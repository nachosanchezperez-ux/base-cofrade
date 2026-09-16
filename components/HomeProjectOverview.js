import Link from 'next/link'
import styles from './HomeProjectOverview.module.css'

const areas = [
  {
    key: 'agenda',
    eyebrow: 'Qué ocurre y cuándo',
    title: 'Agenda cofrade',
    detail: 'Procesiones, traslados, rosarios, besamanos y conciertos, ordenados por fecha y lugar.',
    href: '/agenda-cofrade',
    cta: 'Abrir la agenda',
  },
  {
    key: 'enciclopedia',
    eyebrow: 'Quién es quién',
    title: 'Enciclopedia relacionada',
    detail: 'Hermandades, imágenes, pasos, bandas y patrimonio unidos dentro de una misma red.',
    href: '/directorio',
    cta: 'Explorar el directorio',
  },
  {
    key: 'musica',
    eyebrow: 'Cómo suena',
    title: 'Música y crucetas',
    detail: 'Crucetas reales, marchas, bandas, autorías y grabaciones para seguir cada relación.',
    href: '/crucetas-musicales',
    cta: 'Descubrir las crucetas',
  },
  {
    key: 'costaleros',
    eyebrow: 'Calendario propio',
    title: 'Igualás y ensayos',
    detail: 'Convocatorias de costaleros separadas de la agenda general y vinculadas a sus hermandades.',
    href: '/igualas-y-ensayos',
    cta: 'Ver convocatorias',
  },
]

export default function HomeProjectOverview() {
  return (
    <section className={styles.section} aria-labelledby="hilo-de-un-vistazo">
      <div className="shell">
        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>Todo el proyecto</span>
            <h2 id="hilo-de-un-vistazo">Hilo Cofrade, de un vistazo</h2>
          </div>
          <p>Cuatro formas de entrar en una plataforma donde la actualidad, las fichas y la música siempre conducen a nuevas relaciones.</p>
        </header>

        <nav className={styles.grid} aria-label="Áreas principales de Hilo Cofrade">
          {areas.map((area, index) => (
            <Link className={styles.card} href={area.href} key={area.key} data-area={area.key}>
              <span className={styles.cardTopline}>
                <span className={styles.sequence}>{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.areaEyebrow}>{area.eyebrow}</span>
              </span>
              <span className={styles.cardBody}>
                <strong>{area.title}</strong>
                <span>{area.detail}</span>
              </span>
              <span className={styles.cta}>
                {area.cta} <b aria-hidden="true">→</b>
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  )
}
