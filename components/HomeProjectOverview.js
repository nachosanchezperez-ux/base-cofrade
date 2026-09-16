import Link from 'next/link'
import styles from './HomeProjectOverview.module.css'

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
          <Link className={styles.agendaCard} href="/agenda-cofrade">
            <span className={styles.cardEyebrow}>Qué ocurre y cuándo</span>
            <span className={styles.agendaBody}>
              <strong>Agenda cofrade</strong>
              <span>Los actos documentados, ordenados por fecha y lugar y enlazados con sus protagonistas.</span>
            </span>
            <span className={styles.agendaTypes} aria-label="Procesiones, traslados, rosarios, besamanos y conciertos">
              <i>Procesiones</i>
              <i>Traslados</i>
              <i>Rosarios</i>
              <i>Besamanos</i>
              <i>Conciertos</i>
            </span>
            <span className={styles.agendaCta}>Abrir la agenda <b aria-hidden="true">→</b></span>
          </Link>

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
