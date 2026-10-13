import { connection } from 'next/server'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import SiteBreadcrumb from '@/components/SiteBreadcrumb'
import { absoluteUrl, breadcrumbJsonLd, socialMetadata } from '@/lib/seo'
import { getPublicMarchDirectory } from '@/lib/supabase/public-directory-cache'
import styles from './marchas.module.css'

export const revalidate = 900

const title = 'Marchas procesionales: obras y compositores'
const description = 'Directorio de marchas procesionales documentadas en Hilo Cofrade: compositores, fechas, formaciones musicales, grabaciones y presencia en crucetas.'
const PAGE_SIZE = 120
const RECENT_DAYS = 7
const FILTERS = new Set(['all', 'recent', 'authored', 'dated'])

export async function generateMetadata({ searchParams } = {}) {
  const params = await searchParams
  const page = pageNumber(params?.pagina)
  const filtered = Boolean(
    String(params?.q || '').trim()
    || String(params?.letra || '').trim()
    || String(params?.decada || '').trim()
    || (params?.filtro && params.filtro !== 'all')
  )

  return {
    title,
    description,
    ...socialMetadata({ title, description, path: '/marchas' }),
    ...(page > 1 || filtered ? { robots: { index: false, follow: true } } : {}),
  }
}

function pageNumber(value) {
  const parsed = Number.parseInt(String(value || '1'), 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
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

function normalizeSearch(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .trim()
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

function numericYear(value) {
  const match = String(value || '').match(/(?:18|19|20)\d{2}/)
  return match ? Number(match[0]) : null
}

function decadeFor(value) {
  const year = numericYear(value)
  return year ? Math.floor(year / 10) * 10 : null
}

function timestamp(value) {
  const parsed = value ? new Date(value).getTime() : 0
  return Number.isFinite(parsed) ? parsed : 0
}

function recentCutoff() {
  return Date.now() - (RECENT_DAYS * 24 * 60 * 60 * 1000)
}

function matchesQuery(march, query) {
  if (!query) return true
  const haystack = normalizeSearch([
    march.name,
    march.workType,
    march.musicType,
    ...march.authors.map((author) => author.name),
  ].filter(Boolean).join(' '))
  return haystack.includes(normalizeSearch(query))
}

function filterLabel(value) {
  if (value === 'recent') return 'Nuevas incorporaciones'
  if (value === 'authored') return 'Con autoría'
  if (value === 'dated') return 'Con fecha'
  return 'Todas'
}

function applyMode(marches, mode) {
  if (mode === 'recent') {
    const cutoff = recentCutoff()
    return marches.filter((march) => timestamp(march.createdAt) >= cutoff)
  }
  if (mode === 'authored') return marches.filter((march) => march.authors.length)
  if (mode === 'dated') return marches.filter((march) => Boolean(numericYear(march.compositionYear)))
  return marches
}

function directoryHref({ page = 1, query = '', letter = '', decade = '', filter = 'all' } = {}) {
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  if (letter) params.set('letra', letter)
  if (decade) params.set('decada', String(decade))
  if (filter && filter !== 'all') params.set('filtro', filter)
  if (page > 1) params.set('pagina', String(page))
  const suffix = params.toString()
  return suffix ? `/marchas?${suffix}` : '/marchas'
}

function shortDate(value) {
  const parsed = timestamp(value)
  if (!parsed) return ''
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    timeZone: 'Europe/Madrid',
  }).format(new Date(parsed)).replace('.', '')
}

export default async function MarchesDirectoryPage({ searchParams } = {}) {
  await connection()
  const params = await searchParams
  const marches = [...await getPublicMarchDirectory()].sort(compareMarchTitles)

  const query = String(params?.q || '').trim()
  const requestedLetter = String(params?.letra || '').trim().toUpperCase()
  const requestedDecade = Number.parseInt(String(params?.decada || ''), 10)
  const decade = Number.isFinite(requestedDecade) ? requestedDecade : ''
  const filter = FILTERS.has(String(params?.filtro || 'all')) ? String(params?.filtro || 'all') : 'all'

  const authored = marches.filter((march) => march.authors.length).length
  const dated = marches.filter((march) => Boolean(numericYear(march.compositionYear))).length
  const recent = applyMode(marches, 'recent').length

  const availableDecades = [...new Set(
    marches.map((march) => decadeFor(march.compositionYear)).filter(Boolean)
  )].sort((a, b) => b - a)

  const modeItems = applyMode(marches, filter)
  const queryItems = modeItems.filter((march) => matchesQuery(march, query))
  const decadeItems = decade
    ? queryItems.filter((march) => decadeFor(march.compositionYear) === decade)
    : queryItems

  const initialGroups = groupsFor(decadeItems)
  const availableInitials = initialGroups.map((group) => group.initial)
  const letter = availableInitials.includes(requestedLetter) ? requestedLetter : ''
  const filteredItems = letter
    ? decadeItems.filter((march) => initialFor(march.name) === letter)
    : decadeItems

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE))
  const page = Math.min(pageNumber(params?.pagina), totalPages)
  const pageItems = filteredItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const groups = groupsFor(pageItems)
  const hasFilters = Boolean(query || letter || decade || filter !== 'all')

  const filterCards = [
    { key: 'all', label: 'Todas', count: marches.length },
    { key: 'recent', label: 'Nuevas', count: recent },
    { key: 'authored', label: 'Con autoría', count: authored },
    { key: 'dated', label: 'Con fecha', count: dated },
  ]

  const newest = [...marches]
    .filter((march) => march.createdAt)
    .sort((a, b) => timestamp(b.createdAt) - timestamp(a.createdAt))
    .slice(0, 4)

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
          <SiteBreadcrumb
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Marchas' },
            ]}
            tone="dark"
            showAccent={false}
          />
          <div className={styles.heroCopy}>
            <span>Archivo musical</span>
            <h1>Marchas procesionales</h1>
            <p>Busca una obra por título o compositor, entra por letra o acota el archivo por época. Cada ficha continúa el hilo hacia autores, bandas, dedicatorias, grabaciones y crucetas.</p>
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
          <div><span>Explora el archivo</span><h2 id="archivo-marchas">Encuentra una marcha</h2></div>
          <p>Empieza escribiendo un título o compositor. También puedes entrar por letra, década o estado documental.</p>
        </header>

        <section className={styles.finder} aria-label="Buscar y filtrar Marchas">
          <form className={styles.searchForm} action="/marchas" method="get">
            {filter !== 'all' ? <input type="hidden" name="filtro" value={filter} /> : null}
            <label className={styles.searchField}>
              <span>Buscar</span>
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Ej. Amarguras, Font de Anta, Macarena…"
                autoComplete="off"
              />
            </label>
            <label className={styles.decadeField}>
              <span>Época</span>
              <select name="decada" defaultValue={decade || ''}>
                <option value="">Todas las décadas</option>
                {availableDecades.map((value) => (
                  <option value={value} key={value}>Década de {value}</option>
                ))}
              </select>
            </label>
            <button type="submit">Buscar <span aria-hidden="true">→</span></button>
          </form>

          <nav className={styles.quickFilters} aria-label="Filtros rápidos de Marchas">
            {filterCards.map((item) => (
              <Link
                className={filter === item.key ? styles.quickFilterActive : styles.quickFilter}
                href={directoryHref({ query, decade, filter: item.key })}
                key={item.key}
                aria-current={filter === item.key ? 'page' : undefined}
              >
                <span>{item.label}</span>
                <strong>{item.count}</strong>
              </Link>
            ))}
          </nav>

          <div className={styles.alphabetWrap}>
            <div>
              <span>Ir por letra</span>
              {letter ? <small>Letra {letter}</small> : <small>Índice completo</small>}
            </div>
            <nav className={styles.alphabet} aria-label="Índice alfabético de Marchas">
              <Link
                className={!letter ? styles.alphabetActive : ''}
                href={directoryHref({ query, decade, filter })}
              >
                Todas
              </Link>
              {availableInitials.map((initial) => (
                <Link
                  className={letter === initial ? styles.alphabetActive : ''}
                  href={directoryHref({ query, letter: initial, decade, filter })}
                  key={initial}
                  aria-current={letter === initial ? 'page' : undefined}
                >
                  {initial}
                </Link>
              ))}
            </nav>
          </div>
        </section>

        {!hasFilters && page === 1 && newest.length ? (
          <section className={styles.latest} aria-labelledby="ultimas-marchas">
            <header>
              <div><span>Recién incorporadas</span><h3 id="ultimas-marchas">Últimas marchas publicadas</h3></div>
              <Link href={directoryHref({ filter: 'recent' })}>Ver novedades <span aria-hidden="true">→</span></Link>
            </header>
            <div className={styles.latestGrid}>
              {newest.map((march) => (
                <Link href={march.href} key={march.id}>
                  <span>{shortDate(march.createdAt)}</span>
                  <strong>{march.name}</strong>
                  <small>{authorLabel(march)}</small>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <div className={styles.resultBar} aria-live="polite" aria-atomic="true">
          <div>
            <strong>{filteredItems.length} {filteredItems.length === 1 ? 'marcha' : 'marchas'}</strong>
            <span>
              {query ? `para “${query}”` : filterLabel(filter)}
              {letter ? ` · letra ${letter}` : ''}
              {decade ? ` · década de ${decade}` : ''}
            </span>
          </div>
          {hasFilters ? <Link href="/marchas">Limpiar filtros</Link> : <span>Página {page} de {totalPages}</span>}
        </div>

        {groups.length ? (
          <>
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
                          {march.compositionYear ? <time>{march.compositionYear}</time> : <time className={styles.pending}>Sin fecha</time>}
                          <em>{march.musicType || march.workType}</em>
                        </span>
                        <b className={styles.cardArrow} aria-hidden="true">→</b>
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
                    href={directoryHref({ page: number, query, letter, decade, filter })}
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
          <div className={styles.empty}>
            <strong>No encontramos marchas con esos criterios.</strong>
            <p>Prueba otro título, compositor, letra o década.</p>
            <Link href="/marchas">Volver al archivo completo →</Link>
          </div>
        )}
      </section>
    </div>
  )
}
