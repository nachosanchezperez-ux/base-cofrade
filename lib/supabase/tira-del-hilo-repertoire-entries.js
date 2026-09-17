import 'server-only'

import { getMusicalRepertoires } from '@/lib/supabase/musical-repertoires'
import { relationalRepertoireScore } from '@/lib/tira-relational-v2'

function answer({ text, path, entities, items, links, evidence, followUps, context }) {
  return {
    kind: 'answer',
    answer: text,
    path,
    entities,
    items,
    links,
    evidence,
    references: [],
    followUps,
    context,
    compactItemLimit: Math.min(Math.max(Math.min(items.length, 12), 5), 12),
  }
}

function notDocumented(text) {
  return {
    kind: 'not_documented',
    answer: text,
    path: [],
    entities: [],
    items: [],
    links: [],
    evidence: [],
    references: [],
    followUps: [],
    context: null,
  }
}

function marchEntity(entry) {
  if (!entry?.marchId || !entry?.marchHref) return null
  return {
    id: entry.marchId,
    entityType: 'march',
    type: 'Marcha',
    name: entry.catalogTitle || entry.title,
    href: entry.marchHref,
    meta: '',
  }
}

function contextForMarches(entries) {
  const ids = [...new Set(entries
    .filter(({ entry }) => entry?.marchId && entry?.marchHref)
    .map(({ entry }) => entry.marchId))]
    .slice(0, 12)
  if (!ids.length) return null
  return {
    entityId: null,
    entityType: null,
    name: '',
    resultSet: {
      entityType: 'march',
      entityIds: ids,
      count: ids.length,
      label: `${ids.length} marchas`,
      sourceIntent: 'repertoire_entries',
    },
  }
}

export async function askHiloCofradeRepertoireEntries(question = '') {
  const repertoires = await getMusicalRepertoires()
  if (!repertoires.length) return null

  const ranked = repertoires
    .map((repertoire) => ({ repertoire, score: relationalRepertoireScore(repertoire, question) }))
    .filter(({ score }) => score >= 700)
    .sort((first, second) => second.score - first.score)
  if (!ranked.length) return null

  const bestScore = ranked[0].score
  const selected = ranked
    .filter(({ score }) => score >= bestScore - 50)
    .slice(0, 3)
    .map(({ repertoire }) => repertoire)

  const allEntries = selected.flatMap((repertoire) => (
    (repertoire.entries || []).map((entry) => ({ repertoire, entry }))
  ))
  if (!allEntries.length) {
    return notDocumented(`La cruceta ${selected[0]?.displayTitle || selected[0]?.title || 'seleccionada'} está publicada, pero todavía no tiene marchas cargadas.`)
  }

  const totalWorks = allEntries.length
  const primary = selected[0]
  const visibleEntries = allEntries.slice(0, 30)
  const uniqueEntities = [...new Map(
    visibleEntries
      .map(({ entry }) => marchEntity(entry))
      .filter(Boolean)
      .map((entity) => [entity.id, entity])
  ).values()].slice(0, 12)

  return answer({
    text: selected.length === 1
      ? `${primary.displayTitle || primary.title} contiene ${totalWorks} ${totalWorks === 1 ? 'marcha publicada' : 'marchas publicadas'} en Hilo Cofrade.`
      : `He localizado ${selected.length} crucetas que coinciden con la consulta y ${totalWorks} marchas publicadas entre ellas.`,
    path: ['Música', 'Crucetas musicales', selected.length === 1 ? (primary.displayTitle || primary.title) : 'Coincidencias', 'Marchas'],
    entities: uniqueEntities,
    items: visibleEntries.map(({ repertoire, entry }) => ({
      label: entry.catalogTitle || entry.title,
      meta: [
        entry.count > 1 ? `${entry.count} interpretaciones` : '',
        (entry.authors || []).map((author) => author.name).filter(Boolean).join(', '),
        entry.compositionYear,
      ].filter(Boolean).join(' · '),
      href: entry.marchHref || repertoire.href,
      group: selected.length > 1 ? (repertoire.displayTitle || repertoire.title) : '',
    })),
    links: selected.map((repertoire) => ({
      label: `Abrir ${repertoire.displayTitle || repertoire.title}`,
      href: repertoire.href,
    })),
    evidence: selected.map((repertoire) => ({
      key: `repertoire-${repertoire.id}`,
      label: 'Cruceta musical publicada',
      detail: `${repertoire.displayTitle || repertoire.title} · ${repertoire.worksCount} obras`,
    })),
    followUps: uniqueEntities.length
      ? ['¿Quién compuso estas marchas?', '¿Qué tienen en común?', 'Ordénalas de más antigua a más reciente.']
      : [],
    context: contextForMarches(allEntries),
  })
}
