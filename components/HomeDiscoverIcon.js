// Pictogramas de las secciones de «Descubre Hilo Cofrade». SVG en línea, sin
// peticiones adicionales; heredan el color del texto (currentColor).
const PATHS = {
  // Escudo con cruz.
  brotherhood: (
    <>
      <path d="M12 2.8 19.5 6v5.4c0 4.6-3.1 8.2-7.5 10-4.4-1.8-7.5-5.4-7.5-10V6Z" />
      <path d="M12 7.5v9M8.6 10.7h6.8" />
    </>
  ),
  // Tambor con baquetas.
  band: (
    <>
      <ellipse cx="12" cy="9" rx="7.5" ry="2.6" />
      <path d="M4.5 9v8c0 1.4 3.4 2.6 7.5 2.6s7.5-1.2 7.5-2.6V9" />
      <path d="M8 12v7M16 12v7M12 12.4v7.2" />
      <path d="m6.5 2.8 3.6 4.4M17.5 2.8l-3.6 4.4" />
    </>
  ),
  // Notas musicales.
  march: (
    <>
      <path d="M9 18V5.5l11-2.3v12.6" />
      <path d="M9 9.2l11-2.3" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="17.5" cy="15.8" r="2.5" />
    </>
  ),
  // Corona con resplandor.
  image: (
    <>
      <path d="M4.5 18.5 3.5 9l4.6 3.6L12 6.2l3.9 6.4L20.5 9l-1 9.5Z" />
      <path d="M4.5 21.2h15" />
      <circle cx="12" cy="3.2" r="1" />
    </>
  ),
  // Paso: canastilla, candelería y maniguetas.
  step: (
    <>
      <path d="M3 15.5h18v3.2H3Z" />
      <path d="M5.2 15.5 6.4 11h11.2l1.2 4.5" />
      <path d="M8.5 11V6.8M12 11V4.6M15.5 11V6.8" />
      <path d="M.8 17.1H3M21 17.1h2.2" />
    </>
  ),
  // Calendario.
  agenda: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 9.8h17M8 2.8v4.2M16 2.8v4.2" />
      <path d="M7.5 13.5h2M11 13.5h2M14.5 13.5h2M7.5 17h2M11 17h2" />
    </>
  ),
}

export default function HomeDiscoverIcon({ name, className = '' }) {
  const shape = PATHS[name]
  if (!shape) return null
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {shape}
    </svg>
  )
}
