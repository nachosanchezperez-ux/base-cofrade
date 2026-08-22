'use client';

import styles from './HiloReferences.module.css';

function ReferenceContent({ reference }) {
  return (
    <>
      <span>{reference.type || 'Fuente'}</span>
      <strong>{reference.name}</strong>
      <small>
        {[reference.publisher, ...(reference.scopes || []).slice(0, 1)].filter(Boolean).join(' · ')}
      </small>
    </>
  );
}

export default function HiloReferences({ items = [], note = '' }) {
  if (!Array.isArray(items) || !items.length) return null;

  return (
    <aside className={styles.root} aria-label="Fuentes vinculadas">
      <header>
        <div>
          <span aria-hidden="true">↗</span>
          <strong>Fuentes vinculadas</strong>
        </div>
        <small>{items.length} {items.length === 1 ? 'fuente' : 'fuentes'}</small>
      </header>

      <div className={styles.list}>
        {items.slice(0, 4).map((reference) => reference.url ? (
          <a
            className={styles.reference}
            href={reference.url}
            target="_blank"
            rel="noopener noreferrer"
            key={reference.id}
          >
            <ReferenceContent reference={reference} />
            <b aria-hidden="true">↗</b>
          </a>
        ) : (
          <div className={styles.reference} key={reference.id}>
            <ReferenceContent reference={reference} />
          </div>
        ))}
      </div>

      {note ? <p>{note}</p> : null}
    </aside>
  );
}
