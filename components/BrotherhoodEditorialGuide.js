import styles from './BrotherhoodEditorialGuide.module.css'

function normalizedAnchor(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function guideChapters(value = '') {
  const blocks = String(value)
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)

  const chapters = []
  let current = null

  for (const block of blocks) {
    const heading = block.match(/^###\s+(.+)$/)

    if (heading) {
      const title = heading[1].trim()
      current = {
        id: normalizedAnchor(title) || `clave-${chapters.length + 1}`,
        title,
        paragraphs: [],
      }
      chapters.push(current)
      continue
    }

    const paragraph = block.replace(/\s*\n\s*/g, ' ')
    if (!current) {
      current = {
        id: `clave-${chapters.length + 1}`,
        title: '',
        paragraphs: [],
      }
      chapters.push(current)
    }
    current.paragraphs.push(paragraph)
  }

  return chapters.filter((chapter) => chapter.title || chapter.paragraphs.length)
}

export default function BrotherhoodEditorialGuide({ guide }) {
  if (!guide?.title || !(guide.summary || guide.body)) return null

  const chapters = guideChapters(guide.body)

  return (
    <section className={styles.section} id="conoce-hermandad" data-hilo-section="brotherhood-editorial-guide">
      <div className={`shell ${styles.shell}`}>
        <header className={styles.header}>
          <div className={styles.headerCopy}>
            <span className={styles.eyebrow}>Conoce la Hermandad</span>
            <h2>{guide.title}</h2>
            {guide.subtitle ? <p className={styles.subtitle}>{guide.subtitle}</p> : null}
          </div>

          <div className={styles.headerMarker} aria-hidden="true">
            <span>{String(chapters.length).padStart(2, '0')}</span>
            <small>claves</small>
          </div>
        </header>

        {guide.summary ? <p className={styles.lead}>{guide.summary}</p> : null}

        {chapters.length > 0 ? (
          <details className={styles.disclosure}>
            <summary>
              <span>Leer las {chapters.length} claves</span>
              <small>Una lectura breve para entender la Hermandad</small>
              <b aria-hidden="true">＋</b>
            </summary>

            <div className={styles.disclosureBody}>
              {chapters.length > 1 ? (
                <nav className={styles.index} aria-label={`Índice de ${guide.title}`}>
                  <span className={styles.indexLabel}>En esta lectura</span>
                  <ol>
                    {chapters.map((chapter, index) => (
                      chapter.title ? (
                        <li key={chapter.id}>
                          <a href={`#${chapter.id}`}>
                            <b>{String(index + 1).padStart(2, '0')}</b>
                            <span>{chapter.title}</span>
                          </a>
                        </li>
                      ) : null
                    ))}
                  </ol>
                </nav>
              ) : null}

              <ol className={styles.chapters}>
                {chapters.map((chapter, index) => (
                  <li className={styles.chapter} id={chapter.id} key={chapter.id}>
                    <div className={styles.chapterNumber} aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className={styles.chapterCopy}>
                      {chapter.title ? <h3>{chapter.title}</h3> : null}
                      {chapter.paragraphs.map((paragraph, paragraphIndex) => (
                        <p key={`${chapter.id}-${paragraphIndex}`}>{paragraph}</p>
                      ))}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </details>
        ) : null}

        {guide.authorName ? (
          <footer className={styles.byline}>Contenido documentado por {guide.authorName}</footer>
        ) : null}
      </div>
    </section>
  )
}
