const PROFILE_ALIASES = {
  hermandad: 'hermandad',
  brotherhood: 'hermandad',
  imagen: 'imagen',
  image: 'imagen',
  paso: 'paso',
  step: 'paso',
  banda: 'banda',
  band: 'banda',
};

export const RELATIONAL_THREAD_PROFILES = {
  hermandad: {
    order: { imagen: 10, paso: 20, banda: 30, marcha: 40, autor: 50 },
    caps: { imagen: 3, paso: 3, banda: 2 },
  },
  imagen: {
    order: { hermandad: 10, paso: 20, autor: 30, imagen: 40, acontecimiento: 50 },
    caps: { hermandad: 1, paso: 2, autor: 1, imagen: 4 },
  },
  paso: {
    order: { imagen: 10, hermandad: 20, banda: 30, capataz: 40, autor: 50 },
    caps: { imagen: 4, hermandad: 1, banda: 2, capataz: 1 },
  },
  banda: {
    order: { paso: 10, hermandad: 20, marcha: 30, autor: 40 },
    caps: { paso: 4, hermandad: 4, marcha: 2 },
  },
};

function normalized(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function profileFor(value = '') {
  const alias = PROFILE_ALIASES[normalized(value)] || normalized(value);
  return RELATIONAL_THREAD_PROFILES[alias] || null;
}

function cleanItem(item) {
  const { __index, __priority, ...clean } = item;
  return clean;
}

export function prepareRelationalItems(items = [], { profile = '', maxItems = 8 } = {}) {
  const activeProfile = profileFor(profile);
  const limit = Math.max(1, Number.parseInt(maxItems, 10) || 8);
  const seen = new Set();

  const ordered = items
    .filter((item) => item?.href && item?.title)
    .map((item, index) => {
      const kind = normalized(item.kind || 'relacion');
      const profilePriority = activeProfile?.order?.[kind] ?? 1000;
      const explicitPriority = Number.isFinite(item.priority) ? item.priority : null;

      return {
        ...item,
        __index: index,
        __priority: explicitPriority ?? profilePriority,
      };
    })
    .sort((left, right) => (
      left.__priority - right.__priority || left.__index - right.__index
    ))
    .filter((item) => {
      if (seen.has(item.href)) return false;
      seen.add(item.href);
      return true;
    });

  if (!ordered.length) {
    return { visibleItems: [], hiddenItems: [], totalItems: 0 };
  }

  const visible = [];
  const selected = new Set();
  const kindCounts = new Map();
  const caps = activeProfile?.caps || {};

  for (const item of ordered) {
    if (visible.length >= limit) break;

    const kind = normalized(item.kind || 'relacion');
    const cap = caps[kind];
    const count = kindCounts.get(kind) || 0;

    if (Number.isFinite(cap) && count >= cap) continue;

    visible.push(item);
    selected.add(item.href);
    kindCounts.set(kind, count + 1);
  }

  if (visible.length < limit) {
    for (const item of ordered) {
      if (visible.length >= limit) break;
      if (selected.has(item.href)) continue;
      visible.push(item);
      selected.add(item.href);
    }
  }

  const hidden = ordered.filter((item) => !selected.has(item.href));

  return {
    visibleItems: visible.map(cleanItem),
    hiddenItems: hidden.map(cleanItem),
    totalItems: ordered.length,
  };
}
