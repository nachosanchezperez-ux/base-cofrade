import { groupBy, isCurrentRelation, makeIssue, normalizeName, normalizeTitle } from '../model.js'

// Hermandades, imágenes y pasos.
//
// Criterios para evitar falsos positivos:
//   * dos imágenes o pasos NO son duplicados por compartir advocación: solo se
//     comparan dentro de la misma Hermandad;
//   * una relación hacia una entidad en borrador no aparece en la web (RLS la
//     oculta), pero sí es incoherente si la relación está publicada;
//   * la falta de fotografía se informa en conjunto, no ficha a ficha (es una
//     tarea editorial amplia, no un error).

const RELATION_TABLES = [
  { table: 'brotherhood_images', a: ['brotherhood_entity_id', 'brotherhood'], b: ['image_entity_id', 'image'], label: 'Hermandad ↔ Imagen' },
  { table: 'brotherhood_steps', a: ['brotherhood_entity_id', 'brotherhood'], b: ['step_entity_id', 'step'], label: 'Hermandad ↔ Paso' },
  { table: 'image_steps', a: ['image_entity_id', 'image'], b: ['step_entity_id', 'step'], label: 'Imagen ↔ Paso' },
]

const PUBLIC_COVER_RIGHTS = new Set(['owned', 'authorized', 'licensed', 'public_domain'])

const isTitularRelation = (row) => String(row.relation_type || '').trim().toLowerCase() === 'titular'

