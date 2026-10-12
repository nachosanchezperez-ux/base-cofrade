import Link from 'next/link'
import { connection } from 'next/server'
import JsonLd from '@/components/JsonLd'
import HiddenThreadGame from '@/components/HiddenThreadGame'
import { breadcrumbJsonLd, socialMetadata } from '@/lib/seo'
import { HILO_GAME_PATH, madridHiddenDayKey } from '@/lib/hilo-hidden-game'
import styles from '@/components/HiddenThreadGame.module.css'

const TITLE = 'El hilo escondido · Juego cofrade del día'
const DESCRIPTION = 'Un juego diario de vocabulario cofrade: sigue las pistas, adivina la palabra y descubre cómo todo está relacionado en Hilo Cofrade.'

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: HILO_GAME_PATH },
  ...socialMetadata({ title: TITLE, description: DESCRIPTION, path: HILO_GAME_PATH }),
}

export default async function HiddenThreadPage() {
  await connection()
  const initialDayKey = madridHiddenDayKey()

  return (
    <div className={styles.page}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'El hilo escondido', path: HILO_GAME_PATH },
      ])} />

      <header className={styles.gameIntro}>
        <div className="shell">
          <Link className={styles.gameIntroBack} href="/#descubre-hoy">← Volver a Hilo Cofrade</Link>
          <div className={styles.gameIntroLine}>
            <div>
              <span className={styles.gameIntroEyebrow}>Hilo Cofrade · Nuestro juego diario</span>
              <h1>El hilo escondido</h1>
              <p>¿Qué palabra cofrade se esconde hoy? Lee la pista y empieza a jugar.</p>
            </div>
            <span className={styles.gameIntroSymbol} aria-hidden="true">✦</span>
          </div>
        </div>
      </header>

      <HiddenThreadGame initialDayKey={initialDayKey} />

      <aside className={styles.recommendationSection} aria-label="Otro juego cofrade recomendado">
        <div className="shell">
          <a
            className={styles.recommendationCard}
            href="https://cofradle.es/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Conoce Cofradle, otros juegos cofrades en una web externa e independiente"
          >
            <span className={styles.recommendationArtwork} aria-hidden="true">
              <img
                src="https://www.google.com/s2/favicons?domain=cofradle.es&sz=128"
                alt=""
                width="64"
                height="64"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </span>
            <span className={styles.recommendationCopy}>
              <small>¿Te has quedado con ganas de más?</small>
              <strong>También puedes jugar en <span className={styles.recommendationBrand}>Cofradle</span></strong>
              <span>Más retos de hermandades y marchas en una web independiente.</span>
            </span>
            <span className={styles.recommendationLink}>Visitar Cofradle <span aria-hidden="true">↗</span></span>
          </a>
          <p className={styles.recommendationDisclaimer}>Cofradle es un proyecto externo e independiente de Hilo Cofrade.</p>
        </div>
      </aside>
    </div>
  )
}
