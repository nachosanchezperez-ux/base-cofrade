import Image from 'next/image'
import styles from './BrotherhoodChapterHabit.module.css'

// Túnica de nazareno en la ficha por capítulos (solo Penitencia): la figura y
// sus prendas, a la vista dentro del Cortejo. Si la Hermandad tiene más de un
// hábito (p. ej. cortejo del Cristo y del palio), se muestran juntos para
// comparar. Solo los campos documentados (habitFields). Conserva #tunica.

export default function BrotherhoodChapterHabit({ habits = [] }) {
  if (!habits.length) return null
  return <section className={`section ${styles.section}`} id="tunica" aria-labelledby="tunica-titulo">
    <div className="shell">
      <h2 className={styles.title} id="tunica-titulo">La túnica de sus nazarenos</h2>
      <div className={styles.grid} data-count={habits.length}>
        {habits.map((habit) => <article key={habit.id} className={styles.habit}>
          {habit.imagenPath ? <figure className={styles.figure}>
            <Image src={habit.imagenPath} alt={habit.imagenAlt || `Túnica de nazareno: ${habit.nombre}`} width={1024} height={1536} sizes="(max-width: 899px) 40vw, 220px" />
          </figure> : null}
          <div className={styles.copy}>
            {habits.length > 1 || (habit.nombre && !/^h[aá]bito de nazareno$/i.test(habit.nombre)) ? <h3>{habit.nombre}</h3> : null}
            <dl>
              {habit.fields.map((field) => <div key={field.key}>
                <dt>{field.label}</dt>
                <dd>{field.value}</dd>
              </div>)}
            </dl>
          </div>
        </article>)}
      </div>
    </div>
  </section>
}
