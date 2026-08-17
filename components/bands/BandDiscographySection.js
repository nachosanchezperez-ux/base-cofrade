import Image from 'next/image'
import Link from 'next/link'
import styles from './BandDiscographySection.module.css'

function ordinalLabel(value) {
  if (!value) return ''
  return `${value}.º trabajo discográfico`
}

function entityHref(item) {
  if (!item?.slug) return ''
  if (item.entityType === 'image') return `/imagenes/${item.slug}`
  if (item.entityType === 'brotherhood') return `/hermandades/${item.slug}`
  if (item.entityType === 'band') return `/bandas/${item.slug}`
  if (item.entityType === 'event') return `/acontecimientos/${item.slug}`
  return ''
}

function TrackList({ tracks }) {
  if (!tracks.length) return null

  return (
    <div className={styles.trackList}>
      <div className={styles.trackHeading}>
        <span>Elige qué escuchar</span>
        <strong>{tracks.length} {tracks.length === 1 ? 'pista' : 'pistas'}</strong>
      </div>
      <ol>
        {tracks.map((track) => (
          <li key={track.id}>
            <span className={styles.trackNumber}>{String(track.sequenceNo).padStart(2, '0')}</span>
            <div className={styles.trackCopy}>
              {track.marchSlug
                ? <Link href={`/marchas/${track.marchSlug}`} className={styles.trackTitle}>{track.title}</Link>
                : <strong className={styles.trackTitle}>{track.title}</strong>}
              {track.composers.length ? (
                <div className={styles.relationshipLine}>
                  <span>Composición</span>
                  <div>{track.composers.map((composer, index) => <span key={composer.id}>{index ? ' · ' : ''}{composer.slug ? <Link href={`/autores/${composer.slug}`}>{composer.name}</Link> : composer.name}</span>)}</div>
                </div>
              ) : null}
              {track.dedications.length ? (
                <div className={styles.relationshipLine}>
                  <span>Dedicada a</span>
                  <div>{track.dedications.map((dedication, index) => {
                    const href = entityHref(dedication)
                    return <span key={`${dedication.id}-${index}`}>{index ? ' · ' : ''}{href ? <Link href={href}>{dedication.name || dedication.text}</Link> : dedication.name || dedication.text}</span>
                  })}</div>
                </div>
              ) : null}
            </div>
            <div className={styles.trackActions}>
              {track.durationText ? <small className={styles.duration}>{track.durationText}</small> : null}
              {track.spotifyUrl ? (
                <a
                  href={track.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.trackSpotifyLink}
                  aria-label={`Escuchar ${track.title} en Spotify`}
                  title={`Escuchar ${track.title} en Spotify`}
                >
                  <span aria-hidden="true">▶</span>
                  <em>Escuchar</em>
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function BandDiscographySection({ releases = [], artistSpotifyUrl = '', bandName = '' }) {
  if (!releases.length) return null
  const spotifyArtist = artistSpotifyUrl || releases[0]?.artistSpotifyUrl || ''
  const displayBandName = bandName || releases[0]?.bandName || ''

  return (
    <section className={styles.section} id="discografia">
      <div className="shell">
        <header className={styles.heading}>
          <div>
            <span>Patrimonio sonoro</span>
            <h2>Discografía</h2>
          </div>
          <div className={styles.headingAside}>
            <p>{releases.length > 1
              ? `${releases.length} lanzamientos documentados. Abre el que quieras para explorar sus pistas y relaciones.`
              : 'Elige una marcha para escuchar su grabación o explora las relaciones documentadas de cada obra.'}</p>
            {spotifyArtist ? (
              <a href={spotifyArtist} target="_blank" rel="noopener noreferrer" className={styles.artistSpotifyLink}>
                <span aria-hidden="true">▶</span> {displayBandName ? `Escuchar a ${displayBandName} en Spotify` : 'Escuchar perfil en Spotify'}
              </a>
            ) : null}
          </div>
        </header>

        <div className={styles.releaseList}>
          {releases.map((release, index) => (
            <details className={styles.release} key={release.id} open={index === 0}>
              <summary className={styles.releaseSummary}>
                <div className={styles.cover}>
                  {release.coverImagePath ? (
                    <Image src={release.coverImagePath} alt={release.coverImageAlt || `Portada de ${release.title}`} fill sizes="(max-width: 760px) 72px, 110px" />
                  ) : (
                    <div className={styles.coverPlaceholder} aria-hidden="true"><span>{release.year || 'HC'}</span></div>
                  )}
                </div>
                <div className={styles.summaryCopy}>
                  <h3>{release.title}</h3>
                  <div className={styles.meta}>
                    {release.year ? <strong>{release.year}</strong> : null}
                    <span>{release.tracks.length} {release.tracks.length === 1 ? 'pista' : 'pistas'}</span>
                    {ordinalLabel(release.ordinalNumber) ? <span>{ordinalLabel(release.ordinalNumber)}</span> : null}
                  </div>
                </div>
                <span className={styles.releaseToggle}>
                  <em className={styles.toggleClosed}>Ver pistas</em>
                  <em className={styles.toggleOpen}>Ocultar pistas</em>
                  <b aria-hidden="true">+</b>
                </span>
              </summary>

              <div className={styles.releaseDetail}>
                <div className={styles.releaseInfo}>
                  {release.description ? <p>{release.description}</p> : null}
                  {release.dateText ? <small className={styles.dateText}>{release.dateText}</small> : null}
                  {release.coverImageCredit ? <small>{release.coverImageCredit}</small> : null}
                  <div className={styles.actions}>
                    {release.spotifyUrl ? <a href={release.spotifyUrl} target="_blank" rel="noopener noreferrer" className={styles.secondaryLink}>Álbum completo en Spotify ↗</a> : null}
                    {release.externalUrl ? <a href={release.externalUrl} target="_blank" rel="noopener noreferrer" className={styles.secondaryLink}>Más información ↗</a> : null}
                  </div>
                </div>
                <TrackList tracks={release.tracks} />
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
