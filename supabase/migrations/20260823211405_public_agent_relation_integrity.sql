-- Endurece las lecturas públicas de relaciones que exponen autores y profesionales.
-- Una relación solo es pública cuando sus entidades relacionadas también lo son.

DROP POLICY IF EXISTS "Published image authorships" ON public.image_authorships;
CREATE POLICY "Published image authorships"
ON public.image_authorships
FOR SELECT
TO public
USING (
  status = 'published'
  AND EXISTS (
    SELECT 1
    FROM public.entities image_entity
    WHERE image_entity.id = image_authorships.image_entity_id
      AND image_entity.status = 'published'
  )
  AND (
    agent_entity_id IS NULL
    OR EXISTS (
      SELECT 1
      FROM public.entities agent_entity
      WHERE agent_entity.id = image_authorships.agent_entity_id
        AND agent_entity.status = 'published'
    )
  )
);

DROP POLICY IF EXISTS "Published heritage interventions" ON public.heritage_interventions;
CREATE POLICY "Published heritage interventions"
ON public.heritage_interventions
FOR SELECT
TO public
USING (
  status = 'published'
  AND EXISTS (
    SELECT 1
    FROM public.entities target_entity
    WHERE target_entity.id = heritage_interventions.target_entity_id
      AND target_entity.status = 'published'
  )
  AND (
    agent_entity_id IS NULL
    OR EXISTS (
      SELECT 1
      FROM public.entities agent_entity
      WHERE agent_entity.id = heritage_interventions.agent_entity_id
        AND agent_entity.status = 'published'
    )
  )
);

DROP POLICY IF EXISTS "Published step personnel periods" ON public.step_personnel_periods;
CREATE POLICY "Published step personnel periods"
ON public.step_personnel_periods
FOR SELECT
TO public
USING (
  status = 'published'
  AND EXISTS (
    SELECT 1
    FROM public.entities step_entity
    WHERE step_entity.id = step_personnel_periods.step_entity_id
      AND step_entity.status = 'published'
  )
  AND EXISTS (
    SELECT 1
    FROM public.entities agent_entity
    WHERE agent_entity.id = step_personnel_periods.agent_entity_id
      AND agent_entity.status = 'published'
  )
);

DROP POLICY IF EXISTS "Public step phase agents" ON public.step_phase_agents;
CREATE POLICY "Public step phase agents"
ON public.step_phase_agents
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1
    FROM public.step_phases phase
    JOIN public.entities step_entity ON step_entity.id = phase.step_entity_id
    WHERE phase.id = step_phase_agents.step_phase_id
      AND phase.status = 'published'
      AND step_entity.status = 'published'
  )
  AND EXISTS (
    SELECT 1
    FROM public.entities agent_entity
    WHERE agent_entity.id = step_phase_agents.agent_entity_id
      AND agent_entity.status = 'published'
  )
  AND (
    element_entity_id IS NULL
    OR EXISTS (
      SELECT 1
      FROM public.entities element_entity
      WHERE element_entity.id = step_phase_agents.element_entity_id
        AND element_entity.status = 'published'
    )
  )
);

DROP POLICY IF EXISTS "Public heritage update agents" ON public.heritage_update_agents;
CREATE POLICY "Public heritage update agents"
ON public.heritage_update_agents
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1
    FROM public.heritage_updates update_row
    WHERE update_row.id = heritage_update_agents.heritage_update_id
      AND update_row.status = 'published'
  )
  AND EXISTS (
    SELECT 1
    FROM public.entities agent_entity
    WHERE agent_entity.id = heritage_update_agents.agent_entity_id
      AND agent_entity.status = 'published'
  )
);

DROP POLICY IF EXISTS "Published march authors" ON public.march_authors;
CREATE POLICY "Published march authors"
ON public.march_authors
FOR SELECT
TO public
USING (
  status = 'published'
  AND EXISTS (
    SELECT 1
    FROM public.entities march_entity
    WHERE march_entity.id = march_authors.march_entity_id
      AND march_entity.status = 'published'
  )
  AND EXISTS (
    SELECT 1
    FROM public.entities agent_entity
    WHERE agent_entity.id = march_authors.agent_entity_id
      AND agent_entity.status = 'published'
  )
);

DROP POLICY IF EXISTS "Published entity relations" ON public.entity_relations;
CREATE POLICY "Published entity relations"
ON public.entity_relations
FOR SELECT
TO public
USING (
  status = 'published'
  AND EXISTS (
    SELECT 1
    FROM public.entities source_entity
    WHERE source_entity.id = entity_relations.source_entity_id
      AND source_entity.status = 'published'
  )
  AND EXISTS (
    SELECT 1
    FROM public.entities target_entity
    WHERE target_entity.id = entity_relations.target_entity_id
      AND target_entity.status = 'published'
  )
);
