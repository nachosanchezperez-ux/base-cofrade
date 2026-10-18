'use client';

import { useEffect, useState } from 'react';
import styles from './BrotherhoodChapterNav.module.css';

// Un solo sistema de navegación: barra inferior fija en móvil y barra superior
// adherida en ordenador (misma lista, distinta posición por CSS). Son enlaces de
// ancla normales: sin JavaScript también funcionan y todo el contenido está en
// el HTML del servidor. El JS solo marca el capítulo en curso.

const ICONS = {
  inicio: <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" />,
  cortejo: <path d="M12 3v18M7.5 8h9" />,
  procesion: <path d="M5 18h14M6.5 18 5 9l4.5 3L12 6l2.5 6L19 9l-1.5 9" />,
  musica: <path d="M9 18V6l10-2v12M9 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm10-2a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />,
  patrimonio: <path d="M7 4h10l-1.5 6a3.5 3.5 0 0 1-7 0zM12 13.5V19M8 20h8" />,
  historia: <path d="M12 7v5l3 2M21 12a9 9 0 1 1-9-9 9 9 0 0 1 9 9Z" />,
  hilo: <path d="M2.5 15h4c4 0 1.5-7 5.5-7s1.5 9 5.5 9h4M6.5 15a1 1 0 1 0 0 .01M17.5 17a1 1 0 1 0 0 .01" />,
};

export default function BrotherhoodChapterNav({ items = [] }) {
  const [active, setActive] = useState(items[0]?.href || '');
  const key = items.map((item) => item.href).join('|');

  // Un enlace interno (p. ej. «Ver culto →») a un apartado plegado lo abre antes
  // del salto, como en la versión lectura.
  useEffect(() => {
    const reveal = (hash) => {
      if (!hash?.startsWith('#') || hash.length < 2) return null;
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      for (let node = target?.parentElement; node; node = node.parentElement) {
        if (node.tagName === 'DETAILS') node.open = true;
      }
      return target;
    };
    const onClick = (event) => {
      const link = event.target.closest?.('a[href^="#"]');
      if (link?.closest('main')) reveal(link.getAttribute('href'));
    };
    const onHash = () => reveal(window.location.hash)?.scrollIntoView({ block: 'start' });
    document.addEventListener('click', onClick, true);
    window.addEventListener('hashchange', onHash);
    if (window.location.hash) onHash();
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('hashchange', onHash);
    };
  }, []);

  useEffect(() => {
    const sections = items.map((item) => document.getElementById(item.anchor)).filter(Boolean);
    if (!sections.length || typeof IntersectionObserver === 'undefined') return undefined;
    if (items.some((item) => item.href === window.location.hash)) setActive(window.location.hash);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) setActive(`#${visible[0].target.id}`);
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
    // `key` resume `items`: se recalcula solo si cambian los capítulos.
  }, [key]);

  if (items.length < 2) return null;

  return (
    <nav className={styles.nav} aria-label="Capítulos de la ficha" data-count={items.length}>
      <ol className={styles.list}>
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className={styles.link}
              aria-current={active === item.href ? 'location' : undefined}
              onClick={() => setActive(item.href)}
            >
              <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">{ICONS[item.icon]}</svg>
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
