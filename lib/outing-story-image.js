import { ImageResponse } from 'next/og';
import { absoluteUrl } from '@/lib/seo';
import { getHermandadPageBySlug } from '@/lib/supabase/brotherhood-page';
import { getGloryDetailByOutingId } from '@/lib/supabase/glory-directory';
import { resolveSocialImageSource } from '@/lib/social-image-media';
import { loadFonts } from '@/lib/section-social-image';
import { bandSegments, outingCardTitle, outingDateParts, outingRouteStops } from '@/lib/brotherhood-featured-outing';
import { fitRoutePoints, svgPath } from '@/lib/route-map';

// Imagen de una salida para redes, en los colores de la Hermandad:
// - «estado» (1080 × 1920): estados de WhatsApp e historias de Instagram.
// - «cuadrado» (1080 × 1080): publicaciones.
// Fecha, horas, bandas y el recorrido dibujado con el tramo de cada banda.
// Solo datos publicados; sin coordenadas, el recorrido no se dibuja.

export const OUTING_IMAGE_FORMATS = {
  estado: { width: 1080, height: 1920 },
  cuadrado: { width: 1080, height: 1080 },
};
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

function MusicGlyph({ color, size = 34 }) {
  // Lucide «music» (ISC).
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
    </svg>
  );
}

