import { routeMapLayout, svgPath } from '@/lib/route-map'
import styles from './BrotherhoodChapterOuting.module.css'

// Mapa del recorrido: teselas de OpenStreetMap y el trazado en el color de la
// Hermandad, con el tramo de cada banda en su segundo color. Cada calle es un
// solo punto, así que el trazado es aproximado y se dice. Sin coordenadas
// suficientes no se pinta nada.
export default function BrotherhoodOutingMap({ points = [], segments = [], title = '' }) {
  const layout = routeMapLayout(points, { width: 640, height: 420, padding: 40 })
  if (!layout) return null
  const located = layout.points
  const sameCount = points.length === located.length
  const first = located[0]
  const last = located[located.length - 1]
  const roundTrip = Math.hypot(first.x - last.x, first.y - last.y) < 12

  return <figure className={styles.map}>
    <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="img" aria-label={`Mapa aproximado del recorrido${title ? ` de ${title}` : ''}`}>
      <g aria-hidden="true">
        {layout.tiles.map((tile) => <image key={tile.key} href={tile.href} x={tile.x} y={tile.y} width="256" height="256" />)}
        <rect width={layout.width} height={layout.height} className={styles.mapVeil} />
        <path d={svgPath(located)} className={styles.mapCasing} />
        {sameCount ? segments.map((band) => <path key={band.id} d={svgPath(located.slice(band.start, band.end + 1))} className={styles.mapBand} />) : null}
        <path d={svgPath(located)} className={styles.mapRoute} />
        {located.slice(1, -1).map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="4" className={styles.mapStop} />)}
        <circle cx={first.x} cy={first.y} r="11" className={styles.mapEnd} />
        {!roundTrip ? <circle cx={last.x} cy={last.y} r="11" className={styles.mapEnd} /> : null}
      </g>
    </svg>
    <figcaption>
      <span>Trazado aproximado: un punto por calle.</span>
      <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap</a>
    </figcaption>
  </figure>
}
