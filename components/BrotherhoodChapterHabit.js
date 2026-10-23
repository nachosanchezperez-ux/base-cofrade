import Image from 'next/image'
import { habitComparison, habitFieldDisplay, habitTitle } from '@/lib/brotherhood-habits'
import styles from './BrotherhoodChapterHabit.module.css'

// Túnica de nazareno en la ficha por capítulos (solo Penitencia), en formato
// cromo: una tarjeta por hábito con la figura sobre fondo claro y, debajo, una
// franja en el color de la Hermandad con sus prendas.
// - Un hábito: el cromo con todas sus prendas, sin cabecera (ya la da la sección).
// - Varios (cortejo del Cristo y del palio): un cromo por tramo, que se pasan
//   deslizando; cada franja lleva solo lo que cambia y lo común va una vez debajo.
// Nada se repite: la prenda no se repite en su descripción. Todo es HTML del
// servidor (scroll-snap, sin JavaScript). Conserva #tunica y #tunica-<id>.

function Pieces({ fields }) {
  return <dl className={styles.pieces}>
    {fields.map((field) => {
      const { label, value } = habitFieldDisplay(field)
      return <div key={field.key}><dt>{label}</dt><dd>{value}</dd></div>
    })}
  </dl>
}

function Cromo({ habit, fields, index, total }) {
  const title = total > 1 ? habitTitle(habit.nombre) : null
  return <article id={`tunica-${habit.id}`} className={styles.cromo} aria-label={habit.nombre}>
    {title ? <header className={styles.head}>
      <p className={styles.heading}>
        {title.kicker ? <span className={styles.kicker}>{title.kicker}</span> : null}
        <strong>{title.name}</strong>
      </p>
      <span className={styles.count} aria-hidden="true">{index + 1} / {total}</span>
    </header> : null}
    {habit.imagenPath ? <figure className={styles.figure}>
      <Image src={habit.imagenPath} alt={habit.imagenAlt || `Túnica de nazareno: ${habit.nombre}`} width={1024} height={1536} sizes="(max-width: 899px) 60vw, 240px" />
    </figure> : null}
    {fields.length ? <div className={styles.band}><Pieces fields={fields} /></div> : null}
  </article>
}

export default function BrotherhoodChapterHabit({ habits = [] }) {
  if (!habits.length) return null
  const many = habits.length > 1
  const { changed, common } = many ? habitComparison(habits) : { changed: [], common: [] }
  const changedKeys = new Set(changed.map((row) => row.key))
  const everyone = habits.length === 2 ? 'En los dos tramos' : 'En todos los tramos'

  return <section className={`section ${styles.section}`} id="tunica" aria-labelledby="tunica-titulo">
    <div className="shell">
      <h2 className={styles.title} id="tunica-titulo">La túnica de sus nazarenos</h2>
      <div className={styles.rail} data-count={habits.length}>
        {habits.map((habit, index) => <Cromo key={habit.id} habit={habit} index={index} total={habits.length}
          fields={many ? habit.fields.filter((field) => changedKeys.has(field.key)) : habit.fields} />)}
      </div>
      {many && common.length ? <p className={styles.common}>
        <strong>{everyone}:</strong>{' '}
        {common.map((field, index) => {
          const { label, value } = habitFieldDisplay(field)
          return <span key={field.key}>{index ? ' · ' : ''}<em>{label}</em> {value.charAt(0).toLowerCase()}{value.slice(1)}</span>
        })}
      </p> : null}
    </div>
  </section>
}
