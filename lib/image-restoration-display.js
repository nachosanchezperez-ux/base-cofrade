// Both presentations use the same published intervention. No second event is created.
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeBreaks(value) {
  return text(value).replace(/\\r\\n|\\n|\r\n?/g, '\n');
}

function yearsIn(value) {
  return [...new Set(text(value).match(/\b[12]\d{3}\b/g) || [])];
}

function summaryOf(value, limit = 280) {
  const compact = text(value).replace(/\s+/g, ' ');
  if (compact.length <= limit) return compact;
  return `${compact.slice(0, limit - 1).replace(/\s+\S*$/, '').trim()}…`;
}

export function imageRestorationCards(items = []) {
  const seen = new Set();
  return (Array.isArray(items) ? items : []).filter(Boolean).flatMap((item, index) => {
    const id = text(item.id) || `registro-${index + 1}`;
    if (seen.has(id)) return [];
    seen.add(id);
    const anchor = `restauracion-${id.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
    const responsable = text(item.responsable);
    let description = normalizeBreaks(item.descripcion || item.texto);
    // The legacy public reader prefixes the author to the description.
    // Keep the author in its own field instead of repeating that prefix.
    if (responsable && description.startsWith(`${responsable} · `)) {
      description = description.slice(responsable.length + 3).trim();
    }
    const paragraphs = description.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    const [type, ...phase] = text(item.titulo).split(/\s+·\s+/);
    const fecha = text(item.fecha).replace(/(?<=\d)–(?=[A-Za-zÁÉÍÓÚÑáéíóúñ])/g, ' – ');
    const years = yearsIn(fecha);
    const resumen = summaryOf(paragraphs[0] || '');
    const detail = paragraphs.length > 1 && resumen === paragraphs[0]
      ? paragraphs.slice(1)
      : description && resumen !== description ? paragraphs : [];
    return [{
      id,
      anchor,
      timelineAnchor: `cronologia-${anchor}`,
      fecha,
      anio: years.join('–'),
      tipo: type || 'Intervención',
      fase: phase.join(' · '),
      responsable,
      disciplina: text(item.disciplina),
      resumen,
      descripcion: description,
      detalle: detail,
    }];
  });
}

function timelineKey(item) {
  return [item.fecha, item.titulo, item.texto]
    .map((value) => text(value).replace(/\s+/g, ' ').toLocaleLowerCase('es'))
    .join('|');
}

export function buildImageChronology(image = {}, cards = imageRestorationCards(image.restauraciones)) {
  const existing = Array.isArray(image.cronologia) ? image.cronologia.filter(Boolean) : [];
  const entries = existing.length
    ? existing.map((item) => ({ ...item }))
    : text(image.fecha) ? [{
        fecha: image.fecha,
        titulo: 'Datación',
        texto: 'Fecha asociada actualmente a la ficha de esta imagen.',
      }] : [];
  const existingIds = new Set(entries.flatMap((item) => [item.restauracionId, item.intervention_id, item.id]).filter(Boolean));
  const signatures = new Set(entries.map(timelineKey));

  for (const card of cards) {
    if (existingIds.has(card.id)) continue;
    const entry = {
      id: card.timelineAnchor,
      anchor: card.timelineAnchor,
      restauracionId: card.id,
      fecha: card.anio || card.fecha,
      titulo: card.tipo,
      texto: card.resumen || [card.responsable, card.fecha].filter(Boolean).join(' · '),
      href: `#${card.anchor}`,
      enlace: 'Ver restauración',
    };
    if (signatures.has(timelineKey(entry))) continue;
    entries.push(entry);
    existingIds.add(card.id);
    signatures.add(timelineKey(entry));
  }

  // Years are used for ordering only: unknown dates are never filled in.
  return entries.sort((a, b) => {
    const yearA = Number(yearsIn(a.fecha)[0]) || Infinity;
    const yearB = Number(yearsIn(b.fecha)[0]) || Infinity;
    return yearA === yearB ? 0 : yearA - yearB;
  });
}
