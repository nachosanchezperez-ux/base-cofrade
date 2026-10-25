import PanelEditLink from './PanelEditLink'
import styles from './PanelEditLink.module.css'

// Fila superior de la cabecera de una ficha: la ruta de navegación y, para el
// equipo, «Editar ficha» a la derecha. Sin `editHref` solo pinta la ruta.
export default function HeroTopRow({ children, editHref = '' }) {
  if (!editHref) return children
  return (
    <div className={styles.row}>
      {children}
      <PanelEditLink href={editHref} />
    </div>
  )
}
