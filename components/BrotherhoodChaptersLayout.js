import Image from 'next/image'
import BrotherhoodChapterNav, { ChapterIcon } from './BrotherhoodChapterNav'
import BrotherhoodQuickFacts from './BrotherhoodQuickFacts'
import BrotherhoodOverviewV2 from './BrotherhoodOverviewV2'
import BrotherhoodEditorialGuide from './BrotherhoodEditorialGuide'
import HiloMovementCards from './HiloMovementCards'
import { plural } from '@/lib/plural'
import styles from './BrotherhoodChaptersLayout.module.css'
import readingStyles from './BrotherhoodReadingLayout.module.css'

// Ficha 2.0 por capítulos (Tarea 13 · prototipo). Reutiliza las secciones ya
// existentes de la ficha (slots) y solo cambia su orden, su agrupación y la
// navegación. Todo se renderiza en el servidor: los plegables son <details>,
// cuyo contenido está en el HTML aunque empiece cerrado.

function Disclosure({ title, count, children, id }) {
  return <details className={readingStyles.disclosure} id={id}>
    <summary><span>{title}</span>{count ? <small>{count}</small> : null}<b aria-hidden="true">+</b></summary>
    <div className={readingStyles.disclosureBody}>{children}</div>
  </details>
}

function Chapter({ chapter, index, children, intro, owner, next, home }) {
  return <section className={styles.chapter} id={chapter.anchor} aria-labelledby={`${chapter.anchor}-titulo`} data-chapter={chapter.id}>
    <div className={`shell ${styles.chapterHead}`}>
      <p className={styles.chapterTitle} id={`${chapter.anchor}-titulo`} tabIndex={-1} data-chapter-title="">
        <span className={styles.chapterNumber} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <span className={styles.chapterOwner}>{owner}</span>
        <span className={styles.chapterName}>{chapter.label}</span>
      </p>
      {intro ? <p className={styles.chapterIntro}>{intro}</p> : null}
    </div>
    {children}
    {next || home ? <nav className={`shell ${styles.continue}`} aria-label={`Seguir desde ${chapter.label}`}>
      {next ? <a href={next.href} className={styles.continueNext}>
        <small>Sigue con</small>
        <strong><ChapterIcon icon={next.icon} className={styles.continueIcon} />{next.label}</strong>
        <span>{next.summary}</span>
        <b aria-hidden="true">›</b>
      </a> : null}
      {home ? <a href={home.href} className={styles.continueHome}>← Volver a {home.label}</a> : null}
    </nav> : null}
  </section>
}

function Supplement({ children }) {
  return <div className={`shell ${styles.supplement}`}>{children}</div>
}

