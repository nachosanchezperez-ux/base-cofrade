import RelationalThreadClient from '@/components/RelationalThreadClient';
import { prepareRelationalItems } from '@/lib/relational-thread';
import { enrichRelationalPresence } from '@/lib/supabase/relational-presence';

function normalizeCountGrammar(value) {
  if (!value) return '';

  return String(value)
    .replace(/\b1 imágenes\b/g, '1 imagen')
    .replace(/\b1 pasos\b/g, '1 paso')
    .replace(/\b1 bandas actuales\b/g, '1 banda actual');
}

export default async function RelationalThread({
  id = 'tira-del-hilo',
  eyebrow = 'Tira del hilo',
  title = 'Sigue las relaciones',
  description = 'Cada ficha es un punto de entrada. Continúa por sus relaciones documentadas sin perder el contexto.',
  currentLabel = 'Estás en',
  currentName,
  currentMeta = '',
  items = [],
  maxItems = 8,
  priorityProfile = '',
}) {
  const sourceType = priorityProfile || currentLabel;
  const { visibleItems, hiddenItems } = prepareRelationalItems(items, {
    profile: sourceType,
    maxItems,
  });

  if (!currentName || visibleItems.length === 0) return null;

  const enrichedVisibleItems = await enrichRelationalPresence(visibleItems);

  return (
    <RelationalThreadClient
      id={id}
      eyebrow={eyebrow}
      title={title}
      description={description}
      currentLabel={currentLabel}
      currentName={currentName}
      normalizedMeta={normalizeCountGrammar(currentMeta)}
      sourceType={sourceType}
      visibleItems={enrichedVisibleItems}
      hiddenItems={hiddenItems}
    />
  );
}
