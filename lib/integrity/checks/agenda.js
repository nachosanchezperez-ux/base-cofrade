import { blank, groupBy, isCurrentRelation, makeIssue, normalizeName, slugify, yearOf } from '../model.js'

// Agenda cofrade.
//
// Respeta las reglas vigentes (docs/AGENDA-DETALLE-Y-URLS-2026-10-09.md):
//   * una cita puntual no necesita slug ni página propia: una salida sin slug NO
//     es una incidencia;
//   * las 209 URLs históricas del manifiesto congelado deben seguir resolviendo;
//     algunas se derivan de «slug de la Hermandad + fecha» (fallbackSlug de
//     glory-directory), así que se acepta también esa forma.
//
// Criterios para evitar falsos positivos (comprobados contra producción):
//   * dos salidas de la misma Hermandad, fecha y tipo son cortejos distintos si
//     llevan imágenes o pasos distintos (El Amor y La Borriquita, Écija); solo es
//     duplicado si comparten alguna imagen o paso;
//   * el municipio de la salida puede no ser el de la Hermandad (romerías,
//     pedanías como Los Rosales, actos en la capital): no se compara;
//   * los horarios del día anterior (papeletas, triduos) son legítimos.

const PRESERVED_FAMILY = /^\/(agenda-cofrade\/rosarios|extraordinarias|procesiones-de-gloria)\/([^/]+)\/?$/

function outingName(outing) {
  return outing.title || outing.outing_type || 'Salida'
}

function linkedHeritage(ctx) {
  const map = new Map()
  const add = (outingId, entityId) => {
    if (!outingId || !entityId) return
    const set = map.get(outingId) || new Set()
    set.add(entityId)
    map.set(outingId, set)
  }
  for (const row of ctx.rows('outing_entities')) {
    const type = ctx.entities.get(row.entity_id)?.entity_type
    // En modo público una entidad no publicada no está en el mapa; el rol la delata igualmente.
    if (type === 'image' || type === 'step' || /image|step/.test(String(row.role || ''))) add(row.outing_id, row.entity_id)
  }
  for (const position of ctx.rows('outing_music_positions')) add(position.outing_id, position.step_entity_id)
  return map
}

const publishedOutings = (ctx) => ctx.rows('outings').filter((outing) => outing.status === 'published')