export default function BrotherhoodChaptersLayout({
  brotherhood: h,
  chapters,
  profile,
  heroFactLabels = [],
  nextAppointment = null,
  movements = [],
  hasCrew = false,
  agendaCount = 0,
  hasMusic = false,
  tileMedia = null,
  crestSrc = '',
  slots,
}) {
  const byId = Object.fromEntries(chapters.map((chapter, index) => [chapter.id, { chapter, index }]))
  const owner = h.nombrePopular || h.nombreOficial || ''
  const render = (id, children, intro) => {
    if (!byId[id]) return null
    const { chapter, index } = byId[id]
    const next = chapters[index + 1] || null
    const home = index > 0 ? chapters[0] : null
    return <Chapter chapter={chapter} index={index} intro={intro} owner={owner} next={index > 0 ? next : null} home={home}>{children}</Chapter>
  }
  const [leadStory, ...otherStories] = movements
  const intro = h.resumen?.trim() || ''
  const destinations = chapters.filter((chapter) => chapter.id !== 'inicio')
  const isPenitencia = profile === 'penitencia'
  const hasHeritageExtras = h.simpecados?.length || h.cartelesFiestas?.length
  const hasHeritage = h.patrimonio?.length || h.estrenos?.length

  // Música: el envoltorio #musica conserva el tratamiento lineal de la versión
  // lectura (sin tarjetas anidadas). En una Gloria vive dentro de Patrimonio.
  const music = <div id="musica" className={styles.flow}>
    {slots.ownMusic}
    {slots.musicalHeritage}
    {slots.repertoires}
    {h.acompanamientos?.length ? <Supplement><Disclosure title="Acompañamientos históricos" count={h.acompanamientos.length}>{slots.historicalMusic}</Disclosure></Supplement> : null}
  </div>

  // Vida de hermandad: se llega desde Inicio; el detalle sigue en el HTML.
  const lifeLinks = [
    h.cultos?.length ? { title: 'Cultos', count: plural(h.cultos.length, 'culto', 'cultos'), body: slots.cults } : null,
    isPenitencia && h.salidas?.length ? { title: 'Salidas · ediciones y archivo', count: plural(h.salidas.length, 'salida', 'salidas'), body: slots.outings, id: 'archivo-salidas' } : null,
    hasCrew ? { title: 'Igualás y ensayos', body: slots.crew } : null,
  ].filter(Boolean)

  // Accesos visuales de Inicio: el primero, con la foto del titular si existe.
  const tiles = <nav className={`shell ${styles.tiles}`} aria-label="Qué descubrir en esta ficha" data-count={destinations.length}>
    <ol>
      {destinations.map((chapter, index) => {
        const photo = index === 0 && tileMedia?.path ? tileMedia : null
        return <li key={chapter.id} className={photo ? styles.tilePhoto : ''}>
          <a href={chapter.href}>
            {photo ? <Image src={photo.path} alt="" fill sizes="(max-width: 899px) calc(100vw - 32px), 560px" className={styles.tileImage} /> : null}
            <span className={styles.tileIcon}><ChapterIcon icon={chapter.icon} /></span>
            <strong>{chapter.label}</strong>
            <span className={styles.tileSummary}>{chapter.summary}</span>
            <b aria-hidden="true">›</b>
          </a>
        </li>
      })}
    </ol>
  </nav>

  return <div className={styles.chapters} data-profile={profile} data-chapters-root="">
    <BrotherhoodChapterNav items={chapters} name={owner} crestSrc={crestSrc} />

    {render('inicio', <>
      {intro ? <div className="shell"><p className={styles.lead}>{intro}</p></div> : null}
      {destinations.length ? tiles : null}
      <div className={`shell ${styles.homeGrid}`}>
        <div className={styles.homeSide}>
          {nextAppointment}
          {leadStory ? <div className={styles.news} aria-labelledby="actualidad-titulo">
            <p className={styles.newsEyebrow} id="actualidad-titulo">Actualidad</p>
            <div className={styles.newsLead}><HiloMovementCards items={[leadStory]} compact headingLevel={3} /></div>
            {otherStories.length ? <div className={styles.newsMore}><HiloMovementCards items={otherStories} secondary headingLevel={3} /></div> : null}
          </div> : null}
        </div>
        <div className={styles.homeMain}>
          <div className={styles.essentials}>
            <BrotherhoodQuickFacts brotherhood={h} compact hidePeople heroFactLabels={[...heroFactLabels, 'Pasos']} />
          </div>
          <Disclosure title="Sede, dirección y horarios">
            <BrotherhoodOverviewV2 brotherhood={h} practicalOnly />
          </Disclosure>
        </div>
      </div>
      {lifeLinks.length ? <Supplement>
        <p className={styles.subhead}>Vida de hermandad{agendaCount > 1 ? <small> · {plural(agendaCount, 'cita próxima', 'citas próximas')}</small> : null}</p>
        {lifeLinks.map((item) => <Disclosure key={item.title} title={item.title} count={item.count} id={item.id}>{item.body}</Disclosure>)}
      </Supplement> : null}
    </>)}

    {render(isPenitencia ? 'cortejo' : 'procesion', <>
      {slots.steps}
      {slots.titulars}
      {!isPenitencia && h.salidas?.length ? <Supplement>
        <Disclosure title="La salida · horario y recorrido" count={plural(h.salidas.length, 'salida', 'salidas')} id="archivo-salidas">{slots.outings}</Disclosure>
      </Supplement> : null}
      {isPenitencia && (hasHeritage || hasHeritageExtras || h.habitos?.length) ? <Supplement>
        {hasHeritage ? <Disclosure title="Patrimonio y estrenos" count={h.patrimonio?.length ? plural(h.patrimonio.length, 'pieza', 'piezas') : ''}>{slots.heritage}</Disclosure> : null}
        {h.simpecados?.length ? <Disclosure title="Simpecados" count={h.simpecados.length}>{slots.simpecados}</Disclosure> : null}
        {h.cartelesFiestas?.length ? <Disclosure title="Carteles" count={h.cartelesFiestas.length}>{slots.posters}</Disclosure> : null}
        {h.habitos?.length ? <Disclosure title="Túnica" count={h.habitos.length}>{slots.habit}</Disclosure> : null}
      </Supplement> : null}
    </>)}

    {render('musica', music)}

    {render('patrimonio', <div className={styles.flow}>
      {slots.heritage}
      {h.simpecados?.length || h.cartelesFiestas?.length ? <Supplement>
        {h.simpecados?.length ? <Disclosure title="Simpecados" count={h.simpecados.length}>{slots.simpecados}</Disclosure> : null}
        {h.cartelesFiestas?.length ? <Disclosure title="Carteles" count={h.cartelesFiestas.length}>{slots.posters}</Disclosure> : null}
      </Supplement> : null}
      {hasMusic ? music : null}
    </div>)}

    {render('historia', <>
      {slots.history}
      <BrotherhoodEditorialGuide guide={h.editorialGuide} />
      {(h.viaCrucisCofradias?.length || h.participacionesConsejo?.length || h.curiosidades?.length) ? <Supplement>
        {(h.viaCrucisCofradias?.length || h.participacionesConsejo?.length) ? <Disclosure title="Participaciones institucionales y Vía Crucis">{slots.council}{slots.viaCrucis}</Disclosure> : null}
        {h.curiosidades?.length ? <Disclosure title="Curiosidades" count={h.curiosidades.length}>{slots.curiosities}</Disclosure> : null}
      </Supplement> : null}
    </>)}

    {render('hilo', <>
      {slots.thread}
      <Supplement><Disclosure title="Más rutas para tirar del hilo">{slots.discovery}</Disclosure></Supplement>
      {slots.officialLinks}
    </>)}
  </div>
}
