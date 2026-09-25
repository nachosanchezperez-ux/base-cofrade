import Link from 'next/link'
import AgendaCofradeNav from '@/components/AgendaCofradeNav'
import ContextAgendaSection from '@/components/ContextAgendaSection'
import DirectoryBreadcrumb from '@/components/DirectoryBreadcrumb'
import JsonLd from '@/components/JsonLd'
import { absoluteUrl, breadcrumbJsonLd, collectionPageJsonLd } from '@/lib/seo'
import styles from './MunicipalityAgendaHub.module.css'

export default function MunicipalityAgendaHub({ hub }) {
  const filteredAgendaHref = hub.slug === 'sevilla-capital'
    ? '/agenda-cofrade?territorio=capital#agenda'
    : `/agenda-cofrade?municipio=${hub.slug}#agenda`
  const brotherhoodDirectoryHref = hub.brotherhoods.length >= 3 ? `/hermandades/localidad/${hub.slug}` : ''
  const bandDirectoryHref = hub.bands.length ? `/bandas/localidad/${hub.slug}` : ''
  const path = `/agenda-cofrade/localidad/${hub.slug}`
  const description = `Próximos actos cofrades de ${hub.label}, relacionados con sus Hermandades, Bandas, Glorias, Extraordinarias e Igualás y ensayos.`

  return (
    <div className={styles.page}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Agenda Cofrade', path: '/agenda-cofrade' },
        { name: hub.label, path },
      ])} />
      <JsonLd data={collectionPageJsonLd({
        path,
        name: `Agenda cofrade de ${hub.label}`,
        description,
        items: hub.items.filter((item) => item.href).map((item) => ({ name: item.title, path: item.href })),
      })} />

      <section className={styles.hero}>
        <div className="shell">
          <DirectoryBreadcrumb items={[
            { label: 'Agenda Cofrade', href: '/agenda-cofrade' },
            { label: hub.label },
          ]} />
          <span>Agenda por localidad</span>
          <h1>Agenda cofrade de {hub.label}</h1>
          <p>{description}</p>
          <div className={styles.stats}>
            <strong><b>{hub.items.length}</b> próximas citas</strong>
            <strong><b>{hub.brotherhoods.length}</b> Hermandades</strong>
            <strong><b>{hub.bands.length}</b> Bandas</strong>
          </div>
        </div>
      </section>

      <AgendaCofradeNav activeSection="agenda" sticky={false} />

      <ContextAgendaSection
        id="proximas-citas"
        eyebrow={hub.label}
        title="Próximas citas"
        description={`Qué ver próximamente en ${hub.label}, reuniendo en una cronología común los calendarios públicos de Hilo Cofrade.`}
        items={hub.items}
        showMunicipality={false}
        maxItems={12}
        links={[
          { href: filteredAgendaHref, label: 'Abrir agenda completa filtrada' },
          ...(brotherhoodDirectoryHref ? [{ href: brotherhoodDirectoryHref, label: `Hermandades de ${hub.label}` }] : []),
          ...(bandDirectoryHref ? [{ href: bandDirectoryHref, label: `Bandas de ${hub.label}` }] : []),
        ]}
      />

      {(hub.brotherhoods.length || hub.bands.length) ? (
        <section className={styles.entities}>
          <div className="shell">
            <header><span>El mapa cofrade local</span><h2>Entidades de {hub.label}</h2><p>La agenda no termina en la fecha: continúa hacia las fichas que explican quién organiza, quién acompaña y qué relaciones existen.</p></header>
            <div className={styles.entityGrid}>
              {hub.brotherhoods.slice(0, 8).map((item) => (
                <Link href={`/hermandades/${item.slug}`} key={item.id}>
                  <small>Hermandad</small><strong>{item.nombrePopular || item.nombreOficial}</strong><span>Ver ficha →</span>
                </Link>
              ))}
              {hub.bands.slice(0, 8).map((item) => (
                <Link href={`/bandas/${item.slug}`} key={item.id}>
                  <small>Banda</small><strong>{item.popularName || item.officialName}</strong><span>Ver ficha →</span>
                </Link>
              ))}
            </div>
            <nav className={styles.directoryLinks}>
              {brotherhoodDirectoryHref ? <Link href={brotherhoodDirectoryHref}>Todas las Hermandades de {hub.label}</Link> : null}
              {bandDirectoryHref ? <Link href={bandDirectoryHref}>Todas las Bandas de {hub.label}</Link> : null}
              <Link href={filteredAgendaHref}>Agenda completa de {hub.label}</Link>
            </nav>
          </div>
        </section>
      ) : null}
    </div>
  )
}
