import Image from 'next/image'
import Link from 'next/link'
import styles from './BrotherhoodChapterTitulars.module.css'

// Titulares en la ficha por capítulos: una fila por imagen (miniatura, nombre,
// autoría) y el resto de datos plegado en el HTML. Sin foto no hay hueco: la
// fila empieza por el texto («subimos contenido que esté terminado»).

export function TitularDetails({ item }) {
  const technical = [item.tecnica, item.material, item.dimensiones].filter(Boolean)
  if (!item.descripcion && !technical.length && !item.iconografia) return null
  return <details className={styles.more}>
    <summary>Sobre la imagen <b aria-hidden="true">+</b></summary>
    {item.descripcion ? <p>{item.descripcion}</p> : null}
    {technical.length ? <p className={styles.technical}>{technical.join(' · ')}</p> : null}
    {item.iconografia ? <p><strong>Iconografía.</strong> {item.iconografia}</p> : null}
  </details>
}

// Las imágenes que ya se presentan en su paso (excludeIds) no se repiten aquí:
// quedan los titulares que no procesionan, los devocionales y las personas.
export default function BrotherhoodChapterTitulars({ items: allItems = [], conceptual = [], excludeIds = [], children = null }) {
  const excluded = new Set(excludeIds.map(String))
  const items = allItems.filter((item) => !excluded.has(String(item.id)))
  const someInSteps = items.length < allItems.length
  if (!items.length && !conceptual.length && !children) return null
  const title = items.length || conceptual.length ? (someInSteps ? 'Otros titulares' : 'Sagrados Titulares') : ''
  return <section className={`section ${styles.section}`} id="titulares" aria-labelledby={title ? 'titulares-titulo' : undefined}>
    <div className="shell">
      {title ? <h2 className={styles.title} id="titulares-titulo">{title}</h2> : null}
      {items.length || conceptual.length ? <ul className={styles.list}>
        {items.map((item) => {
          const authorship = [item.autor, item.fecha].filter(Boolean).join(' · ')
          return <li key={item.id} className={`${styles.row} ${item.media?.path ? '' : styles.textOnly}`}>
            {item.media?.path ? <figure className={styles.thumb}>
              <Image src={item.media.path} alt={item.media.alt || `Fotografía de ${item.nombre}`} fill sizes="(max-width: 700px) 84px, 112px" />
            </figure> : null}
            <div className={styles.body}>
              {item.tipo ? <small className={styles.kind}>{item.tipo}</small> : null}
              <h3>{item.fichaDisponible ? <Link href={`/imagenes/${item.slug}`}>{item.nombre}</Link> : item.nombre}</h3>
              {authorship ? <p className={styles.authorship}>{authorship}</p> : null}
              {/* El crédito, bajo el texto: no tapa la fotografía. */}
              {item.media?.credit ? <small className={styles.credit}>Foto: {item.media.credit.replace(/^Fotograf[ií]a\s*·\s*/i, '')}</small> : null}
              <TitularDetails item={item} />
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
      </ul> : null}
      {children}
    </div>
  </section>
}
