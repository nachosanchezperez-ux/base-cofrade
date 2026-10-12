import { blank, groupBy, intOrNull, makeIssue, normalizeName, yearOf } from '../model.js'

// Bandas y acompañamientos musicales.
//
// Fuentes canónicas (HC-006, #1139/#1140):
//   * music_accompaniment_periods → relación estable Hermandad–Banda–Paso;
//     alimenta Hermandad, Banda, Paso y Música 2027;
//   * outing_music_positions + outing_music_assignments → música de una salida.
// `accompaniments` es legado bloqueado: no se audita ni se convierte aquí.
//
// Criterios para evitar falsos positivos (comprobados contra producción):
//   * una banda archivada en un periodo histórico es correcta si el periodo
//     conserva `public_band_name` (la web la muestra por ese nombre);
//   * dos bandas distintas vigentes en el mismo paso suelen ser legítimas
//     (ida/regreso, cruz de guía, capilla + coro): no se marcan;
//   * la misma banda en dos posiciones de una salida también lo es (tramos);
//   * una posición sin banda pero con nota («sin acompañamiento», «silencio
//     documentado», matracas) está resuelta.

function periodLabel(ctx, period) {
  const band = period.public_band_name || ctx.entityName(period.band_entity_id, 'Banda sin nombre')
  const step = period.step_entity_id ? ctx.entityName(period.step_entity_id, period.position || '') : (period.position || 'sin paso')
  return `${ctx.entityName(period.brotherhood_entity_id, 'Hermandad')} · ${step} · ${band}`
}

function periodRange(period) {
  const from = intOrNull(period.year_from) ?? yearOf(period.date_from)
  const to = intOrNull(period.year_to) ?? yearOf(period.date_to)
  return { from, to }
}

function rangeText({ from, to }) {
  return `${from ?? '¿?'}–${to ?? 'abierto'}`
}

// Marcas de tramo o lugar del cortejo en el texto de la posición. Dos periodos de la
// misma banda en el mismo paso con marcas distintas («ida» / «regreso», «cruz de
// guía» / «tras el paso») son posiciones distintas y legítimas. Sin marcas, textos
// como «Tras el paso» y «Tras Nuestra Señora de Valvanera» son la misma posición.
const SEGMENT_MARKS = [
  ['ida', /\bida\b/],
  ['regreso', /\b(regreso|vuelta|recogida)\b/],
  ['salida', /\bsalida\b/],
  ['entrada', /\bentrada\b/],
  ['cruz-guia', /\bcruz de guia\b/],
  ['delante', /\b(delante|ante|abriendo|apertura)\b/],
  ['catedral', /\bcatedral\b/],
  ['tramo', /\btramo\b/],
]

function segmentMarks(position) {
  const text = normalizeName(position)
  return SEGMENT_MARKS.filter(([, pattern]) => pattern.test(text)).map(([mark]) => mark).sort().join('+')
}

const publishedPeriods = (ctx) => ctx.rows('music_accompaniment_periods').filter((period) => period.status === 'published')

