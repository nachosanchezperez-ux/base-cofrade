'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './HiloFooter.module.css';

export default function HiloFooter() {
  const pathname = usePathname();
  if (pathname.startsWith('/panel')) return null;

  return (
    <footer className={styles.footer}>
      <div className={`shell ${styles.inner}`}>
        <div className={styles.brand} aria-label="Hilo Cofrade">
          <Image
            src="/brand/logo.svg"
            alt=""
            width={680}
            height={270}
            className={styles.brandLogo}
          />
        </div>
        <div className={styles.meta}>
          <nav aria-label="Información legal">
            <Link href="/colabora">Colabora</Link>
            <Link href="/aviso-legal">Aviso legal</Link>
            <Link href="/privacidad">Privacidad</Link>
            <Link href="/cookies">Cookies</Link>
          </nav>
          <small>Proyecto creado por Nacho Sánchez · @desdeelarenal</small>
        </div>
      </div>
    </footer>
  );
}
