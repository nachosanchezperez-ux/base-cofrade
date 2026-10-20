import { notFound } from 'next/navigation'
import BrotherhoodProcessionFull from '@/components/BrotherhoodProcessionFull'
import BrotherhoodChapterHeritage from '@/components/BrotherhoodChapterHeritage'
import { heritagePiecesFromListing, orderFromListing } from '@/lib/procession-order'
import listing from '@/docs/insignias-baratillo-borrador-2026-10-20.json'

// Laboratorio de la Tarea 15 con datos reales: las insignias del Baratillo tal
// como las publica su web oficial (borrador, no cargado en Supabase). No existe
// en producción y no se indexa; la ficha pública no cambia.
export const dynamic = 'force-static'

export const metadata = {
  title: 'Laboratorio · Insignias del Baratillo',
  robots: { index: false, follow: false },
}

export default function BaratilloInsigniasLaboratoryPage() {
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
      <h1 style={{ margin: '6px 0 8px', fontSize: 28, lineHeight: 1.15 }}>Insignias del Baratillo</h1>
      <p style={{ margin: '0 0 16px', maxWidth: '62ch', color: '#3d454e', fontSize: 16, lineHeight: 1.55 }}>
        Así quedaría «Ver insignias del cortejo» en el capítulo Cortejo de El Baratillo, con el orden que publica la Hermandad. Cada pieza tiene un solo registro en Patrimonio, más abajo, y el cortejo enlaza a él.
      </p>
    </div>
    <BrotherhoodProcessionFull order={orderFromListing(listing)} defaultOpen />
    {/* Simulación del capítulo Patrimonio con las mismas piezas (borrador, sin cargar). */}
    <BrotherhoodChapterHeritage pieces={heritagePiecesFromListing(listing)} />
  </div>
}
