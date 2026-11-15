import Link from 'next/link'
import { getMunicipalityEditorial } from '@/lib/municipality-editorial'
import styles from './MunicipalityAgendaHub.module.css'

// Pieza editorial estática; la agenda y sus recuentos siguen siendo dinámicos.
// Otras localidades no renderizan este bloque durante el piloto.
export default function MunicipalityEditorialSpotlight({ slug, label }) {
  const editorial = getMunicipalityEditorial(slug)
  if (!editorial) return null

  return (
    <section className={styles.editorial} aria-labelledby="municipality-editorial-title">
      <div className="shell">
        <header className={styles.editorialHeading}>
          <span>Conocer su tradición</span>
          <h2 id="municipality-editorial-title">{editorial.title}</h2>
        </header>

        <div className={styles.editorialColumns}>
          <div className={styles.editorialText}>
            {editorial.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {editorial.highlight ? (
              <aside className={styles.editorialHighlight} aria-label={editorial.highlight.title}>
                <h3>{editorial.highlight.title}</h3>
                <p>{editorial.highlight.text}</p>
                <Link href={editorial.highlight.href}>{editorial.highlight.label} →</Link>
              </aside>
            ) : null}
          </div>

          <nav className={styles.editorialLinks} aria-label={`Explorar las devociones de ${label}`}>
            <h3>Seguir el hilo</h3>
            {editorial.related.map((item) => (
              <Link key={item.href} href={item.href}>{item.label}<span aria-hidden="true">→</span></Link>
            ))}
          </nav>
        </div>

        <div className={styles.editorialSources}>
          <span>Fuentes documentales</span>
          {editorial.sources.map((source) => (
            <a key={source.href} href={source.href} target="_blank" rel="noopener noreferrer">
              {source.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
