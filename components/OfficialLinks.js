const PLATFORM_LABELS = {
  website: 'Web oficial',
  facebook: 'Facebook',
  instagram: 'Instagram',
  x: 'X / Twitter',
  youtube: 'YouTube',
  spotify: 'Spotify',
  tiktok: 'TikTok',
  whatsapp: 'Canal de WhatsApp',
}

const PLATFORM_MARKS = {
  website: 'WWW',
  facebook: 'f',
  instagram: 'IG',
  x: 'X',
  youtube: '▶',
  spotify: '♫',
  tiktok: '♪',
  whatsapp: 'WA',
}

export default function OfficialLinks({ links = [], compact = false }) {
  if (!links.length) return null

  // Compacta (ficha por capítulos): una fila de canales, sin tarjetas.
  if (compact) {
    return (
      <nav className="official-links-compact" id="enlaces-de-interes" aria-labelledby="enlaces-de-interes-titulo">
        <p className="official-links-compact-title" id="enlaces-de-interes-titulo">Canales oficiales</p>
        <ul>
          {links.map((link) => (
            <li key={link.id || link.platform}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                <span aria-hidden="true">{PLATFORM_MARKS[link.platform] || '↗'}</span>
                {link.label || PLATFORM_LABELS[link.platform] || 'Enlace oficial'}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    )
  }

  return (
    <section className="section official-links-section" id="enlaces-de-interes">
      <div className="shell">
        <div className="official-links-heading">
          <div><span className="eyebrow">Para saber más</span><h2>Enlaces de interés</h2></div>
          <p>Web, redes y canales oficiales publicados por la entidad.</p>
        </div>
        <div className="official-links-grid">
          {links.map((link) => (
            <a href={link.url} target="_blank" rel="noopener noreferrer" key={link.id || link.platform}>
              <span aria-hidden="true">{PLATFORM_MARKS[link.platform] || '↗'}</span>
              <strong>{link.label || PLATFORM_LABELS[link.platform] || 'Enlace oficial'}</strong>
              <small>Visitar canal ↗</small>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
