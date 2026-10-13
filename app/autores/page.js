import Link from 'next/link'
import { connection } from 'next/server'
import JsonLd from '@/components/JsonLd'
import SiteBreadcrumb from '@/components/SiteBreadcrumb'
import {
  AUTHOR_CATEGORIES,
  authorCategoryBySlug,
  authorCategoryFor,
  authorKindLabel,
} from '@/lib/authors-presentation'
import { getPublicAgentDirectory } from '@/lib/supabase/public-agents'
import { collectionPageJsonLd, socialMetadata } from '@/lib/seo'
import styles from './autores.module.css'

export const revalidate = 900

const PAGE_SIZE = 100
const title = 'Autores y oficios cofrades'
const description = 'Compositores, imagineros, restauradores, vestidores, bordadores, orfebres y talleres documentados en Hilo Cofrade, relacionados con sus obras.'

function pageNumber(value) {
  const parsed = Number.parseInt(String(value || '1'), 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

function pageHref(page, categorySlug = '') {
  const query = new URLSearchParams()
  if (categorySlug) query.set('categoria', categorySlug)
  if (page > 1) query.set('pagina', String(page))
  const suffix = query.toString()
  return suffix ? `/autores?${suffix}` : '/autores'
}

export async function generateMetadata({ searchParams } = {}) {
  const params = await searchParams
  const page = pageNumber(params?.pagina)
  const category = authorCategoryBySlug(params?.categoria)

  return {
    title: category ? `${category.label} · Autores cofrades` : title,
    description: category?.description || description,
    ...socialMetadata({
      title: category ? `${category.label} · Autores cofrades` : title,
      description: category?.description || description,
      path: '/autores',
    }),
    ...(page > 1 || params?.categoria ? { robots: { index: false, follow: true } } : {}),
  }
}

export default async function AuthorsDirectoryPage({ searchParams } = {}) {
  // El build no debe depender de la disponibilidad de Supabase.
  await connection()

  const params = await searchParams
  const rawAgents = await getPublicAgentDirectory()
  const agents = rawAgents.map((agent) => ({
    ...agent,
    category: authorCategoryFor(agent),
  }))

  const categoryCounts = new Map()
  for (const agent of agents) {
    categoryCounts.set(agent.category.key, (categoryCounts.get(agent.category.key) || 0) + 1)
  }

  const availableCategories = AUTHOR_CATEGORIES
    .map((category) => ({ ...category, count: categoryCounts.get(category.key) || 0 }))
    .filter((category) => category.count > 0)

  const requestedCategory = authorCategoryBySlug(params?.categoria)
  const selectedCategory = requestedCategory && categoryCounts.get(requestedCategory.key)
    ? requestedCategory
    : null

  const filteredAgents = selectedCategory
    ? agents.filter((agent) => agent.category.key === selectedCategory.key)
    : agents

  const totalPages = Math.max(1, Math.ceil(filteredAgents.length / PAGE_SIZE))
  const page = Math.min(pageNumber(params?.pagina), totalPages)
  const pageItems = filteredAgents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const groups = AUTHOR_CATEGORIES
    .map((category) => ({
      category,
      items: pageItems.filter((agent) => agent.category.key === category.key),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <div className={styles.page} data-category={selectedCategory?.key || 'all'}>
      <JsonLd data={collectionPageJsonLd({
        path: '/autores',
        name: 'Autores y oficios cofrades',
        description,
        items: pageItems.map((agent) => ({ name: agent.name, path: `/autores/${agent.slug}` })),
      })} />

      <header className={styles.hero}>
        <div className={`shell ${styles.heroInner}`}>
          <SiteBreadcrumb
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Autores' },
            ]}
            tone="dark"
            showAccent={false}
          />

          <div className={styles.heroCopy}>
            <span>{selectedCategory?.kicker || 'Artes y oficios cofrades'}</span>
            <h1>{selectedCategory?.label || 'Autores y oficios'}</h1>
            <p>
              {selectedCategory?.description
                || 'Un directorio relacional que distingue la identidad de cada oficio: música, imaginería, restauración, vestimenta, bordado, orfebrería, talla y creación artística.'}
            </p>
          </div>

          <dl className={styles.metrics}>
            <div><dt>Perfiles indexables</dt><dd>{agents.length}</dd></div>
            <div><dt>Ámbitos representados</dt><dd>{availableCategories.length}</dd></div>
            <div><dt>Talleres y entidades</dt><dd>{agents.filter((agent) => agent.kind !== 'person').length}</dd></div>
          </dl>
        </div>
      </header>

      <section className={`shell ${styles.categorySection}`} aria-labelledby="categorias-autores">
        <header className={styles.categoryHeading}>
          <div>
            <span>Explora por oficio</span>
            <h2 id="categorias-autores">Cada autor desde su disciplina</h2>
          </div>
          <p>
            La categoría organiza la lectura y adapta la ficha individual. El tipo de agente —persona, taller, empresa o institución— se conserva como una segunda dimensión.
          </p>
        </header>

        <div className={styles.categoryGrid}>
          <Link
            className={[
              styles.categoryCard,
              !selectedCategory ? styles.categoryCardActive : '',
            ].filter(Boolean).join(' ')}
            href="/autores"
          >
            <span className={styles.categoryCode}>00</span>
            <span className={styles.categoryCopy}>
              <strong>Todos los perfiles</strong>
              <small>Vista completa del directorio, agrupada por artes y oficios.</small>
            </span>
            <span className={styles.categoryCount}>{agents.length}</span>
          </Link>

          {availableCategories.map((category) => (
            <Link
              className={[
                styles.categoryCard,
                selectedCategory?.key === category.key ? styles.categoryCardActive : '',
              ].filter(Boolean).join(' ')}
              data-category={category.key}
              href={pageHref(1, category.slug)}
              key={category.key}
            >
              <span className={styles.categoryCode}>{category.code}</span>
              <span className={styles.categoryCopy}>
                <strong>{category.label}</strong>
                <small>{category.description}</small>
              </span>
              <span className={styles.categoryCount}>{category.count}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={`shell ${styles.directory}`} aria-labelledby="directorio-autores">
        <header className={styles.directoryHeading}>
          <div>
            <span>Directorio relacional</span>
            <h2 id="directorio-autores">{selectedCategory?.label || 'Perfiles documentados'}</h2>
          </div>
          <p>
            {selectedCategory
              ? `${filteredAgents.length} perfiles en este ámbito. `
              : 'Los perfiles se agrupan por oficio y no solo por su naturaleza jurídica. '}
            Solo aparecen fichas con masa documental suficiente. Página {page} de {totalPages}.
          </p>
        </header>

        <div className={styles.groups}>
          {groups.map(({ category, items }) => (
            <section className={styles.group} data-category={category.key} key={category.key}>
              <header className={styles.groupHeader}>
                <span className={styles.groupHeaderMark}>{category.code}</span>
                <span className={styles.groupHeaderCopy}>
                  <h3>{category.label}</h3>
                  <p>{category.kicker}</p>
                </span>
                <span className={styles.groupHeaderCount}>{items.length} en esta página</span>
              </header>

              <div className={styles.list}>
                {items.map((agent) => (
                  <Link className={styles.card} href={`/autores/${agent.slug}`} key={agent.id}>
                    <span className={styles.cardCopy}>
                      <span className={styles.cardKicker}>
                        {agent.primaryDiscipline || category.label} · {authorKindLabel(agent)}
                      </span>
                      <strong>{agent.name}</strong>
                      <small>{agent.description || agent.summary || 'Perfil relacional documentado en Hilo Cofrade'}</small>
                    </span>
                    <span className={styles.cardMeta}>
                      <time>{agent.relationCount}</time>
                      <em>{agent.relationCount === 1 ? 'relación' : 'relaciones'}</em>
                    </span>
                    <span className={styles.cardArrow} aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {totalPages > 1 ? (
          <nav className={styles.pagination} aria-label="Páginas del directorio de Autores">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
              <Link
                href={pageHref(number, selectedCategory?.slug || '')}
                key={number}
                aria-current={number === page ? 'page' : undefined}
              >
                {number}
              </Link>
            ))}
          </nav>
        ) : null}
      </section>
    </div>
  )
}
