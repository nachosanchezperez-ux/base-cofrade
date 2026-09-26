import { connection } from 'next/server'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import { absoluteUrl, breadcrumbJsonLd, socialMetadata } from '@/lib/seo'
import { getPublicMarchDirectory } from '@/lib/supabase/public-directory-cache'
import styles from './marchas.module.css'

export const revalidate = 900

const title = 'Marchas procesionales: obras y compositores'
const description = 'Directorio de marchas procesionales documentadas en Hilo Cofrade: compositores, fechas, formaciones musicales, grabaciones y presencia en crucetas.'

export async function generateMetadata({ searchParams } = {}) {
  const params = await searchParams
  const page = pageNumber(params?.pagina)
  return {
    title,
    description,
    ...socialMetadata({ title, description, path: '/marchas' }),
    ...(page > 1 ? { robots: { index: false, follow: true } } : {}),
  }
}

const PAGE_SIZE = 120

function pageNumber(value) {
  const parsed = Number.parseInt(String(value || '1'), 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

function pageHref(page) {
  return page <= 1 ? '/marchas' : `/marchas?pagina=${page}`
}

const marchTitleCollator = new Intl.Collator('es', {
  sensitivity: 'base',
  ignorePunctuation: true,
  numeric: true,
})

function compareMarchTitles(a, b) {
  const byName = marchTitleCollator.compare(String(a?.name || ''), String(b?.name || ''))
  if (byName) return byName
  return String(a?.id || '').localeCompare(String(b?.id || ''))
}

function initialFor(value) {
  const initial = String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .match(/[a-z]/i)?.[0]
    ?.toUpperCase()
  return initial || '#'
}

function groupsFor(marches) {
  const groups = new Map()

  for (const march of [...marches].sort(compareMarchTitles)) {
    const initial = initialFor(march.name)
    const current = groups.get(initial) || []
    current.push(march)
    groups.set(initial, current)
  }

  return [...groups.entries()]
    .sort(([initialA], [initialB]) => {
      if (initialA === '#') return 1
      if (initialB === '#') return -1
      return marchTitleCollator.compare(initialA, initialB)
    })
    .map(([initial, items]) => ({ initial, items }))
}

function authorLabel(march) {
  const names = [...new Set(march.authors.map((author) => author.name).filter(Boolean))]
  if (!names.length) return 'Autoría por documentar'
  if (names.length <= 2) return names.join(' · ')
  return `${names.slice(0, 2).join(' · ')} · +${names.length - 2}`
}

export default async function MarchesDirectoryPage({ searchParams } = {}) {
  await connection()
  const params = await searchParams
  const marches = [...await getPublicMarchDirectory()].sort(compareMarchTitles)
  const totalPages = Math.max(1, Math.ceil(marches.length / PAGE_SIZE))
  const page = Math.min(pageNumber(params?.pagina), totalPages)
  const pageItems = marches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const groups = groupsFor(pageItems)
  const authored = marches.filter((march) => march.authors.length).length
  const dated = marches.filter((march) => march.compositionYear).length

  return (
    <div className={styles.page}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Marchas', path: '/marchas' },
      ])} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${absoluteUrl('/marchas')}#collection`,
        url: absoluteUrl('/marchas'),
        name: title,
        description,
        inLanguage: 'es',
        isPartOf: { '@id': `${absoluteUrl('/')}#website` },
        mainEntity: { '@type': 'ItemList', numberOfItems: marches.length },
      }} />

      <header className={styles.hero}>
        <div className={`shell ${styles.heroInner}`}>
          <nav className={styles.breadcrumb} aria-label="Migas de pan">
            <Link href="/">Inicio</Link><span>/</span><strong>Marchas</strong>
          </nav>
          <div className={styles.heroCopy}>
            <span>Archivo musical</span>
            <h1>Marchas procesionales</h1>
            <p>Un recorrido alfabético por las obras documentadas en Hilo Cofrade, enlazadas con sus autores, bandas, dedicatorias, grabaciones y crucetas musicales.</p>
          </div>
          <dl className={styles.metrics}>
            <div><dt>Obras publicadas</dt><dd>{marches.length}</dd></div>
            <div><dt>Con autoría</dt><dd>{authored}</dd></div>
            <div><dt>Con datación</dt><dd>{dated}</dd></div>
          </dl>
        </div>
      </header>

      <section className={`shell ${styles.directory}`} aria-labelledby="archivo-marchas">
        <header className={styles.directoryHeading}>
          <div><span>Índice público</span><h2 id="archivo-marchas">Todas las marchas</h2></div>
          <p>Cada título abre su ficha musical y continúa el hilo hacia las procesiones donde aparece documentado. Página {page} de {totalPages}.</p>
        </header>

        {groups.length ? (
          <>
            <nav className={styles.alphabet} aria-label="Índice alfabético de Marchas">
              {groups.map((group) => <a href={`#letra-${group.initial.toLowerCase()}`} key={group.initial}>{group.initial}</a>)}
            </nav>
            <div className={styles.groups}>
              {groups.map((group) => (
                <section className={styles.group} id={`letra-${group.initial.toLowerCase()}`} key={group.initial} aria-labelledby={`titulo-${group.initial.toLowerCase()}`}>
                  <header><h3 id={`titulo-${group.initial.toLowerCase()}`}>{group.initial}</h3><span>{group.items.length}</span></header>
                  <div className={styles.list}>
                    {group.items.map((march) => (
                      <Link className={styles.card} href={march.href} key={march.id}>
                        <span className={styles.cardCopy}>
                          <strong>{march.name}</strong>
                          <small>{authorLabel(march)}</small>
                        </span>
                        <span className={styles.cardMeta}>
                          {march.compositionYear ? <time>{march.compositionYear}</time> : null}
                          <em>{march.musicType || march.workType}</em>
                        </span>
                        <b aria-hidden="true">→</b>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
            {totalPages > 1 ? (
              <nav className={styles.pagination} aria-label="Páginas del directorio de Marchas">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
                  <Link
                    href={pageHref(number)}
                    key={number}
                    aria-current={number === page ? 'page' : undefined}
                  >
                    {number}
                  </Link>
                ))}
              </nav>
            ) : null}
          </>
        ) : (
          <div className={styles.empty}><strong>El archivo musical no está disponible ahora mismo.</strong><p>Las fichas individuales continúan accesibles desde la búsqueda y las crucetas.</p></div>
        )}
      </section>
    </div>
  )
}
