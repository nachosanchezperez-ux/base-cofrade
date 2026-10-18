import Link from 'next/link'
import BrotherhoodDirectoryCard from '@/components/BrotherhoodDirectoryCard'
import DirectoryBreadcrumb from '@/components/DirectoryBreadcrumb'
import JsonLd from '@/components/JsonLd'
import { sortBrotherhoods } from '@/lib/brotherhood-directory'
import { absoluteUrl, breadcrumbJsonLd, collectionPageJsonLd, municipalityPlaceJsonLd } from '@/lib/seo'
import styles from './HermandadesDirectory.module.css'

const GROUP_SORT_KEY = { penitencia: 'semana-santa', gloria: 'gloria' }

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
  relatedAgendaLabel = '',
  lead = '',
  // Grupos opcionales con encabezado H2 ({ key, heading, items }).
  groups = [],
  // Municipio de la página ({ path, name }): mismo nodo Place que su guía local.
  place = null,
}) {
  const items = sortBrotherhoods(hermandades)
  const linkedBreadcrumbs = breadcrumbs
    .filter((item) => Boolean(item.href))
    .map((item) => ({ name: item.label, path: item.href }))
  const placeJsonLd = place?.path && place?.name ? municipalityPlaceJsonLd(place) : null
  const placeRef = placeJsonLd ? { '@id': `${absoluteUrl(place.path)}#place` } : null
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
      {placeJsonLd ? <JsonLd data={placeJsonLd} /> : null}
      <JsonLd data={collectionPageJsonLd({
        path,
        name: title,
        description,
        items: items.map((hermandad) => ({
          name: hermandad.nombrePopular,
          path: `/hermandades/${hermandad.slug}`,
        })),
        about: placeRef,
        spatialCoverage: placeRef,
      })} />

      <div className="shell">
        <DirectoryBreadcrumb items={visualBreadcrumbs} />

        <span className="eyebrow">{eyebrow}</span>
        <h1 className="page-title">{title}</h1>
        <p className="page-lead">{lead || description}</p>
        {relatedAgendaHref ? (
          <Link href={relatedAgendaHref} style={{ display: 'inline-flex', marginTop: 14, color: '#a71931', fontSize: 12, fontWeight: 850 }}>
            {relatedAgendaLabel || `Ver agenda cofrade de ${contextLabel || breadcrumbs.at(-1)?.label || 'esta localidad'} →`}
          </Link>
        ) : null}

        <div className={styles.resultHead} style={{ marginTop: 34 }}>
          <div>
            <strong>{items.length} {items.length === 1 ? itemSingular : itemPlural}</strong>
            <span>Fichas publicadas en Hilo Cofrade</span>
          </div>
        </div>

        {items.length && groups.length ? (
          <div className={styles.kindGroups}>
            {groups.map((group) => (
              <section className={styles.kindGroup} key={group.key} aria-labelledby={`grupo-${group.key}`}>
                <h2 id={`grupo-${group.key}`} className={styles.kindHeading}>
                  {group.heading}{contextLabel ? ` de ${contextLabel}` : ''}
                  {/* Separador solo para lectores y buscadores: antes se leía «…de Utrera10». */}
                  <span className="sr-only"> · </span>
                  <span>{group.items.length}</span>
                </h2>
                <div className={styles.list}>
                  {sortBrotherhoods(group.items, GROUP_SORT_KEY[group.key] || '').map((hermandad) => (
                    <BrotherhoodDirectoryCard
                      key={hermandad.id}
                      hermandad={hermandad}
                      contextLabel={contextLabel}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : items.length ? (
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
