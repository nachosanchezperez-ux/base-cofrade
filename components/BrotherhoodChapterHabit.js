import Image from 'next/image'
import { habitComparison, habitShortName } from '@/lib/brotherhood-habits'
import styles from './BrotherhoodChapterHabit.module.css'

// Túnica de nazareno en la ficha por capítulos (solo Penitencia), pensada para
// el móvil.
// - Un hábito: la figura y, a su lado, sus prendas en lista limpia.
// - Varios (p. ej. cortejo del Cristo y del palio): las figuras lado a lado,
//   debajo solo lo que cambia, alineado por prenda, y en una línea lo común.
// Solo campos documentados. Conserva #tunica y #tunica-<id> (el tramo del
// cortejo enlaza a su hábito).

function Figure({ habit, sizes }) {
  if (!habit.imagenPath) return null
  return <figure className={styles.figure}>
    <Image src={habit.imagenPath} alt={habit.imagenAlt || `Túnica de nazareno: ${habit.nombre}`} width={1024} height={1536} sizes={sizes} />
  </figure>
}

function Single({ habit }) {
  return <div className={styles.single} id={`tunica-${habit.id}`}>
    <Figure habit={habit} sizes="(max-width: 899px) 40vw, 220px" />
    <dl className={styles.list}>
      {habit.fields.map((field) => <div key={field.key}>
        <dt>{field.label}</dt>
        <dd>{field.value}</dd>
      </div>)}
    </dl>
  </div>
}

function Compare({ habits }) {
  const { changed, common } = habitComparison(habits)
  const names = habits.map((habit) => habitShortName(habit.nombre) || habit.nombre)
  const everyone = habits.length === 2 ? 'En los dos tramos' : 'En todos los tramos'
  return <>
    <div className={styles.compare} data-cols={habits.length} style={{ '--cols': habits.length }}>
      {habits.map((habit, index) => <h3 key={habit.id} id={`tunica-${habit.id}`} className={styles.name} title={habit.nombre}>{names[index]}</h3>)}
      {habits.map((habit) => <div key={habit.id} className={styles.cell}><Figure habit={habit} sizes={`(max-width: 899px) ${Math.round(90 / habits.length)}vw, 260px`} /></div>)}
      {changed.map((row) => <div key={row.key} className={styles.row} role="group" aria-label={row.label}>
        <span className={styles.rowHead}>{row.label}</span>
        {row.values.map((value, index) => <span key={habits[index].id} className={styles.value}>
          <span className={styles.visuallyHidden}>{names[index]}: </span>{value || '—'}
        </span>)}
      </div>)}
    </div>
    {common.length ? <p className={styles.common}>
      <strong>{everyone}:</strong>{' '}
      {common.map((field, index) => <span key={field.key}>{index ? ' · ' : ''}<em>{field.label}</em> {field.value.charAt(0).toLowerCase()}{field.value.slice(1)}</span>)}
    </p> : null}
  </>
}

export default function BrotherhoodChapterHabit({ habits = [] }) {
  if (!habits.length) return null
  return <section className={`section ${styles.section}`} id="tunica" aria-labelledby="tunica-titulo">
    <div className="shell">
      <h2 className={styles.title} id="tunica-titulo">La túnica de sus nazarenos</h2>
      {habits.length > 1 ? <Compare habits={habits} /> : <Single habit={habits[0]} />}
    </div>
  </section>
}
