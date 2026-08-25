'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const CREST_FILE_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}\.(?:svg|png|webp)$/i
const CREST_TYPES = new Set(['image/svg+xml', 'image/png', 'image/webp'])
const MAX_FILE_SIZE = 10 * 1024 * 1024

function value(formData, name) {
  return String(formData.get(name) || '').trim()
}

function uuid(formData, name) {
  const candidate = value(formData, name)
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
}

function fileSize(formData) {
  const candidate = Number(value(formData, 'file_size'))
  if (!Number.isSafeInteger(candidate) || candidate <= 0) throw new Error('No se pudo comprobar el tamaño del escudo.')
  if (candidate > MAX_FILE_SIZE) throw new Error('El escudo no puede superar 10 MB.')
  return candidate
}

function crestExtension(fileType) {
  const extensions = {
    'image/svg+xml': 'svg',
    'image/png': 'png',
    'image/webp': 'webp',
  }
  return extensions[fileType] || ''
}

async function loadContext(formData) {
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const fileType = value(formData, 'file_type')
  const originalFileName = value(formData, 'file_name').slice(0, 255)
  const originalFileSize = fileSize(formData)

  if (!CREST_TYPES.has(fileType)) throw new Error('El escudo debe ser SVG, PNG o WEBP.')
  if (!originalFileName) throw new Error('No se pudo identificar el archivo seleccionado.')

  const entityResult = await supabase
    .from('entities')
    .select('id, name, slug, entity_type, status')
    .eq('id', brotherhoodId)
    .eq('entity_type', 'brotherhood')
    .neq('status', 'archived')
    .maybeSingle()

  if (entityResult.error) throw new Error(`No se pudo comprobar la Hermandad: ${entityResult.error.message}`)
  if (!entityResult.data) throw new Error('La Hermandad no existe o está archivada.')

  const brotherhoodResult = await supabase
    .from('brotherhoods')
    .select('popular_name, crest_path')
    .eq('entity_id', brotherhoodId)
    .maybeSingle()

  if (brotherhoodResult.error) throw new Error(`No se pudo comprobar el escudo actual: ${brotherhoodResult.error.message}`)
  if (!brotherhoodResult.data) throw new Error('No existe la ficha de la Hermandad.')

  return {
    supabase,
    brotherhoodId,
    fileType,
    originalFileName,
    originalFileSize,
    entity: entityResult.data,
    brotherhood: brotherhoodResult.data,
    storageRoot: `hermandades/${brotherhoodId}/escudo`,
  }
}

function assertPreparedStoragePath(storagePath, context) {
  const prefix = `${context.storageRoot}/`
  const fileName = storagePath.startsWith(prefix) ? storagePath.slice(prefix.length) : ''
  const expectedExtension = crestExtension(context.fileType)

  if (!storagePath || storagePath.startsWith('/') || storagePath.includes('..')) {
    throw new Error('La ruta temporal del escudo no es válida.')
  }
  if (!fileName || fileName.includes('/') || !CREST_FILE_PATTERN.test(fileName)) {
    throw new Error('La ruta temporal del escudo no pertenece a esta Hermandad.')
  }
  if (!expectedExtension || !fileName.endsWith(`.${expectedExtension}`)) {
    throw new Error('El formato del escudo no coincide con la ruta temporal.')
  }
}

async function assertStoredUpload(context, storagePath) {
  const segments = storagePath.split('/')
  const fileName = segments.pop()
  const folder = segments.join('/')
  const result = await context.supabase.storage
    .from('hilo-media')
    .list(folder, { limit: 20, search: fileName })

  if (result.error) throw new Error(`No se pudo comprobar el escudo subido: ${result.error.message}`)
  const storedObject = (result.data || []).find((item) => item.name === fileName)
  if (!storedObject) throw new Error('El escudo no llegó correctamente al almacenamiento.')

  const storedSize = Number(storedObject.metadata?.size || storedObject.metadata?.contentLength || 0)
  const storedType = String(storedObject.metadata?.mimetype || storedObject.metadata?.contentType || '')

  if (storedSize && storedSize !== context.originalFileSize) {
    throw new Error('El tamaño almacenado no coincide con el archivo seleccionado.')
  }
  if (storedType && storedType !== context.fileType) {
    throw new Error('El formato almacenado no coincide con el archivo seleccionado.')
  }
}

