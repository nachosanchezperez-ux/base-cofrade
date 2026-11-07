// Iconos de Lucide (https://lucide.dev), versión 0.460.0, copiados como SVG.
// Licencia ISC: Copyright (c) Lucide Contributors; partes de Feather (MIT),
// Copyright (c) Cole Bemis. Se incluyen solo los que usa la web, sin añadir
// dependencias. Trazo con currentColor: toman el color del texto.

function Icon({ size = 20, strokeWidth = 2, className = '', children, title = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  )
}

export function CalendarPlusIcon(props) {
  return <Icon {...props}><path d="M8 2v4" /><path d="M16 2v4" /><path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" /><path d="M3 10h18" /><path d="M16 19h6" /><path d="M19 16v6" /></Icon>
}

export function Share2Icon(props) {
  return <Icon {...props}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></Icon>
}

export function MessageCircleIcon(props) {
  return <Icon {...props}><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></Icon>
}

export function NavigationIcon(props) {
  return <Icon {...props}><polygon points="3 11 22 2 13 21 11 13 3 11" /></Icon>
}

export function MusicIcon(props) {
  return <Icon {...props}><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></Icon>
}

export function ClockIcon(props) {
  return <Icon {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon>
}

export function RouteIcon(props) {
  return <Icon {...props}><circle cx="6" cy="19" r="3" /><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" /><circle cx="18" cy="5" r="3" /></Icon>
}

export function ChurchIcon(props) {
  return <Icon {...props}><path d="M10 9h4" /><path d="M12 7v5" /><path d="M14 22v-4a2 2 0 0 0-4 0v4" /><path d="M18 22V5.618a1 1 0 0 0-.553-.894l-4.553-2.277a2 2 0 0 0-1.788 0L6.553 4.724A1 1 0 0 0 6 5.618V22" /><path d="m18 7 3.447 1.724a1 1 0 0 1 .553.894V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.618a1 1 0 0 1 .553-.894L6 7" /></Icon>
}

export function FlagIcon(props) {
  return <Icon {...props}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" x2="4" y1="22" y2="15" /></Icon>
}

export function ImageDownIcon(props) {
  return <Icon {...props}><path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21" /><path d="m14 19 3 3v-5.5" /><path d="m17 22 3-3" /><circle cx="9" cy="9" r="2" /></Icon>
}

export function ChevronRightIcon(props) {
  return <Icon {...props}><path d="m9 18 6-6-6-6" /></Icon>
}

export function PlusIcon(props) {
  return <Icon {...props}><path d="M5 12h14" /><path d="M12 5v14" /></Icon>
}

export function LinkIcon(props) {
  return <Icon {...props}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></Icon>
}

export function CrownIcon(props) {
  return <Icon {...props}><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" /><path d="M5 21h14" /></Icon>
}

export function UserRoundIcon(props) {
  return <Icon {...props}><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></Icon>
}

export function BookOpenIcon(props) {
  return <Icon {...props}><path d="M12 7v14" /><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" /></Icon>
}
