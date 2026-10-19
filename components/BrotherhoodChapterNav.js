'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './BrotherhoodChapterNav.module.css';

// Navegación de la ficha por capítulos. Todo el contenido llega renderizado en
// el servidor y los enlaces son anclas normales: sin JavaScript (y para Google)
// la ficha es una página larga y completa.
//
// Con JavaScript y pantalla de móvil se activa el «modo aplicación»: cada
// capítulo se ve como una pantalla propia, la barra inferior cambia de pantalla,
// el botón «atrás» del móvil vuelve a la anterior y cada pantalla recuerda
// dónde se quedó el lector. En ordenador sigue siendo una página continua con
// la barra superior adherida.

const ICONS = {
  inicio: <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" />,
  cortejo: <path d="M12 3v18M7.5 8h9" />,
  procesion: <path d="M5 18h14M6.5 18 5 9l4.5 3L12 6l2.5 6L19 9l-1.5 9" />,
  musica: <path d="M9 18V6l10-2v12M9 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm10-2a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />,
  patrimonio: <path d="M7 4h10l-1.5 6a3.5 3.5 0 0 1-7 0zM12 13.5V19M8 20h8" />,
  historia: <path d="M12 7v5l3 2M21 12a9 9 0 1 1-9-9 9 9 0 0 1 9 9Z" />,
  hilo: <path d="M2.5 15h4c4 0 1.5-7 5.5-7s1.5 9 5.5 9h4M6.5 15a1 1 0 1 0 0 .01M17.5 17a1 1 0 1 0 0 .01" />,
};

export function ChapterIcon({ icon, className }) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">{ICONS[icon]}</svg>;
}

const APP_QUERY = '(max-width: 899px)';

function chapterOf(element) {
  return element?.closest?.('[data-chapter]') || null;
}

function openAncestors(element) {
  for (let node = element?.parentElement; node; node = node.parentElement) {
    if (node.tagName === 'DETAILS') node.open = true;
  }
}

export default function BrotherhoodChapterNav({ items = [], name = '', crestSrc = '' }) {
  const [active, setActive] = useState(items[0]?.anchor || '');
  const [appMode, setAppMode] = useState(false);
  const [compactHeader, setCompactHeader] = useState(false);
  const rootRef = useRef(null);
  const scrollMemory = useRef({});
  const key = items.map((item) => item.anchor).join('|');

  const root = () => rootRef.current?.closest('[data-chapters-root]') || null;

  // Muestra un capítulo como pantalla (modo aplicación) o desplaza hasta él.
  const show = useCallback((anchor, { target = null, push = false, restore = false } = {}) => {
    const container = root();
    const section = anchor ? document.getElementById(anchor) : null;
    if (!container || !section) return;
    const app = container.dataset.app === 'on';

    if (app) {
      const previous = container.querySelector('[data-chapter][data-active]');
      if (previous && previous !== section) scrollMemory.current[previous.id] = window.scrollY;
      container.querySelectorAll('[data-chapter]').forEach((node) => {
        if (node === section) node.setAttribute('data-active', '');
        else node.removeAttribute('data-active');
      });
    }
    setActive(anchor);
    if (push) window.history.pushState(null, '', `#${target?.id || anchor}`);

    const destination = target || section;
    openAncestors(destination);
    if (app && restore && !target && scrollMemory.current[anchor] != null) {
      window.scrollTo({ top: scrollMemory.current[anchor], behavior: 'instant' });
    } else if (app && !target && section.id === items[0]?.anchor) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      destination.scrollIntoView({ block: 'start', behavior: app ? 'instant' : 'smooth' });
    }
    if (app && !target) {
      section.querySelector('[data-chapter-title]')?.focus({ preventScroll: true });
    }
  }, [key]);

  // Activa o desactiva el modo aplicación según el ancho de pantalla.
  useEffect(() => {
    const container = root();
    if (!container || typeof window.matchMedia !== 'function') return undefined;
    const query = window.matchMedia(APP_QUERY);
    const apply = () => {
      const on = query.matches;
      container.dataset.app = on ? 'on' : 'off';
      setAppMode(on);
      const hashTarget = window.location.hash ? document.getElementById(decodeURIComponent(window.location.hash.slice(1))) : null;
      const section = chapterOf(hashTarget);
      if (on) {
        const anchor = section?.id || items[0]?.anchor;
        container.querySelectorAll('[data-chapter]').forEach((node) => {
          if (node.id === anchor) node.setAttribute('data-active', '');
          else node.removeAttribute('data-active');
        });
        setActive(anchor);
        if (hashTarget) {
          openAncestors(hashTarget);
          requestAnimationFrame(() => hashTarget.scrollIntoView({ block: 'start', behavior: 'instant' }));
        }
      } else {
        container.querySelectorAll('[data-chapter]').forEach((node) => node.removeAttribute('data-active'));
      }
    };
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, [key]);

  // Cualquier enlace interno de la ficha (barra, tarjetas de Inicio, «Sigue con»,
  // «Ver culto →»…) lleva a su capítulo y abre lo que esté plegado.
  useEffect(() => {
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest?.('a[href^="#"]');
      if (!link || !link.closest('main')) return;
      const id = decodeURIComponent(link.getAttribute('href').slice(1));
      const target = id ? document.getElementById(id) : null;
      const section = chapterOf(target) || (target?.matches?.('[data-chapter]') ? target : null);
      if (!target || !section) return;
      event.preventDefault();
      const isChapter = target === section;
      show(section.id, { target: isChapter ? null : target, push: true, restore: isChapter });
    };
    const onPop = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      const section = chapterOf(target);
      if (section) show(section.id, { target: target === section ? null : target, restore: target === section });
      else show(items[0]?.anchor, { restore: true });
    };
    document.addEventListener('click', onClick);
    window.addEventListener('popstate', onPop);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('popstate', onPop);
    };
  }, [key, show]);

  // En ordenador (página continua) el capítulo activo sigue a la lectura.
  useEffect(() => {
    if (appMode || typeof IntersectionObserver === 'undefined') return undefined;
    const sections = items.map((item) => document.getElementById(item.anchor)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) setActive(visible[0].target.id);
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [appMode, key]);

  // Mini cabecera (móvil): escudo, nombre y capítulo cuando la portada sale de vista.
  useEffect(() => {
    if (!appMode) { setCompactHeader(false); return undefined; }
    const hero = document.getElementById('brotherhood-program-title');
    if (!hero || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(([entry]) => setCompactHeader(!entry.isIntersecting && entry.boundingClientRect.top < 0), { threshold: 0 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [appMode]);

  if (items.length < 2) return null;
  const current = items.find((item) => item.anchor === active) || items[0];

  return <div ref={rootRef} className={styles.wrapper}>
    {appMode ? <div className={`${styles.miniHeader} ${compactHeader ? styles.miniVisible : ''}`} aria-hidden={!compactHeader}>
      {crestSrc ? <img src={crestSrc} alt="" width={28} height={32} /> : null}
      <span><strong>{name}</strong><small>{current.label}</small></span>
    </div> : null}
    <nav className={styles.nav} aria-label="Capítulos de la ficha" data-count={items.length}>
      <ol className={styles.list}>
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className={styles.link}
              aria-current={active === item.anchor ? (appMode ? 'page' : 'location') : undefined}
            >
              <span className={styles.iconWrap}><ChapterIcon icon={item.icon} className={styles.icon} /></span>
              <span className={styles.label}>{item.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  </div>;
}
