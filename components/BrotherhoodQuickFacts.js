import 'server-only'

import { createPublicClient as createClient } from '@/lib/supabase/public'
import { publicText } from '@/lib/supabase/public-entity-page'
import styles from './BrotherhoodQuickFacts.module.css'

const CURRENT_HEAD_RELATIONS = ['hermano_mayor_of', 'hermana_mayor_of']

function normalized(value = '') {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .trim()
}

function latestYear(value = '') {
  const matches = String(value || '').match(/\b(?:19|20)\d{2}\b/g) || []
  return matches.length ? Number(matches.at(-1)) : null
}

function isCurrentRelation(item, currentYear) {
  if (item.date_to) return Number(String(item.date_to).slice(0, 4)) >= currentYear
  const textYear = latestYear(item.date_to_text)
  return textYear ? textYear >= currentYear : !publicText(item.date_to_text)
}

function periodLabel(item = {}) {
  const from = publicText(item.date_from_text) || (item.date_from ? String(item.date_from).slice(0, 4) : '')
  const to = publicText(item.date_to_text) || (item.date_to ? String(item.date_to).slice(0, 4) : '')

  if (from && to) {
    const fromYear = latestYear(from) || from
    const toYear = latestYear(to) || to
    return `${fromYear}–${toYear}`
  }
  if (from) return /^desde\b/i.test(from) ? from : `Desde ${from}`
  if (to) return /^hasta\b/i.test(to) ? to : `Hasta ${to}`
  return ''
}

function membersLabel(count, kind) {
  if (!Number.isFinite(Number(count))) return ''
  const value = Number(count).toLocaleString('es-ES')

  if (kind === 'approximate') return `≈ ${value}`
  if (kind === 'minimum') return `Más de ${value}`
  if (kind === 'maximum') return `Menos de ${value}`
  return value
}

function activityLabel(type = '') {
  const value = normalized(type)
  if (value.includes('via crucis')) return 'Vía Crucis'
  if (value.includes('rosario')) return 'Rosario'
  if (value.includes('traslado')) return 'Traslado'
  if (value.includes('corpus') || value.includes('eucarist')) return 'Procesión eucarística'
  if (value.includes('gloria')) return 'Procesión de Gloria'
  if (value.includes('penitencia') || value.includes('estacion')) return 'Estación de penitencia'
  if (value.includes('procesion')) return 'Procesión'
  return publicText(type) || 'Salida habitual'
}

function activityMoment(item = {}) {
  return publicText(item.diaLiturgico)
    || publicText(item.momento)
    || publicText(item.fechaDetalle)
    || ''
}

