import { routeMapLayout, streetLabels, svgPath } from '@/lib/route-map'
import RouteMapExpand from './RouteMapExpand'
import styles from './BrotherhoodChapterOuting.module.css'

// Mapa del recorrido: teselas de OpenStreetMap y el trazado en el color de la
// Hermandad, con el tramo de cada banda en su segundo color. Cada punto es la
// esquina donde se gira a la calle siguiente: trazado aproximado. Sin coordenadas
// suficientes no se pinta nada.
export default function BrotherhoodOutingMap({ points = [], segments = [], title = '' }) {
  const layout = routeMapLayout(points, { width: 640, height: 420, padding: 40 })
  if (!layout) return null
  const located = layout.points
  const sameCount = points.length === located.length
  const first = located[0]
  const last = located[located.length - 1]
  const roundTrip = Math.hypot(first.x - last.x, first.y - last.y) < 12
  // Mapa ampliado (vertical, más zoom): se calcula aquí y el cliente solo lo pinta al abrirlo.
  const big = routeMapLayout(points, { width: 720, height: 1080, padding: 56, maxZoom: 19, fill: true })
  const bigSegments = big && big.points.length === points.length ? segments : []

  return <figure className={`${styles.map} ${styles.mapWithExpand}`}>
    <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="img" aria-label={`Mapa aproximado del recorrido${title ? ` de ${title}` : ''}`}>
      <g aria-hidden="true">
        {layout.tiles.map((tile) => <image key={tile.key} href={tile.href} x={tile.x} y={tile.y} width={tile.size || 256} height={tile.size || 256} />)}
        <rect width={layout.width} height={layout.height} className={styles.mapVeil} />
        <path d={svgPath(located)} className={styles.mapCasing} />
        {sameCount ? segments.map((band) => <path key={band.id} d={svgPath(located.slice(band.start, band.end + 1))} className={styles.mapBand} />) : null}
        <path d={svgPath(located)} className={styles.mapRoute} />
        {located.slice(1, -1).map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="4" className={styles.mapStop} />)}
        <circle cx={first.x} cy={first.y} r="11" className={styles.mapEnd} />
        {!roundTrip ? <circle cx={last.x} cy={last.y} r="11" className={styles.mapEnd} /> : null}
      </g>
    </svg>
    <RouteMapExpand layout={big} labels={big ? streetLabels(big.points) : []} segments={bigSegments} title={title} />
    <figcaption>
      <span>Trazado aproximado, de esquina a esquina.</span>
      <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap</a>
    </figcaption>
  </figure>
}
