import HiloSearch from '@/components/HiloSearch'
import styles from './HomeHero.module.css'

// Cabecera de la portada: identidad, título y buscador protagonista en una sola
// banda. Los accesos a secciones viven en «Descubre Hilo Cofrade», más abajo.
export default function HomeHero() {
  return (
    <section className={styles.hero} id="inicio" aria-labelledby="home-title">
      <div className={`shell ${styles.inner}`}>
        <div className={styles.copy}>
          <p className={styles.place}>Sevilla y su provincia</p>
          <h1 id="home-title" className={styles.title}>Hilo Cofrade, todo en las cofradías está relacionado</h1>
          <p className={styles.lead}>Hermandades, imágenes, pasos, bandas, marchas y su agenda, conectados entre sí.</p>
        </div>

        <div className={styles.search} id="tiradelhilo">
          <h2 className={styles.searchTitle}>Tira del hilo: busca una ficha o pregunta</h2>
          <HiloSearch homeCompact />
        </div>
      </div>
    </section>
  )
}
