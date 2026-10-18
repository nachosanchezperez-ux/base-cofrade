'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { activeMenuGroup, activeMenuHref, MENU_GROUPS } from '@/lib/site-navigation';
import GlobalHiloSearch from './GlobalHiloSearch';
import HiloUpdates from './HiloUpdates';
import styles from './HiloHeader.module.css';

// Menú en cinco grupos (Agenda, Hermandades, Música, Patrimonio, Actualidad),
// definido en lib/site-navigation.js y compartido por escritorio y móvil. En
// móvil, los grupos se pliegan: cinco filas con su resumen y uno abierto a la vez.
// La Tira del hilo es el botón de búsqueda; el logo lleva a la portada.

export default function HiloHeader() {
  const pathname = usePathname();
  const navRef = useRef(null);
  const [open, setOpen] = useState(false);
  // Menú móvil plegable: un grupo abierto a la vez (el de la página actual al abrir).
  const [mobileGroup, setMobileGroup] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const currentGroup = activeMenuGroup(pathname);
  const currentHref = activeMenuHref(pathname);

  const closeDesktopMenus = (except = null) => {
    navRef.current?.querySelectorAll('details[open]').forEach((menu) => {
      if (menu !== except) menu.removeAttribute('open');
    });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    closeDesktopMenus();
  }, [pathname]);

  useEffect(() => {
    const closeMenus = () => {
      setOpen(false);
      closeDesktopMenus();
    };
    window.addEventListener('hilo:open-updates', closeMenus);
    window.addEventListener('hilo:open-search', closeMenus);
    return () => {
      window.removeEventListener('hilo:open-updates', closeMenus);
      window.removeEventListener('hilo:open-search', closeMenus);
    };
  }, []);

  useEffect(() => {
    if (open) setMobileGroup(currentGroup);
  }, [open, currentGroup]);

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

  // Desplegables de escritorio: uno abierto a la vez; se cierran al pulsar
  // fuera o con Escape (el foco vuelve al título del grupo).
  useEffect(() => {
    const onPointerDown = (event) => {
      if (!navRef.current?.contains(event.target)) closeDesktopMenus();
    };
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      const openMenu = navRef.current?.querySelector('details[open]');
      if (!openMenu) return;
      openMenu.removeAttribute('open');
      openMenu.querySelector('summary')?.focus();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  if (pathname.startsWith('/panel')) return null;

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`} data-hilo-header>
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

          <nav ref={navRef} className={styles.desktopNav} aria-label="Navegación principal">
            {MENU_GROUPS.map((group) => (
              <details
                key={group.id}
                className={styles.groupMenu}
                onToggle={(event) => { if (event.currentTarget.open) closeDesktopMenus(event.currentTarget); }}
              >
                <summary className={currentGroup === group.id ? styles.active : ''}>{group.label}</summary>
                <div className={styles.groupPopover}>
                  {group.sections.map((section, index) => (
                    <div className={styles.groupSection} key={section.title || index}>
                      {section.title ? <span className={styles.groupSectionTitle}>{section.title}</span> : null}
                      {section.links.map(([href, label]) => (
                        <Link
                          href={href}
                          key={href}
                          className={currentHref === href ? styles.currentLink : ''}
                          aria-current={currentHref === href ? 'page' : undefined}
                          onClick={() => closeDesktopMenus()}
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </nav>

          <div className={styles.actions}>
            <HiloUpdates />
            <GlobalHiloSearch />
            <button className={`${styles.menuButton} ${open ? styles.menuOpen : ''}`} type="button" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} aria-controls="hilo-mobile-menu" onClick={() => setOpen((value) => !value)}>
              {open ? '×' : '☰'}
            </button>
          </div>
        </div>
        <div className={styles.accent} />
      </header>

      <div id="hilo-mobile-menu" className={`${styles.mobilePanel} ${open ? styles.panelOpen : ''}`} aria-hidden={!open}>
        <div className="shell">
          <nav className={styles.mobileGroups} aria-label="Menú móvil">
            {MENU_GROUPS.map((group) => {
              const expanded = mobileGroup === group.id;
              return (
                <section className={`${styles.mobileGroup} ${expanded ? styles.mobileGroupOpen : ''}`} key={group.id}>
                  <h2 id={`menu-movil-${group.id}`}>
                    <button
                      type="button"
                      className={`${styles.mobileGroupToggle} ${currentGroup === group.id ? styles.mobileGroupActive : ''}`}
                      aria-expanded={expanded}
                      aria-controls={`menu-movil-${group.id}-enlaces`}
                      onClick={() => setMobileGroup(expanded ? '' : group.id)}
                    >
                      <span className={styles.mobileGroupLabel}>{group.label}</span>
                      {group.hint ? <span className={styles.mobileGroupHint}>{group.hint}</span> : null}
                      <span className={styles.mobileGroupChevron} aria-hidden="true" />
                    </button>
                  </h2>
                  <div id={`menu-movil-${group.id}-enlaces`} className={styles.mobileGroupBody} role="region" aria-labelledby={`menu-movil-${group.id}`} hidden={!expanded}>
                    {group.sections.map((section, index) => (
                      <div className={styles.mobileSection} key={section.title || index}>
                        {section.title ? <span className={styles.mobileSectionTitle}>{section.title}</span> : null}
                        <div className={styles.mobileLinks}>
                          {section.links.map(([href, label]) => (
                            <Link
                              href={href}
                              key={href}
                              className={currentHref === href ? styles.activeMobile : ''}
                              aria-current={currentHref === href ? 'page' : undefined}
                              onClick={() => setOpen(false)}
                            >
                              {label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
