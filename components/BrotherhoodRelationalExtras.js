import Link from 'next/link'
import Image from 'next/image'
import RelationalThread from '@/components/RelationalThread'
import styles from '@/components/BrotherhoodCurrentMusic.module.css'
import discoveryStyles from '@/components/BrotherhoodRelationalDiscovery.module.css'
import { getPublishedEntityCoverMediaMap } from '@/lib/supabase/entity-media'
import { createPublicClient } from '@/lib/supabase/public'

function assertRows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function assertRow(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || null
}

function unique(values = []) {
  return [...new Set(values.filter(Boolean))]
}

function processionRank(position = '') {
  const value = String(position).toLowerCase()
  if (value.includes('cruz de guía') || value.includes('cruz de guia')) return 10
  if (value.includes('delante')) return 15
  if (value.includes('misterio')) return 20
  if (value.includes('cristo') || value.includes('sangre')) return 25
  if (value.includes('paso') && !value.includes('palio') && !value.includes('virgen')) return 30
  if (value.includes('tras') && !value.includes('palio') && !value.includes('virgen')) return 30
  if (value.includes('palio') || value.includes('virgen')) return 40
  return 35
}

function publicPeriod(period = '') {
  const value = String(period).trim()
  return /^desde\s+\d{4}\b/i.test(value) ? value : ''
}

function outingLabel(value = '') {
  const label = String(value || '').trim().replaceAll('_', ' ')
  return label || 'Salida procesional'
}

function groupCurrentAccompaniments(items = []) {
  const groups = new Map()

  for (const item of items) {
    const label = outingLabel(item.salida)
    if (!groups.has(label)) groups.set(label, [])
    groups.get(label).push(item)
  }

  return [...groups.entries()].map(([label, groupItems]) => ({
    label,
    items: groupItems,
  }))
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
      .eq('status', 'published'),
    'No se pudieron consultar los acompañamientos actuales'
  )

  const bandIds = unique(periods.map((item) => item.band_entity_id))
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
      .select('entity_id, band_type, logo_path')
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
        bandId: period.band_entity_id,
        slug: entity.slug,
        nombre: entity.name,
        posicion: period.position || 'Acompañamiento musical',
        tipo: band.band_type || 'Formación musical',
        logo: band.logo_path || '',
        salida: period.outing_type || '',
        periodo: period.date_from_text || (period.year_from ? `Desde ${period.year_from}` : ''),
        observaciones: period.notes || '',
      }
    })
    .filter(Boolean)
    .sort((a, b) => processionRank(a.posicion) - processionRank(b.posicion) || a.posicion.localeCompare(b.posicion, 'es'))
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

async function loadBrotherhoodDiscoveryData(supabase, brotherhoodId, threadData, currentAccompaniments) {
  const imageIds = threadData.images.map((item) => item.id).filter(Boolean)
  const stepIds = threadData.steps.map((item) => item.id).filter(Boolean)
  const bandIds = unique(currentAccompaniments.map((item) => item.bandId))
  const dedicateeIds = unique([brotherhoodId, ...imageIds])

  const [dedicationsResult, authorshipsResult, personnelResult, networkResult] = await Promise.all([
    dedicateeIds.length
      ? supabase
          .from('march_dedications')
          .select('march_entity_id')
          .in('dedicatee_entity_id', dedicateeIds)
          .eq('status', 'published')
      : Promise.resolve({ data: [], error: null }),
    imageIds.length
      ? supabase
          .from('image_authorships')
          .select('agent_entity_id')
          .in('image_entity_id', imageIds)
          .eq('status', 'published')
      : Promise.resolve({ data: [], error: null }),
    stepIds.length
      ? supabase
          .from('step_personnel_periods')
          .select('agent_entity_id')
          .in('step_entity_id', stepIds)
          .eq('is_current', true)
          .eq('status', 'published')
      : Promise.resolve({ data: [], error: null }),
    bandIds.length
      ? supabase
          .from('music_accompaniment_periods')
          .select('brotherhood_entity_id')
          .in('band_entity_id', bandIds)
          .eq('is_current', true)
          .eq('status', 'published')
      : Promise.resolve({ data: [], error: null }),
  ])

  const marchIds = unique(assertRows(dedicationsResult, 'No se pudieron consultar las dedicatorias musicales').map((item) => item.march_entity_id))
  const personIds = unique([
    ...assertRows(authorshipsResult, 'No se pudieron consultar las autorías de los titulares').map((item) => item.agent_entity_id),
    ...assertRows(personnelResult, 'No se pudieron consultar los responsables actuales de los pasos').map((item) => item.agent_entity_id),
  ])
  const otherBrotherhoodIds = unique(
    assertRows(networkResult, 'No se pudo ampliar la red musical de la Hermandad')
      .map((item) => item.brotherhood_entity_id)
      .filter((id) => id && id !== brotherhoodId)
  )
  const relatedIds = unique([...marchIds, ...personIds, ...otherBrotherhoodIds])
  const publishedEntities = relatedIds.length
    ? assertRows(
        await supabase
          .from('entities')
          .select('id, entity_type')
          .in('id', relatedIds)
          .eq('status', 'published'),
        'No se pudieron resolver las relaciones de segundo grado'
      )
    : []
  const typeById = new Map(publishedEntities.map((item) => [item.id, item.entity_type]))

  return {
    dedicatedMarches: marchIds.filter((id) => typeById.get(id) === 'march').length,
    connectedPeople: personIds.filter((id) => typeById.get(id) === 'agent').length,
    currentBands: bandIds.length,
    otherBrotherhoodsViaMusic: otherBrotherhoodIds.filter((id) => typeById.get(id) === 'brotherhood').length,
  }
}

