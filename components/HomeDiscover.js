import Link from 'next/link'
import HomeDiscoverIcon from '@/components/HomeDiscoverIcon'
import { buildHomeDiscover, HOME_DISCOVER_SECONDARY } from '@/lib/home-discover'
import styles from './HomeDiscover.module.css'

// Accesos a las secciones principales de la enciclopedia. Conserva el id
// «enciclopedia», que usa el enlace «Explorar» de la cabecera.
export default function HomeDiscover({ stats, children = null }) {
  const items = buildHomeDiscover(stats)

  return (
    <section className={styles.section} id="enciclopedia" aria-labelledby="descubre-title">
      <div className="shell">
        <h2 id="descubre-title" className={styles.title}>Descubre Hilo Cofrade</h2>
        <p className={styles.lead}>Cada ficha enlaza con su historia, su patrimonio y su música.</p>

        <ul className={styles.grid}>
          {items.map((item) => (
            <li key={item.key}>
              <Link className={styles.tile} href={item.href} data-key={item.key}>
                <HomeDiscoverIcon name={item.key} className={styles.ghost} />
                <span className={styles.glyph}>
                  <HomeDiscoverIcon name={item.key} />
                </span>
                <strong className={styles.name}>{item.label}</strong>
                {item.total ? (
                  <span className={styles.figure}><b>{item.total}</b> {item.unit}</span>
                ) : item.detail ? (
                  <span className={styles.hint}>{item.detail}</span>
                ) : null}
                <i className={styles.go} aria-hidden="true">→</i>
              </Link>
            </li>
          ))}
        </ul>

        {children}

        <nav className={styles.more} aria-labelledby="descubre-mas-title">
          <h3 id="descubre-mas-title" className={styles.moreTitle}>Más en Hilo Cofrade</h3>
          <ul className={styles.moreList}>
            {HOME_DISCOVER_SECONDARY.map((item) => (
              <li key={item.href}>
                <Link className={styles.moreLink} href={item.href}>
                  <span className={styles.moreText}>
                    <strong>{item.label}</strong>
                    <span>{item.detail}</span>
                  </span>
                  <b className={styles.moreArrow} aria-hidden="true">→</b>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
