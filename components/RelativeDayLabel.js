'use client'

import { useEffect, useState } from 'react'
import { madridDateKey, relativeDayLabel } from '@/lib/relative-day'

// Texto relativo («Hoy», «Mañana», «En 3 días») que se recalcula en el móvil:
// la página puede estar en caché desde ayer. Sin fecha válida o ya pasada,
// muestra `fallback`.
export default function RelativeDayLabel({ date = '', initial = '', fallback = '', maxDays = Infinity }) {
  const [label, setLabel] = useState(initial || fallback)

  useEffect(() => {
    const update = () => setLabel(relativeDayLabel(date, madridDateKey(), { maxDays }) || fallback)
    update()
    const timer = setInterval(update, 60 * 1000)
    return () => clearInterval(timer)
  }, [date, fallback, maxDays])

  return label
}
