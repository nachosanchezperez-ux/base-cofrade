'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import GlobalHiloSearch from './GlobalHiloSearch';
import styles from './HiloHeader.module.css';

const sections = [
  ['inicio', 'Inicio'],
  ['tiradelhilo', 'Tira del hilo'],
  ['extraordinarias', 'Extraordinarias'],
  ['igualas-ensayos', 'Igualás y ensayos'],
  ['hoy', 'Hoy'],
];

const homeScrollSections = [
  ['inicio', 'inicio'],
  ['tiradelhilo', 'tiradelhilo'],
  ['extraordinarias', 'extraordinarias'],
  ['hoy', 'hoy'],
  ['ultimos-hilos', 'ultimos-hilos'],
  ['siguientes-extraordinarias', 'extraordinarias'],
  ['enciclopedia', 'explorar'],
];

const directoryLinks = [
  ['/directorio', 'Directorio'],
  ['/hermandades', 'Hermandades'],
  ['/procesiones-de-gloria', 'Procesiones de Gloria'],
  ['/imagenes', 'Imágenes'],
  ['/pasos', 'Pasos'],
  ['/bandas', 'Bandas'],
];

function routeActive(pathname) {
  if (pathname === '/') return 'inicio';
  if (pathname.startsWith('/pregunta')) return 'tiradelhilo';
  if (pathname.startsWith('/extraordinarias')) return 'extraordinarias';
  if (pathname.startsWith('/igualas-y-ensayos')) return 'igualas-ensayos';
  return '';
}

export default function HiloHeader() {
  const pathname = usePathname();
  const headerRef = useRef(null);
  const exploreRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(routeActive(pathname));
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    exploreRef.current?.removeAttribute('open');
    if (pathname !== '/') setActive(routeActive(pathname));
  }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event) => event.key === 'Escape' && setOpen(false);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    const onPointerDown = (event) => {
      const menu = exploreRef.current;
      if (menu?.hasAttribute('open') && !menu.contains(event.target)) menu.removeAttribute('open');
    };
    const onKeyDown = (event) => event.key === 'Escape' && exploreRef.current?.removeAttribute('open');
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (pathname !== '/') return undefined;
    let frame = 0;
    const updateActiveSection = () => {
      frame = 0;
      const markerY = (headerRef.current?.getBoundingClientRect().height || 0) + 18;
      const targets = homeScrollSections
        .map(([id, activeId]) => ({ element: document.getElementById(id), activeId }))
        .filter(({ element }) => Boolean(element))
        .map((target) => ({ ...target, top: target.element.getBoundingClientRect().top }))
        .sort((a, b) => a.top - b.top);
      if (!targets.length) return;
      let nextActive = targets[0].activeId;
      for (const target of targets) {
        if (target.top > markerY) break;
        nextActive = target.activeId;
      }
      setActive(nextActive);
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveSection);
    };
    scheduleUpdate();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('hashchange', scheduleUpdate);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('hashchange', scheduleUpdate);
    };
  }, [pathname]);

  const hrefFor = (id) => {
    if (id === 'extraordinarias') return '/extraordinarias';
    if (id === 'igualas-ensayos') return '/igualas-y-ensayos';
    return pathname === '/' ? `#${id}` : `/#${id}`;
  };
  const isDirectoryActive = directoryLinks.some(([href]) => pathname.startsWith(href));
  const isExploreActive = active === 'explorar' || isDirectoryActive;
  const closeExplore = () => exploreRef.current?.removeAttribute('open');

  if (pathname.startsWith('/panel')) return null;

  return (
    <>
      <header ref={headerRef} className={`${styles.header} ${scrolled ? styles.scrolled : ''}`} data-hilo-header>
        <div className={`shell ${styles.inner}`}>
          <Link href="/" className={styles.brand} aria-label="Hilo Cofrade, inicio">
            <Image
              src="/brand/logo-header.svg"
              alt=""
              width={510}
              height={72}
              priority
              className={styles.brandLogo}
            />
          </Link>

          <nav className={styles.desktopNav} aria-label="Navegación principal">
            {sections.map(([id, label]) => (
              <a key={id} href={hrefFor(id)} className={active === id ? styles.active : ''} aria-current={active === id ? 'location' : undefined} onClick={() => { setActive(id); closeExplore(); }}>
                {label}
              </a>
            ))}
            <details ref={exploreRef} className={styles.exploreMenu}>
              <summary className={isExploreActive ? styles.active : ''}>Explorar</summary>
              <div className={styles.directoryPopover}>
                {directoryLinks.map(([href, label]) => (
                  <Link href={href} key={href} className={pathname.startsWith(href) ? styles.currentDirectory : ''} aria-current={pathname.startsWith(href) ? 'page' : undefined} onClick={closeExplore}>
                    {label}<span>→</span>
                  </Link>
                ))}
              </div>
            </details>
          </nav>

          <GlobalHiloSearch />

          <button className={`${styles.menuButton} ${open ? styles.menuOpen : ''}`} type="button" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} aria-controls="hilo-mobile-menu" onClick={() => setOpen((value) => !value)}>
            {open ? '×' : '☰'}
          </button>
        </div>
        <div className={styles.accent} />
      </header>

      <div id="hilo-mobile-menu" className={`${styles.mobilePanel} ${open ? styles.panelOpen : ''}`} aria-hidden={!open}>
        <div className="shell">
          <nav className={styles.mobileLinks} aria-label="Menú móvil">
            {sections.map(([id, label]) => (
              <a key={id} href={hrefFor(id)} className={active === id ? styles.activeMobile : ''} aria-current={active === id ? 'location' : undefined} onClick={() => { setActive(id); setOpen(false); }}>
                {label}<span>→</span>
              </a>
            ))}
          </nav>
          <div className={`${styles.mobileDirectories} ${active === 'explorar' ? styles.mobileDirectoriesActive : ''}`}>
            <span>Enciclopedia</span>
            <nav aria-label="Directorios de la enciclopedia">
              {directoryLinks.map(([href, label]) => (
                <Link href={href} key={href} className={pathname.startsWith(href) ? styles.activeMobile : ''} aria-current={pathname.startsWith(href) ? 'page' : undefined} onClick={() => setOpen(false)}>
                  {label}<span>→</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
