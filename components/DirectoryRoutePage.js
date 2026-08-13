import Link from 'next/link'
import BrotherhoodDirectoryCard from '@/components/BrotherhoodDirectoryCard'
import { sortBrotherhoods } from '@/lib/brotherhood-directory'
import styles from './HermandadesDirectory.module.css'

export default function DirectoryRoutePage({
  eyebrow,
  title,
  description,
  hermandades,
  breadcrumbs = [],
  contextLabel,
}) {
  const items = sortBrotherhoods(hermandades)

  return (
    <section className={`section page-top ${styles.routePage}`}>
      <div className="shell">
        <nav className={styles.breadcrumbs} aria-label="Migas de pan">
          <Link href="/hermandades">Hermandades</Link>
          {breadcrumbs.map((item) => (
            <span key={item.href || item.label}>
              <span aria-hidden="true">/</span>
              {item.href ? <Link href={item.href}>{item.label}</Link> : <strong>{item.label}</strong>}
            </span>
          ))}
        </nav>

        <span className="eyebrow">{eyebrow}</span>
        <h1 className="page-title">{title}</h1>
        <p className="page-lead">{description}</p>

        <div className={styles.resultHead} style={{ marginTop: 34 }}>
          <div>
            <strong>{items.length} {items.length === 1 ? 'hermandad' : 'hermandades'}</strong>
            <span>Fichas publicadas en Hilo Cofrade</span>
          </div>
        </div>

        {items.length ? (
          <div className={styles.list}>
            {items.map((hermandad) => (
              <BrotherhoodDirectoryCard
                key={hermandad.id}
                hermandad={hermandad}
                contextLabel={contextLabel}
              />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <strong>Todavía no hay hermandades publicadas en este apartado</strong>
            <span>El directorio irá creciendo a medida que se documenten nuevas fichas.</span>
          </div>
        )}
      </div>
    </section>
  )
}
