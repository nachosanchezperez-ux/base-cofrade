import { ImageResponse } from 'next/og';
import { absoluteUrl } from '@/lib/seo';
import { getHermandadPageBySlug } from '@/lib/supabase/brotherhood-page';
import { getGloryDetailByOutingId } from '@/lib/supabase/glory-directory';
import { resolveSocialImageSource } from '@/lib/social-image-media';
import { bandSegments, outingCardTitle, outingDateParts, outingRouteStops } from '@/lib/brotherhood-featured-outing';
import { fitRoutePoints, svgPath } from '@/lib/route-map';

// Imagen vertical (1080 × 1920) de una salida para estados e historias:
// fecha, horas, bandas y el recorrido dibujado en los colores de la Hermandad.
// Solo datos publicados; sin coordenadas, el recorrido no se dibuja.

const WIDTH = 1080;
const HEIGHT = 1920;
const FALLBACK_PRIMARY = '#112339';
const FALLBACK_SECONDARY = '#C6A15B';
const WEEKDAYS_LONG = { dom: 'Domingo', lun: 'Lunes', mar: 'Martes', 'mié': 'Miércoles', jue: 'Jueves', vie: 'Viernes', 'sáb': 'Sábado' };
const MONTHS_LONG = { ene: 'enero', feb: 'febrero', mar: 'marzo', abr: 'abril', may: 'mayo', jun: 'junio', jul: 'julio', ago: 'agosto', sep: 'septiembre', oct: 'octubre', nov: 'noviembre', dic: 'diciembre' };

function safeColor(value, fallback) {
  return /^#[0-9a-f]{6}$/i.test(String(value || '')) ? value : fallback;
}

