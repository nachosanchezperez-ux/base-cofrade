import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAgentRelationsData } from '@/lib/panel/agent-relations'
import styles from '@/app/panel/panel.module.css'

const SECTION_META = [
  ['images', 'Imágenes', 'Autorías y atribuciones sobre Imágenes.'],
  ['heritage', 'Patrimonio', 'Intervenciones, realizaciones y restauraciones.'],
  ['steps', 'Pasos', 'Capataces, responsables y fases patrimoniales.'],
  ['bands', 'Bandas', 'Dirección y responsabilidades dentro de formaciones musicales.'],
  ['marches', 'Marchas', 'Composición, adaptación y otras autorías musicales.'],
]

function RelationCard({ item }) {
  return (
    <article className={styles.editorItem}>
      <div className={styles.itemHeading}>
        <div>
          <span className={styles.eyebrow}>{item.relation}</span>
          <h3>{item.title}</h3>
          {item.meta ? <p>{item.meta}</p> : null}
        </div>
        {item.href ? <Link className={styles.rowLink} href={item.href}>Abrir <span>→</span></Link> : null}
      </div>
    </article>
  )
}

export const metadata = { title: 'Obra y relaciones · Persona · Panel' }

export default async function AgentWorkPage({ params }) {
  const { id } = await params
  const data = await getAgentRelationsData(id)
  if (!data) notFound()

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/agentes">Personas</Link><span>→</span><Link href={`/panel/agentes/${id}`}>{data.entity.name}</Link><span>→</span><strong>Obra y relaciones</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Nodo relacional</span><h1>Obra y relaciones</h1><p>Todo lo que Hilo Cofrade ya relaciona con {data.entity.name}, sin duplicar la fuente de verdad.</p></div>
          <span className={`${styles.statusBadge} ${styles[data.entity.status]}`}>{data.total} vínculo{data.total === 1 ? '' : 's'}</span>
        </div>
      </header>

      <section className={styles.metricGrid} aria-label="Cobertura relacional">
        <article className={styles.metricCard}><span>Imágenes</span><strong>{data.relations.images.length}</strong><small>autorías</small></article>
        <article className={styles.metricCard}><span>Patrimonio</span><strong>{data.relations.heritage.length}</strong><small>intervenciones</small></article>
        <article className={styles.metricCard}><span>Pasos</span><strong>{data.relations.steps.length}</strong><small>responsabilidades</small></article>
        <article className={styles.metricCard}><span>Música</span><strong>{data.relations.bands.length + data.relations.marches.length}</strong><small>Bandas y Marchas</small></article>
      </section>

      {SECTION_META.map(([key, title, description]) => {
        const items = data.relations[key]
        return (
          <section className={styles.editorSection} key={key}>
            <div className={styles.sectionHeading}>
              <div><span className={styles.eyebrow}>Relaciones existentes</span><h2>{title}</h2></div>
              <p>{items.length ? `${items.length} vínculo${items.length === 1 ? '' : 's'} · ${description}` : description}</p>
            </div>
            {items.length ? <div className={styles.editorStack}>{items.map((item) => <RelationCard key={item.id} item={item} />)}</div> : <div className={styles.emptyPanel}>Todavía no hay relaciones registradas en este bloque.</div>}
          </section>
        )
      })}
    </div>
  )
}
