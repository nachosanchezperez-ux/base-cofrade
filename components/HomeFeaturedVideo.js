import Link from 'next/link'
import styles from './HomeFeaturedVideo.module.css'

export default function HomeFeaturedVideo({ video }) {
  if (!video?.videoId) return null

  const meta = [
    video.time ? `${video.time} h` : '',
    video.municipality,
    video.brotherhoodName,
  ].filter(Boolean)

  return (
    <section className={styles.section} aria-labelledby="home-featured-video-title">
      <div className="shell">
        <article className={styles.card}>
          <div className={styles.copy}>
            <span className={styles.eyebrow}>Retransmisión de hoy</span>
            <h2 id="home-featured-video-title">{video.title}</h2>
            {meta.length ? <p className={styles.meta}>{meta.join(' · ')}</p> : null}
            {video.description ? <p className={styles.description}>{video.description}</p> : null}
            <div className={styles.actions}>
              <Link href={video.href}>Abrir ficha completa <span aria-hidden="true">→</span></Link>
              <a href={video.sourceUrl} target="_blank" rel="noreferrer">Ver en YouTube ↗</a>
            </div>
          </div>

          <div className={styles.videoFrame}>
            <iframe
              src={video.embedUrl}
              title={video.videoTitle}
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </article>
      </div>
    </section>
  )
}
