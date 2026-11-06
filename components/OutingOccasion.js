import Link from 'next/link'
import { ChevronRightIcon, CrownIcon, MusicIcon } from './icons/LucideIcons'
import { outingCardTitle } from '@/lib/brotherhood-featured-outing'
import { sharedPremiere } from '@/lib/supabase/outing-occasion'
import styles from './BrotherhoodChapterOuting.module.css'

// Jornada extraordinaria dentro de la salida (p. ej. una Coronación): las
// piezas de patrimonio y las marchas que la conmemoran, con sus autores. Todo
// sale de relaciones publicadas; si no hay nada enlazado, no se pinta.

function lowerFirst(text = '') {
  return text ? text.charAt(0).toLocaleLowerCase('es') + text.slice(1) : ''
}

export default function OutingOccasion({ occasion, music = [], names = [] }) {
  if (!occasion || (!occasion.pieces?.length && !occasion.marches?.length)) return null
  const title = outingCardTitle(occasion.name, { names, fallback: occasion.type || occasion.name })
  const marches = occasion.marches || []
  const premiere = sharedPremiere(marches)
  const bands = [...new Set(marches.map((march) => march.bandName).filter(Boolean))]
  const band = bands.length === 1 ? bands[0] : ''
  // Si la banda que las estrenó acompaña esta salida, se dice dónde va.
  const bandInOuting = band ? music.find((row) => row.name === band) : null

  return <section className={styles.occasion} aria-labelledby="jornada-titulo">
    <h3 className={styles.occasionKicker} id="jornada-titulo"><CrownIcon size={18} strokeWidth={2.2} /> {title}</h3>

    {occasion.pieces.map((piece) => <article key={piece.id} className={styles.occasionPiece}>
      <p className={styles.occasionMeta}>{[piece.type, piece.date].filter(Boolean).join(' · ')}</p>
      <h4>{piece.name}</h4>
      {piece.description ? <p>{piece.description}</p> : null}
      {piece.credits?.length ? <ul className={styles.occasionCredits} aria-label="Autores de la intervención">
        {piece.credits.map((credit) => <li key={credit.discipline}><span>{credit.discipline}</span> {credit.names.join(', ')}</li>)}
      </ul> : null}
      {piece.href ? <Link className={styles.occasionLink} href={piece.href} prefetch={false}>Ver en el patrimonio <ChevronRightIcon size={16} /></Link> : null}
    </article>)}

    {marches.length ? <div className={styles.occasionMarches}>
      <h4><MusicIcon size={17} /> Marchas de la {title}</h4>
      {band || premiere ? <p className={styles.occasionMeta}>
        {[
          band ? `${band}${bandInOuting?.context ? `, ${lowerFirst(bandInOuting.context)}` : ''}` : '',
          premiere ? `estreno: ${premiere}` : '',
        ].filter(Boolean).join(' · ')}
      </p> : null}
      <ul>
        {marches.map((march) => <li key={march.id}>
          {march.href ? <Link href={march.href} prefetch={false}>{march.name}</Link> : <strong>{march.name}</strong>}
          {march.composers.length ? <span>{march.composers.join(' y ')}</span> : null}
        </li>)}
      </ul>
    </div> : null}
  </section>
}
