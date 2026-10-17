import { Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { externalReleaseLinkLabel, presentReleaseType } from '@/lib/bands/discography'
import BandReleaseCover from './BandReleaseCover'
import styles from './BandDiscographySection.module.css'

function ordinalLabel(value) {
  if (!value) return ''
  return `${value}.º trabajo`
}

function entityHref(item) {
  if (!item?.slug) return ''
  if (item.entityType === 'image') return `/imagenes/${item.slug}`
  if (item.entityType === 'brotherhood') return `/hermandades/${item.slug}`
  if (item.entityType === 'band') return `/bandas/${item.slug}`
  return ''
}

function catalogLabel(releases) {
  const years = releases
    .map((release) => Number(release.year))
    .filter((year) => Number.isFinite(year))

  const count = `${releases.length} ${releases.length === 1 ? 'trabajo documentado' : 'trabajos documentados'}`
  if (!years.length) return count

  return `${count} · ${Math.min(...years)}—${Math.max(...years)}`
}

// Marcado ligero por pista (17/10/2026): una discografía puede tener cientos de
// pistas, todas en el HTML y repetidas en los datos de hidratación de React.
// Los estilos se aplican por estructura dentro de .trackList (sin una clase por
// elemento) y la analítica toma la sección del contenedor.
function joinNames(items) {
  return items.map((item) => item.name).filter(Boolean).join(' · ')
}

function TrackList({ tracks }) {
  if (!tracks.length) return null

  return (
    <div className={styles.trackList}>
      <div className={styles.trackHeading}>
        <span>Pistas</span>
        <strong>{tracks.length}</strong>
      </div>
      <ol>
        {tracks.map((track) => (
          <li key={track.id}>
            <span>{String(track.sequenceNo).padStart(2, '0')}</span>
            <div>
              {track.marchSlug ? (
                <Link href={`/marchas/${track.marchSlug}`}>{track.title}<span aria-hidden="true">↗</span></Link>
              ) : <strong>{track.title}</strong>}
              {track.composers.length ? (
                <p><span>Composición</span> {joinNames(track.composers)}</p>
              ) : null}
              {track.dedications.length ? (
                <p>
                  <span>Dedicada a</span>{' '}
                  {track.dedications.map((dedication, index) => {
                    const href = entityHref(dedication)
                    const label = dedication.name || dedication.text
                    return (
                      <Fragment key={`${dedication.id}-${index}`}>
                        {index ? ' · ' : ''}
                        {href ? <Link href={href}>{label}</Link> : label}
                      </Fragment>
                    )
                  })}
                </p>
              ) : null}
            </div>
            <div>
              {track.durationText ? <small>{track.durationText}</small> : null}
              {track.spotifyUrl ? (
                <a
                  href={track.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Escuchar ${track.title} en Spotify`}
                  data-hilo-event="spotify_click"
                  data-hilo-scope="track"
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

export default function BandDiscographySection({ releases = [], artistSpotifyUrl = '', bandName = '', logoPath = '' }) {
  if (!releases.length) return null

  const spotifyArtist = artistSpotifyUrl || releases[0]?.artistSpotifyUrl || ''
  const displayBandName = bandName || releases[0]?.bandName || ''
  const displayLogoPath = logoPath || releases[0]?.bandLogoPath || ''
  const catalog = catalogLabel(releases)

  return (
    <section className={styles.section} id="discografia" data-hilo-section="discography">
      <div className="shell">
        <header className={styles.heading}>
          <div className={styles.headingIdentity}>
            {displayLogoPath ? (
              <div className={styles.bandMark}>
                <Image
                  src={displayLogoPath}
                  alt={`Logotipo de ${displayBandName || 'la banda'}`}
                  width={66}
                  height={82}
                  sizes="(max-width: 760px) 44px, 66px"
                />
              </div>
            ) : null}
            <div className={styles.headingTitle}>
              <span>Patrimonio sonoro</span>
              <h2>Discografía</h2>
              <div className={styles.catalogMeta}>
                {displayBandName ? <strong>{displayBandName}</strong> : null}
                <small>{catalog}</small>
              </div>
            </div>
          </div>
          <div className={styles.headingAside}>
            <p>Abre un disco para explorar sus pistas, relaciones documentadas y enlaces de escucha.</p>
            {spotifyArtist ? (
              <a
                href={spotifyArtist}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.artistSpotifyLink}
                data-hilo-event="spotify_click"
                data-hilo-section="discography"
                data-hilo-scope="artist"
              >
                <span aria-hidden="true">▶</span>
                {displayBandName ? `Escuchar a ${displayBandName} en Spotify` : 'Escuchar perfil en Spotify'}
              </a>
            ) : null}
          </div>
        </header>

        <div className={styles.releaseList}>
          {releases.map((release) => (
            <details className={styles.release} key={release.id}>
              <summary
                className={styles.releaseSummary}
                data-hilo-event="discography_open"
                data-hilo-section="discography"
                data-hilo-scope="release"
              >
                <div className={styles.cover}>
                  <BandReleaseCover
                    src={release.coverImagePath}
                    alt={release.coverImageAlt || `Portada de ${release.title}`}
                    year={release.year}
                  />
                </div>
                <div className={styles.summaryCopy}>
                  <h3>{release.title}</h3>
                  <div className={styles.meta}>
                    {release.year ? <strong>{release.year}</strong> : null}
                    {presentReleaseType(release.type) ? <span>{presentReleaseType(release.type)}</span> : null}
                    {ordinalLabel(release.ordinalNumber) ? <span>{ordinalLabel(release.ordinalNumber)}</span> : null}
                    {release.tracks.length ? (
                      <span>{release.tracks.length} {release.tracks.length === 1 ? 'pista' : 'pistas'}</span>
                    ) : null}
                  </div>
                </div>
                <span className={styles.releaseToggle}>
                  <em className={styles.toggleClosed}>Abrir</em>
                  <em className={styles.toggleOpen}>Cerrar</em>
                  <b aria-hidden="true">+</b>
                </span>
              </summary>

              <div className={styles.releaseDetail}>
                <div className={styles.releaseInfo}>
                  {release.description ? <p>{release.description}</p> : null}
                  {release.dateText ? <small className={styles.dateText}>{release.dateText}</small> : null}
                  {release.coverImageCredit ? <small>{release.coverImageCredit}</small> : null}
                  {(release.spotifyUrl || release.externalUrl) ? (
                    <div className={styles.actions}>
                      {release.spotifyUrl ? (
                        <a
                          href={release.spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.secondaryLink}
                          data-hilo-event="spotify_click"
                          data-hilo-section="discography"
                          data-hilo-scope="release"
                        >Álbum completo en Spotify ↗</a>
                      ) : null}
                      {release.externalUrl ? <a href={release.externalUrl} target="_blank" rel="noopener noreferrer" className={styles.secondaryLink}>{externalReleaseLinkLabel(release.externalUrl)}</a> : null}
                    </div>
                  ) : null}
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
