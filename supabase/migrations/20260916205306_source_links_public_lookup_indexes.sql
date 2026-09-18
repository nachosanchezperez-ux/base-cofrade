create index if not exists source_links_entity_idx
  on public.source_links (entity_id, source_id)
  where entity_id is not null;

create index if not exists source_links_cult_idx
  on public.source_links (cult_id, source_id)
  where cult_id is not null;

create index if not exists source_links_heritage_update_idx
  on public.source_links (heritage_update_id, source_id)
  where heritage_update_id is not null;

create index if not exists source_links_intervention_idx
  on public.source_links (intervention_id, source_id)
  where intervention_id is not null;

create index if not exists source_links_step_phase_idx
  on public.source_links (step_phase_id, source_id)
  where step_phase_id is not null;

create index if not exists source_links_outing_series_idx
  on public.source_links (outing_series_id, source_id)
  where outing_series_id is not null;

create index if not exists source_links_music_period_idx
  on public.source_links (music_accompaniment_period_id, source_id)
  where music_accompaniment_period_id is not null;
