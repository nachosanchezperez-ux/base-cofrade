import { listeningPicks, musicByDecade, topComposers } from '@/lib/brotherhood-magazine'
import styles from './MusicSoundtrack.module.css'

// «Su música» (Tarea 09): el patrimonio musical que la ficha ya carga, leído de
// forma visual: cuándo se compuso, quién más le ha escrito y por dónde empezar a
// escuchar. El archivo completo y las bandas van debajo, en `children`.
export default function MusicSoundtrack({ items = [], name, children = null }) {
  const { decades, dated, max } = musicByDecade(items)
  const composers = topComposers(items)
  const picks = listeningPicks(items)
  const showDecades = dated >= 5 && decades.length >= 2
  const firstYear = showDecades ? Math.min(...items.map((item) => Number.parseInt(String(item.year).match(/\d{4}/)?.[0], 10)).filter(Number.isFinite)) : null

  return (
    <section className={styles.section} id="musica" aria-labelledby="musica-titulo">
      <div className="shell">
        <header className={styles.head}>
          <span className={styles.kicker}>Banda sonora</span>
          <h2 id="musica-titulo">Su música</h2>
          {firstYear ? <p className={styles.dek}>Las obras dedicadas a {name}, desde {firstYear} hasta hoy.</p> : null}
        </header>

        {(showDecades || composers.length) ? (
          <div className={styles.charts}>
            {showDecades ? (
              <figure className={styles.panel}>
                <figcaption>Cuándo se compusieron</figcaption>
                <ol className={styles.decades}>
                  {decades.map(({ decade, count }) => (
                    <li key={decade}>
                      <span className={styles.decadeLabel}>{decade}</span>
                      <span className={styles.track} aria-hidden="true"><span style={{ width: `${max ? Math.max(count ? 6 : 0, (count / max) * 100) : 0}%` }} /></span>
                      <b>{count || '·'}</b>
                      <span className="sr-only">{count === 1 ? '1 obra' : `${count} obras`} en la década de {decade}</span>
                    </li>
                  ))}
                </ol>
                {dated < items.length ? <small className={styles.note}>{items.length - dated} sin año documentado no aparecen en el gráfico.</small> : null}
              </figure>
            ) : null}
            {composers.length ? (
              <figure className={styles.panel}>
                <figcaption>Quién más le ha escrito</figcaption>
                <ol className={styles.composers}>
                  {composers.map((composer, index) => (
                    <li key={composer.slug || composer.name}>
                      <span className={styles.rank}>{index + 1}</span>
                      <span className={styles.composerName}>{composer.name}</span>
                      <b>{composer.count}<small> obras</small></b>
                    </li>
                  ))}
                </ol>
              </figure>
            ) : null}
          </div>
        ) : null}

        {picks.length ? (
          <div className={styles.listen}>
            <h3>Para escuchar</h3>
            <ul>
              {picks.map((item) => (
                <li key={item.id}>
                  <a href={item.listening.url} target="_blank" rel="noreferrer" aria-label={`Escuchar ${item.name} en ${item.listening.provider} (se abre en otra pestaña)`}>
                    <span className={styles.play} aria-hidden="true">▶</span>
                    <span className={styles.listenCopy}>
                      <strong>{item.name}</strong>
                      <small>{[item.composers?.map((c) => c.name).join(' · '), String(item.year || '').match(/\d{4}/)?.[0]].filter(Boolean).join(' · ')}</small>
                    </span>
                    <span className={styles.provider}>{item.listening.provider}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {children ? <div className={styles.archive}>{children}</div> : null}
      </div>
    </section>
  )
}
