import { notFound } from 'next/navigation'
import BrotherhoodProcessionFull from '@/components/BrotherhoodProcessionFull'
import { PROCESSION_ORDER_DEMO } from '@/lib/procession-order-demo'

// Laboratorio de la Tarea 15: estructura del «cortejo completo» con una
// demostración claramente identificada. No existe en producción y no se indexa.
export const dynamic = 'force-static'

export const metadata = {
  title: 'Laboratorio · Cortejo completo',
  robots: { index: false, follow: false },
}

export default function ProcessionFullLaboratoryPage() {
  if (process.env.VERCEL_ENV === 'production') notFound()
  return <div className="brotherhood-page" style={{
    '--brotherhood-primary': '#153B69',
    '--brotherhood-secondary': '#A71930',
    '--brotherhood-light': '#FFFFFF',
    padding: '24px 0 48px',
    background: '#fff',
  }}>
    <div className="shell">
      <p style={{ margin: 0, color: '#A71930', fontSize: 12, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase' }}>Laboratorio · Tarea 15</p>
      <h1 style={{ margin: '6px 0 8px', fontSize: 28, lineHeight: 1.15 }}>Cortejo completo</h1>
      <p style={{ margin: '0 0 16px', maxWidth: '62ch', color: '#3d454e', fontSize: 16, lineHeight: 1.55 }}>
        Así se leería el orden completo de una cofradía dentro del capítulo «Cortejo», bajo el resumen de siempre.
        Los elementos son de ejemplo: ninguna Hermandad tiene todavía su orden oficial documentado en Hilo Cofrade.
      </p>
    </div>
    <BrotherhoodProcessionFull order={PROCESSION_ORDER_DEMO} defaultOpen />
  </div>
}
