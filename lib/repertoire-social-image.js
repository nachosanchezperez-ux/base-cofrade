import { ImageResponse } from 'next/og'
import { musicalRepertoireDateLabel } from '@/lib/musical-repertoires/presentation'
import { getMusicalRepertoireBySlug } from '@/lib/supabase/musical-repertoires'

// Imagen para compartir una cruceta: colores de la Hermandad, nombre, fecha,
// banda y las obras que más se repitieron. Sin fotografía: el diseño no depende de imágenes.
const FALLBACK_PRIMARY = '#112339'
const FALLBACK_ACCENT = '#B01B32'

function safeColor(value, fallback) {
  return /^#[0-9a-f]{6}$/i.test(String(value || '')) ? value : fallback
}

export const REPERTOIRE_SOCIAL_IMAGE_SIZE = { width: 1200, height: 630 }

export async function renderRepertoireSocialImage(slug) {
  const repertoire = await getMusicalRepertoireBySlug(slug)
  const primary = safeColor(repertoire?.colors?.primary, FALLBACK_PRIMARY)
  const accent = safeColor(repertoire?.colors?.accent, FALLBACK_ACCENT)
  const name = repertoire?.identityName || repertoire?.displayTitle || 'Crucetas musicales'
  const edition = repertoire
    ? (repertoire.moment ? `${repertoire.moment} ${repertoire.year || ''}`.trim() : musicalRepertoireDateLabel(repertoire.date))
    : ''
  const top = [...(repertoire?.entries || [])]
    .sort((first, second) => second.count - first.count || first.displayOrder - second.displayOrder)
    .slice(0, 3)
    .filter((entry) => entry.count > 1)

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '52px 64px', color: '#FFFFFF', background: `linear-gradient(135deg, ${primary} 0%, ${primary} 62%, ${accent} 140%)`, fontFamily: 'Arial, sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 22, fontWeight: 700, letterSpacing: 3 }}>
          <div style={{ width: 34, height: 4, display: 'flex', borderRadius: 999, background: '#FFFFFF', opacity: 0.9 }} />
          HILO COFRADE · CRUCETA MUSICAL
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 26, fontWeight: 600, opacity: 0.85 }}>{edition}</div>
          <div style={{ display: 'flex', maxWidth: 1060, marginTop: 10, fontSize: name.length > 34 ? 58 : 70, lineHeight: 1.02, fontWeight: 800, letterSpacing: -1.6 }}>{name}</div>
          {repertoire?.band?.name ? <div style={{ display: 'flex', marginTop: 18, fontSize: 28, fontWeight: 600, opacity: 0.94 }}>{`Por ${repertoire.band.name}`}</div> : null}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 32 }}>
          <div style={{ display: 'flex', gap: 36 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: 56, fontWeight: 800 }}>{repertoire?.worksCount ?? ''}</span><span style={{ fontSize: 20, opacity: 0.8 }}>obras</span></div>
            <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: 56, fontWeight: 800 }}>{repertoire?.performancesCount ?? ''}</span><span style={{ fontSize: 20, opacity: 0.8 }}>interpretaciones</span></div>
          </div>
          {top.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, fontSize: 22, fontWeight: 600 }}>
              <span style={{ fontSize: 16, letterSpacing: 2, opacity: 0.75 }}>LO QUE MÁS SONÓ</span>
              {top.map((entry) => <span key={entry.id}>{`${entry.title} ×${entry.count}`}</span>)}
            </div>
          ) : null}
        </div>
      </div>
    ),
    REPERTOIRE_SOCIAL_IMAGE_SIZE,
  )
}
