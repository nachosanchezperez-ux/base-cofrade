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

function isDirectReference(reference) {
  return Boolean(reference.exact)
    || (reference.scopes || []).some((scope) => /^exacta\b/i.test(String(scope)))
}

function ReferenceGroup({ title, items }) {
  if (!items.length) return null

  return (
    <section className={styles.group}>
      <header>
        <div>
          <span aria-hidden="true">↗</span>
          <strong>{title}</strong>
        </div>
        <small>{items.length} {items.length === 1 ? 'fuente' : 'fuentes'}</small>
      </header>

      <div className={styles.list}>
        {items.map((reference) => reference.url ? (
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
    </section>
  )
}

export default function HiloReferences({ items = [], note = '' }) {
  if (!Array.isArray(items) || !items.length) return null;
  const visibleItems = items.slice(0, 4)
  const direct = visibleItems.filter(isDirectReference)
  const general = visibleItems.filter((reference) => !isDirectReference(reference))

  return (
    <aside className={styles.root} aria-label="Fuentes de la respuesta">
      <ReferenceGroup title="Fuentes que respaldan la respuesta" items={direct} />
      <ReferenceGroup title="Fuentes generales de las entidades" items={general} />

      {note ? <p>{note}</p> : null}
    </aside>
  );
}
