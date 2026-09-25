import Link from 'next/link'
import BrotherhoodDirectoryCard from '@/components/BrotherhoodDirectoryCard'
import DirectoryBreadcrumb from '@/components/DirectoryBreadcrumb'
import JsonLd from '@/components/JsonLd'
import { sortBrotherhoods } from '@/lib/brotherhood-directory'
import { breadcrumbJsonLd, collectionPageJsonLd } from '@/lib/seo'
import styles from './HermandadesDirectory.module.css'

export default function DirectoryRoutePage({
  eyebrow,
  title,
  description,
  hermandades,
  path,
  breadcrumbs = [],
  contextLabel,
  itemSingular = 'hermandad',
  itemPlural = 'hermandades',
  relatedAgendaHref = '',
}) {
  const items = sortBrotherhoods(hermandades)
  const linkedBreadcrumbs = breadcrumbs
    .filter((item) => Boolean(item.href))
    .map((item) => ({ name: item.label, path: item.href }))
  const visualBreadcrumbs = [
    { label: 'Hermandades', href: '/hermandades' },
    ...breadcrumbs,
  ]

  return (
    <section className={`section page-top ${styles.routePage}`}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Hermandades', path: '/hermandades' },
        ...linkedBreadcrumbs,
        { name: title, path },
      ])} />
      <JsonLd data={collectionPageJsonLd({
        path,
        name: title,
        description,
        items: items.map((hermandad) => ({
          name: hermandad.nombrePopular,
          path: `/hermandades/${hermandad.slug}`,
        })),
      })} />

      <div className="shell">
        <DirectoryBreadcrumb items={visualBreadcrumbs} />

        <span className="eyebrow">{eyebrow}</span>
        <h1 className="page-title">{title}</h1>
        <p className="page-lead">{description}</p>
        {relatedAgendaHref ? (
          <Link href={relatedAgendaHref} style={{ display: 'inline-flex', marginTop: 14, color: '#a71931', fontSize: 12, fontWeight: 850 }}>
            Ver agenda cofrade de {contextLabel || breadcrumbs.at(-1)?.label || 'esta localidad'} →
          </Link>
        ) : null}

        <div className={styles.resultHead} style={{ marginTop: 34 }}>
          <div>
            <strong>{items.length} {items.length === 1 ? itemSingular : itemPlural}</strong>
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
            <strong>Todavía no hay corporaciones publicadas en este apartado</strong>
            <span>El directorio irá creciendo a medida que se documenten nuevas fichas.</span>
          </div>
        )}
      </div>
    </section>
  )
}
