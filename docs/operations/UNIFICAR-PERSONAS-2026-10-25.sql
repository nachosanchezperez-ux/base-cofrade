-- Unificación de 22 personas duplicadas (25/10/2026)
-- Plan: claude/plan-unificar-personas-2026-10-25.md (Project «Hilocofrade»).
-- Copia previa: claude/backup-personas-2026-10-25.json (224 filas de las 44 fichas).
--
-- Cada pareja se procesa en una sola llamada (atómica): si algo no cuadra, no
-- se cambia nada de esa pareja. Es idempotente: si la ficha ya está en
-- borrador y sin referencias, la segunda ejecución no mueve nada.
--
-- Qué hace por pareja:
--   1. Comprueba que las dos fichas existen y son personas (agent).
--   2. Mueve a la ficha conservada todas las referencias de la otra.
--      Si una fila quedaría repetida (misma marcha y papel, misma imagen y
--      papel, etc.), se quita la repetida (está en la copia previa).
--   3. Completa el perfil de la conservada con los datos que le falten.
--   4. Guarda el nombre de la otra ficha como nombre alternativo (alias).
--   5. Pone el nombre final y deja la otra ficha en borrador (no se borra).
-- El registro de auditoría (audit_log) no se toca: es historia.

create or replace function pg_temp.unificar_persona(p_keep text, p_drop text, p_final_name text)
returns jsonb
language plpgsql
as $$
declare
  k uuid;
  d uuid;
  d_name text;
  n int;
  out jsonb := '{}'::jsonb;
