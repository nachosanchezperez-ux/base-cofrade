import Link from 'next/link'
import styles from './BrotherhoodEditorialGuide.module.css'

const ENTITY_PATHS = {
  brotherhood: 'hermandades',
  image: 'imagenes',
  step: 'pasos',
  band: 'bandas',
  march: 'marchas',
  agent: 'autores',
}

const ENTITY_LABELS = {
  brotherhood: 'Hermandad',
  image: 'Titular',
  step: 'Paso',
  band: 'Banda',
  march: 'Marcha',
  agent: 'Autor',
}

function guideBlocks(value = '') {
  return String(value)
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => {
      const heading = block.match(/^###\s+(.+)$/)
      return heading
        ? { id: `heading-${index}`, kind: 'heading', text: heading[1].trim() }
        : { id: `paragraph-${index}`, kind: 'paragraph', text: block.replace(/\s*\n\s*/g, ' ') }
    })
}

function relatedHref(entity) {
  const segment = ENTITY_PATHS[entity?.entityType]
  return segment && entity?.slug ? `/${segment}/${entity.slug}` : ''
}

export default function BrotherhoodEditorialGuide({ guide }) {
  if (!guide?.title || !(guide.summary || guide.body)) return null

  const blocks = guideBlocks(guide.body)
  const relatedEntities = (guide.relatedEntities || [])
    .map((entity) => ({ ...entity, href: relatedHref(entity) }))
    .filter((entity) => entity.href)

  return (
    <section className={styles.section} id="conoce-hermandad" data-hilo-section="brotherhood-editorial-guide">
      <div className={`shell ${styles.shell}`}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>Conoce la Hermandad</span>
          <h2>{guide.title}</h2>
          {guide.subtitle ? <p className={styles.subtitle}>{guide.subtitle}</p> : null}
        </header>

        {guide.summary ? <p className={styles.lead}>{guide.summary}</p> : null}

        {blocks.length > 0 ? (
          <article className={styles.article}>
            {blocks.map((block) => (
              block.kind === 'heading'
                ? <h3 key={block.id}>{block.text}</h3>
                : <p key={block.id}>{block.text}</p>
            ))}
          </article>
        ) : null}

        {relatedEntities.length > 0 ? (
          <nav className={styles.related} aria-label={`Entidades relacionadas con ${guide.title}`}>
            <small>Sigue el hilo</small>
            <div>
              {relatedEntities.map((entity) => (
                <Link href={entity.href} key={`${guide.id}-${entity.id}`}>
                  <span>{ENTITY_LABELS[entity.entityType] || 'Relacionado'}</span>
                  <strong>{entity.name}</strong>
                  <b aria-hidden="true">→</b>
                </Link>
              ))}
            </div>
          </nav>
        ) : null}

        {guide.authorName ? (
          <footer className={styles.byline}>Contenido documentado por {guide.authorName}</footer>
        ) : null}
      </div>
    </section>
  )
}
