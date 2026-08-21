import Link from 'next/link'
import Image from 'next/image'
import RelationalThread from '@/components/RelationalThread'
import { getPublishedEntityCoverMediaMap } from '@/lib/supabase/entity-media'
import { createClient } from '@/lib/supabase/server'

function assertRows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function assertRow(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || null
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

async function loadCurrentAccompaniments(supabase, brotherhoodId) {
  const periods = assertRows(
    await supabase
      .from('music_accompaniment_periods')
      .select('id, band_entity_id, step_entity_id, position, outing_type, date_from_text, year_from, notes')
      .eq('brotherhood_entity_id', brotherhoodId)
      .eq('is_current', true)
      .eq('status', 'published')
      .order('position'),
    'No se pudieron consultar los acompañamientos actuales'
  )

  const bandIds = [...new Set(periods.map((item) => item.band_entity_id).filter(Boolean))]
  if (!bandIds.length) return []

  const [entitiesResult, bandsResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, name, slug')
      .eq('entity_type', 'band')
      .eq('status', 'published')
      .in('id', bandIds),
    supabase
      .from('bands')
      .select('entity_id, band_type')
      .in('entity_id', bandIds),
  ])

  const entities = assertRows(entitiesResult, 'No se pudieron consultar las bandas de acompañamiento')
  const bands = assertRows(bandsResult, 'No se pudieron consultar los tipos de banda')
  const entityById = new Map(entities.map((item) => [item.id, item]))
  const bandById = new Map(bands.map((item) => [item.entity_id, item]))

  return periods
    .map((period) => {
      const entity = entityById.get(period.band_entity_id)
      const band = bandById.get(period.band_entity_id) || {}
      if (!entity?.slug) return null

      return {
        id: period.id,
        slug: entity.slug,
        nombre: entity.name,
        posicion: period.position || 'Acompañamiento musical',
        tipo: band.band_type || 'Formación musical',
        salida: period.outing_type || '',
        periodo: period.date_from_text || (period.year_from ? `Desde ${period.year_from}` : ''),
        observaciones: period.notes || '',
      }
    })
    .filter(Boolean)
}

async function loadBrotherhoodThreadData(supabase, brotherhoodId) {
  const [brotherhoodResult, imageLinksResult, stepLinksResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, name, slug')
      .eq('id', brotherhoodId)
      .eq('entity_type', 'brotherhood')
      .eq('status', 'published')
      .maybeSingle(),
    supabase
      .from('brotherhood_images')
      .select('image_entity_id')
      .eq('brotherhood_entity_id', brotherhoodId)
      .eq('status', 'published'),
    supabase
      .from('brotherhood_steps')
      .select('step_entity_id')
      .eq('brotherhood_entity_id', brotherhoodId)
      .eq('status', 'published'),
  ])

  const brotherhood = assertRow(brotherhoodResult, 'No se pudo consultar la Hermandad para Tira del hilo')
  const imageLinks = assertRows(imageLinksResult, 'No se pudieron consultar las Imágenes de la Hermandad')
  const stepLinks = assertRows(stepLinksResult, 'No se pudieron consultar los Pasos de la Hermandad')
  const imageIds = imageLinks.map((item) => item.image_entity_id).filter(Boolean)
  const stepIds = stepLinks.map((item) => item.step_entity_id).filter(Boolean)

  const [imagesResult, stepsResult] = await Promise.all([
    imageIds.length
      ? supabase
          .from('entities')
          .select('id, name, slug')
          .eq('entity_type', 'image')
          .eq('status', 'published')
          .in('id', imageIds)
      : Promise.resolve({ data: [], error: null }),
    stepIds.length
      ? supabase
          .from('entities')
          .select('id, name, slug')
          .eq('entity_type', 'step')
          .eq('status', 'published')
          .in('id', stepIds)
      : Promise.resolve({ data: [], error: null }),
  ])

  return {
    brotherhood,
    images: assertRows(imagesResult, 'No se pudieron consultar las Imágenes publicadas de la Hermandad'),
    steps: assertRows(stepsResult, 'No se pudieron consultar los Pasos publicados de la Hermandad'),
  }
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
    const [bands, threadData, currentAccompaniments] = await Promise.all([
      loadOwnBands(supabase, brotherhoodId),
      loadBrotherhoodThreadData(supabase, brotherhoodId),
      loadCurrentAccompaniments(supabase, brotherhoodId),
    ])
    const threadItems = [
      ...threadData.images.map((image) => ({
        kind: 'Imagen',
        relation: 'Titular',
        title: image.name,
        href: `/imagenes/${image.slug}`,
        context: 'Imagen vinculada a la Hermandad',
        priority: 10,
      })),
      ...threadData.steps.map((step) => ({
        kind: 'Paso',
        relation: 'Procesiona con',
        title: step.name,
        href: `/pasos/${step.slug}`,
        context: 'Paso procesional de la Hermandad',
        priority: 20,
      })),
      ...bands.map((band) => ({
        kind: 'Banda',
        relation: 'Vínculo institucional',
        title: band.nombre,
        href: `/bandas/${band.slug}`,
        context: band.tipo,
        priority: 30,
      })),
      ...currentAccompaniments.map((band) => ({
        kind: 'Banda',
        relation: 'Acompañamiento actual',
        title: band.nombre,
        href: `/bandas/${band.slug}`,
        context: [band.posicion, band.salida, band.periodo].filter(Boolean).join(' · ') || band.tipo,
        priority: 40,
      })),
    ]

    if (!threadItems.length && !bands.length) return null

    const currentBandCount = new Set(currentAccompaniments.map((item) => item.slug).filter(Boolean)).size
    const meta = [
      `${threadData.images.length} imágenes`,
      `${threadData.steps.length} pasos`,
      currentBandCount ? `${currentBandCount} bandas actuales` : '',
    ].filter(Boolean).join(' · ')

    return (
      <>
        <RelationalThread
          currentLabel="Hermandad"
          currentName={threadData.brotherhood?.name || 'Hermandad'}
          currentMeta={meta}
          items={threadItems}
          title="La Hermandad como nodo de la enciclopedia"
          description="Tira del hilo hacia sus imágenes, sus pasos y su música vinculada. Los vínculos institucionales y los acompañamientos actuales se etiquetan de forma distinta para no confundir pertenencia con contrato procesional."
        />

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
      </>
    )
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron mostrar las relaciones principales de la hermandad', error)
    return null
  }
}
