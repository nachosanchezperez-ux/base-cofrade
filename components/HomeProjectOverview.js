import Link from 'next/link'
import styles from './HomeProjectOverview.module.css'

const agendaCategories = [
  { key: 'processions', label: 'Procesiones' },
  { key: 'transfers', label: 'Traslados' },
  { key: 'rosaries', label: 'Rosarios' },
  { key: 'devotions', label: 'Besamanos y besapiés' },
  { key: 'concerts', label: 'Conciertos' },
]

const agendaPeriods = [
  { key: 'today', label: 'Hoy', href: '/agenda-cofrade?periodo=today#agenda' },
  { key: 'weekend', label: 'Este fin de semana', href: '/agenda-cofrade?periodo=weekend#agenda' },
]

const secondaryAreas = [
  {
    key: 'musica',
    eyebrow: 'Música',
    title: 'Crucetas y marchas',
    detail: 'Repertorios reales, bandas, autorías y grabaciones.',
    href: '/crucetas-musicales',
    cta: 'Seguir la música',
  },
  {
    key: 'costaleros',
    eyebrow: 'Costaleros',
    title: 'Igualás y ensayos',
    detail: 'Convocatorias con calendario propio y su Hermandad.',
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
            <span className={styles.eyebrow}>Hilo Cofrade de un vistazo</span>
            <h2 id="hilo-de-un-vistazo">Actualidad y conocimiento, conectados</h2>
          </div>
          <p>Consulta qué ocurre, profundiza en cada ficha y sigue las relaciones que unen Hermandades, patrimonio y música.</p>
        </header>

        <nav className={styles.map} aria-label="Áreas principales de Hilo Cofrade">
          <article className={styles.agendaCard}>
            <span className={styles.cardEyebrow}>Qué ocurre y cuándo</span>
            <span className={styles.agendaBody}>
              <strong>Agenda cofrade</strong>
              <span>Los actos documentados, ordenados por fecha y lugar y enlazados con sus protagonistas.</span>
            </span>
            <nav className={styles.agendaQuick} aria-label="Accesos rápidos por fecha de la Agenda Cofrade">
              {agendaPeriods.map((period) => (
                <Link href={period.href} key={period.key} data-period={period.key}>
                  {period.label} <b aria-hidden="true">→</b>
                </Link>
              ))}
            </nav>
            <span className={styles.agendaTypesLabel}>Por tipo de acto</span>
            <ul className={styles.agendaTypes} aria-label="Categorías de la Agenda Cofrade">
              {agendaCategories.map((category) => (
                <li key={category.key}>
                  <Link
                    href={`/agenda-cofrade?categoria=${category.key}#agenda`}
                    data-category={category.key}
                  >
                    <span>{category.label}</span>
                    <b aria-hidden="true">→</b>
                  </Link>
                </li>
              ))}
            </ul>
            <Link className={styles.agendaCta} href="/agenda-cofrade">
              Ver la agenda completa <b aria-hidden="true">→</b>
            </Link>
          </article>

          <div className={styles.supportingAreas}>
            <Link className={styles.encyclopediaCard} href="/directorio">
              <span className={styles.cardEyebrow}>El núcleo documental</span>
              <span className={styles.encyclopediaBody}>
                <span>
                  <strong>Explora la enciclopedia</strong>
                  <small>Fichas conectadas para no dejar cada dato aislado.</small>
                </span>
                <b aria-hidden="true">→</b>
              </span>
              <span className={styles.entityTrail} aria-hidden="true">
                <i>Hermandades</i><b>·</b><i>Imágenes</i><b>·</b><i>Pasos</i><b>·</b><i>Bandas</i>
              </span>
            </Link>

            <div className={styles.secondaryGrid}>
              {secondaryAreas.map((area) => (
                <Link className={styles.secondaryCard} href={area.href} key={area.key} data-area={area.key}>
                  <span className={styles.cardEyebrow}>{area.eyebrow}</span>
                  <span className={styles.secondaryBody}>
                    <strong>{area.title}</strong>
                    <span>{area.detail}</span>
                  </span>
                  <span className={styles.secondaryCta}>{area.cta} <b aria-hidden="true">→</b></span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </section>
  )
}
