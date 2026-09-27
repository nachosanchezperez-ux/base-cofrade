/** Presentation only: preserve every record, its order within the year and its full text. */
export function releaseYear(item = {}) {
  const explicit = String(item.ano ?? '').trim();
  if (/^\d{4}$/.test(explicit)) return Number(explicit);
  const iso = /^(\d{4})-\d{2}-\d{2}$/.exec(String(item.fechaIso || ''));
  if (iso) return Number(iso[1]);
  // The legacy adapter sometimes supplies a Spanish display date in `ano`.
  const years = [...new Set(explicit.match(/\b\d{4}\b/g) || [])];
  return years.length === 1 ? Number(years[0]) : null;
}

export function knownReleaseText(value = '') {
  const text = String(value || '').trim();
  const placeholder = /^(?:(?:responsable|autor(?:ía)?|taller|fecha)\s+)?(?:no documentad[oa]|desconocid[oa]|por documentar|por confirmar|pendiente)[.!]?$/i;
  return placeholder.test(text) ? '' : text;
}

export function releaseAuthorship(item = {}) {
  const names = (Array.isArray(item.agentes) ? item.agentes : [])
    .map((agent) => knownReleaseText(agent?.nombre))
    .filter(Boolean);
  return names.length ? [...new Set(names)].join(' · ') : knownReleaseText(item.autoria);
}

function countLabel(items) {
  const types = new Set(items.map((item) => String(item.tipo || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()));
  const noun = types.size === 1 && types.has('restauracion')
    ? ['restauración', 'restauraciones']
    : types.size === 1 && types.has('estreno')
      ? ['estreno', 'estrenos'] : ['actuación', 'actuaciones'];
  return `${items.length} ${noun[items.length === 1 ? 0 : 1]}`;
}

export function groupHeritageReleases(items = [], currentYear) {
  const byYear = new Map();
  for (const item of Array.isArray(items) ? items : []) {
    if (!item || typeof item !== 'object') continue;
    const year = releaseYear(item);
    const key = year === null ? 'other' : String(year);
    if (!byYear.has(key)) byYear.set(key, { key, year, items: [] });
    byYear.get(key).items.push(item);
  }
  const groups = [...byYear.values()].sort((a, b) => {
    if (a.year === null) return b.year === null ? 0 : 1;
    if (b.year === null) return -1;
    return b.year - a.year;
  });
  const active = groups.find((group) => group.year === Number(currentYear)) || groups[0];
  return groups.map((group) => ({
    ...group,
    label: group.year === null ? 'Otras actuaciones' : String(group.year),
    countLabel: countLabel(group.items),
    open: group === active,
  }));
}
