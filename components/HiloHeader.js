'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './HiloHeader.module.css';

const sections = [
  ['inicio', 'Inicio'],
  ['tiradelhilo', 'Tira del hilo'],
  ['hoy', 'Hoy'],
  ['extraordinarias', 'Extraordinarias'],
  ['enciclopedia', 'Enciclopedia'],
];

export default function HiloHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(pathname === '/' ? 'inicio' : '');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (pathname !== '/') return undefined;
    const elements = sections
      .map(([id]) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-22% 0px -60% 0px', threshold: [0, 0.1, 0.25, 0.5] }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  const hrefFor = (id) => (pathname === '/' ? `#${id}` : `/#${id}`);

  if (pathname.startsWith('/panel')) return null;

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={`shell ${styles.inner}`}>
          <Link href="/" className={styles.brand} aria-label="Hilo Cofrade, inicio">
            <span className={styles.brandRail} aria-hidden="true">
              <span className={styles.brandLine} />
              <span className={styles.brandNode} />
            </span>
            <span className={styles.brandWord}>
              <strong>Hilo</strong>
              <span>Cofrade</span>
            </span>
          </Link>

          <nav className={styles.desktopNav} aria-label="Navegación principal">
            {sections.map(([id, label]) => (
              <a
                key={id}
                href={hrefFor(id)}
                className={active === id ? styles.active : ''}
              >
                {label}
              </a>
            ))}
          </nav>

          <a className={styles.collabButton} href={pathname === '/' ? '#colabora' : '/#colabora'}>
            <span />Colabora
          </a>

          <button
            className={`${styles.menuButton} ${open ? styles.menuOpen : ''}`}
            type="button"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? '×' : '☰'}
          </button>
        </div>
        <div className={styles.accent} />
      </header>

      <div className={`${styles.mobilePanel} ${open ? styles.panelOpen : ''}`}>
        <div className="shell">
          <nav className={styles.mobileLinks} aria-label="Menú móvil">
            {sections.map(([id, label]) => (
              <a
                key={id}
                href={hrefFor(id)}
                className={active === id ? styles.activeMobile : ''}
                onClick={() => setOpen(false)}
              >
                {label}<span>→</span>
              </a>
            ))}
          </nav>
          <div className={styles.mobileCta}>
            <a href={pathname === '/' ? '#colabora' : '/#colabora'} onClick={() => setOpen(false)}>
              Colabora con Hilo Cofrade <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