function RouteDrawing({ map, segments, sameCount, primary, secondary, width, height }) {
  const path = svgPath(map.points);
  const first = map.points[0];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${map.width} ${map.height}`}>
      <path d={path} fill="none" stroke="rgba(0,0,0,0.28)" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
      {sameCount ? segments.map((band) => (
        <path key={band.id} d={svgPath(map.points.slice(band.start, band.end + 1))} fill="none" stroke={secondary} strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
      )) : null}
      <path d={path} fill="none" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={first.x} cy={first.y} r="24" fill={secondary} stroke="#FFFFFF" strokeWidth="8" />
      <circle cx={first.x} cy={first.y} r="8" fill={primary} />
    </svg>
  );
}

function Legend({ origin, segments, secondary, fontSize }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize, opacity: 0.92 }}>
      {origin ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', width: 22, height: 22, borderRadius: 11, background: secondary, border: '4px solid #FFFFFF' }} />
          <div style={{ display: 'flex' }}>{`Salida y entrada · ${origin}`}</div>
        </div>
      ) : null}
      {segments.map((band) => (
        <div key={band.id} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', width: 34, height: 10, borderRadius: 5, background: secondary }} />
          <div style={{ display: 'flex' }}>{`${band.name} hasta ${band.endLabel}`}</div>
        </div>
      ))}
    </div>
  );
}

export async function renderOutingStoryImage(outingId, format = 'estado') {
  const size = OUTING_IMAGE_FORMATS[format] || OUTING_IMAGE_FORMATS.estado;
  const square = size.height === size.width;
  const outing = await getGloryDetailByOutingId(outingId).catch(() => null);
  if (!outing) return new Response('Salida no encontrada', { status: 404 });

  const [brotherhood, fonts] = await Promise.all([
    getHermandadPageBySlug(brotherhoodSlug(outing.brotherhoodHref)).catch(() => null),
    loadFonts().catch(() => undefined),
  ]);
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
  const mapBox = square ? { width: 480, height: 560 } : { width: 900, height: 620 };
  const map = fitRoutePoints(outing.routePoints || [], { ...mapBox, padding: 40 });
  const sameCount = map && (outing.routePoints || []).length === map.points.length;
  const longDate = date ? `${WEEKDAYS_LONG[date.weekday] || ''} ${date.day} de ${MONTHS_LONG[date.month] || ''}`.toUpperCase() : '';
  const origin = route.origin && route.origin === route.destination ? route.origin : '';
  const times = [['SALIDA', outing.departureTime], ['ENTRADA', outing.returnTime]];

  const header = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ display: 'flex', width: 54, height: 6, borderRadius: 3, background: secondary }} />
        <div style={{ display: 'flex', fontSize: 28, fontWeight: 800, letterSpacing: 3 }}>HILO COFRADE</div>
      </div>
      {crestSrc ? <img src={crestSrc} alt="" width={square ? 96 : 124} height={square ? 96 : 124} style={{ objectFit: 'contain' }} /> : null}
    </div>
  );

  const identity = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
      {date ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: square ? 150 : 190, height: square ? 168 : 214, borderRadius: 30, background: '#FFFFFF', color: primary }}>
          <div style={{ display: 'flex', fontSize: square ? 28 : 34, fontWeight: 800, letterSpacing: 3 }}>{date.weekday.toUpperCase()}</div>
          <div style={{ display: 'flex', fontSize: square ? 82 : 106, fontWeight: 800, lineHeight: 1 }}>{date.day}</div>
          <div style={{ display: 'flex', fontSize: square ? 28 : 34, fontWeight: 800, letterSpacing: 3 }}>{date.month.toUpperCase()}</div>
        </div>
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {longDate ? <div style={{ display: 'flex', fontSize: square ? 24 : 30, fontWeight: 800, letterSpacing: 3, color: secondary }}>{longDate}</div> : null}
        <div style={{ display: 'flex', fontSize: square ? 60 : 80, fontWeight: 800, lineHeight: 1.04, marginTop: 8, letterSpacing: -1 }}>{name}</div>
        <div style={{ display: 'flex', fontSize: square ? 26 : 34, fontWeight: 600, lineHeight: 1.25, marginTop: 10, opacity: 0.88 }}>{title}</div>
      </div>
    </div>
  );

  const timeBlock = (
    <div style={{ display: 'flex', flexDirection: square ? 'column' : 'row', borderRadius: 28, background: 'rgba(255,255,255,0.10)' }}>
      {times.map(([label, value], index) => (
        <div key={label} style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: square ? '20px 28px' : '30px 36px', borderLeft: !square && index ? '2px solid rgba(255,255,255,0.18)' : 'none', borderTop: square && index ? '2px solid rgba(255,255,255,0.18)' : 'none' }}>
          <div style={{ display: 'flex', fontSize: square ? 22 : 28, fontWeight: 800, letterSpacing: 3, opacity: 0.8 }}>{label}</div>
          <div style={{ display: 'flex', fontSize: value ? (square ? 76 : 108) : (square ? 34 : 44), fontWeight: value ? 800 : 600, lineHeight: value ? 1.05 : 2, opacity: value ? 1 : 0.75 }}>{value || 'Por confirmar'}</div>
        </div>
      ))}
    </div>
  );

  const bands = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: square ? 14 : 22 }}>
      {music.map((band) => {
        const segment = segments.find((item) => item.id === (band.id || band.name));
        return (
          <div key={band.id || band.name} style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: square ? 52 : 64, height: square ? 52 : 64, borderRadius: 32, background: segment ? secondary : 'rgba(255,255,255,0.14)' }}>
              <MusicGlyph color={segment ? primary : '#FFFFFF'} size={square ? 26 : 34} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {band.context ? <div style={{ display: 'flex', fontSize: square ? 20 : 26, fontWeight: 600, opacity: 0.78 }}>{band.context}</div> : null}
              <div style={{ display: 'flex', fontSize: square ? 30 : 40, fontWeight: 800 }}>{band.name}</div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const footer = (
    <div style={{ display: 'flex', marginTop: 'auto', paddingTop: 28, justifyContent: 'space-between', alignItems: 'center', fontSize: square ? 22 : 28 }}>
      <div style={{ display: 'flex', fontWeight: 600, opacity: 0.85 }}>{map ? 'Trazado aproximado · © OpenStreetMap' : 'Horarios y recorrido en'}</div>
      <div style={{ display: 'flex', fontWeight: 800 }}>hilocofrade.es</div>
    </div>
  );

  const drawing = map ? <RouteDrawing map={map} segments={segments} sameCount={sameCount} primary={primary} secondary={secondary} width={mapBox.width} height={mapBox.height} /> : null;

  return new ImageResponse(
    square ? (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '60px 64px 48px', color: '#FFFFFF', background: `linear-gradient(160deg, ${primary} 0%, ${primary} 60%, #0b0f14 140%)`, fontFamily: 'Open Sans' }}>
        {header}
        <div style={{ display: 'flex', marginTop: 34 }}>{identity}</div>
        <div style={{ display: 'flex', gap: 36, marginTop: 34, flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 26, width: 420 }}>
            {timeBlock}
            {bands}
          </div>
          {drawing ? <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>{drawing}</div> : null}
        </div>
        {footer}
      </div>
    ) : (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '84px 90px 72px', color: '#FFFFFF', background: `linear-gradient(170deg, ${primary} 0%, ${primary} 55%, #0b0f14 135%)`, fontFamily: 'Open Sans' }}>
        {header}
        <div style={{ display: 'flex', marginTop: 64 }}>{identity}</div>
        <div style={{ display: 'flex', marginTop: 52 }}>{timeBlock}</div>
        {drawing ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40, gap: 18 }}>
            {drawing}
            <div style={{ display: 'flex', alignSelf: 'stretch' }}>
              <Legend origin={origin} segments={sameCount ? segments : []} secondary={secondary} fontSize={26} />
            </div>
          </div>
        ) : null}
        <div style={{ display: 'flex', marginTop: 40 }}>{bands}</div>
        {footer}
      </div>
    ),
    {
      ...size,
      fonts,
      headers: { 'Cache-Control': 'public, max-age=600, s-maxage=600, stale-while-revalidate=3600' },
    }
  );
}
