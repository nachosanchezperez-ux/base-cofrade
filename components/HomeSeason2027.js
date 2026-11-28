import Link from 'next/link'
import SeasonClock from '@/components/SeasonClock'
import { HOLY_WEEK_2027 } from '@/lib/home-pulse'
import { buildSeasonTimeline } from '@/lib/home-season'
import styles from './HomeSeason2027.module.css'

// Tarjeta «Semana Santa 2027» (28/11/2026): a la izquierda, el reloj hasta el
// Viernes de Dolores y la línea de hitos litúrgicos; a la derecha, las cifras
// vivas de la semana (agenda, igualás, horarios oficiales, cambios de banda).
export default function HomeSeason2027({ pulse = [], today = '' }) {
  const countdown = pulse.find((item) => item.key === 'countdown')
  const figures = pulse.filter((item) => item.key !== 'countdown')
  const timeline = buildSeasonTimeline(today)
  if (!countdown && !figures.length) return null

  return (
    <section className={styles.season} aria-labelledby="temporada-title">
      <div className={`shell ${styles.shell}`}>
        <div className={styles.card}>
          <div className={styles.lead}>
            <p className={styles.eyebrow}>Próxima Semana Santa</p>
            <h2 id="temporada-title" className={styles.title}>Semana Santa 2027</h2>
            <p className={styles.dates}>Del Viernes de Dolores, 19 de marzo, al Domingo de Resurrección, 28 de marzo</p>

            {countdown ? (
              <div className={styles.clockBox}>
                <span className={styles.clockLabel}>{countdown.target ? 'Faltan para el Viernes de Dolores' : countdown.label}</span>
                {countdown.target
                  ? <SeasonClock target={countdown.target} days={countdown.figure} />
                  : <b className={styles.today}>{countdown.figure}</b>}
              </div>
            ) : null}

            {timeline.length ? (
              <ol className={styles.timeline} aria-label="Hitos hasta la Semana Santa">
                {timeline.map((step) => (
                  <li key={step.key} className={styles.step} data-state={step.state}>
                    <span className={styles.bar} aria-hidden="true">
                      <span style={{ width: `${step.progress * 100}%` }} />
                    </span>
                    <b className={styles.stepDay}>{step.day}</b>
                    <span className={styles.stepLabel}>{step.label}</span>
                  </li>
                ))}
              </ol>
            ) : null}
          </div>

          <div className={styles.side}>
            <h3 className={styles.sideTitle}>Esta semana en la central</h3>
            {figures.length ? (
              <ul className={styles.figures}>
                {figures.map((item) => (
                  <li key={item.key}>
                    <Link className={styles.figureLink} href={item.href} data-key={item.key}>
                      <b className={styles.figure}>{item.figure}</b>
                      <span className={styles.figureLabel}>{item.label}</span>
                      <span className={styles.arrow} aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
            <Link className={styles.programme} href={HOLY_WEEK_2027.href}>Abrir el programa de mano 2027 →</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
