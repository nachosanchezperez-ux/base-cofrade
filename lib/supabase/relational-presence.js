import 'server-only';

import { createPublicClient } from '@/lib/supabase/public';

const PATH_ENTITY_TYPES = {
  hermandades: 'brotherhood',
  imagenes: 'image',
  pasos: 'step',
  bandas: 'band',
};

function rowsOrEmpty(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`);
  return result.data || [];
}

function unique(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function parseTarget(item) {
  const match = /^\/(hermandades|imagenes|pasos|bandas)\/([^/?#]+)/.exec(String(item?.href || ''));
  if (!match) return null;

  return {
    href: item.href,
    entityType: PATH_ENTITY_TYPES[match[1]],
    slug: decodeURIComponent(match[2]),
  };
}

function plural(count, singular, pluralForm) {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}

async function publishedEntityIds(supabase, ids, entityType) {
  const uniqueIds = unique(ids);
  if (!uniqueIds.length) return new Set();

  const rows = rowsOrEmpty(
    await supabase
      .from('entities')
      .select('id')
      .eq('entity_type', entityType)
      .eq('status', 'published')
      .in('id', uniqueIds),
    `No se pudieron verificar las entidades públicas de tipo ${entityType}`
  );

  return new Set(rows.map((item) => item.id));
}

async function imagePresence(supabase, targets) {
  if (!targets.length) return new Map();

  const imageIds = targets.map((item) => item.id);
  const authorships = rowsOrEmpty(
    await supabase
      .from('image_authorships')
      .select('image_entity_id, agent_entity_id, authorship_type')
      .in('image_entity_id', imageIds)
      .eq('status', 'published'),
    'No se pudieron consultar las autorías para También en Hilo Cofrade'
  ).filter((item) => item.agent_entity_id);

  const agentIds = unique(authorships.map((item) => item.agent_entity_id));
  if (!agentIds.length) return new Map();

  const [agentsResult, relatedAuthorshipsResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, name')
      .eq('entity_type', 'agent')
      .eq('status', 'published')
      .in('id', agentIds),
    supabase
      .from('image_authorships')
      .select('image_entity_id, agent_entity_id')
      .in('agent_entity_id', agentIds)
      .eq('status', 'published'),
  ]);

  const agents = rowsOrEmpty(agentsResult, 'No se pudieron resolver los autores publicados');
  const relatedAuthorships = rowsOrEmpty(
    relatedAuthorshipsResult,
    'No se pudieron consultar las otras imágenes de los autores'
  );
  const publicImageIds = await publishedEntityIds(
    supabase,
    relatedAuthorships.map((item) => item.image_entity_id),
    'image'
  );
  const agentById = new Map(agents.map((agent) => [agent.id, agent]));
  const imagesByAgent = new Map();

  relatedAuthorships.forEach((item) => {
    if (!publicImageIds.has(item.image_entity_id) || !agentById.has(item.agent_entity_id)) return;
    if (!imagesByAgent.has(item.agent_entity_id)) imagesByAgent.set(item.agent_entity_id, new Set());
    imagesByAgent.get(item.agent_entity_id).add(item.image_entity_id);
  });

  const result = new Map();
  targets.forEach((target) => {
    const candidates = authorships
      .filter((item) => item.image_entity_id === target.id && agentById.has(item.agent_entity_id))
      .map((item) => ({
        agent: agentById.get(item.agent_entity_id),
        count: imagesByAgent.get(item.agent_entity_id)?.size || 0,
      }))
      .filter((item) => item.count > 1)
      .sort((left, right) => right.count - left.count || left.agent.name.localeCompare(right.agent.name, 'es'));

    if (!candidates.length) return;
    const candidate = candidates[0];
    result.set(target.href, {
      type: 'Autoría',
      detail: `${candidate.agent.name} · ${plural(candidate.count, 'imagen documentada', 'imágenes documentadas')}`,
    });
  });

  return result;
}

function isCapataz(roleName = '') {
  return String(roleName).toLocaleLowerCase('es').includes('capataz');
}

async function stepPresence(supabase, targets) {
  if (!targets.length) return new Map();

  const stepIds = targets.map((item) => item.id);
  const personnel = rowsOrEmpty(
    await supabase
      .from('step_personnel_periods')
      .select('step_entity_id, agent_entity_id, role_name')
      .in('step_entity_id', stepIds)
      .eq('is_current', true)
      .eq('status', 'published'),
    'No se pudieron consultar los responsables actuales para También en Hilo Cofrade'
  ).filter((item) => item.agent_entity_id && isCapataz(item.role_name));

  const agentIds = unique(personnel.map((item) => item.agent_entity_id));
  if (!agentIds.length) return new Map();

  const [agentsResult, relatedPersonnelResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, name')
      .eq('entity_type', 'agent')
      .eq('status', 'published')
      .in('id', agentIds),
    supabase
      .from('step_personnel_periods')
      .select('step_entity_id, agent_entity_id, role_name')
      .in('agent_entity_id', agentIds)
      .eq('is_current', true)
      .eq('status', 'published'),
  ]);

  const agents = rowsOrEmpty(agentsResult, 'No se pudieron resolver los capataces publicados');
  const relatedPersonnel = rowsOrEmpty(
    relatedPersonnelResult,
    'No se pudieron consultar los otros pasos de los capataces'
  ).filter((item) => isCapataz(item.role_name));
  const publicStepIds = await publishedEntityIds(
    supabase,
    relatedPersonnel.map((item) => item.step_entity_id),
    'step'
  );
  const agentById = new Map(agents.map((agent) => [agent.id, agent]));
  const stepsByAgent = new Map();

  relatedPersonnel.forEach((item) => {
    if (!publicStepIds.has(item.step_entity_id) || !agentById.has(item.agent_entity_id)) return;
    if (!stepsByAgent.has(item.agent_entity_id)) stepsByAgent.set(item.agent_entity_id, new Set());
    stepsByAgent.get(item.agent_entity_id).add(item.step_entity_id);
  });

  const result = new Map();
  targets.forEach((target) => {
    const current = personnel.filter(
      (item) => item.step_entity_id === target.id && agentById.has(item.agent_entity_id)
    );
    if (!current.length) return;

    if (current.length === 1) {
      const agent = agentById.get(current[0].agent_entity_id);
      const count = stepsByAgent.get(current[0].agent_entity_id)?.size || 0;
      if (count > 1) {
        result.set(target.href, {
          type: 'Capataz',
          detail: `${agent.name} · ${plural(count, 'paso como capataz actual', 'pasos como capataz actual')}`,
        });
      }
      return;
    }

    const relatedSteps = new Set();
    current.forEach((item) => {
      (stepsByAgent.get(item.agent_entity_id) || new Set()).forEach((stepId) => relatedSteps.add(stepId));
    });
    if (relatedSteps.size > 1) {
      result.set(target.href, {
        type: 'Capataces',
        detail: `${plural(current.length, 'capataz', 'capataces')} · ${plural(relatedSteps.size, 'paso relacionado', 'pasos relacionados')}`,
      });
    }
  });

  return result;
}

async function bandPresence(supabase, targets) {
  if (!targets.length) return new Map();

  const bandIds = targets.map((item) => item.id);
  const periods = rowsOrEmpty(
    await supabase
      .from('music_accompaniment_periods')
      .select('band_entity_id, brotherhood_entity_id')
      .in('band_entity_id', bandIds)
      .eq('is_current', true)
      .eq('status', 'published'),
    'No se pudieron consultar los acompañamientos para También en Hilo Cofrade'
  );
  const publicBrotherhoodIds = await publishedEntityIds(
    supabase,
    periods.map((item) => item.brotherhood_entity_id),
    'brotherhood'
  );
  const brotherhoodsByBand = new Map();

  periods.forEach((item) => {
    if (!publicBrotherhoodIds.has(item.brotherhood_entity_id)) return;
    if (!brotherhoodsByBand.has(item.band_entity_id)) brotherhoodsByBand.set(item.band_entity_id, new Set());
    brotherhoodsByBand.get(item.band_entity_id).add(item.brotherhood_entity_id);
  });

  const result = new Map();
  targets.forEach((target) => {
    const count = brotherhoodsByBand.get(target.id)?.size || 0;
    if (count > 1) {
      result.set(target.href, {
        type: 'Red musical',
        detail: `${plural(count, 'Hermandad con acompañamiento actual', 'Hermandades con acompañamiento actual')}`,
      });
    }
  });

  return result;
}

async function brotherhoodPresence(supabase, targets) {
  if (!targets.length) return new Map();

  const brotherhoodIds = targets.map((item) => item.id);
  const [imageLinksResult, stepLinksResult] = await Promise.all([
    supabase
      .from('brotherhood_images')
      .select('brotherhood_entity_id, image_entity_id')
      .in('brotherhood_entity_id', brotherhoodIds)
      .eq('status', 'published'),
    supabase
      .from('brotherhood_steps')
      .select('brotherhood_entity_id, step_entity_id')
      .in('brotherhood_entity_id', brotherhoodIds)
      .eq('status', 'published'),
  ]);

  const imageLinks = rowsOrEmpty(imageLinksResult, 'No se pudieron consultar las imágenes de las Hermandades');
  const stepLinks = rowsOrEmpty(stepLinksResult, 'No se pudieron consultar los pasos de las Hermandades');
  const [publicImageIds, publicStepIds] = await Promise.all([
    publishedEntityIds(supabase, imageLinks.map((item) => item.image_entity_id), 'image'),
    publishedEntityIds(supabase, stepLinks.map((item) => item.step_entity_id), 'step'),
  ]);
  const result = new Map();

  targets.forEach((target) => {
    const imageCount = new Set(
      imageLinks
        .filter((item) => item.brotherhood_entity_id === target.id && publicImageIds.has(item.image_entity_id))
        .map((item) => item.image_entity_id)
    ).size;
    const stepCount = new Set(
      stepLinks
        .filter((item) => item.brotherhood_entity_id === target.id && publicStepIds.has(item.step_entity_id))
        .map((item) => item.step_entity_id)
    ).size;
    const total = imageCount + stepCount;
    if (total <= 1) return;

    const parts = [
      imageCount ? plural(imageCount, 'imagen publicada', 'imágenes publicadas') : '',
      stepCount ? plural(stepCount, 'paso publicado', 'pasos publicados') : '',
    ].filter(Boolean);

    result.set(target.href, {
      type: 'Universo',
      detail: parts.join(' · '),
    });
  });

  return result;
}

export async function enrichRelationalPresence(items = []) {
  const parsed = items.map(parseTarget).filter(Boolean);
  if (!parsed.length) return items;

  try {
    const supabase = createPublicClient();
    const slugs = unique(parsed.map((item) => item.slug));
    const entities = rowsOrEmpty(
      await supabase
        .from('entities')
        .select('id, name, slug, entity_type')
        .in('slug', slugs)
        .eq('status', 'published'),
      'No se pudieron resolver los nodos para También en Hilo Cofrade'
    );
    const entityByKey = new Map(
      entities.map((entity) => [`${entity.entity_type}:${entity.slug}`, entity])
    );
    const targets = parsed
      .map((item) => {
        const entity = entityByKey.get(`${item.entityType}:${item.slug}`);
        return entity ? { ...item, id: entity.id, name: entity.name } : null;
      })
      .filter(Boolean);

    const [images, steps, bands, brotherhoods] = await Promise.all([
      imagePresence(supabase, targets.filter((item) => item.entityType === 'image')),
      stepPresence(supabase, targets.filter((item) => item.entityType === 'step')),
      bandPresence(supabase, targets.filter((item) => item.entityType === 'band')),
      brotherhoodPresence(supabase, targets.filter((item) => item.entityType === 'brotherhood')),
    ]);
    const presence = new Map([...images, ...steps, ...bands, ...brotherhoods]);

    return items.map((item) => (
      item.also?.detail || !presence.has(item.href)
        ? item
        : { ...item, also: presence.get(item.href) }
    ));
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo enriquecer También en Hilo Cofrade', {
      error: error instanceof Error ? error.message : String(error),
    });
    return items;
  }
}
