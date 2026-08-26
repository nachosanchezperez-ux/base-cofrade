'use client';

import { useEffect, useMemo, useState } from 'react';

const DISCOVERABLE_SECTIONS = [
  { href: '#musica', label: 'Patrimonio musical' },
];

export default function EntitySectionNav({ items = [] }) {
  const visibleItems = useMemo(
    () => items.filter((item) => item?.href && item?.label),
    [items]
  );
  const [discoveredItems, setDiscoveredItems] = useState([]);

  useEffect(() => {
    const existingHrefs = new Set(visibleItems.map((item) => item.href));
    const discovered = DISCOVERABLE_SECTIONS.filter((item) => (
      !existingHrefs.has(item.href) && document.querySelector(item.href)
    ));

    setDiscoveredItems(discovered);
  }, [visibleItems]);

  const navigationItems = [...visibleItems, ...discoveredItems];
  if (!navigationItems.length) return null;

  return (
    <nav className="section-nav brotherhood-nav entity-section-nav" aria-label="Secciones de la ficha">
      <div className="shell brotherhood-nav-shell">
        <span className="brotherhood-nav-label">Explorar ficha</span>
        <div className="brotherhood-nav-list nav-scroll">
          {navigationItems.map((item) => (
            <a href={item.href} key={item.href}>{item.label}</a>
          ))}
        </div>
      </div>
    </nav>
  );
}
