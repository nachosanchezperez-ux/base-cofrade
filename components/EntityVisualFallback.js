export default function EntityVisualFallback({ className = '' }) {
  return (
    <span
      className={className}
      aria-hidden="true"
      data-hilo-entity-visual-fallback="true"
    >
      <svg
        viewBox="0 0 112 56"
        focusable="false"
        role="presentation"
        style={{
          display: 'block',
          width: '62%',
          maxWidth: '112px',
          height: 'auto',
          overflow: 'visible',
          color: '#B01B32',
        }}
      >
        <line
          x1="30"
          y1="28"
          x2="82"
          y2="28"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <circle cx="30" cy="28" r="10" fill="currentColor" />
        <circle cx="82" cy="28" r="10" fill="currentColor" />
      </svg>
    </span>
  )
}
