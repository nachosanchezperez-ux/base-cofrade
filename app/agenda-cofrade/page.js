import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import RosaryDirectory from '@/components/RosaryDirectory'
import { absoluteUrl, breadcrumbJsonLd, collectionPageJsonLd, pageTitle, seoDescription } from '@/lib/seo'
import { getRosaryOutings } from '@/lib/supabase/rosary-outings'
import styles from './agenda-cofrade.module.css'

export const dynamic = 'force-dynamic'

const title = 'Agenda cofrade de Sevilla: rosarios públicos 2026'
const description = 'Consulta los próximos rosarios públicos de Sevilla y su provincia: fechas, horarios, imágenes o Simpecados, recorridos y Hermandades.'

export const metadata = {
  title,
  description,
  alternates: { canonical: '/agenda-cofrade' },
  openGraph: {
    title: pageTitle(title),
    description,
    url: '/agenda-cofrade',
  },
  twitter: {
    title: pageTitle(title),
    description,
  },
}

export default async function AgendaCofradePage() {
  const rosaries = await getRosaryOutings()
  const upcoming = rosaries.filter((item) => item.isUpcoming && !item.isCancelled)
  const capitalCount = upcoming.filter((item) => item.scope === 'capital').length
  const provinceCount = upcoming.filter((item) => item.scope === 'province').length
  const next = upcoming[0] || null

  return (
    <div className={styles.page}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Agenda Cofrade', path: '/agenda-cofrade' },
      ])} />
      <JsonLd data={collectionPageJsonLd({
        path: '/agenda-cofrade',
        name: pageTitle(title),
        description,
        items: upcoming.filter((item) => item.detailHref).map((item) => ({ name: item.title, path: item.detailHref })),
      })} />

      <header className={styles.hero}>
        <div className="shell">
          <nav className={styles.breadcrumb} aria-label="Migas de pan">
            <Link href="/">Inicio</Link><span>›</span><strong>Agenda Cofrade</strong>
          </nav>

          <div className={styles.heroGrid}>
            <div>
              <span className={styles.eyebrow}>Qué ver · Qué sale</span>
              <h1>Agenda Cofrade</h1>
              <p>Los rosarios públicos que recorren las calles de Sevilla y su provincia, presididos por una imagen o Simpecado.</p>
            </div>

            <div className={styles.nextCard}>
              <span>Próximo rosario</span>
              {next ? (
                <>
                  <strong>{next.dateInfo.weekdayLabel}</strong>
                  <Link href={next.detailHref}>{next.title}</Link>
                  <small>{next.municipality}{next.departureTime ? ` · ${next.departureTime} h` : ''}</small>
                </>
              ) : (
                <strong>Pendiente de nuevas convocatorias</strong>
              )}
            </div>
          </div>

          <div className={styles.heroStats}>
            <a href="#rosarios"><strong>{upcoming.length}</strong><span>próximos rosarios</span></a>
            <a href="#rosarios"><strong>{capitalCount}</strong><span>en Sevilla capital</span></a>
            <a href="#rosarios"><strong>{provinceCount}</strong><span>en la provincia</span></a>
          </div>
        </div>
      </header>

      <nav className={styles.agendaNav} aria-label="Secciones de la Agenda Cofrade">
        <div className="shell">
          <Link href="/extraordinarias">Extraordinarias</Link>
          <Link href="/procesiones-de-gloria">Glorias</Link>
          <a className={styles.current} href="#rosarios" aria-current="page">Rosarios</a>
          <Link href="/igualas-y-ensayos">Igualás y ensayos</Link>
        </div>
      </nav>

      <div className={`shell ${styles.content}`}>
        <RosaryDirectory outings={rosaries} />

        <section className={styles.seoCopy} aria-labelledby="agenda-sevilla">
          <span>Agenda actualizada</span>
          <h2 id="agenda-sevilla">Rosarios públicos en Sevilla y su provincia</h2>
          <p>{seoDescription('Hilo Cofrade reúne en una sola agenda los rosarios de la Aurora, matutinos, vespertinos y extraordinarios que salen a la calle con una imagen o Simpecado.')}</p>
        </section>
      </div>
    </div>
  )
}
