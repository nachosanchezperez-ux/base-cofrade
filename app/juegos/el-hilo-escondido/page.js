import Link from 'next/link'
import SiteBreadcrumb from '@/components/SiteBreadcrumb'
import { getMadridDayKey, puzzleForDay } from '@/lib/hilo-escondido'
import HiloEscondidoClient from './HiloEscondidoClient'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'El hilo escondido · El juego cofrade del día',
  description: 'Adivina una palabra cofrade a partir de pistas, descubre su significado y tira del hilo por nuestra enciclopedia. Un reto nuevo cada día.',
  alternates: { canonical: '/juegos/el-hilo-escondido' },
  openGraph: {
    title: 'El hilo escondido · Hilo Cofrade',
    description: 'Una palabra, varios cabos y mucho lenguaje cofrade. ¿La adivinas?',
    url: '/juegos/el-hilo-escondido',
  },
}

export default function ElHiloEscondidoPage() {
  const dayKey = getMadridDayKey()
  const dailyPuzzle = puzzleForDay(dayKey)

  return (
    <div className={styles.page}>
      <div className="shell">
        <SiteBreadcrumb items={[{ label: 'El hilo escondido' }]} />
        <header className={styles.hero}>
          <div className={styles.heroText}>
            <span className={styles.eyebrow}>Juega · Aprende · Sigue el hilo</span>
            <h1>El hilo <em>escondido</em></h1>
            <p>Hay una palabra detrás de cada historia cofrade. Sigue las pistas, desenreda el misterio y descubre adónde lleva.</p>
            <div className={styles.heroSteps} aria-label="Cómo jugar">
              <span>01 · Lee la adivinanza</span>
              <span>02 · Tira de un cabo</span>
              <span>03 · Da con la palabra</span>
            </div>
          </div>
          <div className={styles.heroMark} aria-hidden="true">
            <div className={styles.threadRing}>¿</div>
            <span>Una palabra<br />cada día</span>
          </div>
        </header>

        <HiloEscondidoClient dayKey={dayKey} dailyPuzzle={dailyPuzzle} />

        <section className={styles.below} aria-label="Sigue jugando y aprendiendo">
          <article className={styles.glossary}>
            <span className={styles.belowEyebrow}>Sigue tirando del hilo</span>
            <h2>De capirote a trabajadera</h2>
            <p>Las palabras también cuentan historias. Cada solución te descubre un término y te acerca a los pasos, las imágenes y el patrimonio de nuestras hermandades.</p>
            <Link href="/pasos">Explorar la enciclopedia <span aria-hidden="true">→</span></Link>
          </article>
          <article className={styles.otherGame}>
            <span className={styles.belowEyebrow}>¿Quieres jugar a otro nivel?</span>
            <h2>Más retos cofrades</h2>
            <p>Si todavía te quedan ganas de jugar, descubre Cofradle, un proyecto independiente con otras pruebas sobre el mundo cofrade.</p>
            <a href="https://cofradle.es/" target="_blank" rel="noopener noreferrer">Ir a Cofradle <span aria-hidden="true">↗</span></a>
          </article>
        </section>
      </div>
    </div>
  )
}
