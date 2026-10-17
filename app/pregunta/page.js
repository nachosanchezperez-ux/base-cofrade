import Link from 'next/link'
import HiloSearch from '@/components/HiloSearch'
import styles from './page.module.css'

export const metadata = {
  title: 'Pregunta a Hilo Cofrade | Tira del hilo',
  description: 'Pregunta a Hilo Cofrade y descubre cómo se relacionan hermandades, imágenes, pasos, bandas, marchas, autores y patrimonio.',
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
            <Link href="/#tiradelhilo">← Volver a la portada</Link>
            <span>Respuestas con datos de Hilo Cofrade</span>
          </div>

          <header className={styles.intro}>
            <span className={styles.eyebrow}>Tira del hilo</span>
            <h1>Conversa con la enciclopedia</h1>
            <p>
              Pregunta como lo harías a otro cofrade, sigue preguntando sobre la respuesta y descubre cómo se
              relacionan hermandades, imágenes, bandas y marchas. Solo responde con lo que está publicado en Hilo Cofrade.
            </p>
          </header>

          <div className={styles.workspace}>
            <HiloSearch fullPage initialQuestion={initialQuestion} />
          </div>

          <footer className={styles.footnote}>
            <span aria-hidden="true" />
            La conversación se guarda solo en este navegador y se borra al cerrarlo.
          </footer>
        </div>
      </section>
    </div>
  )
}
