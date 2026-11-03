import Link from 'next/link'
import { plural } from '@/lib/plural'
import styles from './crucetas.module.css'

// «Lo que más suena» y «Marchas nuevas» de la temporada, calculados con las
// crucetas publicadas. Sin datos suficientes, el bloque no se muestra.
export default function RepertoireInsights({ year, totalRepertoires = 0, mostPlayed = [], newMarches = [] }) {
  if (!mostPlayed.length && !newMarches.length) return null

  return (
    <section className={styles.insights} aria-label={`La música de la temporada${year ? ` ${year}` : ''}`}>
      <div className={`shell ${styles.insightsGrid}`}>
        {mostPlayed.length ? (
          <div className={styles.insightBlock}>
            <h2>Lo que más suena{year ? ` en ${year}` : ''}</h2>
            <ol className={styles.topList}>
              {mostPlayed.map((item, index) => (
                <li key={item.id} style={{ '--share': `${Math.round((item.repertoires / Math.max(totalRepertoires, 1)) * 100)}%` }}>
                  <span className={styles.topRank} aria-hidden="true">{index + 1}</span>
                  <div>
                    <strong>{item.href ? <Link href={item.href}>{item.title}</Link> : item.title}</strong>
                    <small>En {item.repertoires} de {totalRepertoires} crucetas · {plural(item.bands, 'banda', 'bandas')}</small>
                    <i className={styles.topBar} aria-hidden="true" />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ) : null}

        {newMarches.length ? (
          <details className={styles.insightBlock}>
            <summary>
              <h2>Marchas nuevas de {year}</h2>
              <span>{plural(newMarches.length, 'obra compuesta este año', 'obras compuestas este año')} que ya han sonado en la calle</span>
            </summary>
            <ul className={styles.newList}>
              {newMarches.map((item) => (
                <li key={item.id}>
                  <strong>{item.href ? <Link href={item.href}>{item.title}</Link> : item.title}</strong>
                  {item.premiere ? <em className={styles.premiereTag}>Estreno</em> : null}
                  <small>
                    {item.sounded.map((sounded, index) => (
                      <span key={sounded.href}>{index ? ' · ' : ''}<Link href={sounded.href}>{sounded.label}</Link></span>
                    ))}
                  </small>
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </div>
    </section>
  )
}