export const coreChecks = [
  {
    id: 'core.relation-wrong-type',
    area: 'core',
    severity: 'error',
    title: 'Relación con una entidad de otro tipo',
    fix: 'Corregir el identificador de la relación en el Panel para que apunte a una entidad del tipo esperado.',
    run(ctx) {
      const issues = []
      for (const spec of RELATION_TABLES) {
        for (const row of ctx.rows(spec.table)) {
          for (const [column, expected] of [spec.a, spec.b]) {
            const entity = ctx.entities.get(row[column])
            if (entity && entity.entity_type !== expected) {
              issues.push(makeIssue(this, {
                entityType: 'relation',
                entityId: row.id,
                entityName: `${spec.label}: ${ctx.entityName(row[spec.a[0]])} → ${ctx.entityName(row[spec.b[0]])}`,
                reason: `La columna ${column} apunta a «${entity.name}», que es de tipo ${entity.entity_type} y no ${expected}.`,
                related: [row[spec.a[0]], row[spec.b[0]]],
              }))
            }
          }
        }
      }
      return issues
    },
  },
  {
    id: 'core.relation-to-unpublished',
    area: 'core',
    severity: 'error',
    requires: 'full',
    title: 'Relación publicada hacia una entidad no publicada',
    fix: 'Publicar la entidad enlazada o devolver la relación a borrador hasta que lo esté.',
    run(ctx) {
      const issues = []
      for (const spec of RELATION_TABLES) {
        for (const row of ctx.rows(spec.table)) {
          if (row.status !== 'published') continue
          const hidden = [row[spec.a[0]], row[spec.b[0]]].filter((id) => ctx.entities.has(id) && !ctx.isPublic(id))
          if (!hidden.length) continue
          issues.push(makeIssue(this, {
            entityType: 'relation',
            entityId: row.id,
            entityName: `${spec.label}: ${ctx.entityName(row[spec.a[0]])} → ${ctx.entityName(row[spec.b[0]])}`,
            reason: `La relación está publicada, pero ${hidden.map((id) => `«${ctx.entityName(id)}» (${ctx.entities.get(id).status})`).join(' y ')} no lo está. La web no la muestra.`,
            related: hidden,
          }))
        }
      }
      return issues
    },
  },
  {
    id: 'core.relation-pending-between-published',
    area: 'core',
    severity: 'warning',
    requires: 'full',
    title: 'Relación sin publicar entre dos fichas publicadas',
    fix: 'Revisar la relación y publicarla; si no procede, archivarla. Hasta entonces la ficha pública no la muestra.',
    run(ctx) {
      const issues = []
      for (const spec of RELATION_TABLES) {
        const rows = ctx.rows(spec.table)
        const publishedPairs = new Set(rows.filter((row) => row.status === 'published').map((row) => `${row[spec.a[0]]}|${row[spec.b[0]]}`))
        for (const row of rows) {
          if (!['draft', 'review'].includes(row.status) || row.date_to) continue
          if (!ctx.isPublic(row[spec.a[0]]) || !ctx.isPublic(row[spec.b[0]])) continue
          // Si ya existe la misma relación publicada, la pendiente no quita nada de la web.
          if (publishedPairs.has(`${row[spec.a[0]]}|${row[spec.b[0]]}`)) continue
          issues.push(makeIssue(this, {
            entityType: spec.a[1],
            entityId: row[spec.a[0]],
            entityName: ctx.entityName(row[spec.a[0]]),
            reason: `${spec.label} con «${ctx.entityName(row[spec.b[0]])}» está en ${row.status} (${row.relation_type || 'sin tipo'}) aunque ambas fichas están publicadas: la web no muestra esta relación.`,
            related: [row.id, row[spec.b[0]]],
          }))
        }
      }
      return issues
    },
  },
  {
    id: 'core.relation-duplicate',
    area: 'core',
    severity: 'error',
    title: 'Relación vigente duplicada',
    fix: 'Conservar una sola relación vigente (la que tenga fuente o tipo canónico) y archivar la otra, con respaldo previo.',
    run(ctx) {
      const issues = []
      for (const spec of RELATION_TABLES) {
        const current = ctx.rows(spec.table).filter(isCurrentRelation)
        const groups = groupBy(current, (row) => `${row[spec.a[0]]}|${row[spec.b[0]]}`)
        for (const rows of groups.values()) {
          if (rows.length < 2) continue
          const [first] = rows
          issues.push(makeIssue(this, {
            entityType: spec.b[1],
            entityId: first[spec.b[0]],
            entityName: `${ctx.entityName(first[spec.a[0]])} → ${ctx.entityName(first[spec.b[0]])}`,
            reason: `${spec.label} aparece ${rows.length} veces como vigente y publicada (tipos: ${rows.map((row) => row.relation_type || '∅').join(', ')}). Puede listarse dos veces en la ficha.`,
            related: rows.map((row) => row.id),
          }))
        }
      }
      return issues
    },
  },
  {
    id: 'core.image-step-brotherhood-mismatch',
    area: 'core',
    severity: 'error',
    title: 'Imagen en un paso de otra Hermandad',
    fix: 'Revisar si la Imagen o el Paso están vinculados a la Hermandad equivocada y corregir la relación que no corresponda.',
    run(ctx) {
      const brotherhoodsOfImage = groupBy(ctx.rows('brotherhood_images').filter(isCurrentRelation), (row) => row.image_entity_id)
      const brotherhoodsOfStep = groupBy(ctx.rows('brotherhood_steps').filter(isCurrentRelation), (row) => row.step_entity_id)
      const issues = []
      for (const relation of ctx.rows('image_steps').filter(isCurrentRelation)) {
        const imageBrotherhoods = new Set((brotherhoodsOfImage.get(relation.image_entity_id) || []).map((row) => row.brotherhood_entity_id))
        const stepBrotherhoods = (brotherhoodsOfStep.get(relation.step_entity_id) || []).map((row) => row.brotherhood_entity_id)
        // Sin Hermandad en alguno de los lados no hay contradicción, solo dato incompleto (lo cubre Salud).
        if (!imageBrotherhoods.size || !stepBrotherhoods.length) continue
        if (stepBrotherhoods.some((id) => imageBrotherhoods.has(id))) continue
        issues.push(makeIssue(this, {
          entityType: 'image',
          entityId: relation.image_entity_id,
          entityName: ctx.entityName(relation.image_entity_id),
          reason: `Procesiona en «${ctx.entityName(relation.step_entity_id)}», que pertenece a ${stepBrotherhoods.map((id) => `«${ctx.entityName(id)}»`).join(', ')}, pero la Imagen solo está vinculada a ${[...imageBrotherhoods].map((id) => `«${ctx.entityName(id)}»`).join(', ')}.`,
          related: [relation.id, relation.step_entity_id, ...stepBrotherhoods, ...imageBrotherhoods],
        }))
      }
      return issues
    },
  },
  {
    id: 'core.image-titular-of-several-brotherhoods',
    area: 'core',
    severity: 'warning',
    title: 'Imagen titular de varias Hermandades a la vez',
    fix: 'Confirmar si es una titularidad compartida real (fusión, agrupación) o cerrar con fecha la relación antigua.',
    run(ctx) {
      const titular = ctx.rows('brotherhood_images').filter((row) => isCurrentRelation(row) && isTitularRelation(row))
      const issues = []
      for (const [imageId, rows] of groupBy(titular, (row) => row.image_entity_id)) {
        const brotherhoods = [...new Set(rows.map((row) => row.brotherhood_entity_id))]
        if (brotherhoods.length < 2) continue
        issues.push(makeIssue(this, {
          entityType: 'image',
          entityId: imageId,
          entityName: ctx.entityName(imageId),
          reason: `Figura como titular vigente de ${brotherhoods.map((id) => `«${ctx.entityName(id)}»`).join(' y ')}.`,
          related: brotherhoods,
        }))
      }
      return issues
    },
  },
  {
    id: 'core.step-of-several-brotherhoods',
    area: 'core',
    severity: 'warning',
    title: 'Paso vigente en varias Hermandades',
    fix: 'Confirmar si el paso se comparte realmente; si no, cerrar con fecha la relación que ya no está vigente.',
    run(ctx) {
      const current = ctx.rows('brotherhood_steps').filter(isCurrentRelation)
      const issues = []
      for (const [stepId, rows] of groupBy(current, (row) => row.step_entity_id)) {
        const brotherhoods = [...new Set(rows.map((row) => row.brotherhood_entity_id))]
        if (brotherhoods.length < 2) continue
        issues.push(makeIssue(this, {
          entityType: 'step',
          entityId: stepId,
          entityName: ctx.entityName(stepId),
          reason: `Tiene relación vigente con ${brotherhoods.map((id) => `«${ctx.entityName(id)}»`).join(' y ')}.`,
          related: brotherhoods,
        }))
      }
      return issues
    },
  },
  {
    id: 'core.possible-duplicate-in-brotherhood',
    area: 'core',
    severity: 'warning',
    title: 'Posible Imagen o Paso duplicado en la misma Hermandad',
    fix: 'Comparar ambas fichas; si son la misma pieza, fusionarlas conservando relaciones y fuentes, con redirección del slug retirado.',
    run(ctx) {
      const issues = []
      const specs = [
        ['brotherhood_images', 'image_entity_id', 'image'],
        ['brotherhood_steps', 'step_entity_id', 'step'],
      ]
      for (const [table, column, type] of specs) {
        const rows = ctx.rows(table).filter((row) => row.status === 'published' && ctx.entities.get(row[column])?.status !== 'archived')
        const groups = groupBy(rows, (row) => {
          const name = normalizeName(ctx.entityName(row[column]))
          return name ? `${row.brotherhood_entity_id}|${name}` : null
        })
        for (const group of groups.values()) {
          const ids = [...new Set(group.map((row) => row[column]))]
          if (ids.length < 2) continue
          issues.push(makeIssue(this, {
            entityType: type,
            entityId: ids[0],
            entityName: ctx.entityName(ids[0]),
            reason: `«${ctx.entityName(group[0].brotherhood_entity_id)}» tiene ${ids.length} fichas con el mismo nombre: ${ids.map((id) => `${ctx.entities.get(id)?.slug || id}`).join(', ')}.`,
            related: ids,
          }))
        }
      }
      return issues
    },
  },
  {
    id: 'core.march-possible-duplicate',
    area: 'core',
    severity: 'warning',
    title: 'Posible Marcha duplicada',
    fix: 'Fusionar en una sola ficha conservando dedicatorias, grabaciones y fuentes, con redirección 301 del slug retirado.',
    run(ctx) {
      const authorsByMarch = new Map()
      for (const row of ctx.rows('march_authors')) {
        if (row.status === 'archived') continue
        const set = authorsByMarch.get(row.march_entity_id) || new Set()
        set.add(row.agent_entity_id)
        authorsByMarch.set(row.march_entity_id, set)
      }
      const marches = ctx.rows('entities').filter((entity) => entity.entity_type === 'march' && entity.status === 'published')
      // Mismo título comparable Y mismos autores: dos marchas homónimas de compositores distintos no coinciden.
      const groups = groupBy(marches, (march) => {
        const authors = authorsByMarch.get(march.id)
        const title = normalizeTitle(march.name)
        return authors?.size && title ? `${title}|${[...authors].sort().join(',')}` : null
      })
      const issues = []
      for (const group of groups.values()) {
        if (group.length < 2) continue
        issues.push(makeIssue(this, {
          entityType: 'march',
          entityId: group[0].id,
          entityName: group[0].name,
          reason: `${group.length} marchas publicadas con el mismo título y los mismos autores: ${group.map((march) => march.slug).join(', ')}.`,
          related: group.map((march) => march.id),
        }))
      }
      return issues
    },
  },
  {
    id: 'core.cover-hidden',
    area: 'core',
    severity: 'warning',
    requires: 'full',
    title: 'Fotografía de portada que la web no puede mostrar',
    fix: 'Completar derechos de uso, tipo «image» y ruta del archivo, o elegir otra portada.',
    run(ctx) {
      const assets = new Map(ctx.rows('media_assets').map((asset) => [asset.id, asset]))
      const issues = []
      for (const relation of ctx.rows('entity_media')) {
        const entity = ctx.entities.get(relation.entity_id)
        if (!entity || entity.status !== 'published') continue
        const isCover = relation.is_cover || (entity.entity_type === 'brotherhood' && relation.relation_type === 'hero')
        if (!isCover) continue
        const asset = assets.get(relation.media_asset_id)
        const problems = []
        if (!asset) problems.push('el recurso no existe o no es legible')
        else {
          if (asset.media_type !== 'image') problems.push(`tipo «${asset.media_type}»`)
          if (!PUBLIC_COVER_RIGHTS.has(asset.rights_status)) problems.push(`derechos «${asset.rights_status || '∅'}»`)
          if (!asset.storage_path) problems.push('sin ruta de archivo')
        }
        if (!problems.length) continue
        issues.push(makeIssue(this, {
          entityType: entity.entity_type,
          entityId: entity.id,
          entityName: entity.name,
          reason: `Tiene portada asignada, pero la web la descarta: ${problems.join(', ')}.`,
          related: [relation.media_asset_id],
          severity: asset && asset.rights_status === 'pending' ? 'incomplete' : this.severity,
        }))
      }
      return issues
    },
  },
  {
    id: 'core.cover-ambiguous',
    area: 'core',
    severity: 'warning',
    title: 'Portada ambigua o compartida',
    fix: 'Dejar una sola portada por ficha y comprobar que la fotografía corresponde a la entidad.',
    run(ctx) {
      const issues = []
      const covers = ctx.rows('entity_media').filter((relation) => relation.is_cover && ctx.isPublic(relation.entity_id))
      for (const [entityId, rows] of groupBy(covers, (relation) => relation.entity_id)) {
        if (rows.length < 2) continue
        const entity = ctx.entities.get(entityId)
        issues.push(makeIssue(this, {
          entityType: entity.entity_type,
          entityId,
          entityName: entity.name,
          reason: `Tiene ${rows.length} portadas marcadas; la web solo muestra la primera por orden.`,
          related: rows.map((row) => row.media_asset_id),
        }))
      }
      // La misma fotografía como portada de dos fichas del mismo tipo suele ser una asignación equivocada.
      const byAssetAndType = groupBy(covers, (relation) => `${relation.media_asset_id}|${ctx.entities.get(relation.entity_id).entity_type}`)
      for (const rows of byAssetAndType.values()) {
        const entityIds = [...new Set(rows.map((row) => row.entity_id))]
        if (entityIds.length < 2) continue
        const first = ctx.entities.get(entityIds[0])
        issues.push(makeIssue(this, {
          entityType: first.entity_type,
          entityId: first.id,
          entityName: first.name,
          reason: `La misma fotografía es portada de ${entityIds.map((id) => `«${ctx.entityName(id)}»`).join(' y ')}.`,
          related: [rows[0].media_asset_id, ...entityIds],
        }))
      }
      return issues
    },
  },
  {
    id: 'core.cover-coverage',
    area: 'core',
    severity: 'incomplete',
    title: 'Fichas publicadas sin fotografía de portada',
    fix: 'Priorizar fotografías con derechos en el Panel (Multimedia). Es una tarea editorial, no un error.',
    run(ctx) {
      // Misma regla que la web: portada marcada o de tipo «cover»; «hero» solo cuenta en Hermandades.
      const withCover = new Set(ctx.rows('entity_media').filter((relation) => (
        relation.is_cover
        || relation.relation_type === 'cover'
        || (relation.relation_type === 'hero' && ctx.entities.get(relation.entity_id)?.entity_type === 'brotherhood')
      )).map((relation) => relation.entity_id))
      const labels = { step: 'Pasos', image: 'Imágenes', brotherhood: 'Hermandades', band: 'Bandas' }
      const issues = []
      for (const [type, label] of Object.entries(labels)) {
        const published = ctx.rows('entities').filter((entity) => entity.entity_type === type && entity.status === 'published')
        const missing = published.filter((entity) => !withCover.has(entity.id))
        if (!missing.length) continue
        issues.push(makeIssue(this, {
          entityType: 'aggregate',
          entityId: '',
          entityName: label,
          reason: `${missing.length} de ${published.length} sin portada.`,
          href: '/panel/multimedia',
        }))
      }
      return issues
    },
  },
]
