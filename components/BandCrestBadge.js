import Image from 'next/image'
import { normalizeLogoBackgroundColor } from '@/lib/bands/logo-background'
import { MusicIcon } from './icons/LucideIcons'
import styles from './BandCrestBadge.module.css'

// Escudo de una banda sobre su color de fondo (el mismo criterio que las
// Crucetas). Sin escudo, una nota musical en la paleta de Hilo.
export default function BandCrestBadge({ logoPath = '', background = '', size = 40, className = '' }) {
  const color = normalizeLogoBackgroundColor(background) || '#FFFFFF'
  return <span
    className={`${styles.badge} ${logoPath ? '' : styles.empty} ${className}`}
    style={{ '--crest-size': `${size}px`, ...(logoPath ? { background: color } : {}) }}
    aria-hidden="true"
  >
    {logoPath
      ? <Image src={logoPath} alt="" width={size * 2} height={size * 2} sizes={`${size}px`} />
      : <MusicIcon size={Math.round(size * 0.45)} />}
  </span>
}
