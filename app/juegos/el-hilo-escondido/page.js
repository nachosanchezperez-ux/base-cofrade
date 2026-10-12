import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import HiddenThreadGame from '@/components/HiddenThreadGame'
import { breadcrumbJsonLd, socialMetadata } from '@/lib/seo'
import { HILO_GAME_PATH, madridHiddenDayKey } from '@/lib/hilo-hidden-game'
import styles from '@/components/HiddenThreadGame.module.css'

const TITLE = 'El hilo escondido · Juego cofrade del día'
const DESCRIPTION = 'Un juego diario de vocabulario cofrade: lee la adivinanza, toca la respuesta y comparte tu resultado en Hilo Cofrade.'

// La adivinanza se sirve ya en el HTML. Se regenera cada 5 minutos y el navegador corrige
// el día con la hora de Madrid, así que no hace falta renderizar en cada visita.
export const revalidate = 300

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: HILO_GAME_PATH },
  ...socialMetadata({ title: TITLE, description: DESCRIPTION, path: HILO_GAME_PATH }),
}

export default function HiddenThreadPage() {
  const initialDayKey = madridHiddenDayKey()

  return (
    <div className={styles.page}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'El hilo escondido', path: HILO_GAME_PATH },
      ])} />

      <header className={styles.intro}>
        <div className="shell">
          <Link className={styles.introBack} href="/#descubre-hoy">← Hilo Cofrade</Link>
          <h1>El hilo escondido</h1>
        </div>
      </header>

      <HiddenThreadGame initialDayKey={initialDayKey} />

      <aside className={styles.recommendation} aria-label="Otro juego cofrade">
        <div className="shell">
          <a
            className={styles.recommendationCard}
            href="https://cofradle.es/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* Favicon oficial de cofradle.es, sin alterar, usado con permiso (13/10/2026). */}
            <img
              className={styles.recommendationLogo}
              src="/externos/cofradle-favicon.svg"
              alt=""
              width="40"
              height="40"
              loading="lazy"
              decoding="async"
            />
            <span className={styles.recommendationText}>
              <small>¿Quieres más retos?</small>
              <strong>Juega también en <span className={styles.recommendationBrand}>Cofradle</span></strong>
            </span>
            <span className={styles.recommendationLink} aria-hidden="true">↗</span>
          </a>
          <p className={styles.recommendationNote}>Cofradle es un proyecto externo e independiente de Hilo Cofrade.</p>
        </div>
      </aside>
    </div>
  )
}