function brotherhoodSlug(href = '') {
  return String(href || '').match(/\/hermandades\/([^/?#]+)/)?.[1] || '';
}

function MusicGlyph({ color }) {
  // Lucide «music» (ISC).
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
    </svg>
  );
}

export async function renderOutingStoryImage(outingId) {
  const outing = await getGloryDetailByOutingId(outingId).catch(() => null);
  if (!outing) return new Response('Salida no encontrada', { status: 404 });

  const brotherhood = await getHermandadPageBySlug(brotherhoodSlug(outing.brotherhoodHref)).catch(() => null);
  const primary = safeColor(brotherhood?.colores?.primario, FALLBACK_PRIMARY);
  const secondary = safeColor(brotherhood?.colores?.secundario, FALLBACK_SECONDARY);
  const crestSrc = outing.crestPath ? await resolveSocialImageSource(absoluteUrl(outing.crestPath)).catch(() => '') : '';

  const date = outingDateParts(outing.date);
  const name = brotherhood?.nombrePopular || outing.brotherhoodName;
  const title = outingCardTitle(outing.title, {
    names: [name, brotherhood?.nombreOficial, ...(brotherhood?.imagenes || []).map((imagen) => imagen.nombre)],
    fallback: outing.outingType || 'Procesión de Gloria',
  });
  const route = outingRouteStops(outing.routeSummary, { origin: outing.origin, destination: outing.destination });
  const music = (outing.processionalMusic?.length ? outing.processionalMusic : outing.music || []).slice(0, 3);
  const segments = bandSegments(music, route);
  const map = fitRoutePoints(outing.routePoints || [], { width: 900, height: 640, padding: 40 });
  const sameCount = map && (outing.routePoints || []).length === map.points.length;
  const path = map ? svgPath(map.points) : '';

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '84px 90px 72px', color: '#FFFFFF', background: `linear-gradient(170deg, ${primary} 0%, ${primary} 55%, #0b0f14 135%)`, fontFamily: 'Arial, sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ display: 'flex', width: 54, height: 6, borderRadius: 3, background: secondary }} />
            <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, letterSpacing: 2 }}>HILO COFRADE</div>
          </div>
          {crestSrc ? <img src={crestSrc} alt="" width={120} height={120} style={{ objectFit: 'contain' }} /> : null}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 36, marginTop: 70 }}>
          {date ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 190, height: 210, borderRadius: 32, background: '#FFFFFF', color: primary }}>
              <div style={{ display: 'flex', fontSize: 34, fontWeight: 700, letterSpacing: 3 }}>{date.weekday.toUpperCase()}</div>
              <div style={{ display: 'flex', fontSize: 104, fontWeight: 800, lineHeight: 1 }}>{date.day}</div>
              <div style={{ display: 'flex', fontSize: 34, fontWeight: 700, letterSpacing: 3 }}>{date.month.toUpperCase()}</div>
            </div>
          ) : null}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, letterSpacing: 3, color: secondary }}>
              {date ? `${WEEKDAYS_LONG[date.weekday] || ''} ${date.day} de ${MONTHS_LONG[date.month] || ''}`.toUpperCase() : 'PRÓXIMA SALIDA'}
            </div>
            <div style={{ display: 'flex', fontSize: 78, fontWeight: 800, lineHeight: 1.05, marginTop: 10 }}>{name}</div>
            <div style={{ display: 'flex', fontSize: 34, lineHeight: 1.25, marginTop: 12, opacity: 0.9 }}>{title}</div>
          </div>
        </div>

        <div style={{ display: 'flex', marginTop: 56, borderRadius: 28, background: 'rgba(255,255,255,0.10)' }}>
          {[['SALIDA', outing.departureTime], ['ENTRADA', outing.returnTime]].map(([label, value], index) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '30px 36px', borderLeft: index ? '2px solid rgba(255,255,255,0.18)' : 'none' }}>
              <div style={{ display: 'flex', fontSize: 28, fontWeight: 700, letterSpacing: 3, opacity: 0.8 }}>{label}</div>
              <div style={{ display: 'flex', fontSize: value ? 104 : 44, fontWeight: 800, lineHeight: value ? 1.05 : 2.4, opacity: value ? 1 : 0.75 }}>{value || 'Por confirmar'}</div>
            </div>
          ))}
        </div>

        {map ? (
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 48, alignItems: 'center' }}>
            <svg width="900" height="640" viewBox="0 0 900 640">
              <path d={path} fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
              {sameCount ? segments.map((band) => (
                <path key={band.id} d={svgPath(map.points.slice(band.start, band.end + 1))} fill="none" stroke={secondary} strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
              )) : null}
              <path d={path} fill="none" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx={map.points[0].x} cy={map.points[0].y} r="22" fill={secondary} stroke="#FFFFFF" strokeWidth="8" />
            </svg>
            <div style={{ display: 'flex', fontSize: 26, opacity: 0.75, marginTop: 10 }}>
              {`Recorrido · ${route.streets.length} calles · Trazado aproximado · © OpenStreetMap`}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flex: 1 }} />
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 44 }}>
          {music.map((band) => {
            const segment = segments.find((item) => item.id === (band.id || band.name));
            return (
              <div key={band.id || band.name} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 32, background: segment ? secondary : 'rgba(255,255,255,0.14)' }}>
                  <MusicGlyph color={segment ? primary : '#FFFFFF'} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', fontSize: 26, opacity: 0.8 }}>{[band.context, segment ? `hasta ${segment.endLabel}` : ''].filter(Boolean).join(' · ')}</div>
                  <div style={{ display: 'flex', fontSize: 40, fontWeight: 700 }}>{band.name}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', marginTop: 'auto', paddingTop: 40, justifyContent: 'space-between', alignItems: 'center', fontSize: 30 }}>
          <div style={{ display: 'flex', opacity: 0.85 }}>Recorrido, bandas y horarios en</div>
          <div style={{ display: 'flex', fontWeight: 800 }}>hilocofrade.es</div>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      headers: { 'Cache-Control': 'public, max-age=600, s-maxage=600, stale-while-revalidate=3600' },
    }
  );
}
