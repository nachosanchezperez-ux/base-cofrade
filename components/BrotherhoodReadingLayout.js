import Link from 'next/link'
import EntitySectionNav from './EntitySectionNav'
import SectionTitle from './SectionTitle'
import BrotherhoodQuickFacts from './BrotherhoodQuickFacts'
import BrotherhoodOverviewV2 from './BrotherhoodOverviewV2'
import BrotherhoodEditorialGuide from './BrotherhoodEditorialGuide'
import { nextBrotherhoodAppointment } from '@/lib/brotherhood-reading'
import styles from './BrotherhoodReadingLayout.module.css'

function Disclosure({ title, count, children, id }) {
  return <details className={styles.disclosure} id={id}>
    <summary><span>{title}</span>{count ? <small>{count}</small> : null}<b aria-hidden="true">+</b></summary>
    <div className={styles.disclosureBody}>{children}</div>
  </details>
}

function NextAppointment({ item }) {
  if (!item) return null
  const date = new Date(`${item.date}T12:00:00Z`)
  const label = new Intl.DateTimeFormat('es-ES', {day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Madrid'}).format(date)
  const route = item.route || item.routeText || item.routeSummary || (Array.isArray(item.processionRoute) ? item.processionRoute.join(' · ') : '')
  return <aside className={styles.next} aria-label="Próxima cita de la Hermandad">
    <span className="eyebrow">Próxima cita</span>
    <time dateTime={item.date}>{label}</time>
    <h3>{item.title}</h3>
    <p className={styles.nextTime}>{item.startTime || item.timeText || 'Hora por confirmar'}</p>
    {route ? <details className={styles.inlineDisclosure}><summary>Recorrido <span aria-hidden="true">+</span></summary><p>{route}</p></details> : null}
    {item.musicSummary ? <p>{item.musicSummary}</p> : null}
    <Link href={item.href || '#agenda'} className="text-link">{item.href?.startsWith('#') ? 'Consultar salida' : 'Ver detalle'} →</Link>
  </aside>
}

export default function BrotherhoodReadingLayout({ brotherhood: h, today, agendaItems, heroFactLabels, hasMusic, slots }) {
  const next = nextBrotherhoodAppointment(agendaItems, h.salidas, today, h.cultos)
  const hasHeritage = h.patrimonio?.length || h.estrenos?.length || h.simpecados?.length || h.cartelesFiestas?.length || h.habitos?.length
  const hasAgenda = h.salidas?.length || h.cultos?.length || agendaItems.length || slots.hasCrew
  return <>
    <EntitySectionNav discover={false} revealDisclosures items={[
      {href:'#resumen',label:'Resumen'},
      h.imagenes?.length && {href:'#titulares',label:'Titulares'},
      h.cronologia?.length && {href:'#historia',label:'Historia'},
      hasMusic && {href:'#musica',label:'Música'},
      hasHeritage && {href:'#patrimonio-area',label:'Patrimonio'},
      hasAgenda && {href:'#agenda',label:'Agenda / Cultos'},
    ]} />
    <section className={`section ${styles.overview}`} id="resumen"><div className={`shell ${styles.overviewGrid}`}>
      <div>
        <SectionTitle eyebrow="De un vistazo" title="La Hermandad en breve" />
        {!h.editorialGuide?.summary && h.resumen ? <p className={styles.intro}>{h.resumen}</p> : null}
        <BrotherhoodQuickFacts brotherhood={h} compact heroFactLabels={[...heroFactLabels, 'Pasos']} />
        <Disclosure title="Sede, horarios y actividad anual">
          <BrotherhoodOverviewV2 brotherhood={h} practicalOnly />
          {h.diaSalida ? <p>Salida habitual: {h.diaSalida}</p> : null}
          {(h.salidas || []).filter(item => item.estado === 'recurring').map(item => <p key={item.id}><strong>{item.nombre}</strong> · {item.momento}</p>)}
        </Disclosure>
      </div>
      <NextAppointment item={next} />
    </div></section>
    <BrotherhoodEditorialGuide guide={h.editorialGuide} />
    {slots.titulars}
    {slots.steps}
    {slots.history}
    {(h.viaCrucisCofradias?.length || h.participacionesConsejo?.length) ? <div className={`shell ${styles.supplement}`}><Disclosure title="Participaciones institucionales y Vía Crucis">{slots.council}{slots.viaCrucis}</Disclosure></div> : null}
    {hasMusic ? <section className={`section ${styles.area}`} id="musica"><div className="shell">
      <SectionTitle eyebrow="Identidad sonora" title="Música" />
      <div className={styles.musicGrid}>
        <div>{slots.ownMusic}</div>
        <div>{slots.musicalHeritage}{slots.repertoires}
          {h.acompanamientos?.length ? <Disclosure title="Acompañamientos históricos" count={h.acompanamientos.length}>{slots.historicalMusic}</Disclosure> : null}
        </div>
      </div>
    </div></section> : null}
    {hasHeritage ? <section className={`section ${styles.area}`} id="patrimonio-area"><div className="shell">
      {!h.patrimonio?.length && !h.estrenos?.length ? <SectionTitle eyebrow="Memoria material" title="Patrimonio" /> : null}
      {slots.heritage}
      {h.simpecados?.length ? <Disclosure title="Simpecados" count={h.simpecados.length}>{slots.simpecados}</Disclosure> : null}
      {h.cartelesFiestas?.length ? <Disclosure title="Carteles" count={h.cartelesFiestas.length}>{slots.posters}</Disclosure> : null}
      {h.habitos?.length ? <Disclosure title="Túnica e indumentaria" count={h.habitos.length}>{slots.habit}</Disclosure> : null}
    </div></section> : null}
    {hasAgenda ? <section className={`section ${styles.area}`} id="agenda"><div className="shell">
      <SectionTitle eyebrow="Vida de hermandad" title="Agenda y cultos" />
      {next ? <p className={styles.agendaSummary}>Próxima cita: <Link href={next.href}>{next.title}</Link> · <time dateTime={next.date}>{new Intl.DateTimeFormat('es-ES',{day:'numeric',month:'long',timeZone:'Europe/Madrid'}).format(new Date(`${next.date}T12:00:00Z`))}</time></p> : null}
      {agendaItems.length > 1 ? <Disclosure title="Otras próximas citas" count={agendaItems.length - 1}><ul className={styles.appointments}>{agendaItems.filter(item => item.href !== next?.href).map(item => <li key={item.key}><time dateTime={item.date}>{item.date}</time><Link href={item.href}>{item.title}</Link><strong>{item.startTime || item.timeText || 'Hora por confirmar'}</strong></li>)}</ul></Disclosure> : null}
      {h.salidas?.length ? <Disclosure title="Salidas · ediciones y archivo" count={h.salidas.length} id="archivo-salidas">{slots.outings}</Disclosure> : null}
      {h.cultos?.length ? <Disclosure title="Calendario de cultos y ediciones" count={h.cultos.length}>{slots.cults}</Disclosure> : null}
      {slots.crew}
    </div></section> : null}
    {h.noticias?.length || h.curiosidades?.length ? <div className={`shell ${styles.supplement}`}><Disclosure title="Actualidad y curiosidades">{slots.news}{slots.curiosities}</Disclosure></div> : null}
  </>
}
