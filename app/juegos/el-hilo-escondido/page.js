import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import HiddenThreadGame from '@/components/HiddenThreadGame'
import { breadcrumbJsonLd, socialMetadata } from '@/lib/seo'
import { HILO_GAME_PATH } from '@/lib/hilo-hidden-game'
import styles from '@/components/HiddenThreadGame.module.css'

const TITLE = 'El hilo escondido · Juego cofrade del día'
const DESCRIPTION = 'Un juego diario de vocabulario cofrade: sigue las pistas, adivina la palabra y descubre cómo todo está relacionado en Hilo Cofrade.'

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: HILO_GAME_PATH },
  ...socialMetadata({ title: TITLE, description: DESCRIPTION, path: HILO_GAME_PATH }),
}

export default function HiddenThreadPage() {
  return (
    <div className={styles.page}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'El hilo escondido', path: HILO_GAME_PATH },
      ])} />
      <header className={styles.entryHero}>
        <div className="shell">
          <Link className={styles.entryBack} href="/#descubre-hoy">← Volver a Hilo Cofrade</Link>
          <div className={styles.entryIntro}>
            <div>
              <span className={styles.entryEyebrow}>Hilo Cofrade · Zona de juego</span>
              <h1>¿Jugamos?</h1>
              <p>Dos desafíos cofrades. Elige y empieza.</p>
            </div>
            <span className={styles.entryOrnament} aria-hidden="true">✦</span>
          </div>

          <nav className={styles.entryChoices} aria-label="Elige tu juego">
            <a className={styles.entryChoice + ' ' + styles.entryChoiceHilo} href="#partida-del-hilo">
              <div className={styles.entryChoiceCopy}>
                <span className={styles.entryChoiceType}><span className={styles.entryStatusDot} aria-hidden="true" /> El reto del día</span>
                <h2>El hilo escondido</h2>
                <p>Una pista. Una palabra. ¿La sabes?</p>
                <span className={styles.entryChoiceAction}>Jugar aquí <span aria-hidden="true">↓</span></span>
              </div>
              <div className={styles.entryChoiceArt + ' ' + styles.entryChoiceArtHilo} aria-hidden="true">
                <span className={styles.entryHiloQuestion}>¿?</span>
                <span className={styles.entryHiloTrail}><i /> <i /> <i /></span>
              </div>
            </a>

            <a
              className={styles.entryChoice + ' ' + styles.entryChoiceCofradle}
              href="https://cofradle.es/"
              target="_blank"
              rel="noopener noreferrer"
              aria-describedby="cofradle-external-note"
            >
              <div className={styles.entryChoiceCopy}>
                <span className={styles.entryChoiceType}>Más juegos cofrades · Web externa</span>
                <h2>Cofradle</h2>
                <p>Hermandades, marchas y otros retos.</p>
                <span className={styles.entryChoiceAction}>Jugar en Cofradle <span aria-hidden="true">↗</span></span>
              </div>
              <div className={styles.entryChoiceArt + ' ' + styles.entryChoiceArtCofradle} aria-hidden="true">
                <span className={styles.entryMiniCard}><strong>?</strong><small>HERMANDAD</small></span>
                <span className={styles.entryMiniCard + ' ' + styles.entryMiniCardMusic}><strong>♫</strong><small>MARCHA</small></span>
              </div>
            </a>
          </nav>
          <p className={styles.entryExternalNote} id="cofradle-external-note">Cofradle es un proyecto independiente de Hilo Cofrade y se abre en su propia web.</p>
        </div>
      </header>
      <HiddenThreadGame />
    </div>
  )
}
