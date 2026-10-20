import 'server-only'
import { getAgendaCofradeSources } from '@/lib/supabase/agenda-cofrade'
import { createClient } from '@/lib/supabase/server'
import { agendaPhotoGaps } from '@/lib/panel/agenda-photo-gaps-core'

// Aviso del Panel: actos de la Agenda de los próximos días sin foto ni cartel
// propios, con el enlace directo a donde se sube. Reutiliza las fuentes de la
// Agenda (misma caché) y añade una lectura por lotes para saber de qué
// Hermandad es cada salida o culto. Si algo falla, el Panel sigue sin el aviso.
export async function getAgendaPhotoGaps({ days = 15, today = '' } = {}) {
  try {
    const sources = await getAgendaCofradeSources()
    const gaps = agendaPhotoGaps(sources, { days, today })
    if (!gaps.length) return gaps

    const supabase = await createClient()
    const outingIds = gaps.filter((gap) => gap.kind === 'outing').map((gap) => gap.id)
    const cultIds = gaps.filter((gap) => gap.kind === 'cult').map((gap) => gap.cultId)
    const [outings, cults] = await Promise.all([
      outingIds.length ? supabase.from('outings').select('id, brotherhood_entity_id').in('id', outingIds) : { data: [] },
      cultIds.length ? supabase.from('cults').select('id, brotherhood_entity_id').in('id', cultIds) : { data: [] },
    ])
    if (outings.error) throw outings.error
    if (cults.error) throw cults.error
    const brotherhoodByOuting = new Map((outings.data || []).map((row) => [row.id, row.brotherhood_entity_id]))
    const brotherhoodByCult = new Map((cults.data || []).map((row) => [row.id, row.brotherhood_entity_id]))

    return gaps.map((gap) => {
      if (gap.kind === 'outing') {
        const brotherhoodId = brotherhoodByOuting.get(gap.id)
        return { ...gap, panelHref: brotherhoodId ? `/panel/hermandades/${brotherhoodId}/salidas#outing-${gap.id}` : '' }
      }
      if (gap.kind === 'cult') {
        const brotherhoodId = brotherhoodByCult.get(gap.cultId)
        return { ...gap, panelHref: brotherhoodId ? `/panel/hermandades/${brotherhoodId}/multimedia#contenido-${gap.cultId}` : '' }
      }
      return { ...gap, panelHref: `/panel/multimedia?entity=${gap.id}` }
    })
  } catch (error) {
    console.error('[Hilo Cofrade] Aviso de actos sin foto no disponible', {
      error: error instanceof Error ? error.message : String(error),
    })
    return []
  }
}
