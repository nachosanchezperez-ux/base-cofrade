import { ImageResponse } from 'next/og';
import { absoluteUrl } from '@/lib/seo';
import { getHermandadPageBySlug } from '@/lib/supabase/brotherhood-page';
import { getPublishedEntityCoverMedia } from '@/lib/supabase/entity-media';

const FALLBACK_PRIMARY = '#112339';
const FALLBACK_SECONDARY = '#7A263A';

function safeColor(value, fallback) {
  return /^#[0-9a-f]{6}$/i.test(String(value || '')) ? value : fallback;
}

function socialTypeLabel(brotherhood) {
  const types = brotherhood?.tipos || [];
  if (types.includes('Penitencia')) return 'Hermandad de Penitencia';
  if (types.includes('Gloria')) return 'Hermandad de Gloria';
  if (types.includes('Sacramental')) return 'Hermandad Sacramental';
  return 'Hermandad';
}

export async function renderBrotherhoodSocialImage(slug) {
  const brotherhood = await getHermandadPageBySlug(slug);
  const coverMedia = brotherhood?.id
    ? await getPublishedEntityCoverMedia(brotherhood.id)
    : null;
  const primary = safeColor(brotherhood?.colores?.primario, FALLBACK_PRIMARY);
  const secondary = safeColor(brotherhood?.colores?.secundario, FALLBACK_SECONDARY);
  const photoSrc = coverMedia?.path ? absoluteUrl(coverMedia.path) : '';
  const title = brotherhood?.nombrePopular || 'Hilo Cofrade';
  const locality = brotherhood?.localidad || 'Sevilla y provincia';
  const typeLabel = brotherhood ? socialTypeLabel(brotherhood) : 'Enciclopedia cofrade';
  const outing = brotherhood?.diaSalida || '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          color: '#FFFFFF',
          background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {photoSrc ? (
          <img
            src={photoSrc}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: coverMedia?.focusPosition || '50% 50%',
            }}
          />
        ) : null}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background: photoSrc
              ? 'linear-gradient(90deg, rgba(6, 18, 31, 0.92) 0%, rgba(6, 18, 31, 0.72) 52%, rgba(6, 18, 31, 0.28) 100%)'
              : 'linear-gradient(135deg, rgba(17, 35, 57, 0.2) 0%, rgba(0, 0, 0, 0.18) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 64,
            top: 48,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 3,
          }}
        >
          <div
            style={{
              width: 34,
              height: 4,
              display: 'flex',
              borderRadius: 999,
              background: '#FFFFFF',
              opacity: 0.9,
            }}
          />
          HILO COFRADE
        </div>
        <div
          style={{
            position: 'absolute',
            left: 64,
            right: 64,
            bottom: 60,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              display: 'flex',
              marginBottom: 18,
              padding: '8px 14px',
              border: '1px solid rgba(255,255,255,0.42)',
              borderRadius: 999,
              background: 'rgba(7, 20, 34, 0.42)',
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 1.2,
            }}
          >
            {typeLabel}
          </div>
          <div
            style={{
              display: 'flex',
              maxWidth: 980,
              fontSize: title.length > 34 ? 58 : 68,
              lineHeight: 1.02,
              fontWeight: 800,
              letterSpacing: -1.8,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginTop: 22,
              fontSize: 24,
              fontWeight: 600,
              opacity: 0.94,
            }}
          >
            <span>{locality}</span>
            {outing ? <span>·</span> : null}
            {outing ? <span>{outing}</span> : null}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
