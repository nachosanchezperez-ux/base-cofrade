import { ImageResponse } from 'next/og';

export const alt = 'Hilo Cofrade · Enciclopedia cofrade de Sevilla y provincia';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '74px 82px',
          color: '#FFFFFF',
          background: '#112339',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '30px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '999px',
                background: '#B01B32',
              }}
            />

            <div
              style={{
                width: '72px',
                height: '10px',
                background: '#B01B32',
              }}
            />

            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '999px',
                background: '#B01B32',
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '20px',
              color: '#FFFFFF',
              fontSize: '60px',
              letterSpacing: '-2px',
            }}
          >
            <span style={{ fontWeight: 800 }}>Hilo</span>
            <span style={{ fontWeight: 400 }}>Cofrade</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '900px',
          }}
        >
          <div
            style={{
              color: '#B01B32',
              fontSize: '22px',
              fontWeight: 800,
              letterSpacing: '5px',
              textTransform: 'uppercase',
            }}
          >
            Enciclopedia cofrade
          </div>

          <div
            style={{
              marginTop: '22px',
              fontSize: '58px',
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: '-2px',
            }}
          >
            Sevilla y su provincia,
            todo conectado por un mismo hilo
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'rgba(255,255,255,.78)',
            fontSize: '22px',
          }}
        >
          <span>
            Hermandades · Imágenes · Pasos · Bandas · Patrimonio
          </span>

          <span
            style={{
              color: '#FFFFFF',
              fontWeight: 700,
            }}
          >
            hilocofrade.es
          </span>
        </div>
      </div>
    ),
    size
  );
}
