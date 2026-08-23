import Link from 'next/link'
import styles from './HomeExploreV2.module.css'
import polishStyles from './HomeResponsivePolish.module.css'

function countLabel(item) {
  if (item.key === 'brotherhood') return `${item.count} ${item.count === 1 ? 'hermandad publicada' : 'hermandades publicadas'}`
  if (item.key === 'image') return `${item.count} ${item.count === 1 ? 'imagen publicada' : 'imágenes publicadas'}`
  if (item.key === 'step') return `${item.count} ${item.count === 1 ? 'paso publicado' : 'pasos publicados'}`
  if (item.key === 'band') return `${item.count} ${item.count === 1 ? 'banda publicada' : 'bandas publicadas'}`
  return String(item.count)
}

const directoryOrder = {
  brotherhood: '01',
  image: '02',
  step: '03',
  band: '04',
}

export default function HomeExploreV2({ stats }) {
  const directories = stats?.directories || []
  const graph = stats?.graph || []

  return (
    <section className={`${styles.section} ${polishStyles.exploreSection}`} id="enciclopedia">
      <div className="shell">
        <header className={`${styles.header} ${polishStyles.exploreHeader}`}>
          <span className={styles.eyebrow}>Enciclopedia</span>
          <h2>Entra por donde quieras</h2>
          <p>Cuatro puertas para empezar a recorrer Hilo Cofrade. Cada directorio abre después sus relaciones con imágenes, pasos, música, autores y patrimonio.</p>
        </header>

        <div className={`${styles.grid} ${polishStyles.exploreGrid}`}>
          {directories.map((item) => (
            <Link className={`${styles.card} ${polishStyles.exploreCard}`} href={item.href} key={item.key}>
              <div className={`${styles.cardTop} ${polishStyles.exploreCardTop}`}>
                <span className={styles.sequence}>{directoryOrder[item.key] || '·'}</span>
                <span className={`${styles.count} ${polishStyles.exploreCount}`}>{countLabel(item)}</span>
              </div>
              <div className={`${styles.cardBody} ${polishStyles.exploreCardBody}`}>
                <h3>{item.label}</h3>
                <p>{item.detail}</p>
                <span className={`${styles.cta} ${polishStyles.exploreCta}`}>
                  <span>Explorar {item.label.toLowerCase()}</span>
                  <b aria-hidden="true">→</b>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <aside className={`${styles.graphStrip} ${polishStyles.graphStrip}`} aria-label="Dimensión del grafo público de Hilo Cofrade">
          <div className={styles.graphIntro}>
            <span className={styles.eyebrow}>El hilo sigue</span>
            <h3>Los directorios son solo la entrada</h3>
            <p>Marchas, autores, patrimonio y acontecimientos se descubren relacionados con las entidades principales, sin convertir la Home en un catálogo de tablas.</p>
          </div>
          <div className={`${styles.metrics} ${polishStyles.graphMetrics}`}>
            {graph.map((item) => (
              <div className={`${styles.metric} ${polishStyles.graphMetric}`} key={item.key}>
                <strong>{item.count}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </aside>

        <aside className={`${styles.collab} ${polishStyles.collab}`} id="colabora">
          <div>
            <span className={styles.eyebrow}>Participa</span>
            <h3>Ayúdanos a completar el hilo</h3>
            <p>Las aportaciones pasan por revisión y documentación antes de incorporarse a Hilo Cofrade.</p>
          </div>
          <div className={styles.collabActions}>
            <div className={`${styles.flow} ${polishStyles.collabFlow}`} aria-label="Proceso de publicación">
              <span>1 · Envías</span>
              <span>2 · Revisamos</span>
              <span>3 · Documentamos</span>
              <span>4 · Publicamos</span>
            </div>
            <Link className={`${styles.collabButton} ${polishStyles.collabButton}`} href="/colabora">Proponer información</Link>
          </div>
        </aside>
      </div>
    </section>
  )
}
