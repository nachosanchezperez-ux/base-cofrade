'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import styles from './HiloSearch.module.css';

function normalize(value = '') {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function analyticsEntityType(value = '') {
  const type = normalize(value);
  if (type.includes('hermandad')) return 'brotherhood';
  if (type.includes('imagen')) return 'image';
  if (type.includes('paso')) return 'step';
  if (type.includes('banda')) return 'band';
  if (type.includes('marcha')) return 'march';
  if (type.includes('autor') || type.includes('agente')) return 'agent';
  if (type.includes('acontecimiento')) return 'event';
  return 'other';
}

function resultBucket(count) {
  if (!count) return '0';
  if (count <= 3) return '1-3';
  return '4-6';
}

export default function HiloSearch({ items = [] }) {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const results = useMemo(() => {
    const term = normalize(query.trim());
    if (!term) return [];

    return items
      .filter((item) => normalize(`${item.title} ${item.subtitle || ''} ${item.type || ''}`).includes(term))
      .slice(0, 6);
  }, [items, query]);

  const submit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const useSuggestion = (value) => {
    setQuery(value);
    setSubmitted(true);
  };

  const hasQuery = query.trim().length > 0;
  const outcome = hasQuery ? (results.length ? 'results' : 'empty') : 'empty_query';

  return (
    <div className={styles.wrap} data-hilo-section="home_search">
      <form
        className={styles.form}
        onSubmit={submit}
        data-hilo-event="hilo_search"
        data-hilo-origin="form"
        data-hilo-outcome={outcome}
        data-hilo-result-bucket={resultBucket(results.length)}
      >
        <label className={styles.srOnly} htmlFor="hilo-search">Buscar en Hilo Cofrade</label>
        <input
          id="hilo-search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSubmitted(false);
          }}
          placeholder="Ej. El Baratillo, Virgen de la Piedad, Paso de palio…"
          autoComplete="off"
        />
        <button type="submit" aria-label="Buscar">→</button>
      </form>

      <div className={styles.suggestions} aria-label="Búsquedas sugeridas">
        <button
          type="button"
          onClick={() => useSuggestion('El Baratillo')}
          data-hilo-event="hilo_search"
          data-hilo-origin="suggestion"
          data-hilo-outcome="suggestion"
        >El Baratillo</button>
        <button
          type="button"
          onClick={() => useSuggestion('Virgen de la Piedad')}
          data-hilo-event="hilo_search"
          data-hilo-origin="suggestion"
          data-hilo-outcome="suggestion"
        >Virgen de la Piedad</button>
        <button
          type="button"
          onClick={() => useSuggestion('Paso de palio')}
          data-hilo-event="hilo_search"
          data-hilo-origin="suggestion"
          data-hilo-outcome="suggestion"
        >Paso de palio</button>
      </div>

      {(submitted || query.trim().length > 1) && (
        <div className={styles.results} aria-live="polite">
          {results.length > 0 ? (
            results.map((item) => (
              <Link
                href={item.href}
                className={styles.result}
                key={`${item.type}-${item.href}`}
                data-hilo-event="search_result_open"
                data-hilo-origin="home_search"
                data-hilo-target-type={analyticsEntityType(item.type)}
              >
                <span className={styles.resultType}>{item.type}</span>
                <span className={styles.resultCopy}>
                  <strong>{item.title}</strong>
                  {item.subtitle && <small>{item.subtitle}</small>}
                </span>
                <span className={styles.arrow}>→</span>
              </Link>
            ))
          ) : (
            <div className={styles.empty}>
              <strong>Aún no encontramos esa relación</strong>
              <span>La búsqueda crecerá a medida que incorporemos nuevas fichas y entidades</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
