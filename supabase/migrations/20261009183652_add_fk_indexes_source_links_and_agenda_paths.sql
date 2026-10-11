-- Índices de apoyo para claves foráneas sin cobertura (aviso "unindexed foreign keys"
-- del asesor de rendimiento de Supabase). Aplicada primero en producción el 09/10/2026.
-- Los índices de source_links son parciales: la mayoría de sus columnas de enlace
-- son nulas en cada fila, así que solo se indexan las filas que sí usan esa columna.

create index if not exists source_links_agent_name_id_idx
  on public.source_links (agent_name_id) where agent_name_id is not null;
create index if not exists source_links_agent_role_id_idx
  on public.source_links (agent_role_id) where agent_role_id is not null;
create index if not exists source_links_band_premiere_id_idx
  on public.source_links (band_premiere_id) where band_premiere_id is not null;
create index if not exists source_links_brotherhood_image_id_idx
  on public.source_links (brotherhood_image_id) where brotherhood_image_id is not null;
create index if not exists source_links_brotherhood_step_id_idx
  on public.source_links (brotherhood_step_id) where brotherhood_step_id is not null;
create index if not exists source_links_cult_occurrence_id_idx
  on public.source_links (cult_occurrence_id) where cult_occurrence_id is not null;
create index if not exists source_links_editorial_content_id_idx
  on public.source_links (editorial_content_id) where editorial_content_id is not null;
create index if not exists source_links_entity_location_id_idx
  on public.source_links (entity_location_id) where entity_location_id is not null;
create index if not exists source_links_entity_relation_id_idx
  on public.source_links (entity_relation_id) where entity_relation_id is not null;
create index if not exists source_links_image_authorship_id_idx
  on public.source_links (image_authorship_id) where image_authorship_id is not null;
create index if not exists source_links_image_step_id_idx
  on public.source_links (image_step_id) where image_step_id is not null;
create index if not exists source_links_march_dedication_id_idx
  on public.source_links (march_dedication_id) where march_dedication_id is not null;
create index if not exists source_links_march_recording_id_idx
  on public.source_links (march_recording_id) where march_recording_id is not null;
create index if not exists source_links_outing_music_assignment_id_idx
  on public.source_links (outing_music_assignment_id) where outing_music_assignment_id is not null;
create index if not exists source_links_outing_music_position_id_idx
  on public.source_links (outing_music_position_id) where outing_music_position_id is not null;
create index if not exists source_links_step_personnel_period_id_idx
  on public.source_links (step_personnel_period_id) where step_personnel_period_id is not null;

create index if not exists outings_brotherhood_entity_id_idx
  on public.outings (brotherhood_entity_id);
create index if not exists outings_municipality_id_idx
  on public.outings (municipality_id);
create index if not exists cults_brotherhood_entity_id_idx
  on public.cults (brotherhood_entity_id);
create index if not exists outing_entities_entity_id_idx
  on public.outing_entities (entity_id);
create index if not exists image_steps_step_entity_id_idx
  on public.image_steps (step_entity_id);
create index if not exists march_authors_agent_entity_id_idx
  on public.march_authors (agent_entity_id);
create index if not exists events_municipality_id_idx
  on public.events (municipality_id);
