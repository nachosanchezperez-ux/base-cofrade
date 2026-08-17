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

export default function BandDiscographySection({ releases = [] }) {
  if (!releases.length) return null

  return (
    <section className={styles.section} id="discografia">
      <div className="shell">
        <header className={styles.heading}>
          <div>
            <span>Patrimonio sonoro</span>
            <h2>Discografía</h2>
          </div>
          <p>Elige una marcha para escuchar su grabación o explora las relaciones documentadas de cada obra.</p>
        </header>

        <div className={styles.releaseList}>
          {releases.map((release) => (
            <article className={styles.release} key={release.id}>
              <div className={styles.releaseIdentity}>
                <div className={styles.cover}>
                  {release.coverImagePath ? (
                    <Image src={release.coverImagePath} alt={release.coverImageAlt || `Portada de ${release.title}`} fill sizes="(max-width: 760px) 42vw, 230px" />
                  ) : (
                    <div className={styles.coverPlaceholder} aria-hidden="true"><span>{release.year || 'HC'}</span></div>
                  )}
                </div>

                <div className={styles.releaseCopy}>
                  <div className={styles.meta}>
                    {release.year ? <strong>{release.year}</strong> : null}
                    {ordinalLabel(release.ordinalNumber) ? <span>{ordinalLabel(release.ordinalNumber)}</span> : null}
                  </div>
                  <h3>{release.title}</h3>
                  {release.description ? <p>{release.description}</p> : null}
                  {release.coverImageCredit ? <small>{release.coverImageCredit}</small> : null}
                  <div className={styles.actions}>
                    {release.spotifyUrl ? <a href={release.spotifyUrl} target="_blank" rel="noopener noreferrer" className={styles.secondaryLink}>Álbum completo en Spotify ↗</a> : null}
                    {release.externalUrl ? <a href={release.externalUrl} target="_blank" rel="noopener noreferrer" className={styles.secondaryLink}>Más información ↗</a> : null}
                  </div>
                </div>
              </div>

              {release.tracks.length ? (
                <div className={styles.trackList}>
                  <div className={styles.trackHeading}><span>Elige qué escuchar</span><strong>{release.tracks.length} {release.tracks.length === 1 ? 'marcha' : 'marchas'}</strong></div>
                  <ol>
                    {release.tracks.map((track) => (
                      <li key={track.id}>
                        <span className={styles.trackNumber}>{String(track.sequenceNo).padStart(2, '0')}</span>
                        <div className={styles.trackCopy}>
                          {track.marchSlug ? <Link href={`/marchas/${track.marchSlug}`} className={styles.trackTitle}>{track.title}</Link> : <strong className={styles.trackTitle}>{track.title}</strong>}
                          {track.composers.length ? (
                            <div className={styles.relationshipLine}><span>Composición</span><div>{track.composers.map((composer, index) => <span key={composer.id}>{index ? ' · ' : ''}{composer.slug ? <Link href={`/autores/${composer.slug}`}>{composer.name}</Link> : composer.name}</span>)}</div></div>
                          ) : null}
                          {track.dedications.length ? (
                            <div className={styles.relationshipLine}><span>Dedicada a</span><div>{track.dedications.map((dedication, index) => { const href = entityHref(dedication); return <span key={`${dedication.id}-${index}`}>{index ? ' · ' : ''}{href ? <Link href={href}>{dedication.name || dedication.text}</Link> : dedication.name || dedication.text}</span> })}</div></div>
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
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
