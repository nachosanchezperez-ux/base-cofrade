import Image from 'next/image'
import Link from 'next/link'
import { ChevronRightIcon, ClockIcon, MusicIcon, RouteIcon } from './icons/LucideIcons'
import DossierPrintButton from './DossierPrintButton'
import { creditsByDiscipline, imageFacts, pieceFacts, stepFacts } from '@/lib/brotherhood-dossier'
import styles from './BrotherhoodDossier.module.css'

// Dosier de la Hermandad: todo lo publicado sobre la Hermandad, su Titular y la
// gran jornada en una sola página, ordenado para consultarlo en directo (una
// retransmisión) o imprimirlo. Solo pinta lo que existe; sin datos, no hay
// bloque.

function Facts({ items = [], className = '' }) {
  if (!items.length) return null
  return <dl className={`${styles.facts} ${className}`}>
    {items.map((fact) => <div key={`${fact.label}-${fact.value}`}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
  </dl>
}

function Section({ id, title, count = '', children }) {
  return <section className={styles.section} id={id} aria-labelledby={`${id}-titulo`}>
    <h2 id={`${id}-titulo`}>{title}{count ? <small>{count}</small> : null}</h2>
    {children}
  </section>
}

function Piece({ piece, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`
  const meta = [piece.tipo, piece.fecha].filter(Boolean).join(' · ')
  return <article className={styles.piece}>
    {piece.imagen?.src ? <figure className={styles.pieceImage}>
      <Image src={piece.imagen.src} alt={piece.imagen.alt || piece.nombre} fill sizes="(max-width: 899px) 92vw, 360px" />
      {piece.imagen.autor ? <figcaption>{piece.imagen.autor}</figcaption> : null}
    </figure> : null}
    <div className={styles.pieceText}>
      {meta ? <p className={styles.meta}>{meta}</p> : null}
      <Heading>{piece.nombre}</Heading>
      {piece.descripcion ? <p>{piece.descripcion}</p> : null}
      {piece.contexto ? <p className={styles.context}>{piece.contexto}</p> : null}
      {piece.uso ? <p className={styles.usage}><strong>Uso:</strong> {piece.uso}</p> : null}
      <Facts items={pieceFacts(piece).filter((fact) => fact.label !== 'Fecha')} />
    </div>
  </article>
}

export default function BrotherhoodDossier({
  brotherhood,
  title,
  eyebrow = 'Dosier',
  crestPath = '',
  keyFacts = [],
  outing = null,
  occasion = null,
  occasionPieces = [],
  images = [],
  imageMedia = new Map(),
  heritageGroups = [],
  steps = [],
  history = { lead: '', rest: [] },
  chronology = [],
  currentMusic = [],
  historicalMusic = [],
  musicalHeritage = [],
  cults = [],
  fichaHref = '',
  children = null,
}) {
  const marches = occasion?.marches || []
  const schedule = outing?.schedule || []
  const stations = (outing?.routePoints || []).filter((point) => point.notes || point.type === 'station')
  const pieceCount = heritageGroups.reduce((total, group) => total + group.items.length, 0)
  const index = [
    keyFacts.length && { href: '#datos', label: 'Datos clave' },
    outing && { href: '#jornada', label: 'La jornada' },
    (occasionPieces.length || marches.length) && { href: '#coronacion', label: title.short || 'La gran cita' },
    images.length && { href: '#titular', label: images.length > 1 ? 'Titulares' : 'La Titular' },
    pieceCount && { href: '#patrimonio', label: 'Patrimonio' },
    steps.length && { href: '#paso', label: steps.length > 1 ? 'Pasos' : 'El paso' },
    (history.lead || chronology.length) && { href: '#historia', label: 'Historia' },
    (currentMusic.length || historicalMusic.length || musicalHeritage.length) && { href: '#musica', label: 'Música' },
    cults.length && { href: '#cultos', label: 'Cultos' },
  ].filter(Boolean)

  return <article className={styles.dossier}>
    <header className={styles.header}>
      <div className="shell">
        <div className={styles.headerRow}>
          {crestPath ? <span className={styles.crest}><Image src={crestPath} alt="" width={64} height={64} /></span> : null}
          <div>
            <p className={styles.eyebrow}>{eyebrow}</p>
            <h1>{title.full}</h1>
            <p className={styles.subtitle}>{brotherhood.nombreOficial}</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          {fichaHref ? <Link href={fichaHref} prefetch={false}>Ficha completa <ChevronRightIcon size={16} /></Link> : null}
          <DossierPrintButton />
        </div>
      </div>
    </header>

    {index.length > 1 ? <nav className={styles.index} aria-label="Índice del dosier">
      <div className="shell"><ol>{index.map((item) => <li key={item.href}><a href={item.href}>{item.label}</a></li>)}</ol></div>
    </nav> : null}

    <div className={`shell ${styles.body}`}>
      {keyFacts.length ? <Section id="datos" title="Datos clave">
        <Facts items={keyFacts} className={styles.keyFacts} />
      </Section> : null}

      {outing ? <Section id="jornada" title="La jornada">
        {occasion?.description ? <p className={styles.lead}>{occasion.description}</p> : null}
        {schedule.length ? <>
          <h3 className={styles.subheading}><ClockIcon size={17} /> Horarios</h3>
          <ol className={styles.schedule}>
            {schedule.map((item) => <li key={item.id}>
              <time>{item.time || item.timeText || '—'}</time>
              <div><strong>{item.label}</strong>{item.place ? <span>{item.place}</span> : null}{item.notes ? <p>{item.notes}</p> : null}</div>
            </li>)}
          </ol>
        </> : null}
        <Facts items={[
          { label: 'Salida', value: outing.departureTime },
          { label: 'Entrada', value: outing.returnTime },
        ].filter((fact) => fact.value)} />
        {outing.routeSummary ? <>
          <h3 className={styles.subheading}><RouteIcon size={17} /> Recorrido</h3>
          <p>{outing.routeSummary}</p>
        </> : null}
        {stations.length ? <ul className={styles.stations} aria-label="Momentos del recorrido">
          {stations.map((point) => <li key={point.order}>{point.time ? <time>{point.time}</time> : null}<strong>{point.label}</strong>{point.notes ? <span>{point.notes}</span> : null}</li>)}
        </ul> : null}
        {outing.publicNotes ? <p className={styles.context}>{outing.publicNotes}</p> : null}
        {outing.music?.length ? <>
          <h3 className={styles.subheading}><MusicIcon size={17} /> Acompañamiento musical</h3>
          <ul className={styles.plainList}>
            {outing.music.map((row) => <li key={row.id}>
              {row.href ? <Link href={row.href} prefetch={false}>{row.name}</Link> : <strong>{row.name}</strong>}
              {row.context ? <span>{row.context}</span> : null}
              {row.notes ? <p>{row.notes}</p> : null}
            </li>)}
          </ul>
        </> : null}
        {outing.detailHref ? <p><Link className={styles.more} href={outing.detailHref} prefetch={false}>Mapa y horario por puntos <ChevronRightIcon size={16} /></Link></p> : null}
      </Section> : null}

      {occasionPieces.length || marches.length ? <Section id="coronacion" title={title.short || 'La gran cita'}>
        {occasionPieces.map((piece) => <Piece key={piece.id} piece={piece} />)}
        {marches.length ? <>
          <h3 className={styles.subheading}><MusicIcon size={17} /> Patrimonio musical de la {title.short}</h3>
          <ul className={styles.plainList}>
            {marches.map((march) => <li key={march.id}>
              {march.href ? <Link href={march.href} prefetch={false}>{march.name}</Link> : <strong>{march.name}</strong>}
              {[march.composers.join(' y '), march.bandName && `estreno: ${march.bandName}`, march.premiere].filter(Boolean).length
                ? <span>{[march.composers.join(' y '), march.bandName && `estreno: ${march.bandName}`, march.premiere].filter(Boolean).join(' · ')}</span>
                : null}
            </li>)}
          </ul>
        </> : null}
      </Section> : null}

      {images.length ? <Section id="titular" title={images.length > 1 ? 'Titulares' : 'La Titular'}>
        {images.map((image) => {
          const media = imageMedia.get(image.id)
          return <article className={styles.piece} key={image.id}>
            {media?.path ? <figure className={styles.pieceImage}>
              <Image src={media.path} alt={media.alt || image.nombre} fill sizes="(max-width: 899px) 92vw, 360px" />
              {media.credit ? <figcaption>{media.credit}</figcaption> : null}
            </figure> : null}
            <div className={styles.pieceText}>
              <h3>{image.slug ? <Link href={`/imagenes/${image.slug}`} prefetch={false}>{image.nombre}</Link> : image.nombre}</h3>
              {image.descripcion ? <p>{image.descripcion}</p> : null}
              <Facts items={imageFacts(image)} />
            </div>
          </article>
        })}
      </Section> : null}

      {pieceCount ? <Section id="patrimonio" title="Patrimonio" count={`${pieceCount} ${pieceCount === 1 ? 'pieza' : 'piezas'}`}>
        {heritageGroups.map((group) => <div className={styles.group} key={group.key}>
          <h3 className={styles.groupTitle}>{group.title}</h3>
          {group.items.map((piece) => <Piece key={piece.id} piece={piece} headingLevel={4} />)}
        </div>)}
      </Section> : null}

      {steps.length ? <Section id="paso" title={steps.length > 1 ? 'Pasos' : 'El paso'}>
        {steps.map((step) => <article className={styles.pieceText} key={step.id}>
          <h3>{step.slug ? <Link href={`/pasos/${step.slug}`} prefetch={false}>{step.nombre}</Link> : step.nombre}</h3>
          {step.descripcion ? <p>{step.descripcion}</p> : null}
          <Facts items={stepFacts(step)} />
          {step.fases?.length ? <ul className={styles.plainList} aria-label="Fases del paso">
            {step.fases.map((phase) => <li key={phase.id}>
              <strong>{phase.nombre}</strong>
              <span>{[phase.tipo, phase.periodo, creditsByDiscipline(phase.agentes).map((credit) => `${credit.label}: ${credit.value}`).join(' · ')].filter(Boolean).join(' · ')}</span>
              {phase.descripcion ? <p>{phase.descripcion}</p> : null}
            </li>)}
          </ul> : null}
        </article>)}
      </Section> : null}

      {history.lead || chronology.length ? <Section id="historia" title="Historia" count={chronology.length ? `${chronology.length} hitos` : ''}>
        {history.lead ? <p className={styles.lead}>{history.lead}</p> : null}
        {history.rest.map((paragraph) => <p key={paragraph.slice(0, 40)}>{paragraph}</p>)}
        {chronology.length ? <ol className={styles.chronology}>
          {chronology.map((item) => <li key={item.id || `${item.fecha}-${item.titulo}`} className={item.upcoming ? styles.upcoming : ''}>
            <time>{item.fecha || '—'}</time>
            <div><strong>{item.titulo}</strong>{item.texto ? <p>{item.texto}</p> : null}</div>
          </li>)}
        </ol> : null}
      </Section> : null}

      {currentMusic.length || historicalMusic.length || musicalHeritage.length ? <Section id="musica" title="Música">
        {currentMusic.length ? <>
          <h3 className={styles.subheading}>Acompañamiento actual</h3>
          <ul className={styles.plainList}>{currentMusic.map((item) => <li key={item.id}>
            {item.bandaSlug ? <Link href={`/bandas/${item.bandaSlug}`} prefetch={false}>{item.banda}</Link> : <strong>{item.banda}</strong>}
            <span>{[item.posicion, item.periodo].filter(Boolean).join(' · ')}</span>
          </li>)}</ul>
        </> : null}
        {historicalMusic.length ? <>
          <h3 className={styles.subheading}>Bandas que la han acompañado</h3>
          <ul className={styles.plainList}>{historicalMusic.map((item) => <li key={item.id || `${item.banda}-${item.periodo}`}>
            {item.bandaSlug ? <Link href={`/bandas/${item.bandaSlug}`} prefetch={false}>{item.banda}</Link> : <strong>{item.banda}</strong>}
            <span>{[item.periodo, item.paso].filter(Boolean).join(' · ')}</span>
          </li>)}</ul>
        </> : null}
        {musicalHeritage.length ? <>
          <h3 className={styles.subheading}>Patrimonio musical</h3>
          <ul className={styles.plainList}>{musicalHeritage.map((work) => <li key={work.id}>
            {work.href ? <Link href={work.href} prefetch={false}>{work.name}</Link> : <strong>{work.name}</strong>}
            <span>{[work.musicType || work.workType, work.year, work.composers.map((composer) => composer.name).join(' y ') || work.authorshipText].filter(Boolean).join(' · ')}</span>
          </li>)}</ul>
        </> : null}
      </Section> : null}

      {cults.length ? <Section id="cultos" title="Cultos">
        <ul className={styles.plainList}>{cults.map((cult) => <li key={cult.id}>
          <strong>{cult.nombre}</strong>
          <span>{[cult.fechaDetalle && cult.fechaDetalle.startsWith('EDICIÓN') ? cult.fechaCorta : cult.fechaDetalle || cult.fechaCorta, cult.lugar].filter(Boolean).join(' · ')}</span>
        </li>)}</ul>
      </Section> : null}

    </div>
    {children}
  </article>
}

