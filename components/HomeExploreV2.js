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

function isSvg(path = '') {
  return String(path).toLowerCase().endsWith('.svg')
}

function DirectoryVisual({ item }) {
  const spotlight = item.spotlight
  const visual = spotlight?.visual
  if (!visual?.path) return null
  const photo = visual.kind === 'photo'
  const secondary = visual.kind === 'context-crest' && visual.contextName
    ? visual.contextName
    : photo && visual.credit
      ? visual.credit
      : ''

  return (
    <div className={`${styles.visual} ${photo ? styles.visualPhoto : styles.visualIdentity}`}>
      <Image
        src={visual.path}
        alt={visual.alt || ''}
        fill
        sizes="(max-width: 859px) calc(100vw - 36px), 360px"
        className={photo ? styles.visualPhotoImage : styles.visualIdentityImage}
        style={photo && visual.focusPosition ? { objectPosition: visual.focusPosition } : undefined}
        unoptimized={isSvg(visual.path)}
      />
      <div className={styles.visualTopline}>
        <span className={styles.mark} aria-hidden="true">{marks[item.key] || '·'}</span>
        <span className={styles.count}>{countLabel(item)}</span>
      </div>
      <div className={styles.visualCaption}>
        <span>Ahora en el hilo</span>
        <strong>{spotlight.name}</strong>
        {secondary ? <small>{secondary}</small> : null}
      </div>
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
            <Link className={`${styles.card} ${item.spotlight?.visual?.path ? styles.cardVisual : ''}`} href={item.href} key={item.key}>
              <DirectoryVisual item={item} />
              {!item.spotlight?.visual?.path ? (
                <div className={styles.cardTop}>
                  <span className={styles.mark} aria-hidden="true">{marks[item.key] || '·'}</span>
                  <span className={styles.count}>{countLabel(item)}</span>
                </div>
              ) : null}
              <div className={styles.cardBody}>
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
