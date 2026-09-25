import Image from 'next/image'
import Link from 'next/link'
import AgendaCofradeNav from '@/components/AgendaCofradeNav'
import ContextAgendaSection from '@/components/ContextAgendaSection'
import DirectoryBreadcrumb from '@/components/DirectoryBreadcrumb'
import JsonLd from '@/components/JsonLd'
import { breadcrumbJsonLd, collectionPageJsonLd } from '@/lib/seo'
import styles from './MunicipalityAgendaHub.module.css'

function EntityGroup({ label, items, hrefFor, nameFor, directoryHref = '' }) {
  if (!items.length) return null

  return (
    <section className={styles.entityGroup}>
      <header>
        <div><span>{label}</span><strong>{items.length}</strong></div>
        {directoryHref ? <Link href={directoryHref}>Ver directorio →</Link> : null}
      </header>
      <div className={styles.entityGrid}>
        {items.slice(0, 6).map((item) => (
          <Link href={hrefFor(item)} key={item.id}>
            <small>{label.slice(0, -1) || label}</small>
            <strong>{nameFor(item)}</strong>
            <span>Ver ficha →</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

function HeritageCard({ item, kind }) {
  return (
    <Link className={styles.heritageCard} href={item.href}>
      <div className={styles.heritageVisual}>
        {item.coverPath ? (
          <Image
            src={item.coverPath}
            alt={item.coverAlt || item.name}
            fill
            sizes="(max-width: 560px) 34vw, (max-width: 900px) 24vw, 180px"
          />
        ) : <span aria-hidden="true">{kind === 'image' ? 'IMG' : 'PAS'}</span>}
      </div>
      <div>
        <small>{kind === 'image' ? item.type || 'Imagen' : item.type || 'Paso'}</small>
        <strong>{item.name}</strong>
        {item.brotherhoodName ? <span>{item.brotherhoodName}</span> : null}
      </div>
    </Link>
  )
}

export default function MunicipalityAgendaHub({ hub }) {
  const filteredAgendaHref = hub.slug === 'sevilla-capital'
    ? '/agenda-cofrade?territorio=capital#agenda'
    : `/agenda-cofrade?municipio=${hub.slug}#agenda`
  const todayHref = hub.slug === 'sevilla-capital'
    ? '/agenda-cofrade?territorio=capital&periodo=today#agenda'
    : `/agenda-cofrade?municipio=${hub.slug}&periodo=today#agenda`
  const weekendHref = hub.slug === 'sevilla-capital'
    ? '/agenda-cofrade?territorio=capital&periodo=weekend#agenda'
    : `/agenda-cofrade?municipio=${hub.slug}&periodo=weekend#agenda`

  const brotherhoodDirectoryHref = hub.brotherhoods.length >= 3
    ? `/hermandades/localidad/${hub.brotherhoodDirectorySlug}`
    : ''
  const bandDirectoryHref = hub.bands.length
    ? `/bandas/localidad/${hub.bandDirectorySlug}`
    : ''
  const imageDirectoryHref = hub.images.length >= 3
    ? `/imagenes/localidad/${hub.imageDirectorySlug}`
    : ''
  const stepDirectoryHref = hub.steps.length >= 3
    ? `/pasos/localidad/${hub.stepDirectorySlug}`
    : ''

  const path = `/agenda-cofrade/localidad/${hub.slug}`
  const description = `Agenda cofrade de ${hub.label}: próximas citas, Hermandades, Bandas, Imágenes y Pasos conectados en una única guía local.`
  const structuredItems = [
    ...hub.items.filter((item) => item.href).map((item) => ({ name: item.title, path: item.href })),
    ...hub.brotherhoods.slice(0, 12).map((item) => ({ name: item.nombrePopular || item.nombreOficial, path: `/hermandades/${item.slug}` })),
    ...hub.bands.slice(0, 12).map((item) => ({ name: item.popularName || item.officialName, path: `/bandas/${item.slug}` })),
    ...hub.images.slice(0, 8).map((item) => ({ name: item.name, path: item.href })),
    ...hub.steps.slice(0, 8).map((item) => ({ name: item.name, path: item.href })),
  ]

  const calendarCards = [
    { key: 'agenda', label: 'Agenda Cofrade', count: hub.calendarCounts.agenda, href: filteredAgendaHref, copy: 'Cultos, rosarios, procesiones y conciertos.' },
    { key: 'glories', label: 'Glorias', count: hub.calendarCounts.glories, href: '/procesiones-de-gloria', copy: 'Salidas de Gloria documentadas.' },
    { key: 'extraordinary', label: 'Extraordinarias', count: hub.calendarCounts.extraordinary, href: '/extraordinarias', copy: 'Traslados y salidas extraordinarias.' },
    { key: 'crew', label: 'Igualás y ensayos', count: hub.calendarCounts.crew, href: '/igualas-y-ensayos', copy: 'Convocatorias de cuadrilla publicadas.' },
  ]

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
        items: structuredItems,
      })} />

      <section className={styles.hero}>
        <div className="shell">
          <DirectoryBreadcrumb items={[
            { label: 'Agenda Cofrade', href: '/agenda-cofrade' },
            { label: hub.label },
          ]} />
          <span>Guía cofrade local</span>
          <h1>Agenda cofrade de {hub.label}</h1>
          <p>{description}</p>

          <nav className={styles.quickActions} aria-label={`Qué ver en ${hub.label}`}>
            <Link href={todayHref}><small>Ahora</small><strong>Qué ver hoy</strong><span>→</span></Link>
            <Link href={weekendHref}><small>Planifica</small><strong>Este fin de semana</strong><span>→</span></Link>
            <Link href={filteredAgendaHref}><small>Calendario</small><strong>Próximos actos</strong><span>→</span></Link>
          </nav>

          <div className={styles.stats}>
            <strong><b>{hub.items.length}</b> próximas citas</strong>
            <strong><b>{hub.brotherhoods.length}</b> Hermandades</strong>
            <strong><b>{hub.bands.length}</b> Bandas</strong>
            <strong><b>{hub.images.length}</b> Imágenes</strong>
            <strong><b>{hub.steps.length}</b> Pasos</strong>
          </div>
        </div>
      </section>

      <AgendaCofradeNav activeSection="agenda" sticky={false} />

      <section className={styles.calendars}>
        <div className="shell">
          <header className={styles.sectionHeading}>
            <span>Todo conectado</span>
            <h2>La agenda de {hub.label}, por ámbitos</h2>
            <p>Los cuatro calendarios públicos siguen separados editorialmente, pero comparten una misma puerta territorial.</p>
          </header>
          <div className={styles.calendarGrid}>
            {calendarCards.map((item) => (
              <Link href={item.href} key={item.key}>
                <span>{item.label}</span>
                <strong>{item.count}</strong>
                <p>{item.copy}</p>
                <small>Explorar →</small>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {hub.items.length ? (
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
      ) : (
        <section className={styles.noAgenda} id="proximas-citas">
          <div className="shell">
            <span>Agenda abierta</span>
            <h2>Sin próximas citas publicadas por ahora</h2>
            <p>La guía de {hub.label} sigue disponible a través de sus entidades y patrimonio. Cuando se publique una nueva cita documentada aparecerá aquí automáticamente.</p>
            <Link href={filteredAgendaHref}>Consultar Agenda Cofrade →</Link>
          </div>
        </section>
      )}

      {(hub.brotherhoods.length || hub.bands.length) ? (
        <section className={styles.entities}>
          <div className="shell">
            <header className={styles.sectionHeading}>
              <span>El mapa cofrade local</span>
              <h2>Hermandades y Bandas de {hub.label}</h2>
              <p>Desde cada fecha se puede continuar hacia las entidades que organizan, acompañan y sostienen la vida cofrade del municipio.</p>
            </header>

            <div className={styles.entityGroups}>
              <EntityGroup
                label="Hermandades"
                items={hub.brotherhoods}
                hrefFor={(item) => `/hermandades/${item.slug}`}
                nameFor={(item) => item.nombrePopular || item.nombreOficial}
                directoryHref={brotherhoodDirectoryHref}
              />
              <EntityGroup
                label="Bandas"
                items={hub.bands}
                hrefFor={(item) => `/bandas/${item.slug}`}
                nameFor={(item) => item.popularName || item.officialName}
                directoryHref={bandDirectoryHref}
              />
            </div>
          </div>
        </section>
      ) : null}

      {(hub.images.length || hub.steps.length) ? (
        <section className={styles.heritage}>
          <div className="shell">
            <header className={styles.sectionHeading}>
              <span>Patrimonio cofrade</span>
              <h2>Imágenes y Pasos de {hub.label}</h2>
              <p>La guía territorial continúa por el patrimonio documentado, enlazando titulares, pasos procesionales, Hermandades y autorías.</p>
            </header>

            <div className={styles.heritageGroups}>
              {hub.images.length ? (
                <section>
                  <div className={styles.groupTitle}>
                    <div><span>Imágenes</span><strong>{hub.images.length}</strong></div>
                    {imageDirectoryHref ? <Link href={imageDirectoryHref}>Ver todas →</Link> : <Link href="/imagenes">Explorar Imágenes →</Link>}
                  </div>
                  <div className={styles.heritageGrid}>
                    {hub.images.slice(0, 4).map((item) => <HeritageCard item={item} kind="image" key={item.id} />)}
                  </div>
                </section>
              ) : null}

              {hub.steps.length ? (
                <section>
                  <div className={styles.groupTitle}>
                    <div><span>Pasos</span><strong>{hub.steps.length}</strong></div>
                    {stepDirectoryHref ? <Link href={stepDirectoryHref}>Ver todos →</Link> : <Link href="/pasos">Explorar Pasos →</Link>}
                  </div>
                  <div className={styles.heritageGrid}>
                    {hub.steps.slice(0, 4).map((item) => <HeritageCard item={item} kind="step" key={item.id} />)}
                  </div>
                </section>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <section className={styles.footerLinks}>
        <div className="shell">
          <span>Seguir explorando {hub.label}</span>
          <nav>
            <Link href={filteredAgendaHref}>Agenda completa</Link>
            {brotherhoodDirectoryHref ? <Link href={brotherhoodDirectoryHref}>Hermandades</Link> : null}
            {bandDirectoryHref ? <Link href={bandDirectoryHref}>Bandas</Link> : null}
            {imageDirectoryHref ? <Link href={imageDirectoryHref}>Imágenes</Link> : null}
            {stepDirectoryHref ? <Link href={stepDirectoryHref}>Pasos</Link> : null}
          </nav>
        </div>
      </section>
    </div>
  )
}
