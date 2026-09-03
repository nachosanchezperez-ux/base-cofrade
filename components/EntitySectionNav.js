'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './EntitySectionNav.module.css';

const DISCOVERABLE_SECTIONS = [
  { href: '#musica', label: 'Patrimonio musical' },
];

export default function EntitySectionNav({ items = [] }) {
  const visibleItems = useMemo(
    () => items.filter((item) => item?.href && item?.label),
    [items]
  );
  const [discoveredItems, setDiscoveredItems] = useState([]);
  const [activeHref, setActiveHref] = useState('');
  const [scrollState, setScrollState] = useState({ start: false, end: false });
  const scrollRef = useRef(null);

  useEffect(() => {
    const existingHrefs = new Set(visibleItems.map((item) => item.href));
    const discovered = DISCOVERABLE_SECTIONS.filter((item) => (
      !existingHrefs.has(item.href) && document.querySelector(item.href)
    ));

    setDiscoveredItems(discovered);
  }, [visibleItems]);

  const navigationItems = useMemo(
    () => [...visibleItems, ...discoveredItems],
    [visibleItems, discoveredItems]
  );
  const hrefKey = navigationItems.map((item) => item.href).join('|');

  const updateScrollState = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;
    const maxScroll = Math.max(0, element.scrollWidth - element.clientWidth);
    setScrollState({
      start: element.scrollLeft > 6,
      end: element.scrollLeft < maxScroll - 6,
    });
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return undefined;

    updateScrollState();
    const observer = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(updateScrollState);
    observer?.observe(element);
    element.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      observer?.disconnect();
      element.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [hrefKey, updateScrollState]);

  useEffect(() => {
    const sections = navigationItems
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter(Boolean);
    if (!sections.length) return undefined;

    let frame = 0;
    const updateActiveSection = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const activationLine = 170;
        const current = sections.reduce((selected, section) => (
          section.getBoundingClientRect().top <= activationLine ? section : selected
        ), sections[0]);
        setActiveHref(`#${current.id}`);
      });
    };

    const hashTarget = window.location.hash;
    setActiveHref(navigationItems.some((item) => item.href === hashTarget)
      ? hashTarget
      : navigationItems[0].href);
    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('hashchange', updateActiveSection);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('hashchange', updateActiveSection);
    };
  }, [hrefKey, navigationItems]);

  useEffect(() => {
    const element = scrollRef.current;
    const activeLink = element?.querySelector(`a[href="${activeHref}"]`);
    activeLink?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeHref]);

  function moveFocus(event, currentIndex) {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();

    let nextIndex = currentIndex;
    if (event.key === 'ArrowLeft') nextIndex = Math.max(0, currentIndex - 1);
    if (event.key === 'ArrowRight') nextIndex = Math.min(navigationItems.length - 1, currentIndex + 1);
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = navigationItems.length - 1;
    scrollRef.current?.querySelectorAll('a')[nextIndex]?.focus();
  }

  function scrollOptions(direction) {
    scrollRef.current?.scrollBy({
      left: direction * Math.max(220, scrollRef.current.clientWidth * 0.7),
      behavior: 'smooth',
    });
  }

  if (!navigationItems.length) return null;

  return (
    <nav
      className={`${styles.nav} section-nav brotherhood-nav entity-section-nav`}
      aria-label="Secciones de la ficha"
      data-can-scroll-start={scrollState.start || undefined}
      data-can-scroll-end={scrollState.end || undefined}
    >
      <div className="shell brotherhood-nav-shell">
        <span className="brotherhood-nav-label">Explorar ficha</span>
        <button
          type="button"
          className="entity-section-nav-arrow entity-section-nav-arrow-prev"
          onClick={() => scrollOptions(-1)}
          disabled={!scrollState.start}
          aria-label="Ver secciones anteriores"
          aria-controls="entity-section-nav-options"
        >
          <span aria-hidden="true">‹</span>
        </button>
        <div className="brotherhood-nav-list nav-scroll" id="entity-section-nav-options" ref={scrollRef}>
          {navigationItems.map((item, index) => (
            <a
              href={item.href}
              key={item.href}
              aria-current={activeHref === item.href ? 'location' : undefined}
              onClick={() => setActiveHref(item.href)}
              onKeyDown={(event) => moveFocus(event, index)}
            >
              {item.label}
            </a>
          ))}
        </div>
        <button
          type="button"
          className="entity-section-nav-arrow entity-section-nav-arrow-next"
          onClick={() => scrollOptions(1)}
          disabled={!scrollState.end}
          aria-label="Ver más secciones"
          aria-controls="entity-section-nav-options"
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </nav>
  );
}
