import Image from 'next/image'
import Link from 'next/link'
import styles from './TitularGallery.module.css'

// Sagrados titulares en galería de retratos (Tarea 09). La descripción larga
// vive en la ficha de cada Imagen; aquí van el rostro, el nombre y la autoría.
function Portrait({ item }) {
  const content = (
    <>
      <span className={styles.photo}>
        {item.photo?.src ? (
          <Image
            src={item.photo.src}
            alt={item.photo.alt || `Fotografía de ${item.name}`}
            fill
            sizes="(max-width: 619px) calc(50vw - 24px), (max-width: 979px) 33vw, 290px"
          />
        ) : <span className={styles.initials} aria-hidden="true">{item.initials}</span>}
        {item.photo?.credit ? <small className={styles.credit}>{item.photo.credit}</small> : null}
      </span>
      {item.type ? <span className={styles.type}>{item.type}</span> : null}
      <span className={styles.name}>{item.name}</span>
      {item.authorship ? <span className={styles.authorship}>{item.authorship}</span> : null}
    </>
  )
  return item.href
    ? <Link href={item.href} className={styles.item}>{content}</Link>
    : <span className={styles.item}>{content}</span>
}

export default function TitularGallery({ items = [], children = null }) {
  if (!items.length) return null
  return (
    <section className={styles.section} id="titulares" aria-labelledby="titulares-titulo">
      <div className="shell">
        <header className={styles.head}>
          <span className={styles.kicker}>Titularidad</span>
          <h2 id="titulares-titulo">Sagrados Titulares</h2>
        </header>
        <ul className={styles.grid}>
          {items.map((item) => <li key={item.id}><Portrait item={item} /></li>)}
        </ul>
        {children}
      </div>
    </section>
  )
}
