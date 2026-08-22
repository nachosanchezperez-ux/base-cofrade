import Link from 'next/link'
import HiloSearch from '@/components/HiloSearch'
import styles from './page.module.css'

export const metadata = {
  title: 'Pregunta a Hilo Cofrade | Tira del hilo',
  description: 'Conversa con el grafo de Hilo Cofrade y sigue relaciones entre hermandades, imágenes, pasos, bandas, marchas, autores y patrimonio.',
  alternates: {
    canonical: '/pregunta',
  },
}

export default async function PreguntaPage({ searchParams }) {
  const params = await searchParams
  const initialQuestion = String(params?.q || '').trim().slice(0, 320)

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="shell">
          <div className={styles.topline}>
            <Link href="/#tiradelhilo">← Volver a la Home</Link>
            <span>Conversación · datos publicados</span>
          </div>

          <header className={styles.intro}>
            <span className={styles.eyebrow}>Tira del hilo</span>
            <h1>Conversa con la enciclopedia</h1>
            <p>
              Pregunta con lenguaje natural, continúa sobre los resultados anteriores, recorre conexiones documentadas
              o pide que Hilo Cofrade tire de un hilo curioso por ti. Nunca completa con datos que no estén publicados.
            </p>
          </header>

          <div className={styles.workspace}>
            <HiloSearch fullPage initialQuestion={initialQuestion} />
          </div>

          <footer className={styles.footnote}>
            <span aria-hidden="true" />
            La conversación se conserva únicamente en esta sesión del navegador para poder continuar entre la Home y este modo completo.
          </footer>
        </div>
      </section>
    </div>
  )
}
