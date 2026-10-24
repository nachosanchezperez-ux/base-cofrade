import { Suspense } from 'react'
import HiloMovementsSection from '@/components/HiloMovementsSection'

// El Hilo se mueve va siempre al final de la ficha, como en Hermandad y Banda
// (24/10/2026). Solo aparece si hay movimientos relacionados con esta ficha.
export default async function StepDetailLayout({ children, params }) {
  const { slug } = await params
  return (
    <>
      {children}
      <Suspense fallback={null}><HiloMovementsSection entityHref={`/pasos/${slug}`} /></Suspense>
    </>
  )
}
