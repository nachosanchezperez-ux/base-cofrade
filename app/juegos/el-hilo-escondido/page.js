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
          <p>Una palabra del lenguaje de nuestras cofradías se oculta tras una adivinanza. Tira de las pistas, desenreda el término y descubre por dónde continúa la historia.</p>
        </div>
      </header>
      <HiddenThreadGame />
    </div>
  )
}
