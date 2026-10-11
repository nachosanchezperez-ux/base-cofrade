import Link from 'next/link'
import styles from './DirectoryIntroLink.module.css'

export default function DirectoryIntroLink({ href, children }) {
  return (
    <Link href={href} prefetch={false} className={styles.link}>
      {children}
    </Link>
  )
}
