import 'server-only';

import { getHermandadPageBySlug as getBrotherhoodDisplayBySlug } from '@/lib/supabase/brotherhood-display';
import { createPublicClient } from '@/lib/supabase/public';
import { getPublishedEntityCoverMediaMap } from '@/lib/supabase/entity-media';

function normalized(value = '') {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function isSimpecado(item) {
  return normalized(item?.tipo).includes('simpecado');
}

function mediaImage(media, fallback = null) {
  if (!media?.path) return fallback;
  return {
    ...(fallback || {}),
    src: media.path,
    alt: media.alt || fallback?.alt || media.title || '',
    autor: media.credit || fallback?.autor || '',
    pie: media.caption || fallback?.pie || '',
    width: media.width || fallback?.width || null,
    height: media.height || fallback?.height || null,
  };
}

export async function getHermandadPageBySlug(slug) {
  const hermandad = await getBrotherhoodDisplayBySlug(slug);
  if (!hermandad?.id) return hermandad;

  const patrimonio = hermandad.patrimonio || [];
  const simpecadosBase = patrimonio.filter(isSimpecado);
  const patrimonioGeneral = patrimonio.filter((item) => !isSimpecado(item));
  if (!simpecadosBase.length) return { ...hermandad, simpecados: [], patrimonio: patrimonioGeneral };

  try {
    const supabase = createPublicClient();
    const ids = simpecadosBase.map((item) => item.id).filter(Boolean);
    const [nameResult, usageResult, mediaMap] = await Promise.all([
      supabase
        .from('entity_names')
        .select('entity_id, name, name_type, is_current')
        .in('entity_id', ids)
        .eq('status', 'published')
        .order('name'),
      supabase
        .from('heritage_assets')
        .select('entity_id, usage_text')
        .in('entity_id', ids),
      getPublishedEntityCoverMediaMap(ids),
    ]);

    if (nameResult.error) throw nameResult.error;
    if (usageResult.error) throw usageResult.error;
    const namesByEntity = new Map();
    (nameResult.data || []).forEach((row) => {
      const list = namesByEntity.get(row.entity_id) || [];
      list.push(row.name);
      namesByEntity.set(row.entity_id, list);
    });
    const usageByEntity = new Map((usageResult.data || []).map((row) => [row.entity_id, row.usage_text || '']));

    return {
      ...hermandad,
      simpecados: simpecadosBase.map((item) => ({
        ...item,
        denominaciones: namesByEntity.get(item.id) || [],
        uso: usageByEntity.get(item.id) || '',
        imagen: mediaImage(mediaMap.get(item.id), item.imagen),
      })),
      patrimonio: patrimonioGeneral,
    };
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo enriquecer la sección de Simpecados', {
      slug,
      error: error instanceof Error ? error.message : String(error),
    });
    return { ...hermandad, simpecados: simpecadosBase, patrimonio: patrimonioGeneral };
  }
}
