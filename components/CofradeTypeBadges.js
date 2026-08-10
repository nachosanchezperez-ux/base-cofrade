export function CofradeIcon({ tipo, size = 22, className = '' }) {
  const key = (tipo || '').toLowerCase();

  if (key.includes('penitencia')) {
    return (
      <span
        className={`source-capirote cofrade-type-capirote ${className}`.trim()}
        aria-hidden="true"
      />
    );
  }

  if (key.includes('gloria')) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M13 51 22 14l10 25 10-25 9 37" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 42h30M32 10v38" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <path d="m26 17 6-7 6 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 54h22" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round"/>
      </svg>
    );
  }

  if (key.includes('sacramental')) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <circle cx="32" cy="27" r="12" stroke="currentColor" strokeWidth="3.2"/>
        <circle cx="32" cy="27" r="5" stroke="currentColor" strokeWidth="2.5"/>
        <path d="M32 4v8M32 42v9M9 27h8M47 27h8M16 11l6 6M42 37l6 6M48 11l-6 6M22 37l-6 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <path d="M26 51h12l5 7H21l5-7Z" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round"/>
      </svg>
    );
  }

  return null;
}

export default function CofradeTypeBadges({ tipos = [], compact = false }) {
  return (
    <div className={`cofrade-type-badges ${compact ? 'is-compact' : ''}`}>
      {tipos.map((tipo) => {
        const isPenitencia = (tipo || '').toLowerCase().includes('penitencia');

        return (
          <span className="cofrade-type-badge" key={tipo}>
            <span className={`cofrade-type-icon ${isPenitencia ? 'is-source-capirote' : ''}`}>
              <CofradeIcon tipo={tipo} size={compact ? 17 : 21} />
            </span>
            <span>{tipo}</span>
          </span>
        );
      })}
    </div>
  );
}
