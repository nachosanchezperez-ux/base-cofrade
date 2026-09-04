import Image from 'next/image'
import Link from 'next/link'
import BrotherhoodDirectoryCard from '@/components/BrotherhoodDirectoryCard'
import JsonLd from '@/components/JsonLd'
import {
  directoryPath,
  directoryPeriod,
  directoryType,
  hasDirectoryType,
  localityLabel,
  sortBrotherhoods,
} from '@/lib/brotherhood-directory'
import { breadcrumbJsonLd, collectionPageJsonLd } from '@/lib/seo'
import styles from './HermandadesDirectory.module.css'

function groupSorted(items, getLabel) {
  return items.reduce((groups, item) => {
    const label = getLabel(item) || ''
    const previous = groups[groups.length - 1]

    if (previous?.label === label) {
      previous.items.push(item)
      return groups
    }

    groups.push({ label, items: [item] })
    return groups
  }, [])
}

function groupedDirectory(items, typeKey) {
  const capital = items.filter((item) => localityLabel(item) === 'Sevilla capital')
  const province = items.filter((item) => localityLabel(item) !== 'Sevilla capital')

  const localitiesFor = (source) => groupSorted(source, localityLabel).map((locality) => ({
    ...locality,
    periods: typeKey === 'sacramentales'
      ? [{ label: '', items: locality.items }]
      : groupSorted(locality.items, (item) => directoryPeriod(item, typeKey) || 'Sin fecha documentada'),
  }))

  return [
    capital.length ? {
      key: 'capital',
      label: 'Sevilla capital',
      items: capital,
      localities: localitiesFor(capital),
    } : null,
    province.length ? {
      key: 'provincia',
      label: 'Provincia de Sevilla',
      items: province,
      localities: localitiesFor(province),
    } : null,
  ].filter(Boolean)
}

export default function HermandadesCategoryDirectory({ hermandades, typeKey }) {
  const config = directoryType(typeKey)
  const items = sortBrotherhoods(
    hermandades.filter((item) => hasDirectoryType(item, typeKey)),
    typeKey
  )
  const groups = groupedDirectory(items, typeKey)
  const routes = [...new Map(items.map((item) => {
    const period = directoryPeriod(item, typeKey)
    const label = [localityLabel(item), period].filter(Boolean).join(' · ')
    const href = directoryPath(item, typeKey)
    return [href, { href, label }]
  }).filter(([href]) => Boolean(href))).values()]
  const pageName = `${config.label} de Sevilla y provincia`

  return (
    <section className={`section page-top ${styles.routePage}`}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Hermandades', path: '/hermandades' },
        { name: config.label, path: config.href },
      ])} />
      <JsonLd data={collectionPageJsonLd({
        path: config.href,
        name: pageName,
        description: config.description,
        items: items.map((hermandad) => ({
          name: hermandad.nombrePopular,
          path: `/hermandades/${hermandad.slug}`,
        })),
      })} />

      <div className="shell">
        <nav className={styles.breadcrumbs} aria-label="Migas de pan">
          <Link href="/hermandades">Hermandades</Link>
          <span><span aria-hidden="true">/</span><strong>{config.label}</strong></span>
        </nav>

        <div className={styles.categoryHeading}>
          <div>
            <span className="eyebrow">Directorio de hermandades</span>
            <h1 className="page-title">{config.label}</h1>
            <p className="page-lead">{config.description}</p>
          </div>
          <span className={styles.categoryHeroIcon} aria-hidden="true">
            <Image src={config.icon} alt="" width={112} height={112} sizes="112px" />
          </span>
        </div>

        {routes.length ? (
          <div className={styles.routeLinks}>
            {routes.map((route) => (
              <Link href={route.href} key={route.href}>
                <span>{route.label}</span>
                <strong>Explorar <span aria-hidden="true">→</span></strong>
              </Link>
            ))}
          </div>
        ) : null}

        <div className={styles.resultHead}>
          <div>
            <strong>{items.length} {items.length === 1 ? 'hermandad' : 'hermandades'}</strong>
            <span>Sevilla capital y provincia</span>
          </div>
        </div>

        {items.length ? (
          <div className={styles.groupedDirectory}>
            {groups.map((territory) => (
              <section className={styles.territoryBlock} key={territory.key}>
                <header className={styles.territoryHeading}>
                  <div>
                    <span>Territorio</span>
                    <h2>{territory.label}</h2>
                  </div>
                  <strong>{territory.items.length} {territory.items.length === 1 ? 'hermandad' : 'hermandades'}</strong>
                </header>

                <div className={styles.localityStack}>
                  {territory.localities.map((locality) => (
                    <section className={styles.localityBlock} key={`${territory.key}-${locality.label}`}>
                      {territory.key === 'provincia' ? (
                        <header className={styles.localityHeading}>
                          <h3>{locality.label}</h3>
                          <span>{locality.items.length} {locality.items.length === 1 ? 'hermandad' : 'hermandades'}</span>
                        </header>
                      ) : null}

                      <div className={styles.periodStack}>
                        {locality.periods.map((period) => (
                          <section className={styles.periodBlock} key={`${territory.key}-${locality.label}-${period.label || 'general'}`}>
                            {period.label ? (
                              <header className={styles.periodHeading}>
                                <h4>{period.label}</h4>
                                <span>{period.items.length}</span>
                              </header>
                            ) : null}

                            <div className={styles.list}>
                              {period.items.map((hermandad) => (
                                <BrotherhoodDirectoryCard
                                  key={hermandad.id}
                                  hermandad={hermandad}
                                />
                              ))}
                            </div>
                          </section>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <strong>Todavía no hay fichas publicadas en esta categoría</strong>
            <span>Solo se mostrarán hermandades cuya clasificación esté expresamente documentada.</span>
          </div>
        )}
      </div>
    </section>
  )
}
