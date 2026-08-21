import Link from 'next/link'
import Image from 'next/image'
import BrotherhoodMusicalHeritage from '@/components/BrotherhoodMusicalHeritage'
import { getBrotherhoodMusicalHeritage } from '@/lib/supabase/brotherhood-musical-heritage'
import { getPublishedEntityCoverMediaMap } from '@/lib/supabase/entity-media'
import { createClient } from '@/lib/supabase/server'

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

export async function BrotherhoodTitularCount({ brotherhoodId, imageCount = 0 }) {
  try {
    const supabase = await createClient()
    const conceptualTitulars = await loadConceptualTitulars(supabase, brotherhoodId)
    return imageCount + conceptualTitulars.length
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo completar el contador de titulares', error)
    return imageCount
  }
}

export async function BrotherhoodConceptualTitulars({ brotherhoodId }) {
  try {
    const supabase = await createClient()
    const titulars = await loadConceptualTitulars(supabase, brotherhoodId)
    if (!titulars.length) return null
    const coverMedia = await getPublishedEntityCoverMediaMap(titulars.map((titular) => titular.id))

    return (
      <div className="image-grid" style={{ marginTop: '1.25rem' }}>
        {titulars.map((titular) => {
          const media = coverMedia.get(titular.id)

          return (
            <article className="image-card brotherhood-image-card" key={titular.id}>
              {media?.path ? (
                <div className="portrait-placeholder brotherhood-portrait has-image">
                  <Image
                    className="brotherhood-portrait-image"
                    src={media.path}
                    alt={media.alt || `Fotografía de ${titular.nombre}`}
                    fill
                    sizes="(max-width: 620px) calc(100vw - 40px), (max-width: 980px) 50vw, 25vw"
                  />
                  {media.credit ? (
                    <small className="brotherhood-portrait-credit">{media.credit}</small>
                  ) : null}
                </div>
              ) : (
                <div className="portrait-placeholder brotherhood-portrait"><span>✦</span></div>
              )}
              <div className="image-card-body">
                <span className="eyebrow">{titular.tipo}</span>
                <h3>{titular.nombre}</h3>
                {titular.descripcion && <p className="image-card-description">{titular.descripcion}</p>}
                <small>Identidad devocional titular independiente de una Imagen física.</small>
              </div>
            </article>
          )
        })}
      </div>
    )
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron mostrar los titulares devocionales', error)
    return null
  }
}

export async function BrotherhoodOwnBands({ brotherhoodId }) {
  try {
    const supabase = await createClient()
    const [bands, musicalHeritage] = await Promise.all([
      loadOwnBands(supabase, brotherhoodId),
      getBrotherhoodMusicalHeritage(brotherhoodId),
    ])

    if (!bands.length && !musicalHeritage.length) return null

    return (
      <>
        {bands.length ? (
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
        ) : null}
        <BrotherhoodMusicalHeritage items={musicalHeritage} />
      </>
    )
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron mostrar las relaciones musicales de la hermandad', error)
    return null
  }
}
