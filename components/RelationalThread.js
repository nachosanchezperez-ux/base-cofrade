import Link from 'next/link';
import styles from './RelationalThread.module.css';

function uniqueItems(items = [], maxItems = 8) {
  const seen = new Set();

  return items
    .filter((item) => item?.href && item?.title)
    .filter((item) => {
      if (seen.has(item.href)) return false;
      seen.add(item.href);
      return true;
    })
    .slice(0, maxItems);
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
}) {
  const visibleItems = uniqueItems(items, maxItems);

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
              <Link className={styles.card} href={item.href} key={item.href}>
                <span className={styles.cardNode} aria-hidden="true" />
                <div className={styles.cardTopline}>
                  <small>{item.kind || 'Relación'}</small>
                  {item.relation ? <span>{item.relation}</span> : null}
                </div>
                <strong>{item.title}</strong>
                {item.context ? <p>{item.context}</p> : null}
                <span className={styles.arrow} aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
