import Link from 'next/link'
import {
  HOLY_WEEK_OUTING_ORDER,
  presentAccompanimentStep,
  resolveAccompanimentOutingType,
} from '@/lib/bands/accompaniments'
import styles from './BandHolyWeek.module.css'

// «Su Semana Santa, día a día» (Tarea 09): dónde suena la banda cada jornada,
// con las jornadas libres visibles. Solo acompañamientos vigentes ya cargados.
const CORE_DAYS = ['Domingo de Ramos', 'Lunes Santo', 'Martes Santo', 'Miércoles Santo', 'Jueves Santo', 'Madrugá', 'Viernes Santo', 'Sábado Santo', 'Domingo de Resurrección']
const SHORT = {
  'Viernes de Dolores': 'V. Dolores',
  'Sábado de Pasión': 'S. Pasión',
  'Domingo de Ramos': 'Domingo de Ramos',
  'Domingo de Resurrección': 'Resurrección',
}

export default function BandHolyWeek({ items = [], year, id = 'semana-santa' }) {
  if (!items.length) return null
  const byDay = new Map()
  for (const item of items) {
    const day = resolveAccompanimentOutingType(item)
    const key = HOLY_WEEK_OUTING_ORDER.includes(day) ? day : 'Día por documentar'
    byDay.set(key, [...(byDay.get(key) || []), item])
  }
  const days = [
    ...HOLY_WEEK_OUTING_ORDER.filter((day) => CORE_DAYS.includes(day) || byDay.has(day)),
    ...(byDay.has('Día por documentar') ? ['Día por documentar'] : []),
  ]
  const busyDays = days.filter((day) => byDay.has(day) && day !== 'Día por documentar').length

  return (
    <section className={`section ${styles.section}`} id={id}>
      <div className="shell">
        <div className="section-heading">
          <span className="eyebrow">Semana Santa {year}</span>
          <h2>Su Semana Santa, día a día</h2>
          <p>{items.length} {items.length === 1 ? 'acompañamiento' : 'acompañamientos'} en {busyDays} {busyDays === 1 ? 'jornada' : 'jornadas'}.</p>
        </div>
        <ol className={styles.week}>
          {days.map((day) => {
            const entries = byDay.get(day) || []
            return (
              <li key={day} className={styles.day} data-busy={entries.length ? 'true' : undefined}>
                <span className={styles.dayName}>{SHORT[day] || day}</span>
                {entries.length ? (
                  <ul className={styles.entries}>
                    {entries.map((item) => {
                      const step = presentAccompanimentStep(item)
                      return (
                        <li key={item.id || `${item.brotherhoodName}-${step.name}`}>
                          {item.brotherhoodSlug && item.brotherhoodPageReady
                            ? <Link href={`/hermandades/${item.brotherhoodSlug}`} className={styles.brotherhood}>{item.brotherhoodName}</Link>
                            : <strong className={styles.brotherhood}>{item.brotherhoodName}</strong>}
                          {step.name || step.type ? (
                            <span className={styles.step}>
                              {item.stepPageReady && item.stepSlug
                                ? <Link href={`/pasos/${item.stepSlug}`}>{step.type || step.name}</Link>
                                : (step.type || step.name)}
                            </span>
                          ) : null}
                        </li>
                      )
                    })}
                  </ul>
                ) : <span className={styles.free}>Sin acompañamiento documentado</span>}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
