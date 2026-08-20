export default function EntitySectionNav({ items = [] }) {
  const visibleItems = items.filter((item) => item?.href && item?.label);
  if (!visibleItems.length) return null;

  return (
    <nav className="section-nav brotherhood-nav entity-section-nav" aria-label="Secciones de la ficha">
      <div className="shell brotherhood-nav-shell">
        <span className="brotherhood-nav-label">Explorar ficha</span>
        <div className="brotherhood-nav-list nav-scroll">
          {visibleItems.map((item) => (
            <a href={item.href} key={item.href}>{item.label}</a>
          ))}
        </div>
      </div>
    </nav>
  );
}
