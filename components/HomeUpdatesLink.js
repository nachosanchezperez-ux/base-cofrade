import Link from 'next/link'
import styles from './HomeUpdatesLink.module.css'

// Actualidad como propuesta secundaria: un acceso compacto a «El Hilo se mueve»,
// sin repetir en la portada el listado de novedades (retirado en #1131).
// Cuando el juego propio esté publicado, se añade aquí como segundo acceso.
export const HOME_SECONDARY_LINKS = [
  {
    href: '/el-hilo-se-mueve',
    title: 'El Hilo se mueve',
    detail: 'Lo que cambia en nuestras hermandades: sones que llegan, patrimonio que vuelve e historias que siguen.',
  },
]

export default function HomeUpdatesLink() {
  return (
    <section className={styles.section} aria-label="Actualidad">
      <div className="shell">
        <ul className={styles.list}>
          {HOME_SECONDARY_LINKS.map((item) => (
            <li key={item.href}>
              <Link className={styles.link} href={item.href}>
                <strong>{item.title}</strong>
                <span>{item.detail}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
