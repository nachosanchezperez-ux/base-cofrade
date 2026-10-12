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
      <header className={styles.hero}>
        <div className="shell">
          <Link className={styles.heroBack} href="/#descubre-hoy">← Volver a Descubre hoy</Link>
          <span className={styles.heroEyebrow}>Hilo Cofrade · Un juego para seguir descubriendo</span>
          <h1>El hilo escondido</h1>
          <p>Una pista, una palabra. ¿La descubres? Juega aquí o continúa el desafío en Cofradle.</p>
          <nav className={styles.heroPlayActions} aria-label="Elige dónde jugar">
            <a className={styles.heroPrimaryPlay} href="#partida-del-hilo">
              Jugar al reto de hoy <span aria-hidden="true">↓</span>
            </a>
            <a className={styles.heroCofradlePlay} href="https://cofradle.es/" target="_blank" rel="noopener noreferrer">
              Jugar a Cofradle <span aria-hidden="true">↗</span>
            </a>
          </nav>
          <span className={styles.heroExternalNote}>Cofradle abre en otra web independiente.</span>
        </div>
      </header>
      <HiddenThreadGame />
    </div>
  )
}