async function assertSafeSvg(context, storagePath) {
  if (context.fileType !== 'image/svg+xml') return

  const downloaded = await context.supabase.storage.from('hilo-media').download(storagePath)
  if (downloaded.error) throw new Error(`No se pudo validar el SVG: ${downloaded.error.message}`)
  const source = await downloaded.data.text()

  if (!/<svg(?:\s|>)/i.test(source)) throw new Error('El archivo SVG no contiene un gráfico vectorial válido.')

  const unsafePatterns = [
    /<\s*(?:script|foreignObject|iframe|object|embed)\b/i,
    /\son[a-z]+\s*=/i,
    /javascript\s*:/i,
    /<!\s*(?:DOCTYPE|ENTITY)\b/i,
    /(?:href|xlink:href)\s*=\s*["']\s*(?:https?:|\/\/|data:)/i,
    /url\(\s*["']?\s*(?:https?:|\/\/|javascript:|data:)/i,
  ]

  if (unsafePatterns.some((pattern) => pattern.test(source))) {
    throw new Error('El SVG incluye contenido externo o código no permitido. Exporta un SVG limpio y autocontenido.')
  }
}

function managedStoragePath(publicPath, brotherhoodId) {
  const marker = '/storage/v1/object/public/hilo-media/'
  const index = String(publicPath || '').indexOf(marker)
  if (index < 0) return ''

  try {
    const storagePath = decodeURIComponent(String(publicPath).slice(index + marker.length))
    return storagePath.startsWith(`hermandades/${brotherhoodId}/escudo/`) ? storagePath : ''
  } catch {
    return ''
  }
}

async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    ...entry,
  })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la edición del escudo', error)
}

function revalidateBrotherhood(context) {
  revalidatePath('/panel')
  revalidatePath('/panel/hermandades')
  revalidatePath(`/panel/hermandades/${context.brotherhoodId}`)
  revalidatePath('/hermandades')
  if (context.entity.slug) revalidatePath(`/hermandades/${context.entity.slug}`)
}

function crestErrorMessage(error) {
  if (error instanceof Error && error.message) return error.message
  return 'No se ha podido actualizar el escudo. Revisa el archivo e inténtalo de nuevo.'
}

export async function prepareBrotherhoodCrestUploadAction(formData) {
  await requirePanelEditor()

  try {
    const context = await loadContext(formData)
    const extension = crestExtension(context.fileType)
    const storagePath = `${context.storageRoot}/${randomUUID()}.${extension}`
    const signedUpload = await context.supabase.storage
      .from('hilo-media')
      .createSignedUploadUrl(storagePath, { upsert: false })

    if (signedUpload.error) throw new Error(`No se pudo preparar la subida: ${signedUpload.error.message}`)
    if (!signedUpload.data?.token) throw new Error('No se pudo generar el permiso temporal de subida.')

    return { upload: { path: storagePath, token: signedUpload.data.token } }
  } catch (error) {
    const message = crestErrorMessage(error)
    console.error('[Hilo Cofrade] Error al preparar la subida del escudo', error)
    return { error: message }
  }
}

