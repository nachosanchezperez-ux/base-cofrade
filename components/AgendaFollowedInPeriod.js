'use client'

import Link from 'next/link'
import useFollowedBrotherhoods from '@/components/useFollowedBrotherhoods'
import styles from './AgendaFollowedInPeriod.module.css'

// «Tus hermandades» en Hoy, Mañana y Fin de semana (#agenda-mi-agenda): las
// citas de las Hermandades que sigues, arriba y sin buscar. Solo en el
// navegador: el seguimiento vive en este móvil. Sin seguidas, no ocupa nada.
export default function AgendaFollowedInPeriod({ items = [], periodLabel = 'este periodo' }) {
  const { followed } = useFollowedBrotherhoods()
  if (!followed.length) return null
  const slugs = new Set(followed.map((item) => item.slug))
  const mine = items.filter((item) => item.slugs.some((slug) => slugs.has(slug)))

  return (
    <section className={styles.followed} aria-labelledby="agenda-tus-hermandades">
      <h2 id="agenda-tus-hermandades"><span aria-hidden="true">★</span> Tus hermandades {periodLabel}</h2>
      {mine.length ? (
        <ul>
          {mine.slice(0, 6).map((item) => (
            <li key={item.key}>
              {item.time ? <time>{item.time}</time> : null}
              {item.eventHref ? <Link href={item.eventHref}>{item.title}</Link> : <span>{item.title}</span>}
            </li>
          ))}
        </ul>
      ) : <p>Ninguna de las que sigues tiene actos {periodLabel}.</p>}
      <Link className={styles.more} href="/agenda-cofrade?mis=1">Todas sus citas y su calendario <span aria-hidden="true">→</span></Link>
    </section>
  )
}
