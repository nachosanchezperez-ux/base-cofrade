import Link from 'next/link'
import styles from '@/app/panel/panel.module.css'

export default function PanelMetricLink({ href, label, value, note, ariaLabel }) {
  return (
    <Link
      className={`${styles.metricCard} panelMetricLink`}
      href={href}
      aria-label={ariaLabel || `${label}: ${value}. Abrir`}
    >
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
      <span className="panelMetricArrow" aria-hidden="true">→</span>
    </Link>
  )
}
