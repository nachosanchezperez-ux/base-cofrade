import Link from 'next/link'
import styles from './HomeExploreV2.module.css'
import polishStyles from './HomeResponsivePolish.module.css'

function hasCount(item) {
  return Number.isFinite(item?.count)
}

function displayCount(item) {
  return hasCount(item) ? item.count : '—'
}

function countLabel(item) {
  if (!hasCount(item)) return 'dato no disponible'
  if (item.key === 'step') return item.count === 1 ? 'publicado' : 'publicados'
  return item.count === 1 ? 'publicada' : 'publicadas'
}

function countAriaLabel(item) {
  if (!hasCount(item)) return `${item.label}: dato temporalmente no disponible`
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
          <span className={styles.eyebrow}>El núcleo documental</span>
          <h2>Explora la enciclopedia</h2>
          <p>Hermandades, imágenes, pasos y bandas son las cuatro puertas principales. Desde cada ficha puedes seguir el hilo hacia su historia, su patrimonio y su música.</p>
        </header>

        <div className={`${styles.grid} ${polishStyles.exploreGrid}`}>
          {directories.map((item) => (
            <Link className={`${styles.card} ${polishStyles.exploreCard}`} href={item.href} key={item.key}>
              <div className={`${styles.cardTop} ${polishStyles.exploreCardTop}`}>
                <span className={styles.sequence}>{directoryOrder[item.key] || '·'}</span>
                <span
                  className={`${styles.count} ${polishStyles.exploreCount}`}
                  aria-label={countAriaLabel(item)}
                >
                  <strong>{displayCount(item)}</strong>
                  <span data-home-count-label>{countLabel(item)}</span>
                </span>
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
            <h3>Cada ficha abre nuevas relaciones</h3>
            <p>Marchas, autores, patrimonio y acontecimientos completan el relato y conectan entre sí las entidades principales.</p>
          </div>
          <div className={`${styles.metrics} ${polishStyles.graphMetrics}`}>
            {graph.map((item) => (
              <div
                className={`${styles.metric} ${polishStyles.graphMetric}`}
                key={item.key}
                aria-label={hasCount(item) ? `${item.count} ${item.label}` : `${item.label}: dato temporalmente no disponible`}
              >
                <strong>{displayCount(item)}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}
