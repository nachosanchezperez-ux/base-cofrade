import Link from 'next/link'
import styles from './ImageLabel.module.css'

// Cartela de museo para la Imagen (Tarea 09): los datos de catálogo en el
// formato que el público reconoce de las salas de exposición. Solo filas
// con valor; nada se rellena.
export default function ImageLabel({ title, subtitle = '', rows = [], note = '', where = [] }) {
  const visibleRows = rows.filter((row) => row?.value)
  const visibleWhere = where.filter((item) => item?.value)
  if (!visibleRows.length) return null

  return (
    <div className={styles.wrap}>
      <figure className={styles.label} aria-label={`Cartela de ${title}`}>
        <p className={styles.title}>{title}</p>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        <dl className={styles.rows}>
          {visibleRows.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.href ? <Link href={row.href}>{row.value}</Link> : row.value}</dd>
            </div>
          ))}
        </dl>
        {note ? <figcaption className={styles.note}>{note}</figcaption> : null}
      </figure>

      {visibleWhere.length ? (
        <div className={styles.where}>
          <p className={styles.whereTitle}>Dónde verla</p>
          <ul>
            {visibleWhere.map((item) => (
              <li key={item.label}>
                <span>{item.label}</span>
                {item.href ? <Link href={item.href}>{item.value}</Link> : <strong>{item.value}</strong>}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
