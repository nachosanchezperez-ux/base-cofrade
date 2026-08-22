'use client';

import styles from './HiloEvidence.module.css';

export default function HiloEvidence({ items = [] }) {
  if (!Array.isArray(items) || !items.length) return null;

  return (
    <aside className={styles.root} aria-label="Base de la respuesta">
      <div className={styles.heading}>
        <span aria-hidden="true" />
        <strong>Base de la respuesta</strong>
        <small>datos internos</small>
      </div>
      <div className={styles.items}>
        {items.slice(0, 4).map((item) => (
          <div className={styles.item} key={item.key || item.label} title={item.detail || ''}>
            <strong>{item.label}</strong>
            {item.detail ? <span>{item.detail}</span> : null}
          </div>
        ))}
      </div>
    </aside>
  );
}
