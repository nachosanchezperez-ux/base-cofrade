import Link from 'next/link'
import styles from './SiteBreadcrumb.module.css'

export default function SiteBreadcrumb({
  items = [],
  tone = 'light',
  showAccent = true,
  ariaLabel = 'Migas de pan',
  className = '',
}) {
  const visibleItems = (items || []).filter((item) => item?.label)
  if (!visibleItems.length) return null

  return (
    <nav
      className={`${styles.breadcrumb} ${className}`.trim()}
      aria-label={ariaLabel}
      data-tone={tone}
      data-site-breadcrumb="true"
    >
      {showAccent ? <span className={styles.accent} aria-hidden="true" /> : null}
      <ol>
        {visibleItems.map((item, index) => {
          const isCurrent = index === visibleItems.length - 1

          return (
            <li key={`${item.label}-${index}`} data-current={isCurrent ? 'true' : undefined}>
              {item.href && !isCurrent ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span aria-current={isCurrent ? 'page' : undefined}>{item.label}</span>
              )}
              {!isCurrent ? <i aria-hidden="true">→</i> : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
