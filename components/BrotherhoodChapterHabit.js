import Image from 'next/image'
import { HABIT_CALLOUTS, habitDifferences, habitShortName } from '@/lib/brotherhood-habits'
import styles from './BrotherhoodChapterHabit.module.css'

// Túnica de nazareno en la ficha por capítulos (solo Penitencia), pensada para
// el móvil: la figura grande, con cada prenda señalada sobre ella, y debajo las
// prendas en fichas. Con varios hábitos (p. ej. cortejo del Cristo y del palio)
// se pasa de uno a otro deslizando o con las pestañas, y se marca lo que cambia.
// Todo es HTML del servidor (desplazamiento con scroll-snap, sin JavaScript).
// Solo campos documentados. Conserva #tunica.

const SHORT_VALUE = 16

function Callouts({ fields }) {
  return <ul className={styles.callouts} aria-hidden="true">
    {fields.filter((field) => HABIT_CALLOUTS[field.key]).map((field) => {
      const spot = HABIT_CALLOUTS[field.key]
      return <li key={field.key} className={styles.callout} data-side={spot.side} style={{ top: `${spot.top}%` }}>
        <span className={styles.chip}>
          <small>{field.label}</small>
          {field.value.length <= SHORT_VALUE ? <strong>{field.value}</strong> : null}
        </span>
      </li>
    })}
  </ul>
}

export default function BrotherhoodChapterHabit({ habits = [] }) {
  if (!habits.length) return null
  const changes = habitDifferences(habits)
  const many = habits.length > 1
  const changedLabels = habits[0].fields.filter((field) => changes.has(field.key)).map((field) => field.label.toLowerCase())

  return <section className={`section ${styles.section}`} id="tunica" aria-labelledby="tunica-titulo">
    <div className="shell">
      <h2 className={styles.title} id="tunica-titulo">La túnica de sus nazarenos</h2>
      {many && changedLabels.length ? <p className={styles.changes}>
        Entre sus tramos cambia {changedLabels.length === 1 ? 'el ' : ''}<strong>{changedLabels.join(', ').replace(/, ([^,]*)$/, ' y $1')}</strong>.
      </p> : null}
      {many ? <nav className={styles.tabs} aria-label="Hábitos de la Hermandad">
        {habits.map((habit) => <a key={habit.id} href={`#tunica-${habit.id}`}>{habitShortName(habit.nombre) || habit.nombre}</a>)}
      </nav> : null}
    </div>

    <div className={styles.rail} data-count={habits.length}>
      {habits.map((habit) => <article key={habit.id} id={`tunica-${habit.id}`} className={styles.card} aria-labelledby={`tunica-${habit.id}-nombre`}>
        <h3 id={`tunica-${habit.id}-nombre`} className={many ? styles.cardTitle : styles.visuallyHidden}>{habit.nombre}</h3>
        {habit.imagenPath ? <div className={styles.stage}>
          <figure className={styles.figure}>
            <Image src={habit.imagenPath} alt={habit.imagenAlt || `Túnica de nazareno: ${habit.nombre}`} width={1024} height={1536} sizes="(max-width: 899px) 46vw, 220px" />
          </figure>
          <Callouts fields={habit.fields} />
        </div> : null}
        <dl className={styles.pieces}>
          {habit.fields.map((field) => <div key={field.key} className={changes.has(field.key) ? styles.changed : ''}>
            <dt>{field.label}{changes.has(field.key) ? <span className={styles.badge}>Cambia</span> : null}</dt>
            <dd>{field.value}</dd>
          </div>)}
        </dl>
      </article>)}
    </div>
  </section>
}
