'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import {
  analyzeDocumentSource,
  enrichAnalysisWithMatches,
  fetchDocumentSource,
  normalizeSourceUrl,
} from '@/lib/panel/document-import'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i

function value(formData, name) {
  return String(formData.get(name) || '').trim()
}

function uuid(valueToCheck, label, { optional = false } = {}) {
  const candidate = String(valueToCheck || '').trim()
  if (optional && !candidate) return null
  if (!UUID_PATTERN.test(candidate)) throw new Error(`${label} no es válido.`)
  return candidate
}

function compactError(error) {
  return String(error?.message || error || 'Error desconocido')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 420)
}

function encodedError(error) {
  return encodeURIComponent(compactError(error))
}

async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    ...entry,
  })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la auditoría del Importador', error)
}

async function loadTarget(supabase, targetId) {
  if (!targetId) return null
  const result = await supabase
    .from('entities')
    .select('id, entity_type, name, slug, status')
    .eq('id', targetId)
    .neq('status', 'archived')
    .maybeSingle()
  if (result.error) throw new Error(`No se pudo validar la entidad objetivo: ${result.error.message}`)
  if (!result.data) throw new Error('La entidad objetivo ya no está disponible.')
  return result.data
}

async function loadImport(supabase, importId) {
  const result = await supabase
    .from('document_imports')
    .select('id, target_entity_id, source_url, status, analysis')
    .eq('id', importId)
    .maybeSingle()
  if (result.error) throw new Error(`No se pudo cargar la importación: ${result.error.message}`)
  if (!result.data) throw new Error('La importación ya no existe.')
  return result.data
}

async function refreshTarget(supabase, targetId) {
  revalidatePath('/panel')
  revalidatePath('/panel/importar')
  revalidatePath('/panel/fuentes')
  revalidatePath('/panel/hermandades')
  revalidatePath('/panel/imagenes')
  revalidatePath('/panel/pasos')
  revalidatePath('/panel/agentes')
  revalidatePath('/panel/bandas')
  revalidatePath('/panel/relaciones')

  if (!targetId) return
  const result = await supabase
    .from('entities')
    .select('entity_type, slug')
    .eq('id', targetId)
    .maybeSingle()
  if (!result.data) return

  const panelRoutes = {
    brotherhood: 'hermandades',
    image: 'imagenes',
    step: 'pasos',
    agent: 'agentes',
    band: 'bandas',
  }
  const publicRoutes = {
    brotherhood: 'hermandades',
    image: 'imagenes',
    step: 'pasos',
    band: 'bandas',
  }
  const panelRoute = panelRoutes[result.data.entity_type]
  const publicRoute = publicRoutes[result.data.entity_type]
  if (panelRoute) revalidatePath(`/panel/${panelRoute}/${targetId}`)
  if (publicRoute && result.data.slug) revalidatePath(`/${publicRoute}/${result.data.slug}`)
}

export async function analyzeDocumentAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  let destination = '/panel/importar'

  try {
    const sourceUrl = normalizeSourceUrl(value(formData, 'source_url'))
    const targetId = uuid(value(formData, 'target_entity_id'), 'La entidad objetivo', { optional: true })
    const target = await loadTarget(supabase, targetId)
    const source = await fetchDocumentSource(sourceUrl)
    const result = await analyzeDocumentSource({ source, target })
    const analysis = await enrichAnalysisWithMatches(supabase, result.analysis)

    const inserted = await supabase
      .from('document_imports')
      .insert({
        target_entity_id: target?.id || null,
        source_url: source.url,
        source_title: source.title,
        status: 'review',
        analysis_version: 1,
        analysis,
        model_name: result.model,
        content_sha256: source.contentSha256,
        fetched_at: source.fetchedAt,
        created_by: user.id,
      })
      .select('id')
      .single()

    if (inserted.error) throw new Error(`No se pudo guardar la propuesta: ${inserted.error.message}`)

    await audit(supabase, user, {
      action_type: 'create',
      object_type: 'document_import',
      object_id: inserted.data.id,
      entity_id: target?.id || null,
      summary: `Fuente analizada: ${analysis.source?.title || source.url}`,
      changed_fields: {
        source_url: source.url,
        model: result.model,
        entities: analysis.entities.length,
        relations: analysis.relations.length,
        warnings: analysis.warnings.length,
      },
    })

    revalidatePath('/panel/importar')
    destination = `/panel/importar/${inserted.data.id}`
  } catch (error) {
    destination = `/panel/importar?error=${encodedError(error)}`
  }

  redirect(destination)
}

export async function applyDocumentImportAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const importId = uuid(value(formData, 'import_id'), 'La importación')
  let destination = `/panel/importar/${importId}`

  try {
    const importRow = await loadImport(supabase, importId)
    if (importRow.status !== 'review') throw new Error('Esta importación ya no está pendiente de revisión.')

    const resolutions = {}
    for (const candidate of importRow.analysis?.entities || []) {
      const localId = String(candidate.local_id || '')
      if (!localId) continue
      const resolution = value(formData, `resolution_${localId}`) || 'ignore'
      if (resolution === 'ignore' || resolution === 'new') {
        resolutions[localId] = resolution
      } else if (resolution.startsWith('existing:')) {
        const existingId = uuid(resolution.slice('existing:'.length), `La coincidencia de ${candidate.name}`)
        resolutions[localId] = `existing:${existingId}`
      } else {
        throw new Error(`La decisión para ${candidate.name} no es válida.`)
      }
    }

    const relationIndexes = formData
      .getAll('relation_candidate')
      .map((item) => Number.parseInt(String(item), 10))
      .filter((item) => Number.isInteger(item) && item >= 0)

    const applied = await supabase.rpc('apply_document_import', {
      p_import_id: importId,
      p_resolutions: resolutions,
      p_relation_indexes: relationIndexes,
    })
    if (applied.error) throw new Error(`No se pudo crear el borrador: ${applied.error.message}`)

    await audit(supabase, user, {
      action_type: 'apply',
      object_type: 'document_import',
      object_id: importId,
      entity_id: importRow.target_entity_id || null,
      summary: 'Importación documental revisada y aplicada como borrador',
      changed_fields: applied.data || {},
    })

    await refreshTarget(supabase, importRow.target_entity_id)
    revalidatePath(`/panel/importar/${importId}`)
    destination = `/panel/importar/${importId}?saved=applied`
  } catch (error) {
    destination = `/panel/importar/${importId}?error=${encodedError(error)}`
  }

  redirect(destination)
}

export async function discardDocumentImportAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const importId = uuid(value(formData, 'import_id'), 'La importación')
  let destination = `/panel/importar/${importId}`

  try {
    const importRow = await loadImport(supabase, importId)
    if (importRow.status !== 'review') throw new Error('Solo se pueden descartar propuestas pendientes de revisión.')

    const updated = await supabase
      .from('document_imports')
      .update({ status: 'discarded' })
      .eq('id', importId)
      .eq('status', 'review')
      .select('id')
      .single()
    if (updated.error) throw new Error(`No se pudo descartar la propuesta: ${updated.error.message}`)

    await audit(supabase, user, {
      action_type: 'archive',
      object_type: 'document_import',
      object_id: importId,
      entity_id: importRow.target_entity_id || null,
      summary: 'Propuesta documental descartada sin alterar el grafo',
      changed_fields: { status: 'discarded' },
    })

    revalidatePath('/panel/importar')
    revalidatePath(`/panel/importar/${importId}`)
    destination = `/panel/importar/${importId}?saved=discarded`
  } catch (error) {
    destination = `/panel/importar/${importId}?error=${encodedError(error)}`
  }

  redirect(destination)
}