export async function BrotherhoodTitularCount({ brotherhoodId, imageCount = 0 }) {
  try {
    const supabase = createPublicClient()
    const conceptualTitulars = await loadConceptualTitulars(supabase, brotherhoodId)
    return imageCount + conceptualTitulars.length
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo completar el contador de titulares', error)
    return imageCount
  }
}

export async function BrotherhoodConceptualTitulars({ brotherhoodId }) {
  try {
    const supabase = createPublicClient()
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

function BrotherhoodDiscoveryPaths({ brotherhoodName, data }) {
  const routes = [
    data.dedicatedMarches > 0 ? {
      key: 'marches',
      label: 'Ruta musical',
      count: `${data.dedicatedMarches} ${data.dedicatedMarches === 1 ? 'marcha' : 'marchas'}`,
      trail: 'Titulares → Marchas → Autores',
      description: 'De la devoción a su patrimonio musical y, desde cada composición, a quienes la firmaron.',
      question: `¿Qué marchas están dedicadas a ${brotherhoodName} y a sus titulares, y quiénes son sus autores?`,
    } : null,
    data.connectedPeople > 0 ? {
      key: 'people',
      label: 'Personas conectadas',
      count: `${data.connectedPeople} ${data.connectedPeople === 1 ? 'persona' : 'personas'}`,
      trail: 'Imágenes y pasos → Personas → otras obras',
      description: 'Sigue las autorías de sus imágenes y los responsables actuales de sus pasos hacia el resto del grafo.',
      question: `¿Qué autores y capataces están relacionados con ${brotherhoodName}, y qué otras obras o pasos tienen documentados en Hilo Cofrade?`,
    } : null,
    data.currentBands > 0 && data.otherBrotherhoodsViaMusic > 0 ? {
      key: 'music-network',
      label: 'Red musical',
      count: `${data.currentBands} ${data.currentBands === 1 ? 'banda' : 'bandas'} · ${data.otherBrotherhoodsViaMusic} ${data.otherBrotherhoodsViaMusic === 1 ? 'Hermandad' : 'Hermandades'}`,
      trail: 'Bandas → Acompañamientos → Hermandades',
      description: 'Continúa por las formaciones actuales para descubrir en qué otros cortejos y salidas están presentes.',
      question: `¿Dónde más tocan actualmente las bandas que acompañan a ${brotherhoodName}?`,
    } : null,
  ].filter(Boolean)

  if (!routes.length) return null

  return (
    <section className={discoveryStyles.section} aria-label="Rutas para seguir tirando del hilo">
      <div className={`shell ${discoveryStyles.shell}`}>
        <header className={discoveryStyles.header}>
          <div className={discoveryStyles.heading}>
            <span className={discoveryStyles.eyebrow}>Descubrimiento relacional</span>
            <h2>Sigue tirando del hilo</h2>
          </div>
          <p>Da un paso más: de sus titulares a la música, de sus pasos a las personas y de sus bandas a otras Hermandades.</p>
        </header>

        <div className={discoveryStyles.grid}>
          {routes.map((route) => (
            <Link
              className={discoveryStyles.card}
              href={`/pregunta?q=${encodeURIComponent(route.question)}`}
              key={route.key}
            >
              <div className={discoveryStyles.topline}>
                <span>{route.label}</span>
                <strong>2º grado</strong>
              </div>
              <strong className={discoveryStyles.metric}>{route.count}</strong>
              <span className={discoveryStyles.trail}>{route.trail}</span>
              <p>{route.description}</p>
              <span className={discoveryStyles.cta}>Explorar con Hilo <span aria-hidden="true">→</span></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function CurrentMusicSequence({ items }) {
  if (!items.length) return null

  const groups = groupCurrentAccompaniments(items)

  return (
    <section className={`${styles.section} brotherhood-current-music-sequence`} id="acompanamiento-musical">
      <div className="shell">
        <div className={styles.header}>
          <div className={styles.copy}>
            <span className="eyebrow">Música procesional</span>
            <h2>Acompañamiento musical</h2>
            <p>Las formaciones vinculadas actualmente a la Hermandad, organizadas según la salida concreta a la que acompaña cada una.</p>
            <div className={styles.context}>
              <span>{items.length} {items.length === 1 ? 'formación' : 'formaciones'} · {groups.length} {groups.length === 1 ? 'salida' : 'salidas'}</span>
            </div>
          </div>
        </div>

        <div className={styles.groups}>
          {groups.map((group) => (
            <section className={styles.outingGroup} key={group.label}>
              <header className={styles.outingHeader}>
                <div>
                  <span>Salida</span>
                  <h3>{group.label}</h3>
                </div>
                <small>{group.items.length} {group.items.length === 1 ? 'formación' : 'formaciones'}</small>
              </header>

              <div className={styles.sequence}>
                {group.items.map((item) => {
                  const period = publicPeriod(item.periodo)
                  return (
                    <Link
                      className={`${styles.item} ${item.logo ? styles.withLogo : styles.withoutLogo}`}
                      href={`/bandas/${item.slug}`}
                      key={item.id}
                    >
                      {item.logo ? (
                        <div className={styles.logoWrap}>
                          <Image
                            className={styles.logo}
                            src={item.logo}
                            alt={`Logotipo de ${item.nombre}`}
                            fill
                            sizes="58px"
                          />
                        </div>
                      ) : null}
                      <div className={styles.main}>
                        <span className={styles.position}>{item.posicion}</span>
                        <h3>{item.nombre}</h3>
                        <div className={styles.meta}>
                          <span>{item.tipo}</span>
                          {period ? <span>{period}</span> : null}
                        </div>
                      </div>
                      <span className={styles.arrow} aria-hidden="true">→</span>
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}

export async function BrotherhoodOwnBands({ brotherhoodId }) {
  try {
    const supabase = createPublicClient()
    const [bands, threadData, currentAccompaniments] = await Promise.all([
      loadOwnBands(supabase, brotherhoodId),
      loadBrotherhoodThreadData(supabase, brotherhoodId),
      loadCurrentAccompaniments(supabase, brotherhoodId),
    ])
    const discoveryData = await loadBrotherhoodDiscoveryData(
      supabase,
      brotherhoodId,
      threadData,
      currentAccompaniments
    )
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

    const hasDiscovery = discoveryData.dedicatedMarches > 0
      || discoveryData.connectedPeople > 0
      || (discoveryData.currentBands > 0 && discoveryData.otherBrotherhoodsViaMusic > 0)
    if (!threadItems.length && !bands.length && !currentAccompaniments.length && !hasDiscovery) return null

    const currentBandCount = new Set(currentAccompaniments.map((item) => item.slug).filter(Boolean)).size
    const meta = [
      `${threadData.images.length} imágenes`,
      `${threadData.steps.length} pasos`,
      currentBandCount ? `${currentBandCount} bandas actuales` : '',
    ].filter(Boolean).join(' · ')
    const brotherhoodName = threadData.brotherhood?.name || 'Hermandad'

    return (
      <>
        <RelationalThread
          currentLabel="Hermandad"
          currentName={brotherhoodName}
          currentMeta={meta}
          items={threadItems}
          title="La Hermandad como nodo de la enciclopedia"
          description="Tira del hilo hacia sus imágenes, sus pasos y su música vinculada. Los vínculos institucionales y los acompañamientos actuales se etiquetan de forma distinta para no confundir pertenencia con contrato procesional."
        />

        <BrotherhoodDiscoveryPaths brotherhoodName={brotherhoodName} data={discoveryData} />

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

        <CurrentMusicSequence items={currentAccompaniments} />
      </>
    )
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron mostrar las relaciones principales de la hermandad', error)
    return null
  }
}
