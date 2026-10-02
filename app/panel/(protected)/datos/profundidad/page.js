import Link from 'next/link'

import {
  ENTITY_DEPTH_DIMENSIONS,
  ENTITY_DEPTH_LEVELS,
  ENTITY_DEPTH_TYPE_LABELS,
  ENTITY_DEPTH_TYPES,
} from '@/lib/entity-depth'
import { requirePanelUser } from '@/lib/panel/auth'
import { getPanelEntityDepth } from '@/lib/panel/entity-depth'
import styles from '@/app/panel/panel.module.css'
import depthStyles from './depth.module.css'

const SORT_OPTIONS = {
  'depth-asc': 'Menor profundidad',
  'depth-desc': 'Mayor profundidad',
  relations: 'Más conexiones',
  sources: 'Más Fuentes',
  name: 'Nombre',
}

function pageHref({ q, type, level, dimension, sort, page }) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (type) params.set('type', type)
  if (level) params.set('level', level)
  if (dimension) params.set('dimension', dimension)
  if (sort && sort !== 'depth-asc') params.set('sort', sort)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return `/panel/datos/profundidad${query ? `?${query}` : ''}`
}

export const metadata = { title: 'Profundidad documental · Datos · Panel' }

export default async function EntityDepthPage({ searchParams }) {
  await requirePanelUser()
  const query = await searchParams
  const q = String(query?.q || '').trim()
  const type = ENTITY_DEPTH_TYPES.includes(query?.type) ? query.type : ''
  const level = Object.hasOwn(ENTITY_DEPTH_LEVELS, query?.level) ? query.level : ''
  const dimension = Object.hasOwn(ENTITY_DEPTH_DIMENSIONS, query?.dimension) ? query.dimension : ''
  const sort = Object.hasOwn(SORT_OPTIONS, query?.sort) ? query.sort : 'depth-asc'
  const page = Math.max(1, Number.parseInt(query?.page, 10) || 1)

  const data = await getPanelEntityDepth({
    query: q,
    entityType: type,
    level,
    dimension,
    sort,
    page,
  })

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>Calidad editorial</span>
          <h1>Profundidad documental</h1>
          <p>Qué riqueza real tiene cada entidad, qué dimensión está más débil y cuál es el siguiente enriquecimiento con más valor documental.</p>
        </div>
        <Link className={styles.secondaryButton} href="/panel/datos">← Datos</Link>
      </header>

      <section className={styles.metricGrid} aria-label="Distribución de profundidad documental">
        <article className={styles.metricCard}><span>Profundas</span><strong>{data.summary.levels.deep}</strong><small>80–100 puntos</small></article>
        <article className={styles.metricCard}><span>Sólidas</span><strong>{data.summary.levels.solid}</strong><small>65–79 puntos</small></article>
        <article className={styles.metricCard}><span>En desarrollo</span><strong>{data.summary.levels.developing}</strong><small>45–64 puntos</small></article>
        <article className={styles.metricCard}><span>Prioritarias</span><strong>{data.summary.levels.priority}</strong><small>menos de 45 puntos</small></article>
      </section>

      <section className={depthStyles.method}>
        <div>
          <strong>Media global · {data.summary.average}/100</strong>
          <span>{data.summary.total} entidades evaluadas en seis familias.</span>
        </div>
        <p>La puntuación no publica, despublica ni cambia el SEO. Solo ordena deuda útil: Identidad 15 · Contexto 15 · Cronología 15 · Relaciones 25 · Fuentes 15 · Uso 10 · Apoyo 5.</p>
      </section>

      <form className={depthStyles.filters}>
        <label>
          <span className={styles.srOnly}>Buscar entidad</span>
          <input type="search" name="q" defaultValue={q} placeholder="Buscar entidad…" />
        </label>
        <label>
          <span className={styles.srOnly}>Tipo</span>
          <select name="type" defaultValue={type}>
            <option value="">Todos los tipos</option>
            {ENTITY_DEPTH_TYPES.map((item) => <option value={item} key={item}>{ENTITY_DEPTH_TYPE_LABELS[item]}</option>)}
          </select>
        </label>
        <label>
          <span className={styles.srOnly}>Nivel</span>
          <select name="level" defaultValue={level}>
            <option value="">Todos los niveles</option>
            {Object.entries(ENTITY_DEPTH_LEVELS).map(([key, item]) => <option value={key} key={key}>{item.label}</option>)}
          </select>
        </label>
        <label>
          <span className={styles.srOnly}>Dimensión más débil</span>
          <select name="dimension" defaultValue={dimension}>
            <option value="">Cualquier dimensión débil</option>
            {Object.entries(ENTITY_DEPTH_DIMENSIONS).map(([key, item]) => <option value={key} key={key}>{item.label}</option>)}
          </select>
        </label>
        <label>
          <span className={styles.srOnly}>Orden</span>
          <select name="sort" defaultValue={sort}>
            {Object.entries(SORT_OPTIONS).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
          </select>
        </label>
        <button className={styles.secondaryButton} type="submit">Aplicar</button>
      </form>

      <section className={styles.panelCard}>
        <div className={styles.listHeading}>
          <strong>{data.total} {data.total === 1 ? 'entidad' : 'entidades'}</strong>
          <small>Página {data.page} de {data.totalPages} · orden: {SORT_OPTIONS[data.sort]}</small>
        </div>

        {data.items.length ? (
          <div className={depthStyles.list}>
            {data.items.map((item) => (
              <article className={depthStyles.row} key={item.id}>
                <span className={styles.listMonogram} aria-hidden="true">{item.typeLabel.slice(0, 2)}</span>

                <div className={depthStyles.identity}>
                  <strong>{item.name}</strong>
                  <span>{item.typeLabel} · {item.relationCount} conexiones · {item.sourceCount} Fuentes</span>
                  <small>Más débil: {item.weakestDimension?.label || '—'} · {item.weakestDimension?.score || 0}/{item.weakestDimension?.weight || 0}</small>
                </div>

                <div className={depthStyles.score}>
                  <strong>{item.score}</strong>
                  <span className={depthStyles[`level_${item.level}`]}>{ENTITY_DEPTH_LEVELS[item.level].label}</span>
                </div>

                <div className={depthStyles.dimensions} aria-label={`Dimensiones de ${item.name}`}>
                  {item.dimensionList.map((dimensionItem) => (
                    <div key={dimensionItem.key}>
                      <span><small>{dimensionItem.label}</small><b>{dimensionItem.score}/{dimensionItem.weight}</b></span>
                      <div><i style={{ width: `${dimensionItem.percent}%` }} /></div>
                    </div>
                  ))}
                </div>

                <div className={depthStyles.gaps} aria-label="Siguientes mejoras recomendadas">
                  {item.gaps.slice(0, 4).map((gap) => <span key={gap.key}>{gap.label}</span>)}
                  {!item.gaps.length ? <span>Sin carencias relevantes en el modelo actual</span> : null}
                </div>

                <div className={depthStyles.actions}>
                  {item.editHref ? <Link className={styles.smallButton} href={item.editHref}>Editar</Link> : null}
                  {item.publicHref ? <Link className={styles.smallButton} href={item.publicHref} target="_blank">Ver ficha</Link> : null}
                </div>
              </article>
            ))}
          </div>
        ) : <p className={styles.emptyText}>No hay entidades que coincidan con estos filtros.</p>}

        {data.totalPages > 1 ? (
          <nav className={depthStyles.pagination} aria-label="Paginación de profundidad documental">
            {data.page > 1 ? (
              <Link className={styles.smallButton} href={pageHref({ q, type, level, dimension, sort, page: data.page - 1 })}>← Anterior</Link>
            ) : <span />}
            <span>{data.page} / {data.totalPages}</span>
            {data.page < data.totalPages ? (
              <Link className={styles.smallButton} href={pageHref({ q, type, level, dimension, sort, page: data.page + 1 })}>Siguiente →</Link>
            ) : <span />}
          </nav>
        ) : null}
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}>
          <div><span className={styles.eyebrow}>Mapa del grafo</span><h2>Profundidad media por familia</h2></div>
          <p>Sirve para detectar si el problema es una ficha concreta o una deuda sistemática de una familia.</p>
        </div>
        <div className={styles.panelCard}>
          <div className={styles.moduleList}>
            {data.summary.byType.map((item) => (
              <div key={item.type}>
                <span><strong>{item.label}</strong><small style={{ display: 'block', marginTop: 3 }}>{item.count} entidades evaluadas</small></span>
                <b>{item.average}/100</b>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
