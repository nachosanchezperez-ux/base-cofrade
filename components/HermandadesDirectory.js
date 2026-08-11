'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import styles from './HermandadesDirectory.module.css';

const JORNADAS = [
  'Todas',
  'Viernes de Dolores',
  'Sábado de Pasión',
  'Domingo de Ramos',
  'Lunes Santo',
  'Martes Santo',
  'Miércoles Santo',
  'Jueves Santo',
  'Madrugada',
  'Viernes Santo',
  'Sábado Santo',
  'Domingo de Resurrección',
];

function crestFor(slug) {
  if (slug === 'el-baratillo') return '/escudos/el-baratillo.svg';
  return null;
}

export default function HermandadesDirectory({ hermandades }) {
  const [query, setQuery] = useState('');
  const [jornada, setJornada] = useState('Todas');

  const sevilla = useMemo(
    () => hermandades.filter((item) => item.localidad?.toLowerCase() === 'sevilla'),
    [hermandades]
  );

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    return sevilla.filter((item) => {
      const matchesDay = jornada === 'Todas' || item.diaSalida === jornada;
      const haystack = [
        item.nombrePopular,
        item.nombreOficial,
        item.sede,
        item.localidad,
        item.diaSalida,
        ...(item.tipos || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const matchesQuery = !value || haystack.includes(value);
      return matchesDay && matchesQuery;
    });
  }, [query, jornada, sevilla]);

  return (
    <div className={styles.directory}>
      <div className={styles.searchPanel}>
        <span className={styles.searchLabel}>Buscar hermandad</span>
        <div className={styles.searchRow}>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nombre, sede o día de salida…"
            aria-label="Buscar hermandad"
          />
          <span aria-hidden="true">⌕</span>
        </div>
      </div>

      <div className={styles.dayBlock}>
        <span className={styles.dayLabel}>Día de salida</span>
        <div className={styles.days}>
          {JORNADAS.map((day) => {
            const isActive = jornada === day;
            return (
              <button
                type="button"
                key={day}
                className={`${styles.dayButton} ${isActive ? styles.activeDay : ''}`}
                onClick={() => setJornada(day)}
                aria-pressed={isActive}
              >
                {isActive ? <span className={styles.activeDot} aria-hidden="true" /> : null}
                <span className={styles.dayText}>{day}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.resultHead}>
        <div>
          <strong>{filtered.length} {filtered.length === 1 ? 'hermandad' : 'hermandades'}</strong>
          <span>Sevilla capital</span>
        </div>
        {jornada !== 'Todas' ? (
          <button type="button" onClick={() => setJornada('Todas')}>Ver todas</button>
        ) : null}
      </div>

      {filtered.length ? (
        <div className={styles.list}>
          {filtered.map((hermandad) => {
            const crest = crestFor(hermandad.slug);
            return (
              <Link
                href={`/hermandades/${hermandad.slug}`}
                className={styles.item}
                key={hermandad.id}
              >
                <span className={styles.crestWrap}>
                  {crest ? (
                    <img src={crest} alt={`Escudo de ${hermandad.nombrePopular}`} />
                  ) : (
                    <span className={styles.monogram}>{hermandad.nombrePopular.slice(0, 2).toUpperCase()}</span>
                  )}
                </span>

                <span className={styles.itemMain}>
                  <span className={styles.kickerRow}>
                    <span className={styles.type}>{(hermandad.tipos || []).join(' · ')}</span>
                    <span className={styles.day}>{hermandad.diaSalida}</span>
                  </span>
                  <strong className={styles.name}>{hermandad.nombrePopular}</strong>
                  <span className={styles.meta}>{hermandad.sede}</span>
                </span>

                <span className={styles.arrow} aria-hidden="true">→</span>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className={styles.empty}>
          <strong>No hay hermandades disponibles con estos criterios</strong>
          <span>Prueba otra jornada o modifica la búsqueda</span>
        </div>
      )}
    </div>
  );
}
