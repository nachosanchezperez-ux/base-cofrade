import Link from 'next/link'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import { getPublicMarchAuthorBySlug } from '@/lib/supabase/public-marches'
import { absoluteUrl, breadcrumbJsonLd, compactSeoTitle, socialMetadata } from '@/lib/seo'
import styles from '../../marchas.module.css'

export const revalidate = 900

function datedCount(marches = []) {
  return marches.filter((march) => march.compositionYear).length
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const author = await getPublicMarchAuthorBySlug(slug)
  if (!author) return { title: 'Compositor no encontrado', robots: { index: false, follow: false } }

  const title = compactSeoTitle(`${author.name} · Marchas procesionales`)
  const description = `${author.marches.length} ${author.marches.length === 1 ? 'marcha procesional documentada' : 'marchas procesionales documentadas'} de ${author.name} en Hilo Cofrade.`

  return {
    title,
    description,
    ...socialMetadata({ title, description, path: `/marchas/autores/${author.slug}` }),
  }
}

export default async function MarchAuthorPage({ params }) {
  const { slug } = await params
  const author = await getPublicMarchAuthorBySlug(slug)
  if (!author) notFound()

  const dated = datedCount(author.marches)
  const stylesCount = new Set(author.marches.map((march) => march.musicType).filter(Boolean)).size
  const canonicalPath = `/marchas/autores/${author.slug}`

  return (
    <div className={styles.page}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Marchas', path: '/marchas' },
        { name: author.name, path: canonicalPath },
      ])} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        '@id': `${absoluteUrl(canonicalPath)}#profile`,
        url: absoluteUrl(canonicalPath),
        name: `Marchas de ${author.name}`,
        mainEntity: {
          '@type': 'Person',
          name: author.name,
        },
      }} />

      <header className={styles.hero}>
        <div className={`shell ${styles.heroInner}`}>
          <nav className={styles.breadcrumb} aria-label="Migas de pan">
            <Link href="/">Inicio</Link><span>/</span><Link href="/marchas">Marchas</Link><span>/</span><strong>{author.name}</strong>
          </nav>
          <div className={styles.heroCopy}>
            <span>Compositor</span>
            <h1>{author.name}</h1>
            <p>{author.summary || 'Obras procesionales documentadas en Hilo Cofrade y enlazadas con sus fichas, dedicatorias, bandas, grabaciones y crucetas musicales.'}</p>
          </div>
          <dl className={styles.metrics}>
            <div><dt>Marchas publicadas</dt><dd>{author.marches.length}</dd></div>
            <div><dt>Con datación</dt><dd>{dated}</dd></div>
            <div><dt>Estilos documentados</dt><dd>{stylesCount}</dd></div>
          </dl>
        </div>
      </header>

      <section className={`shell ${styles.directory}`} aria-labelledby="obras-compositor">
        <header className={styles.directoryHeading}>
          <div><span>Archivo musical</span><h2 id="obras-compositor">Marchas documentadas</h2></div>
          <p>Desde cada obra puedes seguir el hilo hacia sus dedicatorias, interpretaciones, bandas, crucetas y registros discográficos.</p>
        </header>

        {author.marches.length ? (
          <div className={styles.groups}>
            <section className={styles.group}>
              <header><h3>Obras</h3><span>{author.marches.length}</span></header>
              <div className={styles.list}>
                {author.marches.map((march) => (
                  <Link className={styles.card} href={march.href} key={march.id}>
                    <span className={styles.cardCopy}>
                      <strong>{march.name}</strong>
                      <small>{march.workType || 'Marcha procesional'}</small>
                    </span>
                    <span className={styles.cardMeta}>
                      {march.compositionYear ? <time>{march.compositionYear}</time> : null}
                      <em>{march.musicType || 'Formación por documentar'}</em>
                    </span>
                    <b aria-hidden="true">→</b>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className={styles.empty}>
            <strong>No hay Marchas publicadas para este compositor.</strong>
            <p>La ficha del autor queda preparada para incorporar nuevas obras documentadas.</p>
          </div>
        )}
      </section>
    </div>
  )
}
