import { cache } from 'react'
import Link from 'next/link'
import {
  getCachedPublicData,
  PUBLIC_CACHE_TAGS,
  publicEntityTag,
} from '@/lib/cache/public-cache'
import { createPublicClient } from '@/lib/supabase/public'

function assertRows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

async function loadConceptualTitulars(supabase, brotherhoodId) {
  const relations = assertRows(
    await supabase
      .from('entity_relations')
      .select('target_entity_id, notes')
      .eq('source_entity_id', brotherhoodId)
      .eq('relation_type', 'has_titular')
      .eq('status', 'published'),
    'No se pudieron consultar los titulares devocionales'
  )

  const ids = relations.map((item) => item.target_entity_id).filter(Boolean)
  if (!ids.length) return []

  const [entitiesResult, advocationResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, name, slug, summary')
      .eq('entity_type', 'advocation')
      .eq('status', 'published')
      .in('id', ids),
    supabase
      .from('advocations')
      .select('entity_id, advocation_type, description')
      .in('entity_id', ids),
  ])
  const entities = assertRows(entitiesResult, 'No se pudieron consultar las identidades devocionales')
  const advocations = assertRows(advocationResult, 'No se pudieron consultar los datos devocionales')
  const advocationById = new Map(advocations.map((item) => [item.entity_id, item]))
  const relationById = new Map(relations.map((item) => [item.target_entity_id, item]))

  return entities.map((entity) => {
    const advocation = advocationById.get(entity.id) || {}
    return {
      id: entity.id,
      nombre: entity.name,
      tipo: advocation.advocation_type || 'Titular devocional',
      descripcion: advocation.description || entity.summary || relationById.get(entity.id)?.notes || '',
    }
  })
}

async function loadOwnBands(supabase, brotherhoodId) {
  const relations = assertRows(
    await supabase
      .from('entity_relations')
      .select('source_entity_id, notes')
      .eq('target_entity_id', brotherhoodId)
      .eq('relation_type', 'belongs_to_brotherhood')
      .eq('status', 'published'),
    'No se pudieron consultar las bandas propias'
  )

  const ids = relations.map((item) => item.source_entity_id).filter(Boolean)
  if (!ids.length) return []

  const [entitiesResult, bandsResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, name, slug, summary')
      .eq('entity_type', 'band')
      .eq('status', 'published')
      .in('id', ids),
    supabase
      .from('bands')
      .select('entity_id, band_type, description')
      .in('entity_id', ids),
  ])
  const entities = assertRows(entitiesResult, 'No se pudieron consultar las entidades de banda')
  const bands = assertRows(bandsResult, 'No se pudieron consultar las fichas de banda')
  const bandById = new Map(bands.map((item) => [item.entity_id, item]))
  const relationById = new Map(relations.map((item) => [item.source_entity_id, item]))

  return entities.map((entity) => {
    const band = bandById.get(entity.id) || {}
    return {
      id: entity.id,
      slug: entity.slug,
      nombre: entity.name,
      tipo: band.band_type || 'Formación musical',
      descripcion: band.description || entity.summary || relationById.get(entity.id)?.notes || '',
    }
  })
}

const getConceptualTitulars = cache((brotherhoodId) => getCachedPublicData({
  key: ['brotherhood-conceptual-titulars', brotherhoodId],
  tags: [
    PUBLIC_CACHE_TAGS.BROTHERHOODS,
    PUBLIC_CACHE_TAGS.IMAGES,
    publicEntityTag('brotherhood-id', brotherhoodId),
  ],
  loader: () => loadConceptualTitulars(createPublicClient(), brotherhoodId),
}))

const getOwnBands = cache((brotherhoodId) => getCachedPublicData({
  key: ['brotherhood-own-bands', brotherhoodId],
  tags: [
    PUBLIC_CACHE_TAGS.BROTHERHOODS,
    PUBLIC_CACHE_TAGS.BANDS,
    publicEntityTag('brotherhood-id', brotherhoodId),
  ],
  loader: () => loadOwnBands(createPublicClient(), brotherhoodId),
}))

export async function BrotherhoodTitularCount({ brotherhoodId, imageCount = 0 }) {
  const conceptualTitulars = await getConceptualTitulars(brotherhoodId)
  return imageCount + conceptualTitulars.length
}

export async function BrotherhoodConceptualTitulars({ brotherhoodId }) {
  const titulars = await getConceptualTitulars(brotherhoodId)
  if (!titulars.length) return null

  return (
    <div className="image-grid" style={{ marginTop: '1.25rem' }}>
      {titulars.map((titular) => (
        <article className="image-card brotherhood-image-card" key={titular.id}>
          <div className="portrait-placeholder brotherhood-portrait"><span>✦</span></div>
          <div className="image-card-body">
            <span className="eyebrow">{titular.tipo}</span>
            <h3>{titular.nombre}</h3>
            {titular.descripcion && <p className="image-card-description">{titular.descripcion}</p>}
            <small>Identidad devocional titular independiente de una Imagen física.</small>
          </div>
        </article>
      ))}
    </div>
  )
}

export async function BrotherhoodOwnBands({ brotherhoodId }) {
  const bands = await getOwnBands(brotherhoodId)
  if (!bands.length) return null

  return (
    <section className="section brotherhood-soft" id="bandas-propias">
      <div className="shell">
        <span className="eyebrow">Vínculo institucional</span>
        <h2>Bandas de la Hermandad</h2>
        <p className="body-large">Formaciones vinculadas institucionalmente a la Hermandad, con independencia de sus acompañamientos procesionales concretos.</p>
        <div className="current-music-grid">
          {bands.map((band) => (
            <Link className="current-music-card" href={`/bandas/${band.slug}`} key={band.id}>
              <span className="current-music-position">Banda propia</span>
              <h3>{band.nombre}</h3>
              <p>{band.tipo}</p>
              {band.descripcion && <small>{band.descripcion}</small>}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
