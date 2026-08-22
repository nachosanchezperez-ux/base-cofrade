'use client';

import styles from './HiloInlineReferences.module.css';

export default function HiloInlineReferences({ items = [], label = 'Fuente exacta' }) {
  if (!Array.isArray(items) || !items.length) return null;

  return (
    <div className={styles.root} aria-label={label}>
      <b>{label}</b>
      <div>
        {items.slice(0, 2).map((reference) => {
          const content = (
            <>
              <span>{reference.name}</span>
              {reference.type ? <small>{reference.type}</small> : null}
            </>
          );

          return reference.url ? (
            <a href={reference.url} target="_blank" rel="noopener noreferrer" key={reference.id || reference.name}>
              {content}<i aria-hidden="true">↗</i>
            </a>
          ) : (
            <span className={styles.reference} key={reference.id || reference.name}>{content}</span>
          );
        })}
      </div>
    </div>
  );
}
