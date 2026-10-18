import Link from 'next/link'
import styles from './BrotherhoodOtherImages.module.css'

// Figuras secundarias, imágenes de culto y otras imágenes vinculadas a la Hermandad.
// Apartado secundario: no forman parte de la titularidad ni cuentan como titulares.
export default function BrotherhoodOtherImages({ items = [] }) {
  if (!items.length) return null
  return (
    <div className={styles.wrap} id="otras-imagenes">
      <h3 className={styles.title}>Otras imágenes de la Hermandad</h3>
      <ul className={styles.list}>
        {items.map((item) => {
          const meta = [item.tipo, item.autor, item.fecha].filter(Boolean).join(' · ')
          return (
            <li key={item.id}>
              <span className={styles.tag}>{item.relacion}</span>
              {item.fichaDisponible && item.slug
                ? <Link href={`/imagenes/${item.slug}`} className={styles.name}>{item.nombre}</Link>
                : <strong className={styles.name}>{item.nombre}</strong>}
              {meta ? <small className={styles.meta}>{meta}</small> : null}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