begin
  select id into k from entities where slug = p_keep and entity_type = 'agent';
  select id, name into d, d_name from entities where slug = p_drop and entity_type = 'agent';
  if k is null or d is null then
    raise exception 'Pareja % / %: alguna ficha no existe o no es una persona', p_keep, p_drop;
  end if;

  -- Autorías de marchas (único: marcha + persona + papel)
  delete from march_authors a using march_authors b
   where a.agent_entity_id = d and b.agent_entity_id = k
     and b.march_entity_id = a.march_entity_id and b.author_role is not distinct from a.author_role;
  get diagnostics n = row_count; out := out || jsonb_build_object('march_authors_repetidas', n);
  update march_authors set agent_entity_id = k where agent_entity_id = d;
  get diagnostics n = row_count; out := out || jsonb_build_object('march_authors', n);

  -- Autorías de imágenes (único: imagen + persona + tipo + papel)
  delete from image_authorships a using image_authorships b
   where a.agent_entity_id = d and b.agent_entity_id = k and b.image_entity_id = a.image_entity_id
     and b.authorship_type is not distinct from a.authorship_type and b.role_name is not distinct from a.role_name;
  get diagnostics n = row_count; out := out || jsonb_build_object('image_authorships_repetidas', n);
  update image_authorships set agent_entity_id = k where agent_entity_id = d;
  get diagnostics n = row_count; out := out || jsonb_build_object('image_authorships', n);

  -- Intervenciones patrimoniales (sin clave única: se mueven todas)
  update heritage_interventions set agent_entity_id = k where agent_entity_id = d;
  get diagnostics n = row_count; out := out || jsonb_build_object('heritage_interventions', n);
  update heritage_update_agents set agent_entity_id = k where agent_entity_id = d;
  get diagnostics n = row_count; out := out || jsonb_build_object('heritage_update_agents', n);

  -- Fases de paso (único: fase + persona + disciplina + elemento)
  delete from step_phase_agents a using step_phase_agents b
   where a.agent_entity_id = d and b.agent_entity_id = k and b.step_phase_id = a.step_phase_id
     and b.discipline is not distinct from a.discipline and b.element_entity_id is not distinct from a.element_entity_id;
  get diagnostics n = row_count; out := out || jsonb_build_object('step_phase_agents_repetidas', n);
  update step_phase_agents set agent_entity_id = k where agent_entity_id = d;
  get diagnostics n = row_count; out := out || jsonb_build_object('step_phase_agents', n);
  update step_personnel_periods set agent_entity_id = k where agent_entity_id = d;
  get diagnostics n = row_count; out := out || jsonb_build_object('step_personnel_periods', n);

  -- Cargos en bandas (único: banda + persona + cargo + fecha)
  delete from band_agents a using band_agents b
   where a.agent_entity_id = d and b.agent_entity_id = k and b.band_entity_id = a.band_entity_id
     and b.role_name is not distinct from a.role_name and b.date_from is not distinct from a.date_from;
  get diagnostics n = row_count; out := out || jsonb_build_object('band_agents_repetidas', n);
  update band_agents set agent_entity_id = k where agent_entity_id = d;
  get diagnostics n = row_count; out := out || jsonb_build_object('band_agents', n);
  update crew_event_agents set agent_entity_id = k where agent_entity_id = d;
  get diagnostics n = row_count; out := out || jsonb_build_object('crew_event_agents', n);

  -- Relaciones (en los dos sentidos), sin repetir tipo y destino
  delete from entity_relations a using entity_relations b
   where a.source_entity_id = d and b.source_entity_id = k
     and b.target_entity_id = a.target_entity_id and b.relation_type = a.relation_type;
  update entity_relations set source_entity_id = k where source_entity_id = d;
  get diagnostics n = row_count; out := out || jsonb_build_object('entity_relations', n);
  delete from entity_relations a using entity_relations b
   where a.target_entity_id = d and b.target_entity_id = k
     and b.source_entity_id = a.source_entity_id and b.relation_type = a.relation_type;
  update entity_relations set target_entity_id = k where target_entity_id = d;

  -- Fuentes de la ficha (sin repetir la misma fuente)
  delete from source_links a using source_links b
   where a.entity_id = d and b.entity_id = k and b.source_id = a.source_id;
  get diagnostics n = row_count; out := out || jsonb_build_object('source_links_repetidas', n);
  update source_links set entity_id = k where entity_id = d;
  get diagnostics n = row_count; out := out || jsonb_build_object('source_links', n);

  -- Noticias y contenidos enlazados
  update editorial_content_links set entity_id = k where entity_id = d;
  get diagnostics n = row_count; out := out || jsonb_build_object('editorial_content_links', n);

  -- Perfil: disciplinas y cargos que falten
  delete from agent_disciplines a using agent_disciplines b
   where a.agent_entity_id = d and b.agent_entity_id = k and b.discipline = a.discipline;
  update agent_disciplines set agent_entity_id = k, is_primary = false where agent_entity_id = d;
  get diagnostics n = row_count; out := out || jsonb_build_object('agent_disciplines', n);
  update agent_roles set agent_entity_id = k where agent_entity_id = d;

  -- Perfil: datos de la ficha de persona que le falten a la conservada
  update agents ka set
    agent_kind = coalesce(ka.agent_kind, da.agent_kind),
    municipality_id = coalesce(ka.municipality_id, da.municipality_id),
    foundation_or_birth_text = coalesce(nullif(ka.foundation_or_birth_text, ''), da.foundation_or_birth_text),
    death_or_end_text = coalesce(nullif(ka.death_or_end_text, ''), da.death_or_end_text),
    birth_or_foundation_date = coalesce(ka.birth_or_foundation_date, da.birth_or_foundation_date),
    death_or_end_date = coalesce(ka.death_or_end_date, da.death_or_end_date),
    website_url = coalesce(nullif(ka.website_url, ''), da.website_url),
    instagram_url = coalesce(nullif(ka.instagram_url, ''), da.instagram_url),
    description = coalesce(nullif(ka.description, ''), da.description)
  from agents da
  where ka.entity_id = k and da.entity_id = d;
  insert into agents (entity_id, agent_kind, municipality_id, foundation_or_birth_text, death_or_end_text, website_url, instagram_url, description, birth_or_foundation_date, death_or_end_date)
  select k, agent_kind, municipality_id, foundation_or_birth_text, death_or_end_text, website_url, instagram_url, description, birth_or_foundation_date, death_or_end_date
  from agents where entity_id = d and not exists (select 1 from agents where entity_id = k);

  -- Nombres: los de la otra ficha pasan como nombres alternativos
  update agent_names a set agent_entity_id = k, name_type = 'alias'
   where a.agent_entity_id = d
     and a.name <> p_final_name
     and not exists (select 1 from agent_names b where b.agent_entity_id = k and b.name = a.name and b.date_from is not distinct from a.date_from);
  delete from agent_names where agent_entity_id = d and (name = p_final_name or exists (select 1 from agent_names b where b.agent_entity_id = k and b.name = agent_names.name));
  insert into agent_names (agent_entity_id, name, name_type, is_current)
  select k, nm, 'alias', true
  from (values (d_name), ((select name from entities where id = k))) v(nm)
  where nm <> p_final_name
    and not exists (select 1 from agent_names b where b.agent_entity_id = k and b.name = v.nm);

  -- Resumen de la ficha si la conservada no lo tiene
  update entities ke set summary = de.summary
  from entities de
  where ke.id = k and de.id = d and coalesce(ke.summary, '') = '' and coalesce(de.summary, '') <> '';

  -- Nombre final y borrador
  update entities set name = p_final_name, content_updated_at = now(), updated_at = now() where id = k;
  update entities set status = 'draft', updated_at = now() where id = d;

  return jsonb_build_object('conservada', p_keep, 'borrador', p_drop, 'nombre', p_final_name) || out;
