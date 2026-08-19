'use client';

import { useState } from 'react';
import styles from './HomeMarchPlayer.module.css';

export default function HomeMarchPlayer({ videoId, listenUrl, title }) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!videoId && !listenUrl) return null;

  if (!videoId) {
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

  return (
    <div className={`${styles.root} ${styles.playing}`}>
      <div className={styles.playerFrame}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`}
          title={`Escuchar ${title} en Hilo Cofrade`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <div className={styles.playerFooter}>
        <span>Reproduciendo en Hilo Cofrade</span>
        <button type="button" onClick={() => setIsPlaying(false)}>Cerrar</button>
      </div>
    </div>
  );
}
