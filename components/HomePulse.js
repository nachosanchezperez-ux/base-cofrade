import Link from 'next/link'
import PulseClock from '@/components/PulseClock'
import styles from './HomePulse.module.css'

// «Semana Santa 2027 en datos»: cifras vivas bajo el buscador. Cada cifra lleva
// a la sección que la explica. Sin cifras, no se pinta nada.
export default function HomePulse({ items = [] }) {
  if (!items.length) return null

  return (
    <section className={styles.pulse} aria-labelledby="pulso-title">
      <h2 id="pulso-title" className={styles.title}>Semana Santa 2027 en datos</h2>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.key}>
            <Link className={`${styles.item} ${item.target ? styles.clockItem : ''}`} href={item.href} data-key={item.key}>
              {item.target ? (
                <PulseClock target={item.target} figure={item.figure} label={item.label} />
              ) : (
                <>
                  <b className={styles.figure}>{item.figure}</b>
                  <span className={styles.label}>{item.label}</span>
                </>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
