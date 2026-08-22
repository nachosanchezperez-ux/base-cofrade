import Image from 'next/image'
import Link from 'next/link'
import styles from './HomeExploreV2.module.css'

function countLabel(item) {
  if (item.key === 'brotherhood') return `${item.count} ${item.count === 1 ? 'hermandad publicada' : 'hermandades publicadas'}`
  if (item.key === 'image') return `${item.count} ${item.count === 1 ? 'imagen publicada' : 'imágenes publicadas'}`
  if (item.key === 'step') return `${item.count} ${item.count === 1 ? 'paso publicado' : 'pasos publicados'}`
  if (item.key === 'band') return `${item.count} ${item.count === 1 ? 'banda publicada' : 'bandas publicadas'}`
  return String(item.count)
}

const marks = {
  brotherhood: 'H',
  image: 'I',
  step: 'P',
  band: 'B',
}

function DirectoryVisual({ item }) {
  const media = item.sample?.media
  const isSymbol = media?.kind === 'crest' || media?.kind === 'logo'

  return (
    <div className={styles.visual} data-kind={media?.kind || 'fallback'}>
      {media?.path ? (
        <Image
          src={media.path}
          alt={media.alt || item.sample?.name || ''}
          fill
          sizes="(max-width: 859px) calc(100vw - 32px), 28vw"
          style={{
            objectFit: isSymbol ? 'contain' : 'cover',
            objectPosition: media.focusPosition || '50% 50%',
          }}
        />
      ) : (
        <div className={styles.visualFallback} aria-hidden="true">
          <span>{marks[item.key] || '·'}</span>
          <i></i>
          <b></b>
        </div>
      )}
      {item.sample?.name ? (
        <span className={styles.visualLabel}>
          <small>Una ficha del directorio</small>
          <strong>{item.sample.name}</strong>
        </span>
      ) : null}
    </div>
  )
}

export default function HomeExploreV2({ stats }) {
  const directories = stats?.directories || []
  const graph = stats?.graph || []

  return (
    <section className={styles.section} id="enciclopedia">
      <div className="shell">
        <header className={styles.header}>
          <span className={styles.eyebrow}>Enciclopedia</span>
          <h2>Entra por donde quieras</h2>
          <p>Cuatro grandes puertas para empezar. El resto del conocimiento aparece al tirar del hilo dentro de cada ficha.</p>
        </header>

        <div className={styles.grid}>
          {directories.map((item) => (
            <Link className={styles.card} href={item.href} key={item.key}>
              <DirectoryVisual item={item} />
              <div className={styles.cardBody}>
                <div className={styles.cardTop}>
                  <span className={styles.mark} aria-hidden="true">{marks[item.key] || '·'}</span>
                  <span className={styles.count}>{countLabel(item)}</span>
                </div>
                <h3>{item.label}</h3>
                <p>{item.detail}</p>
                <span className={styles.cta}>Explorar {item.label.toLowerCase()} →</span>
              </div>
            </Link>
          ))}
        </div>

        <aside className={styles.graphStrip} aria-label="Dimensión del grafo público de Hilo Cofrade">
          <div className={styles.graphIntro}>
            <span className={styles.eyebrow}>El hilo sigue</span>
            <h3>Los directorios son solo la entrada</h3>
            <p>Marchas, autores, patrimonio y acontecimientos se descubren relacionados con las entidades principales, sin convertir la Home en un catálogo de tablas.</p>
            <div className={styles.graphRoute} aria-hidden="true">
              <span>Hermandad</span><i>→</i><span>Paso</span><i>→</i><span>Autor</span><i>→</i><span>Obra</span>
            </div>
          </div>
          <div className={styles.metrics}>
            {graph.map((item) => (
              <div className={styles.metric} key={item.key}>
                <strong>{item.count}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </aside>

        <aside className={styles.collab} id="colabora">
          <div>
            <span className={styles.eyebrow}>Participa</span>
            <h3>Ayúdanos a completar el hilo</h3>
            <p>Las aportaciones pasan por revisión y documentación antes de incorporarse a Hilo Cofrade.</p>
          </div>
          <div className={styles.collabActions}>
            <div className={styles.flow} aria-label="Proceso de publicación">
              <span>1 · Envías</span>
              <span>2 · Revisamos</span>
              <span>3 · Documentamos</span>
              <span>4 · Publicamos</span>
            </div>
            <Link className={styles.collabButton} href="/colabora">Proponer información</Link>
          </div>
        </aside>
      </div>
    </section>
  )
}
