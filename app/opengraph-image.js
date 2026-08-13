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
          padding: '78px 86px',
          color: '#FFFFFF',
          background: 'linear-gradient(135deg, #0D2949 0%, #153B69 62%, #174F67 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '999px',
              background: '#C33B4B',
              boxShadow: '26px 0 0 #FFFFFF, 52px 0 0 #66B8D4',
            }}
          />
          <span style={{ marginLeft: '54px', fontSize: '25px', letterSpacing: '5px', textTransform: 'uppercase' }}>
            Sevilla y su provincia
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '92px', fontWeight: 800, letterSpacing: '-4px', lineHeight: 1 }}>
            Hilo Cofrade
          </div>
          <div style={{ width: '760px', marginTop: '30px', fontSize: '38px', lineHeight: 1.25, color: '#E8F2F5' }}>
            Todo en las cofradías está relacionado
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '24px', color: '#D6E6EC' }}>
          <span>Hermandades · Imágenes · Pasos · Bandas · Patrimonio</span>
          <span style={{ fontWeight: 700 }}>hilocofrade.es</span>
        </div>
      </div>
    ),
    size
  );
}
