import Image from 'next/image'
import BrotherhoodHeritageUpdates from './BrotherhoodHeritageUpdates'
import { heritagePieceAnchor } from '@/lib/heritage-anchor'
import styles from './BrotherhoodChapterHeritage.module.css'

// Patrimonio en la ficha por capítulos: una fila por pieza (tipo y fecha,
// nombre, entradilla) y el resto plegado en «Conocer la pieza». Mismos campos
// que el catálogo de la ficha clásica, sin recuadros dentro de recuadros.
// Conserva #patrimonio y da a cada pieza su ancla #pieza-… (el cortejo enlaza aquí).

function Facts({ piece }) {
  const facts = [
    piece.bendicion ? ['Bendición', piece.bendicion] : null,
    piece.procedencia ? ['Procedencia', piece.procedencia] : null,
  ].filter(Boolean)
  return facts.length ? <dl className={styles.facts}>
    {facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
  </dl> : null
}

function Piece({ piece }) {
  const lead = piece.resumen || piece.descripcion || ''
  const technical = [piece.tecnica, piece.materiales, piece.dimensiones].filter(Boolean)
  const story = [
    piece.descripcion && piece.descripcion !== lead ? ['', piece.descripcion] : null,
    piece.contexto ? ['Contexto histórico', piece.contexto] : null,
    piece.iconografia ? ['Diseño e iconografía', piece.iconografia] : null,
    piece.origen && piece.origen.trim() !== piece.contexto?.trim() ? ['Origen y evolución', piece.origen] : null,
  ].filter(Boolean)
  const hasMore = piece.bendicion || piece.procedencia || piece.agentes?.length || story.length || technical.length
  return <li className={styles.piece} id={heritagePieceAnchor(piece.id) || undefined}>
    {piece.imagen?.src ? <figure className={styles.thumb}>
      <Image src={piece.imagen.src} alt={piece.imagen.alt || piece.nombre} fill sizes="(max-width: 899px) 84px, 112px" />
    </figure> : null}
    <div className={styles.body}>
      <p className={styles.meta}>{[piece.tipo, piece.fecha].filter(Boolean).join(' · ')}</p>
      <h3>{piece.nombre}</h3>
      {lead ? <p className={styles.lead}>{lead}</p> : null}
      {hasMore ? <details className={styles.more}>
        <summary>Conocer la pieza <b aria-hidden="true">+</b></summary>
        <Facts piece={piece} />
        {piece.agentes?.length ? <p className={styles.agents}>
          <strong>Autores y responsables.</strong>{' '}
          {piece.agentes.map((agent, index) => <span key={`${agent.id}-${agent.rol}`}>{index ? '; ' : ''}{agent.nombre}{agent.rol ? ` (${agent.rol.charAt(0).toLowerCase()}${agent.rol.slice(1)})` : ''}</span>)}
        </p> : null}
        {story.map(([label, text]) => <p key={label || 'descripcion'}>{label ? <strong>{label}. </strong> : null}{text}</p>)}
        {technical.length ? <p className={styles.technical}>{technical.join(' · ')}</p> : null}
        {piece.imagen?.src && (piece.imagen.pie || piece.imagen.autor) ? <p className={styles.credit}>{[piece.imagen.pie, piece.imagen.autor].filter(Boolean).join(' · ')}</p> : null}
      </details> : null}
    </div>
  </li>
}

export default function BrotherhoodChapterHeritage({ pieces = [], updates = [], currentYear, sourcesHref }) {
  if (!pieces.length && !updates.length) return null
  return <section className={`section ${styles.section}`} id="patrimonio" aria-labelledby="patrimonio-titulo">
    <div className="shell">
      <h2 className={styles.title} id="patrimonio-titulo">Patrimonio</h2>
      {pieces.length ? <ul className={styles.list}>{pieces.map((piece) => <Piece key={piece.id} piece={piece} />)}</ul> : null}
      <BrotherhoodHeritageUpdates items={updates} currentYear={currentYear} sourcesHref={sourcesHref} />
    </div>
  </section>
}