export const agendaChecks = [
  {
    id: 'agenda.duplicate-outing',
    area: 'agenda',
    severity: 'error',
    title: 'Salida duplicada',
    fix: 'Fusión gobernada: conservar una salida con toda su música, horarios y fuentes, y archivar la otra sin borrar su ID hasta validar enlaces.',
    run(ctx) {
      const heritage = linkedHeritage(ctx)
      const candidates = publishedOutings(ctx).filter((outing) => outing.brotherhood_entity_id && outing.outing_date)
      const groups = groupBy(candidates, (outing) => `${outing.brotherhood_entity_id}|${outing.outing_date}|${normalizeName(outing.outing_type)}`)
      const issues = []
      for (const outings of groups.values()) {
        if (outings.length < 2) continue
        for (let i = 0; i < outings.length; i += 1) {
          for (let j = i + 1; j < outings.length; j += 1) {
            const a = heritage.get(outings[i].id) || new Set()
            const b = heritage.get(outings[j].id) || new Set()
            const shared = [...a].filter((id) => b.has(id))
            // Cortejos distintos documentados: nada en común y ambos con contenido.
            if (!shared.length && a.size && b.size) continue
            issues.push(makeIssue(this, {
              entityType: 'outing',
              entityId: outings[i].id,
              entityName: `${ctx.entityName(outings[i].brotherhood_entity_id)} · ${outings[i].outing_type} · ${outings[i].outing_date}`,
              severity: shared.length ? 'error' : 'warning',
              reason: shared.length
                ? `Dos salidas publicadas el mismo día y del mismo tipo comparten ${shared.map((id) => `«${ctx.entityName(id)}»`).join(', ')}: «${outingName(outings[i])}» (${outings[i].slug || 'sin slug'}) y «${outingName(outings[j])}» (${outings[j].slug || 'sin slug'}).`
                : `Dos salidas publicadas el mismo día y del mismo tipo, y al menos una no tiene imágenes ni pasos vinculados para distinguir el cortejo: «${outingName(outings[i])}» y «${outingName(outings[j])}».`,
              related: [outings[j].id, ...shared],
              href: '',
            }))
          }
        }
      }
      return issues
    },
  },
  {
    id: 'agenda.outing-dates-incoherent',
    area: 'agenda',
    severity: 'error',
    title: 'Fechas u horarios incoherentes',
    fix: 'Corregir fecha, año o regreso según la fuente.',
    run(ctx) {
      const issues = []
      for (const outing of publishedOutings(ctx)) {
        const problems = []
        if (outing.return_date && outing.outing_date && outing.return_date < outing.outing_date) problems.push(`el regreso (${outing.return_date}) es anterior a la salida (${outing.outing_date})`)
        if (outing.return_date && outing.return_date === outing.outing_date && outing.return_time && outing.departure_time && outing.return_time < outing.departure_time) problems.push(`regreso el mismo día a las ${outing.return_time}, antes de la salida (${outing.departure_time})`)
        const dateYear = yearOf(outing.outing_date)
        if (dateYear && outing.year != null && Number(outing.year) !== dateYear) problems.push(`el año (${outing.year}) no coincide con la fecha (${outing.outing_date})`)
        if (outing.event_status === 'held' && outing.outing_date && outing.outing_date > ctx.today) problems.push(`figura como celebrada, pero su fecha (${outing.outing_date}) es futura`)
        if (!problems.length) continue
        issues.push(makeIssue(this, {
          entityType: 'outing',
          entityId: outing.id,
          entityName: outingName(outing),
          reason: `${problems.join('; ')}.`,
          href: '',
        }))
      }
      return issues
    },
  },
  {
    id: 'agenda.outing-without-organizer',
    area: 'agenda',
    severity: 'warning',
    title: 'Salida sin Hermandad ni entidad relacionada',
    fix: 'Vincular la Hermandad organizadora (o la imagen y el paso) o, si no tiene ficha, rellenar el nombre del organizador.',
    run(ctx) {
      const withEntities = new Set(ctx.rows('outing_entities').map((row) => row.outing_id))
      return publishedOutings(ctx)
        .filter((outing) => !outing.brotherhood_entity_id && blank(outing.organizer_name) && !withEntities.has(outing.id))
        .map((outing) => makeIssue(this, {
          entityType: 'outing',
          entityId: outing.id,
          entityName: outingName(outing),
          reason: `Publicada (${outing.outing_date || 'sin fecha'}) sin Hermandad, sin organizador y sin imágenes ni pasos: la tarjeta no indica quién la organiza ni enlaza a ninguna ficha.`,
          href: '',
        }))
    },
  },
  {
    id: 'agenda.outing-brotherhood-not-public',
    area: 'agenda',
    severity: 'warning',
    title: 'Salida publicada de una Hermandad no publicada',
    fix: 'Publicar la Hermandad o, si no está lista, mantener el nombre del organizador para que la tarjeta lo muestre.',
    run(ctx) {
      return publishedOutings(ctx)
        .filter((outing) => outing.brotherhood_entity_id && !ctx.isPublic(outing.brotherhood_entity_id))
        .map((outing) => {
          const fallback = !blank(outing.organizer_name)
          return makeIssue(this, {
            entityType: 'outing',
            entityId: outing.id,
            entityName: outingName(outing),
            severity: fallback ? 'warning' : 'error',
            reason: fallback
              ? `La Hermandad no es pública: la tarjeta (${outing.outing_date || 'sin fecha'}) muestra «${outing.organizer_name}» sin enlace.`
              : `La Hermandad no es pública y no hay nombre de organizador: la tarjeta (${outing.outing_date || 'sin fecha'}) queda sin Hermandad.`,
            related: [outing.brotherhood_entity_id],
            href: '',
          })
        })
    },
  },
  {
    id: 'agenda.outing-entity-not-public',
    area: 'agenda',
    severity: 'incomplete',
    title: 'Salida vinculada a una ficha no publicada',
    fix: 'Publicar la ficha vinculada (imagen, paso o patrimonio) cuando esté completa.',
    run(ctx) {
      const outings = new Map(publishedOutings(ctx).map((outing) => [outing.id, outing]))
      const groups = groupBy(
        ctx.rows('outing_entities').filter((row) => outings.has(row.outing_id) && !ctx.isPublic(row.entity_id)),
        (row) => row.outing_id,
      )
      return [...groups.entries()].map(([outingId, rows]) => makeIssue(this, {
        entityType: 'outing',
        entityId: outingId,
        entityName: outingName(outings.get(outingId)),
        reason: `${rows.length} vínculo(s) a fichas no publicadas (${rows.map((row) => ctx.entities.get(row.entity_id)?.name || row.role || 'ficha').join(', ')}): se muestran sin enlace o no se muestran.`,
        related: rows.map((row) => row.entity_id),
        href: '',
      }))
    },
  },
  {
    id: 'agenda.upcoming-incomplete',
    area: 'agenda',
    severity: 'incomplete',
    title: 'Próxima cita con información práctica incompleta',
    fix: 'Completar hora de salida y lugar desde la fuente oficial antes de la fecha.',
    run(ctx) {
      return publishedOutings(ctx)
        .filter((outing) => outing.outing_date && outing.outing_date >= ctx.today && outing.event_status !== 'cancelled')
        .map((outing) => {
          const missing = []
          if (!outing.departure_time) missing.push('hora de salida')
          if (!outing.origin_place_id && blank(outing.origin_text)) missing.push('lugar de salida')
          if (!outing.municipality_id) missing.push('municipio')
          return { outing, missing }
        })
        .filter(({ missing }) => missing.length)
        .map(({ outing, missing }) => makeIssue(this, {
          entityType: 'outing',
          entityId: outing.id,
          entityName: outingName(outing),
          reason: `${outing.outing_date}: falta ${missing.join(', ')}.`,
          href: '',
        }))
    },
  },
  {
    id: 'agenda.preserved-url-unresolved',
    area: 'agenda',
    severity: 'error',
    title: 'URL histórica conservada que ya no resuelve',
    fix: 'Restaurar la salida (o su slug) o añadir una redirección 301 al contenido equivalente. No retirar la URL del manifiesto sin inventario.',
    run(ctx) {
      // Cada familia resuelve su slug con su propio lector; se replica cada regla:
      //   rosarios        → rosary-outings.js: outing_type ILIKE '%rosario%' y slug real;
      //   extraordinarias → extraordinary-detail.js: vista con character = 'extraordinary'
      //                     y provincia de Sevilla, slug real;
      //   glorias         → glory-directory.js: outing_type ILIKE 'Procesión de Gloria',
      //                     slug real o derivado (fallbackSlug) si no tiene.
      const provinceOf = new Map(ctx.rows('municipalities').map((municipality) => [municipality.id, municipality.province]))
      const families = { 'agenda-cofrade/rosarios': new Map(), extraordinarias: new Map(), 'procesiones-de-gloria': new Map() }
      const bySlugAnyFamily = new Map()
      for (const outing of publishedOutings(ctx)) {
        if (outing.slug) bySlugAnyFamily.set(outing.slug, outing)
        const type = normalizeName(outing.outing_type)
        if (outing.slug && type.includes('rosario')) families['agenda-cofrade/rosarios'].set(outing.slug, outing)
        if (outing.slug && outing.character === 'extraordinary' && provinceOf.get(outing.municipality_id) === 'Sevilla') families.extraordinarias.set(outing.slug, outing)
        if (type === 'procesion de gloria') {
          // Misma derivación que fallbackSlug (glory-directory) para salidas sin slug.
          const base = [ctx.entities.get(outing.brotherhood_entity_id)?.slug || outing.title || 'procesion-de-gloria', outing.outing_date].filter(Boolean).join('-')
          const slug = outing.slug || slugify(base) || `procesion-de-gloria-${String(outing.id || '').slice(0, 8)}`
          families['procesiones-de-gloria'].set(slug, outing)
        }
      }
      const issues = []
      for (const path of ctx.snapshot.preservedPaths || []) {
        const match = PRESERVED_FAMILY.exec(path)
        if (!match) continue
        const [, family, slug] = match
        if (families[family].has(slug)) continue
        const candidate = bySlugAnyFamily.get(slug)
        let why = 'Ninguna salida publicada tiene ese slug'
        if (candidate && family === 'extraordinarias') {
          why = candidate.character !== 'extraordinary'
            ? `La salida «${outingName(candidate)}» existe, pero no está marcada como extraordinaria`
            : `La salida «${outingName(candidate)}» existe, pero su municipio no es de la provincia de Sevilla (${provinceOf.get(candidate.municipality_id) || 'sin provincia'}) y la ruta solo admite Sevilla`
        } else if (candidate) {
          why = `La salida «${outingName(candidate)}» existe con ese slug, pero es de tipo «${candidate.outing_type}», que esta ruta no lee`
        }
        issues.push(makeIssue(this, {
          entityType: 'url',
          entityId: path,
          entityName: path,
          reason: `${why}: la URL conservada da 404.`,
          related: candidate ? [candidate.id] : [],
          href: path,
        }))
      }
      return issues
    },
  },
  {
    id: 'agenda.outing-out-of-scope',
    area: 'agenda',
    severity: 'warning',
    title: 'Salida publicada fuera de la provincia de Sevilla',
    fix: 'El proyecto abarca Sevilla y su provincia: archivar la salida (con autorización) o documentar la excepción.',
    run(ctx) {
      const provinceOf = new Map(ctx.rows('municipalities').map((municipality) => [municipality.id, municipality.province]))
      return publishedOutings(ctx)
        .filter((outing) => outing.municipality_id && provinceOf.has(outing.municipality_id) && provinceOf.get(outing.municipality_id) !== 'Sevilla')
        .map((outing) => makeIssue(this, {
          entityType: 'outing',
          entityId: outing.id,
          entityName: outingName(outing),
          reason: `${outing.outing_date || 'Sin fecha'}: el municipio es de la provincia de ${provinceOf.get(outing.municipality_id) || 'otra provincia'}. Puede aparecer en la Agenda aunque sus rutas de extraordinarias lo excluyan.`,
          href: '',
        }))
    },
  },
  {
    id: 'agenda.cult-image-not-of-brotherhood',
    area: 'agenda',
    severity: 'warning',
    title: 'Culto dedicado a una imagen sin relación con su Hermandad',
    fix: 'Vincular la Imagen a la Hermandad (titular o imagen secundaria) o corregir la imagen del culto.',
    run(ctx) {
      const related = new Set(ctx.rows('brotherhood_images').filter((row) => row.status === 'published').map((row) => `${row.brotherhood_entity_id}|${row.image_entity_id}`))
      // Imágenes que procesionan en un paso de la Hermandad también cuentan como relacionadas.
      const stepsOf = groupBy(ctx.rows('brotherhood_steps').filter(isCurrentRelation), (row) => row.brotherhood_entity_id)
      const imagesOnStep = groupBy(ctx.rows('image_steps').filter(isCurrentRelation), (row) => row.step_entity_id)
      const viaStep = (brotherhoodId, imageId) => (stepsOf.get(brotherhoodId) || []).some((row) => (imagesOnStep.get(row.step_entity_id) || []).some((relation) => relation.image_entity_id === imageId))
      return ctx.rows('cults')
        .filter((cult) => cult.status === 'published' && cult.image_entity_id && cult.brotherhood_entity_id)
        .filter((cult) => ctx.isPublic(cult.brotherhood_entity_id) && ctx.isPublic(cult.image_entity_id))
        .filter((cult) => !related.has(`${cult.brotherhood_entity_id}|${cult.image_entity_id}`) && !viaStep(cult.brotherhood_entity_id, cult.image_entity_id))
        .map((cult) => makeIssue(this, {
          entityType: 'cult',
          entityId: cult.id,
          entityName: cult.title || 'Culto',
          reason: `Dedicado a «${ctx.entityName(cult.image_entity_id)}», que no tiene relación con «${ctx.entityName(cult.brotherhood_entity_id)}».`,
          related: [cult.image_entity_id, cult.brotherhood_entity_id],
          href: '',
        }))
    },
  },
]
