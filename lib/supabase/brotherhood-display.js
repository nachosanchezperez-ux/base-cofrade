import { getHermandadPageBySlug as getBaseHermandadPageBySlug } from '@/lib/supabase/brotherhoods'
import { createClient } from '@/lib/supabase/server'

const PUBLISHED_STATUS = 'published'

function unique(values = []) {
  return [...new Set(values.filter(Boolean))]
}

function formatAuthorship(authorship, agentName) {
  if (!agentName) return ''
  return authorship.authorship_type === 'attributed_to'
    ? `Atribuido a ${agentName}`
    : agentName
}

async function enrichBrotherhoodDisplay(hermandad) {
  if (!hermandad?.id) return hermandad

  const supabase = await createClient()
  const imageIds = unique((hermandad.imagenes || []).map((imagen) => imagen.id))
  const stepIds = unique((hermandad.pasos || []).map((paso) => paso.id))

  const [authorshipsResult, stepImagesResult, brotherhoodResult] = await Promise.all([
    imageIds.length
      ? supabase
          .from('image_authorships')
          .select('image_entity_id, agent_entity_id, authorship_type, certainty')
          .in('image_entity_id', imageIds)
          .eq('status', PUBLISHED_STATUS)
      : Promise.resolve({ data: [], error: null }),
    stepIds.length
      ? supabase
          .from('image_steps')
          .select('image_entity_id, step_entity_id, relation_type')
          .in('step_entity_id', stepIds)
          .eq('status', PUBLISHED_STATUS)
      : Promise.resolve({ data: [], error: null }),
    supabase
      .from('brotherhoods')
      .select('history_text')
      .eq('entity_id', hermandad.id)
      .maybeSingle(),
  ])

  if (authorshipsResult.error) {
    throw new Error(`No se pudieron consultar las autorías canónicas: ${authorshipsResult.error.message}`)
  }
  if (stepImagesResult.error) {
    throw new Error(`No se pudieron consultar las imágenes procesionales: ${stepImagesResult.error.message}`)
  }
  if (brotherhoodResult.error) {
    throw new Error(`No se pudo consultar la historia de la hermandad: ${brotherhoodResult.error.message}`)
  }

  const authorships = authorshipsResult.data || []
  const stepImageLinks = stepImagesResult.data || []
  const agentIds = unique(authorships.map((item) => item.agent_entity_id))
  const stepImageIds = unique(stepImageLinks.map((item) => item.image_entity_id))

  const [agentsResult, stepImageEntitiesResult] = await Promise.all([
    agentIds.length
      ? supabase
          .from('entities')
          .select('id, name')
          .in('id', agentIds)
          .eq('status', PUBLISHED_STATUS)
      : Promise.resolve({ data: [], error: null }),
    stepImageIds.length
      ? supabase
          .from('entities')
          .select('id, name, slug')
          .in('id', stepImageIds)
          .eq('entity_type', 'image')
          .eq('status', PUBLISHED_STATUS)
      : Promise.resolve({ data: [], error: null }),
  ])

  if (agentsResult.error) {
    throw new Error(`No se pudieron consultar los autores publicados: ${agentsResult.error.message}`)
  }
  if (stepImageEntitiesResult.error) {
    throw new Error(`No se pudieron consultar las imágenes publicadas de los pasos: ${stepImageEntitiesResult.error.message}`)
  }

  const agentById = new Map((agentsResult.data || []).map((agent) => [agent.id, agent.name]))
  const stepImageById = new Map((stepImageEntitiesResult.data || []).map((image) => [image.id, image]))

  const imagenes = (hermandad.imagenes || []).map((imagen) => {
    const autoresCanonicos = unique(
      authorships
        .filter((item) => item.image_entity_id === imagen.id)
        .map((item) => formatAuthorship(item, agentById.get(item.agent_entity_id)))
    )

    return autoresCanonicos.length
      ? { ...imagen, autor: autoresCanonicos.join(' · ') }
      : imagen
  })

  const pasos = (hermandad.pasos || []).map((paso) => ({
    ...paso,
    imagenesDetalle: stepImageLinks
      .filter((link) => link.step_entity_id === paso.id)
      .map((link) => stepImageById.get(link.image_entity_id))
      .filter(Boolean)
      .map((imagen) => ({
        id: imagen.id,
        nombre: imagen.name,
        slug: imagen.slug,
        fichaDisponible: Boolean(imagen.slug),
      })),
  }))

  const historyText = brotherhoodResult.data?.history_text?.trim() || ''
  const historia = historyText || (
    hermandad.historia && hermandad.historia !== hermandad.resumen
      ? hermandad.historia
      : ''
  )

  return {
    ...hermandad,
    imagenes,
    pasos,
    historia,
  }
}

export async function getHermandadPageBySlug(slug) {
  const hermandad = await getBaseHermandadPageBySlug(slug)
  if (!hermandad) return hermandad

  try {
    return await enrichBrotherhoodDisplay(hermandad)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo completar la vista relacional de la hermandad', {
      slug,
      error: error instanceof Error ? error.message : String(error),
    })
    return hermandad
  }
}
