import { Suspense } from 'react'
import HiloMovementsSection from '@/components/HiloMovementsSection'

// El Hilo se mueve va siempre al final de la ficha, como en Hermandad, Banda,
// Imagen y Paso (24/10/2026). Solo aparece si hay movimientos de esta marcha.
export default async function MarchDetailLayout({ children, params }) {
  const { slug } = await params
  return (
    <>
      {children}
      <Suspense fallback={null}><HiloMovementsSection entityHref={`/marchas/${slug}`} /></Suspense>
    </>
  )
}
