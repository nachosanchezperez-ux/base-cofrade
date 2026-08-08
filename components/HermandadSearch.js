'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

export default function HermandadSearch({ hermandades }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return hermandades;
    return hermandades.filter((item) =>
      [item.nombrePopular, item.nombreOficial, item.localidad, item.diaSalida]
        .join(' ')
        .toLowerCase()
        .includes(value)
    );
  }, [query, hermandades]);

  return (
    <div>
      <label className="search-box">
        <span className="sr-only">Buscar hermandad</span>
        <span className="search-icon">⌕</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Busca por hermandad, localidad o día…"
        />
      </label>

      <div className="cards-grid hermandad-grid">
        {filtered.map((hermandad) => (
          <Link
            href={`/hermandades/${hermandad.slug}`}
            className="hermandad-card"
            key={hermandad.id}
          >
            <div className="card-monogram">{hermandad.nombrePopular.slice(0, 2).toUpperCase()}</div>
            <div className="card-content">
              <span className="pill">{hermandad.diaSalida}</span>
              <h3>{hermandad.nombrePopular}</h3>
              <p>{hermandad.sede}</p>
              <div className="card-meta">
                <span>{hermandad.localidad}</span>
                <span>Fund. {hermandad.fundacion}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {!filtered.length ? (
        <div className="empty-state">No encontramos ninguna hermandad con esa búsqueda.</div>
      ) : null}
    </div>
  );
}
