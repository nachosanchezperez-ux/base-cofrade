import 'server-only'

import { getAgendaCofrade } from '@/lib/supabase/agenda-cofrade'
import { getHermandadesDirectory } from '@/lib/supabase/brotherhood-directory'
import { getExtraordinaryDirectory } from '@/lib/supabase/extraordinary-directory'
import { getGloryDirectory } from '@/lib/supabase/glory-directory'
import { getMusicalRepertoires } from '@/lib/supabase/musical-repertoires'
import { createClient } from '@/lib/supabase/server'
import { matchMunicipalityName, normalizeFreeFactText } from '@/lib/tira-free-facts'
import {
  normalizePublishedContentText,
  publishedContentIntent,
  publishedContentScore,
} from '@/lib/tira-published-content'

function answer({ text, path, items, links = [], context = null }) {
  return {
    kind: 'answer',
    answer: text,
    path,
    entities: [],
    items,
    links,
    evidence: [],
    references: [],
    followUps: [],
    context,
    compactItemLimit: Math.min(Math.max(items.length, 3), 12),
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

function directoryName(item) {
  return item.nombrePopular || item.nombreOficial || ''
}

function matchBrotherhood(question, directory) {
  return directory
    .map((item) => ({ item, score: publishedContentScore([directoryName(item), item.nombreOficial], question) }))
    .filter(({ score }) => score >= 100)
    .sort((first, second) => second.score - first.score)[0]?.item || null
}

function resultSetContext(entityIds, label, sourceIntent) {
  const ids = [...new Set(entityIds.filter(Boolean))].slice(0, 12)
  if (!ids.length) return null
  return {
    entityId: null,
    entityType: null,
    name: label,
    resultSet: {
      entityType: 'brotherhood',
      entityIds: ids,
      count: ids.length,
      label,
      sourceIntent,
    },
  }
}

async function cultsAnswer(question) {
  const directory = await getHermandadesDirectory()
  if (!directory.length) return null

  const brotherhood = matchBrotherhood(question, directory)
  const municipality = brotherhood ? '' : matchMunicipalityName(question, directory.map((item) => item.localidad))
  const municipalityKey = normalizeFreeFactText(municipality)
  const scopedBrotherhoods = brotherhood
    ? [brotherhood]
    : municipality
      ? directory.filter((item) => normalizeFreeFactText(item.localidad) === municipalityKey)
      : []
  if (!scopedBrotherhoods.length) return null

  const supabase = await createClient()
  const ids = scopedBrotherhoods.map((item) => item.id).filter(Boolean)
  const result = await supabase
    .from('cults')
    .select('id, brotherhood_entity_id, cult_type, title, cult_date, date_rule, month, time_text, recurrence_label, display_order')
    .in('brotherhood_entity_id', ids)
    .eq('status', 'published')
    .order('month', { ascending: true, nullsFirst: false })
    .order('display_order', { ascending: true })
    .limit(30)
  if (result.error) throw result.error

  const byId = new Map(scopedBrotherhoods.map((item) => [item.id, item]))
  const rows = result.data || []
  if (!rows.length) {
    const scope = brotherhood ? directoryName(brotherhood) : municipality
    return notDocumented(`Todavía no hay cultos publicados de ${scope} en Hilo Cofrade.`)
  }

  const scope = brotherhood ? directoryName(brotherhood) : municipality
  const items = rows.slice(0, 12).map((row) => {
    const owner = byId.get(row.brotherhood_entity_id)
    return {
      label: row.title || row.cult_type || 'Culto publicado',
      meta: [row.cult_type, row.cult_date || row.date_rule || row.recurrence_label, row.time_text].filter(Boolean).join(' · '),
      href: owner?.slug ? `/hermandades/${owner.slug}#cultos` : '',
      group: brotherhood ? '' : directoryName(owner),
    }
  })

  return answer({
    text: `Hilo Cofrade tiene ${rows.length} ${rows.length === 1 ? 'culto publicado' : 'cultos publicados'} de ${scope}.`,
    path: ['Cultos', scope, 'Contenido publicado'],
    items,
    links: brotherhood?.slug ? [{ label: `Ver los cultos de ${scope}`, href: `/hermandades/${brotherhood.slug}#cultos` }] : [],
    context: resultSetContext(ids, `${rows.length} cultos de ${scope}`, 'cults_by_published_scope'),
  })
}

function directoryFilter(items, question, { municipalityKey = 'municipality', identityValues }) {
  const municipality = matchMunicipalityName(question, items.map((item) => item[municipalityKey]))
  const normalizedMunicipality = normalizeFreeFactText(municipality)
  let filtered = municipality
    ? items.filter((item) => normalizeFreeFactText(item[municipalityKey]) === normalizedMunicipality)
    : items

  const scored = filtered
    .map((item) => ({ item, score: publishedContentScore(identityValues(item), question) }))
    .filter(({ score }) => score >= 100)
    .sort((first, second) => second.score - first.score)
  if (scored.length) filtered = scored.map(({ item }) => item)
  return { items: filtered, municipality }
}

async function gloryAnswer(question) {
  const directory = await getGloryDirectory()
  const scoped = directoryFilter(directory, question, {
    identityValues: (item) => [item.title, item.brotherhoodName, item.municipality, item.dateParts?.label, item.year],
  })
  const rows = scoped.items.slice(0, 12)
  if (!rows.length) return notDocumented('Todavía no hay procesiones de Gloria publicadas que coincidan con esa consulta.')
  const scope = scoped.municipality || 'Sevilla y su provincia'
  return answer({
    text: `Hilo Cofrade tiene ${scoped.items.length} ${scoped.items.length === 1 ? 'procesión de Gloria publicada' : 'procesiones de Gloria publicadas'} para ${scope}.`,
    path: ['Agenda Cofrade', 'Procesiones de Gloria', scope],
    items: rows.map((item) => ({
      label: item.title,
      meta: [item.brotherhoodName, item.municipality, item.dateParts?.label].filter(Boolean).join(' · '),
      href: item.detailHref,
    })),
    links: [{ label: 'Ver el calendario de Glorias', href: '/procesiones-de-gloria' }],
    context: resultSetContext(rows.map((item) => item.brotherhoodId), `${scoped.items.length} procesiones de Gloria`, 'published_glory_processions'),
  })
}

async function extraordinaryAnswer(question) {
  const directory = await getExtraordinaryDirectory()
  const scoped = directoryFilter(directory, question, {
    identityValues: (item) => [item.title, item.brotherhoodName, item.municipality, item.reason, item.dateParts?.label, item.year],
  })
  const rows = scoped.items.slice(0, 12)
  if (!rows.length) return notDocumented('Todavía no hay salidas extraordinarias publicadas que coincidan con esa consulta.')
  const scope = scoped.municipality || 'Sevilla y su provincia'
  return answer({
    text: `Hilo Cofrade tiene ${scoped.items.length} ${scoped.items.length === 1 ? 'salida extraordinaria publicada' : 'salidas extraordinarias publicadas'} para ${scope}.`,
    path: ['Agenda Cofrade', 'Extraordinarias', scope],
    items: rows.map((item) => ({
      label: item.title,
      meta: [item.brotherhoodName, item.municipality, item.dateParts?.label, item.reason].filter(Boolean).join(' · '),
      href: item.slug ? `/extraordinarias/${item.slug}` : item.anchorHref,
    })),
    links: [{ label: 'Ver el calendario de extraordinarias', href: '/extraordinarias' }],
    context: resultSetContext(rows.map((item) => item.brotherhoodEntityId), `${scoped.items.length} extraordinarias`, 'published_extraordinary_outings'),
  })
}

async function repertoiresAnswer(question) {
  const repertoires = await getMusicalRepertoires()
  const specificTokens = normalizePublishedContentText(question)
    .replace(/\b(cruceta|crucetas|repertorio|repertorios|musical|musicales|procesional|procesionales)\b/g, '')
    .trim()
  const scored = repertoires
    .map((item) => ({
      item,
      score: publishedContentScore([
        item.title,
        item.displayTitle,
        item.brotherhood?.name,
        item.band?.name,
        item.step?.name,
        item.year,
      ], specificTokens || question),
    }))
    .filter(({ score }) => !specificTokens || score >= 100)
    .sort((first, second) => second.score - first.score)
  const rows = (specificTokens ? scored.map(({ item }) => item) : repertoires).slice(0, 12)
  if (!rows.length) return notDocumented('Todavía no hay crucetas musicales publicadas que coincidan con esa consulta.')

  return answer({
    text: `Hilo Cofrade tiene ${rows.length} ${rows.length === 1 ? 'cruceta musical publicada' : 'crucetas musicales publicadas'} que coinciden con la consulta.`,
    path: ['Música', 'Crucetas musicales', 'Repertorios publicados'],
    items: rows.map((item) => ({
      label: item.displayTitle || item.title,
      meta: [item.band?.name, item.step?.name, item.year, `${item.worksCount} obras`].filter(Boolean).join(' · '),
      href: item.href,
    })),
    links: [{ label: 'Ver todas las crucetas musicales', href: '/crucetas-musicales' }],
    context: resultSetContext(rows.map((item) => item.brotherhood?.id), `${rows.length} crucetas musicales`, 'published_musical_repertoires'),
  })
}

function agendaCategory(question) {
  const q = normalizePublishedContentText(question)
  if (/\brosario/.test(q)) return 'rosaries'
  if (/\b(besamanos|besapies)/.test(q)) return 'devotions'
  if (/\bconcierto/.test(q)) return 'concerts'
  if (/\btraslado/.test(q)) return 'transfers'
  return ''
}

function weekendRange(today) {
  const date = new Date(`${today}T12:00:00Z`)
  const weekday = date.getUTCDay()
  const daysToSaturday = (6 - weekday + 7) % 7
  const saturday = new Date(date)
  saturday.setUTCDate(date.getUTCDate() + daysToSaturday)
  const sunday = new Date(saturday)
  sunday.setUTCDate(saturday.getUTCDate() + 1)
  return [saturday.toISOString().slice(0, 10), sunday.toISOString().slice(0, 10)]
}

async function agendaAnswer(question) {
  const { items, today } = await getAgendaCofrade()
  const municipality = matchMunicipalityName(question, items.map((item) => item.municipality))
  const municipalityKey = normalizeFreeFactText(municipality)
  const category = agendaCategory(question)
  const q = normalizePublishedContentText(question)
  const [saturday, sunday] = weekendRange(today)
  const rows = items
    .filter((item) => !municipality || normalizeFreeFactText(item.municipality) === municipalityKey)
    .filter((item) => !category || item.category === category)
    .filter((item) => !/\bhoy\b/.test(q) || item.date === today)
    .filter((item) => !/fin de semana/.test(q) || (item.date >= saturday && item.date <= sunday))
    .filter((item) => item.isUpcoming && !item.isCancelled)
    .slice(0, 12)
  if (!rows.length) return notDocumented('No hay actos próximos publicados que coincidan con esa consulta.')

  const scope = municipality || 'Sevilla y su provincia'
  return answer({
    text: `La Agenda Cofrade tiene ${rows.length} ${rows.length === 1 ? 'acto próximo' : 'actos próximos'} para ${scope} que coinciden con la consulta.`,
    path: ['Agenda Cofrade', category ? rows[0]?.categoryName || 'Categoría' : 'Próximos actos', scope],
    items: rows.map((item) => ({
      label: item.title,
      meta: [item.categoryLabel, item.dateInfo?.label, item.startTime, item.municipality, item.organizer].filter(Boolean).join(' · '),
      href: item.href || item.categoryHref || '/agenda-cofrade',
      group: item.categoryName,
    })),
    links: [{ label: 'Abrir la Agenda Cofrade', href: '/agenda-cofrade' }],
  })
}

export async function askHiloCofradePublishedContent(question) {
  const intent = publishedContentIntent(question)
  if (!intent) return null

  try {
    if (intent.kind === 'cults') return await cultsAnswer(question)
    if (intent.kind === 'glory_processions') return await gloryAnswer(question)
    if (intent.kind === 'extraordinary_outings') return await extraordinaryAnswer(question)
    if (intent.kind === 'musical_repertoires') return await repertoiresAnswer(question)
    if (intent.kind === 'agenda') return await agendaAnswer(question)
    return null
  } catch (error) {
    console.error('[Hilo Cofrade] Error al consultar contenido publicado', {
      question: String(question || '').slice(0, 320),
      intent: intent.kind,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}
