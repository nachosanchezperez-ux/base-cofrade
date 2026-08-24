import ExtraordinaryDirectory from '@/components/ExtraordinaryDirectory'
import styles from '@/components/ExtraordinaryDirectory.module.css'
import JsonLd from '@/components/JsonLd'
import { getExtraordinaryDirectory } from '@/lib/supabase/extraordinary-directory'
import { breadcrumbJsonLd, collectionPageJsonLd, pageTitle } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const description = 'Consulta las próximas salidas extraordinarias de Sevilla capital y provincia, con fecha, motivo, localidad, horarios y datos documentados en Hilo Cofrade.'

export const metadata = {
  title: 'Extraordinarias de Sevilla y provincia',
  description,
  alternates: {
    canonical: '/extraordinarias',
  },
  openGraph: {
    title: pageTitle('Extraordinarias de Sevilla y provincia'),
    description,
    url: '/extraordinarias',
  },
  twitter: {
    title: pageTitle('Extraordinarias de Sevilla y provincia'),
    description,
  },
}

export default async function ExtraordinariasPage() {
  const outings = await getExtraordinaryDirectory()
  const visibleOutings = outings.filter((item) => !item.isCancelled)
  const directoryJsonLd = collectionPageJsonLd({
    path: '/extraordinarias',
    name: 'Extraordinarias de Sevilla y provincia',
    description,
    items: visibleOutings.map((outing) => ({
      name: `${outing.title} · ${outing.municipality}`,
      path: outing.slug ? `/extraordinarias/${outing.slug}` : outing.anchorHref,
    })),
  })

  return (
    <section className={`section page-top ${styles.page}`}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Extraordinarias', path: '/extraordinarias' },
      ])} />
      <JsonLd data={directoryJsonLd} />

      <div className="shell">
        <header className={styles.pageIntro}>
          <div>
            <span className="eyebrow">Sevilla y provincia</span>
            <h1>Extraordinarias</h1>
          </div>
          <p>
            Qué viene, cuándo sale y qué música llevará. Una agenda rápida para consultar las extraordinarias documentadas en Hilo Cofrade.
          </p>
        </header>

        <ExtraordinaryDirectory outings={outings} />
      </div>
    </section>
  )
}
