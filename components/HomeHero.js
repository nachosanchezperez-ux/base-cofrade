import Link from 'next/link'
import HiloSearch from '@/components/HiloSearch'
import HomeSeason2027 from '@/components/HomeSeason2027'
import styles from './HomeHero.module.css'

// Cabecera de la portada (28/11/2026): identidad, buscador y «El archivo en
// cifras» en la banda azul; debajo, la tarjeta «Semana Santa 2027» con el reloj,
// los hitos y las cifras de la semana.
export default function HomeHero({ pulse = [], archive = [] }) {
  return (
    <>
      <section className={styles.hero} id="inicio" aria-labelledby="home-title">
        <div className={`shell ${styles.inner}`}>
          <div className={styles.copy}>
            {/* «Hilo Cofrade» forma parte del H1 (posicionamiento de marca), en la
                línea pequeña sobre el lema. */}
            <h1 id="home-title" className={styles.title}>
              <span className={styles.place}>Hilo Cofrade · Sevilla y su provincia</span>
              {' '}Todo en las cofradías está relacionado
            </h1>
            <p className={styles.lead}>
              La <strong className={styles.accent}>central de datos</strong> de las cofradías: hermandades, imágenes, pasos, bandas, marchas y su agenda, conectados entre sí.
            </p>

            <div className={styles.search} id="tiradelhilo">
              <h2 className={styles.searchTitle}>Tira del hilo: busca una ficha o pregunta</h2>
              <HiloSearch homeCompact />
            </div>
          </div>

          {archive.length ? (
            <section className={styles.archive} aria-labelledby="archivo-title">
              <h2 id="archivo-title" className={styles.archiveTitle}>El archivo en cifras</h2>
              <ul className={styles.archiveGrid}>
                {archive.map((item) => (
                  <li key={item.key}>
                    <Link className={styles.stat} href={item.href} data-key={item.key}>
                      <b className={styles.statFigure}>{item.figure}</b>
                      <span className={styles.statLabel}>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </section>

      <HomeSeason2027 pulse={pulse} />
    </>
  )
}