export async function saveBrotherhoodCrestUploadAction(formData) {
  const user = await requirePanelEditor()
  let cleanupPath = ''
  let context

  try {
    context = await loadContext(formData)
    const storagePath = value(formData, 'storage_path')
    assertPreparedStoragePath(storagePath, context)
    cleanupPath = storagePath
    await assertStoredUpload(context, storagePath)
    await assertSafeSvg(context, storagePath)

    const publicUrl = context.supabase.storage.from('hilo-media').getPublicUrl(storagePath).data.publicUrl
    if (!publicUrl) throw new Error('No se pudo resolver la URL pública del escudo.')

    const updateResult = await context.supabase
      .from('brotherhoods')
      .update({ crest_path: publicUrl })
      .eq('entity_id', context.brotherhoodId)
      .select('entity_id')
      .single()

    if (updateResult.error) throw new Error(`No se pudo actualizar el escudo: ${updateResult.error.message}`)
    cleanupPath = ''

    await audit(context.supabase, user, {
      action_type: 'update',
      object_type: 'brotherhood',
      object_id: context.brotherhoodId,
      entity_id: context.brotherhoodId,
      summary: `Escudo actualizado: ${context.brotherhood.popular_name || context.entity.name}`,
      changed_fields: {
        crest_path: publicUrl,
        previous_crest_path: context.brotherhood.crest_path || null,
        file_type: context.fileType,
        file_size: context.originalFileSize,
        upload_mode: 'signed_direct',
      },
    })

    const previousStoragePath = managedStoragePath(context.brotherhood.crest_path, context.brotherhoodId)
    if (previousStoragePath && previousStoragePath !== storagePath) {
      const removed = await context.supabase.storage.from('hilo-media').remove([previousStoragePath])
      if (removed.error) console.error('[Hilo Cofrade] No se pudo retirar el escudo anterior del almacenamiento', removed.error)
    }

    revalidateBrotherhood(context)
    return { saved: true, publicUrl }
  } catch (error) {
    if (cleanupPath && context?.supabase) {
      await context.supabase.storage.from('hilo-media').remove([cleanupPath])
    }
    const message = crestErrorMessage(error)
    console.error('[Hilo Cofrade] Error al guardar el escudo', error)
    return { error: message }
  }
}

export async function removeBrotherhoodCrestAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')

  try {
    const entityResult = await supabase
      .from('entities')
      .select('id, name, slug, entity_type, status')
      .eq('id', brotherhoodId)
      .eq('entity_type', 'brotherhood')
      .neq('status', 'archived')
      .maybeSingle()
    if (entityResult.error || !entityResult.data) throw new Error('No se pudo comprobar la Hermandad.')

    const brotherhoodResult = await supabase
      .from('brotherhoods')
      .select('popular_name, crest_path')
      .eq('entity_id', brotherhoodId)
      .maybeSingle()
    if (brotherhoodResult.error || !brotherhoodResult.data) throw new Error('No se pudo comprobar el escudo actual.')

    const previousPath = brotherhoodResult.data.crest_path || ''
    const updateResult = await supabase
      .from('brotherhoods')
      .update({ crest_path: null })
      .eq('entity_id', brotherhoodId)
      .select('entity_id')
      .single()
    if (updateResult.error) throw new Error(`No se pudo retirar el escudo: ${updateResult.error.message}`)

    await audit(supabase, user, {
      action_type: 'update',
      object_type: 'brotherhood',
      object_id: brotherhoodId,
      entity_id: brotherhoodId,
      summary: `Escudo retirado: ${brotherhoodResult.data.popular_name || entityResult.data.name}`,
      changed_fields: { crest_path: null, previous_crest_path: previousPath || null },
    })

    const storagePath = managedStoragePath(previousPath, brotherhoodId)
    if (storagePath) {
      const removed = await supabase.storage.from('hilo-media').remove([storagePath])
      if (removed.error) console.error('[Hilo Cofrade] No se pudo borrar el escudo retirado del almacenamiento', removed.error)
    }

    revalidateBrotherhood({ brotherhoodId, entity: entityResult.data })
    return { removed: true }
  } catch (error) {
    const message = crestErrorMessage(error)
    console.error('[Hilo Cofrade] Error al retirar el escudo', error)
    return { error: message }
  }
}
