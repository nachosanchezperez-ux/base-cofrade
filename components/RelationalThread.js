'use client';

import Link from 'next/link';
import { prepareRelationalItems } from '@/lib/relational-thread';
import styles from './RelationalThread.module.css';

function sendTelemetry(payload) {
  if (typeof window === 'undefined') return;

  const body = JSON.stringify({
    ...payload,
    path: window.location.pathname,
  });

  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    navigator.sendBeacon(
      '/api/analytics/relational-thread',
      new Blob([body], { type: 'application/json' })
    );
    return;
  }

  fetch('/api/analytics/relational-thread', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {});
}

function RelationCard({ item, sourceType, sourceName }) {
  return (
    <Link
      className={styles.card}
      href={item.href}
      key={item.href}
      data-hilo-event="relational_thread_click"
      data-hilo-kind={item.kind || 'Relación'}
      data-hilo-relation={item.relation || ''}
      onClick={() => sendTelemetry({
        event: 'relational_thread_click',
        sourceType,
        source: sourceName,
        destinationType: item.kind || 'Relación',
        destination: item.href,
        relation: item.relation || '',
      })}
    >
      <span className={styles.cardNode} aria-hidden="true" />
      <div className={styles.cardTopline}>
        <small>{item.kind || 'Relación'}</small>
        {item.relation ? <span>{item.relation}</span> : null}
      </div>
      <strong>{item.title}</strong>
      {item.context ? <p>{item.context}</p> : null}
      <span className={styles.arrow} aria-hidden="true">→</span>
    </Link>
  );
}

export default function RelationalThread({
  id = 'tira-del-hilo',
  eyebrow = 'Tira del hilo',
  title = 'Sigue las relaciones',
  description = 'Cada ficha es un punto de entrada. Continúa por sus relaciones documentadas sin perder el contexto.',
  currentLabel = 'Estás en',
  currentName,
  currentMeta = '',
  items = [],
  maxItems = 8,
  priorityProfile = '',
}) {
  const sourceType = priorityProfile || currentLabel;
  const { visibleItems, hiddenItems } = prepareRelationalItems(items, {
    profile: sourceType,
    maxItems,
  });

  if (!currentName || visibleItems.length === 0) return null;

  return (
    <section className={styles.section} id={id} data-relational-thread>
      <div className={`shell ${styles.shell}`}>
        <header className={styles.heading}>
          <div>
            <span className={styles.eyebrow}>{eyebrow}</span>
            <h2>{title}</h2>
          </div>
          <p>{description}</p>
        </header>

        <div className={styles.thread}>
          <div className={styles.origin}>
            <span className={styles.originNode} aria-hidden="true" />
            <small>{currentLabel}</small>
            <strong>{currentName}</strong>
            {currentMeta ? <span>{currentMeta}</span> : null}
          </div>

          <div className={styles.destinations}>
            {visibleItems.map((item) => (
              <RelationCard
                item={item}
                key={item.href}
                sourceType={sourceType}
                sourceName={currentName}
              />
            ))}
          </div>
        </div>

        {hiddenItems.length > 0 ? (
          <details
            className={styles.more}
            data-hilo-event="relational_thread_expand"
            onToggle={(event) => {
              if (!event.currentTarget.open) return;
              sendTelemetry({
                event: 'relational_thread_expand',
                sourceType,
                source: currentName,
                hiddenCount: hiddenItems.length,
              });
            }}
          >
            <summary>
              <span>Ver todas las relaciones</span>
              <small>+{hiddenItems.length}</small>
              <b aria-hidden="true">＋</b>
            </summary>
            <div className={styles.moreGrid}>
              {hiddenItems.map((item) => (
                <RelationCard
                  item={item}
                  key={item.href}
                  sourceType={sourceType}
                  sourceName={currentName}
                />
              ))}
            </div>
          </details>
        ) : null}
      </div>
    </section>
  );
}
