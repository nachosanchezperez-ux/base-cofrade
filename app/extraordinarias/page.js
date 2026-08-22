import ExtraordinaryDirectory from '@/components/ExtraordinaryDirectory'
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
      path: outing.anchorHref,
    })),
  })

  return (
    <section className="section page-top">
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Extraordinarias', path: '/extraordinarias' },
      ])} />
      <JsonLd data={directoryJsonLd} />

      <div className="shell">
        <span className="eyebrow">Agenda cofrade</span>
        <h1 className="page-title">Extraordinarias</h1>
        <p className="page-lead">
          Las próximas salidas extraordinarias de Sevilla capital y su provincia, ordenadas para consultar rápido y conectadas con los datos ya documentados en Hilo Cofrade.
        </p>

        <ExtraordinaryDirectory outings={outings} />
      </div>
    </section>
  )
}
