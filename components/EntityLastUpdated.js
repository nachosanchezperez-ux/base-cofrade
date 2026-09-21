import styles from './EntityLastUpdated.module.css';

export function formatEntityUpdateDate(value) {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  }).format(date);
}

function UpdateIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M20 11a8 8 0 1 0-2.34 5.66" />
      <path d="M20 5v6h-6" />
      <path d="M12 8v4l2.5 1.5" />
    </svg>
  );
}

function UpdateMeta({ value }) {
  const label = formatEntityUpdateDate(value);
  if (!label) return null;

  const date = new Date(value);

  return (
    <div className={styles.meta} data-hilo-section="entity-last-updated">
      <span className={styles.icon} aria-hidden="true"><UpdateIcon /></span>
      <span className={styles.copy}>
        <span className={styles.label}>Última actualización</span>
        <time dateTime={date.toISOString()}>{label}</time>
      </span>
    </div>
  );
}

export default function EntityLastUpdated({ value, variant = 'inline' }) {
  if (!formatEntityUpdateDate(value)) return null;

  if (variant === 'bar') {
    return (
      <div className={styles.bar}>
        <div className="shell">
          <UpdateMeta value={value} />
        </div>
      </div>
    );
  }

  return <UpdateMeta value={value} />;
}