export const musicChecks = [
  {
    id: 'music.period-wrong-type',
    area: 'music',
    severity: 'error',
    title: 'Periodo musical con referencia de otro tipo',
    fix: 'Corregir la Hermandad, Banda o Paso del periodo en el Panel.',
    run(ctx) {
      const issues = []
      for (const period of publishedPeriods(ctx)) {
        for (const [column, expected] of [['brotherhood_entity_id', 'brotherhood'], ['band_entity_id', 'band'], ['step_entity_id', 'step']]) {
          const entity = ctx.entities.get(period[column])
          if (entity && entity.entity_type !== expected) {
            issues.push(makeIssue(this, {
              entityType: 'music_period',
              entityId: period.id,
              entityName: periodLabel(ctx, period),
              reason: `${column} apunta a «${entity.name}» (${entity.entity_type}), no a un registro de tipo ${expected}.`,
              related: [period[column]],
            }))
          }
        }
      }
      return issues
    },
  },
  {
    id: 'music.period-band-without-name',
    area: 'music',
    severity: 'error',
    title: 'Acompañamiento que se mostraría sin nombre de banda',
    fix: 'Publicar la Banda o rellenar el nombre público del periodo (public_band_name).',
    run(ctx) {
      return publishedPeriods(ctx)
        .filter((period) => ctx.isPublic(period.brotherhood_entity_id))
        .filter((period) => !ctx.isPublic(period.band_entity_id) && blank(period.public_band_name))
        .map((period) => makeIssue(this, {
          entityType: 'music_period',
          entityId: period.id,
          entityName: periodLabel(ctx, period),
          reason: 'La Banda no es pública y el periodo no guarda nombre público: la ficha mostraría el acompañamiento sin banda.',
          related: [period.band_entity_id, period.brotherhood_entity_id],
        }))
    },
  },
  {
    id: 'music.period-band-not-public',
    area: 'music',
    severity: 'incomplete',
    title: 'Banda en borrador usada en un acompañamiento público',
    fix: 'Completar y publicar la ficha de la Banda; mientras tanto se muestra por su nombre, sin enlace.',
    run(ctx) {
      // Solo acompañamientos vigentes o futuros: en los históricos, una banda sin
      // ficha (normalmente archivada) se muestra a propósito por su nombre de época.
      // Así el resultado es el mismo en modo público, donde archivada y borrador no
      // se distinguen porque ninguna de las dos es visible.
      const groups = groupBy(
        publishedPeriods(ctx).filter((period) => (
          period.band_entity_id
          && ctx.isPublic(period.brotherhood_entity_id)
          && !ctx.isPublic(period.band_entity_id)
          && ctx.entities.get(period.band_entity_id)?.status !== 'archived'
          && !blank(period.public_band_name)
          && (period.is_current || (periodRange(period).from ?? -Infinity) >= ctx.seasonYear)
        )),
        (period) => period.band_entity_id,
      )
      return [...groups.entries()].map(([bandId, periods]) => makeIssue(this, {
        entityType: 'band',
        entityId: bandId,
        entityName: periods[0].public_band_name,
        reason: `Aparece en ${periods.length} acompañamiento(s) público(s) (${[...new Set(periods.map((period) => ctx.entityName(period.brotherhood_entity_id)))].join(', ')}) sin ficha publicada.`,
        related: periods.map((period) => period.id),
      }))
    },
  },
  {
    id: 'music.period-step-not-of-brotherhood',
    area: 'music',
    severity: 'warning',
    title: 'Acompañamiento en un paso que no consta en la Hermandad',
    fix: 'Vincular el Paso a su Hermandad (y publicarlo si procede) o corregir el paso del periodo.',
    run(ctx) {
      // Cuenta solo la relación que la web puede ver: publicada y con el paso publicado.
      const relations = ctx.rows('brotherhood_steps')
      const visible = new Set(relations.filter((row) => row.status === 'published' && ctx.isPublic(row.step_entity_id)).map((row) => `${row.brotherhood_entity_id}|${row.step_entity_id}`))
      const anyStatus = new Map(relations.map((row) => [`${row.brotherhood_entity_id}|${row.step_entity_id}`, row]))
      return publishedPeriods(ctx)
        .filter((period) => period.step_entity_id && ctx.isPublic(period.brotherhood_entity_id))
        .filter((period) => !visible.has(`${period.brotherhood_entity_id}|${period.step_entity_id}`))
        .map((period) => {
          const key = `${period.brotherhood_entity_id}|${period.step_entity_id}`
          const step = ctx.entities.get(period.step_entity_id)
          const relation = anyStatus.get(key)
          const why = !step
            ? 'el paso no es público'
            : step.status !== 'published'
              ? `el paso está en ${step.status}`
              : relation
                ? `la relación Hermandad ↔ Paso está en ${relation.status}`
                : 'el paso no tiene relación con la Hermandad'
          return makeIssue(this, {
            entityType: 'music_period',
            entityId: period.id,
            entityName: periodLabel(ctx, period),
            reason: `El periodo cita un paso que no consta como paso publicado de «${ctx.entityName(period.brotherhood_entity_id)}»: ${why}. El histórico musical de ese paso no se enlaza.`,
            related: [period.step_entity_id, period.brotherhood_entity_id],
          })
        })
    },
  },
  {
    id: 'music.period-dates-inverted',
    area: 'music',
    severity: 'error',
    title: 'Periodo musical con fechas invertidas',
    fix: 'Corregir inicio y fin del periodo según la fuente.',
    run(ctx) {
      return publishedPeriods(ctx)
        .filter((period) => {
          const yearInverted = intOrNull(period.year_from) != null && intOrNull(period.year_to) != null && Number(period.year_to) < Number(period.year_from)
          const dateInverted = period.date_from && period.date_to && String(period.date_to) < String(period.date_from)
          return yearInverted || dateInverted
        })
        .map((period) => makeIssue(this, {
          entityType: 'music_period',
          entityId: period.id,
          entityName: periodLabel(ctx, period),
          reason: `Termina antes de empezar (${rangeText(periodRange(period))}).`,
        }))
    },
  },
  {
    id: 'music.period-current-but-ended',
    area: 'music',
    severity: 'error',
    title: 'Acompañamiento marcado vigente con fin ya pasado',
    fix: 'Desmarcar «vigente» (el fin documentado lo convierte en histórico) o corregir el año de fin.',
    run(ctx) {
      return publishedPeriods(ctx)
        .filter((period) => period.is_current)
        .filter((period) => {
          const { to } = periodRange(period)
          return to != null && to < ctx.seasonYear
        })
        .map((period) => makeIssue(this, {
          entityType: 'music_period',
          entityId: period.id,
          entityName: periodLabel(ctx, period),
          reason: `Está marcado como vigente, pero su periodo (${rangeText(periodRange(period))}) terminó antes de la temporada ${ctx.seasonYear}.`,
        }))
    },
  },
  {
    id: 'music.period-current-before-start',
    area: 'music',
    severity: 'warning',
    title: 'Acompañamiento futuro ya marcado como vigente',
    fix: 'Decidir el criterio: las altas de la temporada siguiente se registran sin «vigente» hasta que empiece (como el resto de cambios de Música 2027).',
    run(ctx) {
      return publishedPeriods(ctx)
        .filter((period) => period.is_current)
        .filter((period) => {
          const { from } = periodRange(period)
          return from != null && from > ctx.seasonYear
        })
        .map((period) => makeIssue(this, {
          entityType: 'music_period',
          entityId: period.id,
          entityName: periodLabel(ctx, period),
          reason: `Empieza en ${periodRange(period).from}, pero ya figura como vigente en la temporada ${ctx.seasonYear}: la ficha lo presenta como acompañamiento actual.`,
        }))
    },
  },
  {
    id: 'music.period-overlap-same-band',
    area: 'music',
    severity: 'error',
    title: 'Misma banda repetida en el mismo paso con periodos solapados',
    fix: 'Unificar en un solo periodo con las fechas acreditadas; conservar la fuente de ambos registros.',
    run(ctx) {
      const candidates = publishedPeriods(ctx).filter((period) => period.band_entity_id && period.step_entity_id)
      const groups = groupBy(candidates, (period) => [
        period.brotherhood_entity_id,
        period.band_entity_id,
        period.step_entity_id,
        normalizeName(period.outing_type),
        segmentMarks(period.position),
      ].join('|'))
      const issues = []
      for (const periods of groups.values()) {
        if (periods.length < 2) continue
        const sorted = [...periods].sort((a, b) => String(a.id).localeCompare(String(b.id)))
        for (let i = 0; i < sorted.length; i += 1) {
          for (let j = i + 1; j < sorted.length; j += 1) {
            const a = periodRange(sorted[i])
            const b = periodRange(sorted[j])
            const overlap = (a.from ?? -Infinity) <= (b.to ?? Infinity) && (b.from ?? -Infinity) <= (a.to ?? Infinity)
            if (!overlap) continue
            const contradictoryEnd = a.from != null && a.from === b.from && a.to !== b.to
            issues.push(makeIssue(this, {
              entityType: 'music_period',
              entityId: sorted[i].id,
              entityName: periodLabel(ctx, sorted[i]),
              reason: `Dos periodos de la misma banda en el mismo paso se solapan: ${rangeText(a)}${sorted[i].is_current ? ' (vigente)' : ''} y ${rangeText(b)}${sorted[j].is_current ? ' (vigente)' : ''}.${contradictoryEnd ? ' Mismo inicio con fines distintos: el fin es contradictorio.' : ''}`,
              related: [sorted[j].id],
            }))
          }
        }
      }
      return issues
    },
  },
  {
    id: 'music.next-season-contradiction',
    area: 'music',
    severity: 'error',
    title: 'Música de la próxima temporada contradice el histórico',
    fix: 'Cerrar el periodo anterior con el año de fin acreditado, o retirar el alta si no hay cambio.',
    run(ctx) {
      const year = ctx.nextSeasonYear
      const all = publishedPeriods(ctx)
      const byStep = groupBy(all.filter((period) => period.step_entity_id), (period) => `${period.brotherhood_entity_id}|${period.step_entity_id}`)
      const issues = []
      for (const incoming of all.filter((period) => intOrNull(period.year_from) === year && period.step_entity_id)) {
        const siblings = (byStep.get(`${incoming.brotherhood_entity_id}|${incoming.step_entity_id}`) || []).filter((period) => period.id !== incoming.id)
        // Otra banda que sigue abierta para esa temporada en la misma posición.
        const stillOpen = siblings.filter((period) => (
          period.band_entity_id !== incoming.band_entity_id
          && period.is_current
          && periodRange(period).to == null
          && normalizeName(period.position) === normalizeName(incoming.position)
        ))
        for (const previous of stillOpen) {
          issues.push(makeIssue(this, {
            entityType: 'music_period',
            entityId: incoming.id,
            entityName: periodLabel(ctx, incoming),
            reason: `Alta para ${year}, pero «${previous.public_band_name || ctx.entityName(previous.band_entity_id)}» sigue vigente y abierta en la misma posición del mismo paso: las fichas mostrarían ambas.`,
            related: [previous.id],
          }))
        }
        // «Cambio» que en realidad es continuidad: misma banda que cerró la temporada anterior.
        const sameBandBefore = siblings.find((period) => period.band_entity_id && period.band_entity_id === incoming.band_entity_id && periodRange(period).to === year - 1)
        if (sameBandBefore) {
          issues.push(makeIssue(this, {
            entityType: 'music_period',
            entityId: incoming.id,
            entityName: periodLabel(ctx, incoming),
            severity: 'warning',
            reason: `Se registra como alta de ${year}, pero la misma banda cerró ${year - 1} en ese paso: Música ${year} lo presentaría como cambio cuando es continuidad.`,
            related: [sameBandBefore.id],
          }))
        }
      }
      return issues
    },
  },
  {
    id: 'music.period-historic-without-end',
    area: 'music',
    severity: 'incomplete',
    title: 'Acompañamiento histórico sin fin acreditado',
    fix: 'Añadir el año de fin documentado o, si no consta, una nota de fuente que lo explique.',
    run(ctx) {
      return publishedPeriods(ctx)
        .filter((period) => !period.is_current && ctx.isPublic(period.brotherhood_entity_id))
        // Las altas de temporadas futuras tampoco son vigentes, pero no son históricas.
        .filter((period) => (periodRange(period).from ?? -Infinity) <= ctx.seasonYear)
        .filter((period) => periodRange(period).to == null && blank(period.date_to_text))
        .map((period) => makeIssue(this, {
          entityType: 'music_period',
          entityId: period.id,
          entityName: periodLabel(ctx, period),
          reason: `No es vigente, pero no tiene año ni texto de fin (inicio: ${periodRange(period).from ?? 'sin dato'}).`,
        }))
    },
  },
  {
    id: 'music.outing-assignment-duplicate',
    area: 'music',
    severity: 'error',
    title: 'Formación repetida en la misma posición de una salida',
    fix: 'Eliminar la asignación repetida (misma banda, posición y tramo) dejando una.',
    run(ctx) {
      const positions = new Map(ctx.rows('outing_music_positions').map((position) => [position.id, position]))
      const assignments = ctx.rows('outing_music_assignments').filter((assignment) => assignment.status === 'published' && assignment.band_entity_id)
      const groups = groupBy(assignments, (assignment) => [
        assignment.music_position_id,
        assignment.band_entity_id,
        normalizeName(assignment.segment_start_label),
        normalizeName(assignment.segment_end_label),
        assignment.participation_mode || '',
      ].join('|'))
      const outings = new Map(ctx.rows('outings').map((outing) => [outing.id, outing]))
      const issues = []
      for (const rows of groups.values()) {
        if (rows.length < 2) continue
        const position = positions.get(rows[0].music_position_id)
        const outing = outings.get(position?.outing_id)
        issues.push(makeIssue(this, {
          entityType: 'outing',
          entityId: position?.outing_id,
          entityName: outing?.title || outing?.outing_type || 'Salida',
          reason: `«${ctx.entityName(rows[0].band_entity_id, rows[0].band_name_text)}» figura ${rows.length} veces en «${position?.position_label || position?.position_code}» con el mismo tramo.`,
          related: rows.map((row) => row.id),
          href: '',
        }))
      }
      return issues
    },
  },
  {
    id: 'music.outing-band-not-public',
    area: 'music',
    severity: 'incomplete',
    title: 'Banda sin ficha pública en la música de una salida',
    fix: 'Publicar la ficha de la Banda. Si no tiene nombre de respaldo, añadirlo en la asignación.',
    run(ctx) {
      const positions = new Map(ctx.rows('outing_music_positions').map((position) => [position.id, position]))
      const outings = new Map(ctx.rows('outings').map((outing) => [outing.id, outing]))
      const issues = []
      for (const assignment of ctx.rows('outing_music_assignments')) {
        if (assignment.status !== 'published' || !assignment.band_entity_id || ctx.isPublic(assignment.band_entity_id)) continue
        const position = positions.get(assignment.music_position_id)
        const outing = outings.get(position?.outing_id)
        if (!position || position.status !== 'published' || outing?.status !== 'published') continue
        const named = !blank(assignment.band_name_text)
        issues.push(makeIssue(this, {
          entityType: 'outing',
          entityId: outing.id,
          entityName: outing.title || outing.outing_type,
          severity: named ? 'incomplete' : 'error',
          reason: named
            ? `«${assignment.band_name_text}» se muestra por nombre, sin enlace: su ficha no está publicada.`
            : 'La banda asignada no es pública y la asignación no tiene nombre de respaldo: la salida se mostraría sin banda.',
          related: [assignment.id, assignment.band_entity_id],
          href: '',
        }))
      }
      return issues
    },
  },
  {
    id: 'music.outing-step-not-of-brotherhood',
    area: 'music',
    severity: 'error',
    title: 'Música de salida en un paso de otra Hermandad',
    fix: 'Corregir el paso de la posición musical o la Hermandad de la salida.',
    run(ctx) {
      const relations = ctx.rows('brotherhood_steps')
      const published = new Set(relations.filter((row) => row.status === 'published').map((row) => `${row.brotherhood_entity_id}|${row.step_entity_id}`))
      const anyStatus = new Map(relations.map((row) => [`${row.brotherhood_entity_id}|${row.step_entity_id}`, row]))
      const outings = new Map(ctx.rows('outings').map((outing) => [outing.id, outing]))
      const issues = []
      for (const position of ctx.rows('outing_music_positions')) {
        if (position.status !== 'published' || !position.step_entity_id) continue
        const outing = outings.get(position.outing_id)
        if (!outing || outing.status !== 'published' || !ctx.isPublic(outing.brotherhood_entity_id) || !ctx.isPublic(position.step_entity_id)) continue
        const key = `${outing.brotherhood_entity_id}|${position.step_entity_id}`
        if (published.has(key)) continue
        // Con lectura completa se distingue una relación en borrador (pendiente de
        // publicar) de un paso ajeno. En modo público no se puede: se pide revisar.
        const pending = anyStatus.get(key)
        const confirmed = ctx.mode === 'full' && !pending
        issues.push(makeIssue(this, {
          entityType: 'outing',
          entityId: outing.id,
          entityName: outing.title || outing.outing_type,
          severity: confirmed ? 'error' : 'warning',
          reason: pending
            ? `La posición «${position.position_label || position.position_code}» usa «${ctx.entityName(position.step_entity_id)}», cuya relación con «${ctx.entityName(outing.brotherhood_entity_id)}» está en ${pending.status}.`
            : confirmed
              ? `La posición «${position.position_label || position.position_code}» usa «${ctx.entityName(position.step_entity_id)}», que no pertenece a «${ctx.entityName(outing.brotherhood_entity_id)}».`
              : `La posición «${position.position_label || position.position_code}» usa «${ctx.entityName(position.step_entity_id)}», que no consta como paso publicado de «${ctx.entityName(outing.brotherhood_entity_id)}».`,
          related: [position.id, position.step_entity_id],
          href: '',
        }))
      }
      return issues
    },
  },
  {
    id: 'music.outing-position-empty',
    area: 'music',
    severity: 'warning',
    title: 'Posición musical publicada sin banda ni explicación',
    fix: 'Asignar la banda o anotar expresamente «sin acompañamiento» con su fuente.',
    run(ctx) {
      const assigned = new Set(ctx.rows('outing_music_assignments').filter((assignment) => assignment.status === 'published').map((assignment) => assignment.music_position_id))
      const outings = new Map(ctx.rows('outings').map((outing) => [outing.id, outing]))
      return ctx.rows('outing_music_positions')
        .filter((position) => position.status === 'published' && outings.get(position.outing_id)?.status === 'published')
        .filter((position) => !assigned.has(position.id) && blank(position.notes) && position.position_code !== 'other')
        .map((position) => {
          const outing = outings.get(position.outing_id)
          return makeIssue(this, {
            entityType: 'outing',
            entityId: outing.id,
            entityName: outing.title || outing.outing_type,
            reason: `La posición «${position.position_label || position.position_code}» no tiene banda ni nota que explique la ausencia.`,
            related: [position.id],
            href: '',
          })
        })
    },
  },
]
