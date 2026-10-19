import Image from 'next/image'
import Link from 'next/link'
import styles from './BrotherhoodChapterTitulars.module.css'

// Titulares en la ficha por capítulos: una fila por imagen (miniatura, nombre,
// autoría) y el resto de datos plegado en el HTML. Sin foto no hay hueco: la
// fila empieza por el texto («subimos contenido que esté terminado»).

function Details({ item }) {
  const technical = [item.tecnica, item.material, item.dimensiones].filter(Boolean)
  if (!item.descripcion && !technical.length && !item.iconografia) return null
  return <details className={styles.more}>
    <summary>Sobre la imagen <b aria-hidden="true">+</b></summary>
    {item.descripcion ? <p>{item.descripcion}</p> : null}
    {technical.length ? <p className={styles.technical}>{technical.join(' · ')}</p> : null}
    {item.iconografia ? <p><strong>Iconografía.</strong> {item.iconografia}</p> : null}
  </details>
}

export default function BrotherhoodChapterTitulars({ items = [], conceptual = [], children = null }) {
  if (!items.length && !conceptual.length) return null
  return <section className={`section ${styles.section}`} id="titulares" aria-labelledby="titulares-titulo">
    <div className="shell">
      <h2 className={styles.title} id="titulares-titulo">Sagrados Titulares</h2>
      <ul className={styles.list}>
        {items.map((item) => {
          const authorship = [item.autor, item.fecha].filter(Boolean).join(' · ')
          return <li key={item.id} className={`${styles.row} ${item.media?.path ? '' : styles.textOnly}`}>
            {item.media?.path ? <figure className={styles.thumb}>
              <Image src={item.media.path} alt={item.media.alt || `Fotografía de ${item.nombre}`} fill sizes="(max-width: 700px) 84px, 112px" />
              {item.media.credit ? <figcaption>{item.media.credit}</figcaption> : null}
            </figure> : null}
            <div className={styles.body}>
              {item.tipo ? <small className={styles.kind}>{item.tipo}</small> : null}
              <h3>{item.fichaDisponible ? <Link href={`/imagenes/${item.slug}`}>{item.nombre}</Link> : item.nombre}</h3>
              {authorship ? <p className={styles.authorship}>{authorship}</p> : null}
              <Details item={item} />
            </div>
          </li>
        })}
        {conceptual.map((item) => <li key={item.id} className={`${styles.row} ${styles.textOnly}`}>
          <div className={styles.body}>
            {item.tipo ? <small className={styles.kind}>{item.tipo}</small> : null}
            <h3>{item.nombre}</h3>
            <p className={styles.authorship}>Titular devocional, sin imagen propia</p>
          </div>
        </li>)}
      </ul>
      {children}
    </div>
  </section>
}
