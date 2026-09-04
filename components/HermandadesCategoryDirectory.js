import Image from 'next/image'
import Link from 'next/link'
import BrotherhoodDirectoryCard from '@/components/BrotherhoodDirectoryCard'
import JsonLd from '@/components/JsonLd'
import {
  directoryContextLabel,
  directoryPath,
  directoryPeriod,
  directoryType,
  hasDirectoryType,
  localityLabel,
  sortBrotherhoods,
} from '@/lib/brotherhood-directory'
import { breadcrumbJsonLd, collectionPageJsonLd } from '@/lib/seo'
import styles from './HermandadesDirectory.module.css'

export default function HermandadesCategoryDirectory({ hermandades, typeKey }) {
  const config = directoryType(typeKey)
  const items = sortBrotherhoods(
    hermandades.filter((item) => hasDirectoryType(item, typeKey)),
    typeKey
  )
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
          <div className={styles.list}>
            {items.map((hermandad) => (
              <BrotherhoodDirectoryCard
                key={hermandad.id}
                hermandad={hermandad}
                contextLabel={directoryContextLabel(hermandad, typeKey)}
              />
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
