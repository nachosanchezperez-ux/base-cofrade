import 'server-only'

import { createClient } from '@/lib/supabase/server'

const CORE_TYPES = ['brotherhood', 'image', 'step', 'band', 'march', 'event']
const SPECIALIZED_TYPES = ['agent', 'brotherhood', 'step']

const TYPE_LABELS = {
  agent: 'Persona / Agente',
  brotherhood: 'Hermandad',
  image: 'Imagen',
  step: 'Paso',
  band: 'Banda',
  march: 'Marcha',
  event: 'Acontecimiento',
}

function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function editorHref(entity, section = '') {
  const base = {
    agent: `/panel/agentes/${entity.id}`,
    brotherhood: `/panel/hermandades/${entity.id}`,
    image: `/panel/imagenes/${entity.id}`,
    step: `/panel/pasos/${entity.id}`,
    band: `/panel/bandas/${entity.id}`,
    march: `/panel/marchas/${entity.id}`,
    event: `/panel/acontecimientos/${entity.id}`,
  }[entity.entity_type]
  if (!base) return '/panel/datos'
  return section ? `${base}/${section}` : base
}

function issue(entity, { key, severity = 'warning', category, title, detail, href, action = 'Completar' }) {
  return {
    id: `${key}:${entity.id}`,
    key,
    severity,
    category,
    entityId: entity.id,
    entityType: entity.entity_type,
    entityLabel: TYPE_LABELS[entity.entity_type] || entity.entity_type,
    entityName: entity.name,
    title,
    detail,
    href: href || editorHref(entity),
    action,
  }
}

function byEntityId(items) {
  return new Map(items.map((item) => [item.entity_id, item]))
}

function blank(value) {
  return value == null || String(value).trim() === ''
}

function missingFields(entries) {
  return entries.filter(([, missing]) => missing).map(([label]) => label)
}

function missingDetail(fields) {
  return `Faltan datos básicos de ficha: ${fields.join(', ')}. Se agrupan en una sola incidencia para evitar ruido y desaparecen automáticamente al completar esos campos.`
}

