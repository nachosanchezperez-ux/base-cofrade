'use client';

import Link from 'next/link';
import styles from './HiloGraphPath.module.css';

export function isGraphPathResponse(response = {}) {
  const items = Array.isArray(response.items) ? response.items : [];
  return /^He encontrado un camino documentado/i.test(String(response.answer || ''))
    && items.length > 0
    && items.every((item) => String(item.label || '').includes(' → '));
}

function nodeByName(entities = []) {
  return new Map((entities || []).map((entity) => [entity.name, entity]));
}

function Node({ name, entity, position }) {
  const content = (
    <>
      <span>{entity?.type || (position === 'start' ? 'Origen' : 'Nodo')}</span>
      <strong>{name}</strong>
    </>
  );

  return entity?.href ? (
    <Link className={styles.node} href={entity.href}>{content}</Link>
  ) : (
    <div className={styles.node}>{content}</div>
  );
}

function RelationReference({ references = [] }) {
  const first = references[0];
  if (!first) return null;
  const content = (
    <>
      <b>Fuente exacta</b>
      <span>{first.name}</span>
      {references.length > 1 ? <small>+{references.length - 1}</small> : null}
    </>
  );

  return first.url ? (
    <a className={styles.relationReference} href={first.url} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    <span className={styles.relationReference}>{content}</span>
  );
}

export default function HiloGraphPath({ response }) {
  const items = response?.items || [];
  const byName = nodeByName(response?.entities || []);
  const edges = items.map((item) => {
    const [from = '', to = ''] = String(item.label || '').split(' → ');
    return {
      from,
      to,
      meta: item.meta || '',
      relationReferences: item.relationReferences || [],
    };
  });

  if (!edges.length) return null;

  return (
    <section className={styles.root} aria-label="Ruta documentada entre entidades">
      <header>
        <span>Ruta encontrada</span>
        <strong>{edges.length} {edges.length === 1 ? 'relación' : 'relaciones'}</strong>
      </header>

      <div className={styles.path}>
        <Node name={edges[0].from} entity={byName.get(edges[0].from)} position="start" />
        {edges.map((edge, index) => (
          <div className={styles.segment} key={`${edge.from}-${edge.to}-${index}`}>
            <div className={styles.connector} aria-label={edge.meta || 'Relación documentada'}>
              <i aria-hidden="true" />
              <div className={styles.connectorCopy}>
                <span>{edge.meta || 'Relación documentada'}</span>
                <RelationReference references={edge.relationReferences} />
              </div>
              <i aria-hidden="true" />
            </div>
            <Node name={edge.to} entity={byName.get(edge.to)} position="next" />
          </div>
        ))}
      </div>

      <footer>
        El camino se construye únicamente con relaciones publicadas en el grafo.
        {response.exactRelationReferenceCount ? ` ${response.exactRelationReferenceCount} fuentes están enlazadas directamente a los registros utilizados.` : ''}
      </footer>
    </section>
  );
}
