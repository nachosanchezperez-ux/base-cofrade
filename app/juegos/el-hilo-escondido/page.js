import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import HiddenThreadGame from '@/components/HiddenThreadGame'
import { breadcrumbJsonLd, socialMetadata } from '@/lib/seo'
import { HILO_GAME_PATH, madridHiddenDayKey } from '@/lib/hilo-hidden-game'
import { getHiddenThreads } from '@/lib/supabase/hilo-hidden-threads'
import styles from '@/components/HiddenThreadGame.module.css'

const TITLE = 'El hilo escondido · Juego cofrade del día'
const DESCRIPTION = 'Un juego diario de vocabulario cofrade: lee la adivinanza, toca la respuesta y comparte tu resultado en Hilo Cofrade.'

// La adivinanza se calcula en cada visita con la hora de Madrid. Con ISR (revalidate) la
// primera visita tras horas sin tráfico recibía el HTML de otro día, porque Vercel sirve la
// copia antigua mientras regenera. Las palabras son locales; las fichas relacionadas se cachean por día.
export const dynamic = 'force-dynamic'

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: HILO_GAME_PATH },
  ...socialMetadata({ title: TITLE, description: DESCRIPTION, path: HILO_GAME_PATH }),
}

export default async function HiddenThreadPage() {
  const initialDayKey = madridHiddenDayKey()
  // Fichas reales del día para «Sigue el hilo» (en caché por día; nunca bloquean el juego).
  const threads = await getHiddenThreads(initialDayKey)

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

      <HiddenThreadGame initialDayKey={initialDayKey} threads={threads} />

      <aside className={styles.recommendation} aria-label="Otro juego cofrade">
        <div className="shell">
          <p className={styles.recommendationNote}>Otro juego cofrade: <a href="https://cofradle.es/" target="_blank" rel="noopener noreferrer">Cofradle ↗</a>. Proyecto externo e independiente.</p>
        </div>
      </aside>
    </div>
  )
}