function annualActivities(brotherhood) {
  const mainDay = publicText(brotherhood.diaSalida)
  const types = brotherhood.tipos || []
  const main = mainDay
    ? [{
        id: 'main-procession',
        label: types.includes('Penitencia') ? 'Estación de penitencia' : 'Salida principal',
        moment: mainDay,
      }]
    : []

  const recurring = (brotherhood.salidas || [])
    .filter((item) => item.estado === 'recurring')
    .map((item) => ({
      id: item.id,
      label: activityLabel(item.tipo),
      moment: activityMoment(item),
    }))
    .filter((item) => item.moment)

  const seen = new Set()
  return [...main, ...recurring].filter((item) => {
    const key = `${normalized(item.label)}|${normalized(item.moment)}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

async function loadRelationalFacts(brotherhood) {
  if (!brotherhood?.id) return { head: null, dressers: [], membership: null }

  const supabase = createClient()
  const imageIds = (brotherhood.imagenes || []).map((item) => item.id).filter(Boolean)
  const currentYear = new Date().getUTCFullYear()

  const [headResult, dresserResult, membershipResult] = await Promise.all([
    supabase
      .from('entity_relations')
      .select('id, source_entity_id, relation_type, date_from, date_from_text, date_to, date_to_text')
      .eq('target_entity_id', brotherhood.id)
      .in('relation_type', CURRENT_HEAD_RELATIONS)
      .eq('status', 'published'),
    imageIds.length
      ? supabase
          .from('entity_relations')
          .select('id, source_entity_id, target_entity_id, date_from, date_from_text, date_to, date_to_text')
          .in('target_entity_id', imageIds)
          .eq('relation_type', 'dresser_of')
          .eq('status', 'published')
      : Promise.resolve({ data: [], error: null }),
    supabase
      .from('brotherhood_procession_stats')
      .select('year, members_count, members_count_kind, members_source_id')
      .eq('brotherhood_entity_id', brotherhood.id)
      .eq('status', 'published')
      .not('members_count', 'is', null)
      .order('year', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  if (headResult.error) throw new Error(`No se pudo consultar el gobierno actual: ${headResult.error.message}`)
  if (dresserResult.error) throw new Error(`No se pudieron consultar los vestidores: ${dresserResult.error.message}`)
  if (membershipResult.error) throw new Error(`No se pudo consultar el número de hermanos: ${membershipResult.error.message}`)

  const headRelations = (headResult.data || []).filter((item) => isCurrentRelation(item, currentYear))
  const dresserRelations = (dresserResult.data || []).filter((item) => isCurrentRelation(item, currentYear))
  const agentIds = [...new Set([
    ...headRelations.map((item) => item.source_entity_id),
    ...dresserRelations.map((item) => item.source_entity_id),
  ].filter(Boolean))]

  const agentsResult = agentIds.length
    ? await supabase
        .from('entities')
        .select('id, name, slug, status')
        .in('id', agentIds)
        .eq('entity_type', 'agent')
        .eq('status', 'published')
    : { data: [], error: null }

  if (agentsResult.error) throw new Error(`No se pudieron resolver las personas vinculadas: ${agentsResult.error.message}`)

  const agentById = new Map((agentsResult.data || []).map((agent) => [agent.id, agent]))
  const imageById = new Map((brotherhood.imagenes || []).map((image) => [image.id, image]))
  const headRelation = [...headRelations]
    .sort((first, second) => latestYear(second.date_from_text || second.date_from) - latestYear(first.date_from_text || first.date_from))
    .find((item) => agentById.has(item.source_entity_id))
  const headAgent = headRelation ? agentById.get(headRelation.source_entity_id) : null

  return {
    head: headRelation && headAgent
      ? {
          name: headAgent.name,
          slug: headAgent.slug || '',
          label: headRelation.relation_type === 'hermana_mayor_of' ? 'Hermana Mayor' : 'Hermano Mayor',
          period: periodLabel(headRelation),
        }
      : null,
    dressers: dresserRelations
      .map((relation) => {
        const agent = agentById.get(relation.source_entity_id)
        const image = imageById.get(relation.target_entity_id)
        if (!agent || !image) return null
        return {
          id: relation.id,
          name: agent.name,
          slug: agent.slug || '',
          image: image.nombre,
          period: periodLabel(relation),
        }
      })
      .filter(Boolean)
      .sort((first, second) => first.image.localeCompare(second.image, 'es')),
    membership: membershipResult.data?.members_count !== null && membershipResult.data?.members_count !== undefined
      ? {
          value: membersLabel(membershipResult.data.members_count, membershipResult.data.members_count_kind),
          year: membershipResult.data.year,
        }
      : null,
  }
}

export default async function BrotherhoodQuickFacts({ brotherhood }) {
  let relational = { head: null, dressers: [], membership: null }

  try {
    relational = await loadRelationalFacts(brotherhood)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo completar De un vistazo', {
      slug: brotherhood?.slug,
      error: error instanceof Error ? error.message : String(error),
    })
  }

  const activities = annualActivities(brotherhood)
  const facts = [
    publicText(brotherhood.fundacion) ? { label: 'Fundación', value: publicText(brotherhood.fundacion) } : null,
    brotherhood.imagenes?.length ? { label: 'Titulares', value: String(brotherhood.imagenes.length) } : null,
    brotherhood.pasos?.length ? { label: 'Pasos', value: String(brotherhood.pasos.length) } : null,
    relational.membership ? {
      label: 'Hermanos',
      value: relational.membership.value,
      meta: `Dato de ${relational.membership.year}`,
    } : null,
    relational.head ? {
      label: relational.head.label,
      value: relational.head.name,
      meta: relational.head.period,
    } : null,
  ].filter(Boolean)

  if (!facts.length && !activities.length && !relational.dressers.length) return null

  return (
    <div className={styles.wrapper}>
      {facts.length ? (
        <dl className={styles.facts}>
          {facts.map((fact) => (
            <div className={styles.fact} key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
              {fact.meta ? <small>{fact.meta}</small> : null}
            </div>
          ))}
        </dl>
      ) : null}

      {activities.length ? (
        <div className={styles.activities}>
          <div className={styles.blockTitle}>
            <span>Actividad anual habitual</span>
            <small>Qué hace la Hermandad durante el año</small>
          </div>
          <div className={styles.activityGrid}>
            {activities.map((activity) => (
              <div className={styles.activity} key={activity.id}>
                <small>{activity.label}</small>
                <strong>{activity.moment}</strong>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {relational.dressers.length ? (
        <div className={styles.dressers}>
          <div className={styles.blockTitle}>
            <span>Vestidores actuales</span>
            <small>Vinculación documentada con los Titulares</small>
          </div>
          <div className={styles.dresserGrid}>
            {relational.dressers.map((dresser) => (
              <div className={styles.dresser} key={dresser.id}>
                <small>{dresser.image}</small>
                <strong>{dresser.name}</strong>
                {dresser.period ? <span>{dresser.period}</span> : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