export async function getPanelDataHealth() {
  const supabase = await createClient()
  const [
    entitiesResult,
    sourceLinksResult,
    mediaResult,
    agentsResult,
    brotherhoodsResult,
    imagesResult,
    stepsResult,
    bandsResult,
    brotherhoodImagesResult,
    brotherhoodStepsResult,
    imageStepsResult,
    imageAuthorshipsResult,
    stepPersonnelResult,
    bandAgentsResult,
    musicPeriodsResult,
    marchAuthorsResult,
  ] = await Promise.all([
    supabase.from('entities').select('id, entity_type, name, slug, summary, status').in('entity_type', [...new Set([...CORE_TYPES, ...SPECIALIZED_TYPES])]).neq('status', 'archived').order('name'),
    supabase.from('source_links').select('entity_id, scope').not('entity_id', 'is', null),
    supabase.from('entity_media').select('entity_id').not('entity_id', 'is', null),
    supabase.from('agents').select('entity_id'),
    supabase.from('brotherhoods').select('entity_id, official_name, foundation_text, municipality_id, crest_path, brotherhood_types'),
    supabase.from('images').select('entity_id, image_type, execution_date, execution_date_text, description'),
    supabase.from('steps').select('entity_id, step_type, description, execution_date_text'),
    supabase.from('bands').select('entity_id, band_type, municipality_id, foundation_text, description, logo_path'),
    supabase.from('brotherhood_images').select('brotherhood_entity_id, image_entity_id').eq('status', 'published').is('date_to', null),
    supabase.from('brotherhood_steps').select('brotherhood_entity_id, step_entity_id').eq('status', 'published').is('date_to', null),
    supabase.from('image_steps').select('image_entity_id, step_entity_id').eq('status', 'published').is('date_to', null),
    supabase.from('image_authorships').select('image_entity_id, status').neq('status', 'archived'),
    supabase.from('step_personnel_periods').select('step_entity_id, status').neq('status', 'archived'),
    supabase.from('band_agents').select('band_entity_id, is_current').eq('is_current', true),
    supabase.from('music_accompaniment_periods').select('band_entity_id, is_current, status').eq('is_current', true).neq('status', 'archived'),
    supabase.from('march_authors').select('march_entity_id, status').neq('status', 'archived'),
  ])

  const entities = rows(entitiesResult, 'No se pudieron cargar las entidades para el diagnóstico')
  const published = entities.filter((entity) => entity.status === 'published')
  const sourceLinks = rows(sourceLinksResult, 'No se pudieron cargar las Fuentes del diagnóstico')
  const directSourceIds = new Set(sourceLinks.filter((link) => !String(link.scope || '').startsWith('relation:')).map((link) => link.entity_id))
  const mediaIds = new Set(rows(mediaResult, 'No se pudo cargar el Multimedia del diagnóstico').map((item) => item.entity_id))

  const agents = rows(agentsResult, 'No se pudieron comprobar las Personas')
  const brotherhoods = rows(brotherhoodsResult, 'No se pudieron comprobar las Hermandades')
  const images = rows(imagesResult, 'No se pudieron comprobar las Imágenes')
  const steps = rows(stepsResult, 'No se pudieron comprobar los Pasos')
  const bands = rows(bandsResult, 'No se pudieron comprobar las Bandas')
  const brotherhoodImages = rows(brotherhoodImagesResult, 'No se pudieron comprobar las relaciones Hermandad ↔ Imagen')
  const brotherhoodSteps = rows(brotherhoodStepsResult, 'No se pudieron comprobar las relaciones Hermandad ↔ Paso')
  const imageSteps = rows(imageStepsResult, 'No se pudieron comprobar las relaciones Imagen ↔ Paso')

  const subtypeIds = {
    agent: new Set(agents.map((item) => item.entity_id)),
    brotherhood: new Set(brotherhoods.map((item) => item.entity_id)),
    step: new Set(steps.map((item) => item.entity_id)),
  }
  const brotherhoodById = byEntityId(brotherhoods)
  const imageById = byEntityId(images)
  const stepById = byEntityId(steps)
  const bandById = byEntityId(bands)

  const brotherhoodWithImageIds = new Set(brotherhoodImages.map((item) => item.brotherhood_entity_id))
  const stepWithBrotherhoodIds = new Set(brotherhoodSteps.map((item) => item.step_entity_id))
  const stepWithImageIds = new Set(imageSteps.map((item) => item.step_entity_id))
  const imageWithBrotherhoodContextIds = new Set(brotherhoodImages.map((item) => item.image_entity_id))
  for (const relation of imageSteps) {
    if (stepWithBrotherhoodIds.has(relation.step_entity_id)) imageWithBrotherhoodContextIds.add(relation.image_entity_id)
  }

  const authoredImageIds = new Set(rows(imageAuthorshipsResult, 'No se pudieron comprobar las autorías de Imágenes').map((item) => item.image_entity_id))
  const staffedStepIds = new Set(rows(stepPersonnelResult, 'No se pudieron comprobar los responsables de Pasos').map((item) => item.step_entity_id))
  const directedBandIds = new Set(rows(bandAgentsResult, 'No se pudo comprobar la dirección de Bandas').map((item) => item.band_entity_id))
  const accompaniedBandIds = new Set(rows(musicPeriodsResult, 'No se pudieron comprobar los acompañamientos de Bandas').map((item) => item.band_entity_id))
  const authoredMarchIds = new Set(rows(marchAuthorsResult, 'No se pudieron comprobar las autorías de Marchas').map((item) => item.march_entity_id))

  const issues = []

  // Los nodos borrador pueden existir deliberadamente como referencias relacionales.
  // Solo es una incidencia crítica si se ha publicado una entidad sin su ficha especializada.
  for (const entity of published.filter((item) => SPECIALIZED_TYPES.includes(item.entity_type))) {
    if (!subtypeIds[entity.entity_type]?.has(entity.id)) {
      issues.push(issue(entity, {
        key: 'reference-node', severity: 'critical', category: 'Estructura',
        title: 'Nodo publicado sin ficha editable',
        detail: 'La entidad está publicada en el grafo, pero todavía no tiene su registro especializado. Debe consolidarse para garantizar edición y presentación coherentes.',
        href: '/panel/datos/referencias', action: 'Resolver referencia',
      }))
    }
  }

  for (const entity of published.filter((item) => CORE_TYPES.includes(item.entity_type))) {
    if (!directSourceIds.has(entity.id)) {
      issues.push(issue(entity, {
        key: 'missing-source', severity: 'warning', category: 'Documentación',
        title: 'Sin Fuente directa',
        detail: 'La entidad está publicada, pero no tiene una Fuente directa vinculada. Las fuentes de relaciones no sustituyen la documentación de la ficha.',
        href: `/panel/fuentes?entity=${entity.id}`, action: 'Añadir Fuente',
      }))
    }
  }

  for (const entity of published.filter((item) => item.entity_type === 'brotherhood')) {
    const record = brotherhoodById.get(entity.id)
    if (!record) continue

    const fields = missingFields([
      ['resumen', blank(entity.summary)],
      ['fundación', blank(record.foundation_text)],
      ['municipio', !record.municipality_id],
      ['tipos', !Array.isArray(record.brotherhood_types) || record.brotherhood_types.length === 0],
    ])
    if (fields.length) {
      issues.push(issue(entity, {
        key: 'brotherhood-profile', severity: 'warning', category: 'Documentación',
        title: 'Ficha básica de Hermandad incompleta',
        detail: missingDetail(fields),
        action: 'Completar ficha',
      }))
    }
    if (blank(record.crest_path)) {
      issues.push(issue(entity, {
        key: 'brotherhood-crest', severity: 'info', category: 'Visual',
        title: 'Hermandad sin escudo',
        detail: 'La ficha pública no tiene un escudo propio documentado. Es una mejora visual recomendada, no bloquea la publicación.',
        action: 'Añadir escudo',
      }))
    }
    if (!brotherhoodWithImageIds.has(entity.id)) {
      issues.push(issue(entity, {
        key: 'brotherhood-image-link', severity: 'warning', category: 'Relaciones',
        title: 'Hermandad sin Imagen vinculada',
        detail: 'No existe ninguna relación Hermandad ↔ Imagen publicada y vigente. Revisa titulares y otras imágenes vinculadas antes de ampliar contenido libre.',
        action: 'Revisar titulares',
      }))
    }
  }

  for (const entity of published.filter((item) => item.entity_type === 'image')) {
    const record = imageById.get(entity.id)
    if (record) {
      const fields = missingFields([
        ['resumen', blank(entity.summary)],
        ['tipo de imagen', blank(record.image_type)],
        ['fecha o época de ejecución', !record.execution_date && blank(record.execution_date_text)],
        ['descripción', blank(record.description)],
      ])
      if (fields.length) {
        issues.push(issue(entity, {
          key: 'image-profile', severity: 'warning', category: 'Documentación',
          title: 'Ficha básica de Imagen incompleta',
          detail: missingDetail(fields),
          action: 'Completar ficha',
        }))
      }
    }
    if (!authoredImageIds.has(entity.id)) {
      issues.push(issue(entity, {
        key: 'image-authorship', severity: 'warning', category: 'Relaciones',
        title: 'Imagen sin autoría documentada',
        detail: 'No existe ninguna relación activa de autoría. Si la autoría es desconocida, conviene documentar expresamente esa situación.',
        href: editorHref(entity, 'autorias'), action: 'Revisar autoría',
      }))
    }
    if (!imageWithBrotherhoodContextIds.has(entity.id)) {
      issues.push(issue(entity, {
        key: 'image-context', severity: 'warning', category: 'Relaciones',
        title: 'Imagen sin contexto de Hermandad',
        detail: 'La Imagen no está relacionada directamente como titular ni indirectamente mediante un Paso vigente que pertenezca a una Hermandad.',
        action: 'Revisar contexto',
      }))
    }
    if (!mediaIds.has(entity.id)) {
      issues.push(issue(entity, {
        key: 'image-media', severity: 'critical', category: 'Visual',
        title: 'Imagen publicada sin recurso visual',
        detail: 'Una Imagen pública necesita al menos un recurso visual relacionado para poder presentarse correctamente.',
        href: `/panel/multimedia?entity=${entity.id}`, action: 'Añadir imagen',
      }))
    }
  }

  for (const entity of published.filter((item) => item.entity_type === 'step')) {
    const record = stepById.get(entity.id)
    if (record) {
      const fields = missingFields([
        ['resumen', blank(entity.summary)],
        ['tipo de paso', blank(record.step_type)],
        ['descripción', blank(record.description)],
        ['fecha o época de ejecución', blank(record.execution_date_text)],
      ])
      if (fields.length) {
        issues.push(issue(entity, {
          key: 'step-profile', severity: 'info', category: 'Documentación',
          title: 'Ficha técnica de Paso incompleta',
          detail: missingDetail(fields),
          action: 'Completar ficha',
        }))
      }
    }
    if (!staffedStepIds.has(entity.id)) {
      issues.push(issue(entity, {
        key: 'step-personnel', severity: 'warning', category: 'Relaciones',
        title: 'Paso sin responsables documentados',
        detail: 'No tiene capataz u otro responsable registrado en periodos. Revisa el módulo de Responsables.',
        href: editorHref(entity, 'responsables'), action: 'Añadir responsable',
      }))
    }
    if (!stepWithBrotherhoodIds.has(entity.id)) {
      issues.push(issue(entity, {
        key: 'step-brotherhood', severity: 'warning', category: 'Relaciones',
        title: 'Paso sin Hermandad vigente',
        detail: 'El Paso está publicado, pero no tiene una relación Hermandad ↔ Paso publicada y vigente.',
        action: 'Revisar relación',
      }))
    }
    if (!stepWithImageIds.has(entity.id)) {
      issues.push(issue(entity, {
        key: 'step-image', severity: 'warning', category: 'Relaciones',
        title: 'Paso sin Imagen vinculada',
        detail: 'El Paso está publicado, pero no tiene ninguna relación Imagen ↔ Paso publicada y vigente.',
        action: 'Revisar imágenes',
      }))
    }
  }

  for (const entity of published.filter((item) => item.entity_type === 'band')) {
    const record = bandById.get(entity.id)
    if (record) {
      const fields = missingFields([
        ['resumen', blank(entity.summary)],
        ['tipo o estilo', blank(record.band_type)],
        ['municipio', !record.municipality_id],
        ['fundación', blank(record.foundation_text)],
        ['descripción', blank(record.description)],
      ])
      if (fields.length) {
        issues.push(issue(entity, {
          key: 'band-profile', severity: 'warning', category: 'Documentación',
          title: 'Ficha básica de Banda incompleta',
          detail: missingDetail(fields),
          action: 'Completar ficha',
        }))
      }
      if (blank(record.logo_path)) {
        issues.push(issue(entity, {
          key: 'band-logo', severity: 'info', category: 'Visual',
          title: 'Banda sin logotipo',
          detail: 'La identidad de la Banda no tiene logotipo documentado. Es una mejora visual recomendada y no exige una imagen hero adicional.',
          action: 'Añadir logotipo',
        }))
      }
    }
    if (!directedBandIds.has(entity.id)) {
      issues.push(issue(entity, {
        key: 'band-direction', severity: 'warning', category: 'Relaciones',
        title: 'Banda sin dirección actual',
        detail: 'No hay ninguna Persona/Agente marcada como dirección o responsabilidad actual.',
        href: editorHref(entity, 'direccion'), action: 'Revisar dirección',
      }))
    }
    if (!accompaniedBandIds.has(entity.id)) {
      issues.push(issue(entity, {
        key: 'band-accompaniment', severity: 'info', category: 'Relaciones',
        title: 'Banda sin acompañamiento actual',
        detail: 'No aparece en ningún periodo de acompañamiento musical marcado como actual.',
        href: editorHref(entity, 'acompanamientos'), action: 'Revisar acompañamientos',
      }))
    }
  }

  for (const entity of published.filter((item) => item.entity_type === 'march')) {
    if (!authoredMarchIds.has(entity.id)) {
      issues.push(issue(entity, {
        key: 'march-author', severity: 'critical', category: 'Relaciones',
        title: 'Marcha publicada sin autoría',
        detail: 'Una Marcha pública debe tener al menos compositor o adaptador documentado.',
        href: editorHref(entity, 'autoria'), action: 'Añadir autoría',
      }))
    }
  }

  const order = { critical: 0, warning: 1, info: 2 }
  issues.sort((a, b) => (order[a.severity] - order[b.severity]) || a.category.localeCompare(b.category, 'es') || a.entityName.localeCompare(b.entityName, 'es'))

  const bySeverity = issues.reduce((acc, item) => {
    acc[item.severity] = (acc[item.severity] || 0) + 1
    return acc
  }, { critical: 0, warning: 0, info: 0 })
  const byCategory = issues.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1
    return acc
  }, {})

  return {
    issues,
    bySeverity,
    byCategory,
    checkedEntities: published.filter((item) => CORE_TYPES.includes(item.entity_type)).length,
    publishedByType: CORE_TYPES.map((type) => ({ type, label: TYPE_LABELS[type], count: published.filter((item) => item.entity_type === type).length })),
  }
}
