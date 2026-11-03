import Image from 'next/image'
import { normalizeLogoBackgroundColor } from '@/lib/bands/logo-background'
import styles from './crucetas.module.css'

// Escudo de la banda sobre su color de fondo (el del Panel; blanco si no hay),
// para que se lea igual en una tarjeta clara que en la cabecera oscura.
// Sin escudo no se pinta nada: ni hueco ni icono de relleno.
export default function BandCrest({ band, size = 52, className = '' }) {
  if (!band?.logoPath) return null
  const background = normalizeLogoBackgroundColor(band.logoBackground) || '#FFFFFF'

  return (
    <span
      className={`${styles.bandCrest} ${className}`}
      style={{ width: size, height: size, background }}
      aria-hidden="true"
    >
      <Image src={band.logoPath} alt="" width={size} height={size} sizes={`${size}px`} />
    </span>
  )
}