end;
$$;

select pg_temp.unificar_persona(keep, drop, final_name) as resultado
from (values
  (1,  'alberto-barea-tejada', 'alberto-barea', 'Alberto Barea Tejada'),
  (2,  'alberto-escamez-lopez', 'alberto-escamez', 'Alberto Escámez López'),
  (3,  'agente-alejandro-blanco-hernandez', 'agente-alejandro-blanco', 'Alejandro Blanco Hernández'),
  (4,  'antonio-david-rodriguez-gomez', 'agente-antonio-david-rodriguez', 'Antonio David Rodríguez Gómez'),
  (5,  'claudio-gomez-calado', 'claudio-gomez-compositor', 'Claudio Gómez Calado'),
  (6,  'agente-francisco-javier-cebrero-arias', 'francisco-javier-cebrero', 'Francisco Javier Cebrero Arias'),
  (7,  'agente-ignacio-jose-garcia-perez', 'agente-ignacio-garcia-perez', 'Ignacio José García Pérez'),
  (8,  'jesus-joaquin-espinosa-de-los-monteros-perez', 'agente-jesus-joaquin-espinosa-de-los-monteros', 'Jesús Joaquín Espinosa de los Monteros Pérez'),
  (9,  'joaquin-eligio-brun', 'agente-joaquin-eligio', 'Joaquín Eligio Brun'),
  (10, 'jose-julio-vera-cuder', 'jose-julio-vera', 'José Julio Vera Cuder'),
  (11, 'jose-manuel-toscano-perez', 'jose-manuel-toscano', 'José Manuel Toscano Pérez'),
  (12, 'juan-de-dios-espinosa-ordonez', 'juan-de-dios-espinosa', 'Juan de Dios Espinosa Ordóñez'),
  (13, 'luis-manuel-catalan-nunez', 'luis-manuel-catalan', 'Luis Manuel Catalán Núñez'),
  (14, 'rafael-bermudez-medina', 'rafael-bermudez', 'Rafael Bermúdez Medina'),
  (15, 'enrique-castellanos-luque', 'enrique-castellanos-dorador', 'Enrique Castellanos Luque'),
  (16, 'rafael-fernandez-del-toro', 'fernandez-del-toro', 'Rafael Fernández del Toro'),
  (17, 'fernando-marmolejo', 'fernando-marmolejo-camargo', 'Fernando Marmolejo Camargo'),
  (18, 'javier-sanchez-de-los-reyes', 'francisco-javier-sanchez-de-los-reyes', 'Javier Sánchez de los Reyes'),
  (19, 'miguel-angel-valverde-jimenez', 'miguel-angel-valverde', 'Miguel Ángel Valverde Jiménez'),
  (20, 'rafael-barbero', 'rafael-barbero-medina', 'Rafael Barbero Medina'),
  (21, 'juan-antonio-blanco-ramos', 'juan-antonio-blanco', 'Juan Antonio Blanco Ramos'),
  (22, 'juan-ventura', 'juan-antonio-gonzalez-garcia-ventura', 'Juan Ventura')
) as p(n, keep, drop, final_name)
order by n;
