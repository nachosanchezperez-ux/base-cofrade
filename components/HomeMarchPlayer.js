'use client';

import { useState } from 'react';
import styles from './HomeMarchPlayer.module.css';

function spotifyTrackIdFromUrl(url = '') {
  const match = String(url).match(/open\.spotify\.com\/(?:intl-[^/]+\/)?track\/([A-Za-z0-9]+)/i);
  return match?.[1] || '';
}

export default function HomeMarchPlayer({ videoId, listenUrl, title }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const spotifyTrackId = spotifyTrackIdFromUrl(listenUrl);
  const canEmbed = Boolean(videoId || spotifyTrackId);

  if (!videoId && !listenUrl) return null;

  if (!canEmbed) {
    return (
      <div className={styles.root}>
        <a className={styles.listenButton} href={listenUrl} target="_blank" rel="noopener noreferrer">
          Escuchar en la plataforma ↗
        </a>
      </div>
    );
  }

  if (!isPlaying) {
    return (
      <div className={styles.root}>
        <button className={styles.listenButton} type="button" onClick={() => setIsPlaying(true)}>
          <span aria-hidden="true">▶</span>
          Escuchar aquí
        </button>
      </div>
    );
  }

  const embedUrl = videoId
    ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`
    : `https://open.spotify.com/embed/track/${encodeURIComponent(spotifyTrackId)}?utm_source=generator`;

  return (
    <div className={`${styles.root} ${styles.playing}`}>
      <div className={`${styles.playerFrame} ${spotifyTrackId && !videoId ? styles.spotifyFrame : ''}`}>
        <iframe
          src={embedUrl}
          title={`Escuchar ${title} en Hilo Cofrade`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <div className={styles.playerFooter}>
        <span>Reproductor en Hilo Cofrade</span>
        <button type="button" onClick={() => setIsPlaying(false)}>Cerrar</button>
      </div>
    </div>
  );
}
