import Image from 'next/image';

const TYPE_CONFIG = [
  {
    key: 'penitencia',
    label: 'Penitencia',
    icon: '/iconos/hermandades/penitencia.png',
  },
  {
    key: 'gloria',
    label: 'Gloria',
    icon: '/iconos/hermandades/gloria.png',
  },
  {
    key: 'sacramental',
    label: 'Sacramental',
    icon: '/iconos/hermandades/sacramental.png',
  },
];

function typeConfig(tipo) {
  const value = String(tipo || '').trim();
  const key = value.toLowerCase();
  return TYPE_CONFIG.find((item) => key.includes(item.key)) || {
    key,
    label: value,
    icon: null,
  };
}

export function CofradeIcon({ tipo, size = 22, className = '' }) {
  const config = typeConfig(tipo);
  if (!config.icon) return null;

  return (
    <Image
      className={className}
      src={config.icon}
      alt=""
      width={size}
      height={size}
      sizes={`${size}px`}
    />
  );
}

export default function CofradeTypeBadges({ tipos = [], compact = false }) {
  const normalizedTypes = [...new Map(
    tipos
      .filter(Boolean)
      .map(typeConfig)
      .map((item) => [item.key, item])
  ).values()].slice(0, 3);

  return (
    <div
      className={`cofrade-type-badges ${compact ? 'is-compact' : ''}`}
      data-count={normalizedTypes.length}
    >
      {normalizedTypes.map((tipo) => (
        <span className="cofrade-type-badge" key={tipo.key}>
          {tipo.icon ? (
            <span className="cofrade-type-icon">
              <CofradeIcon tipo={tipo.key} size={compact ? 38 : 44} />
            </span>
          ) : null}
          <span>{tipo.label}</span>
        </span>
      ))}
    </div>
  );
}
