-- TAREA 05 · Reversión de candidate.sql.
begin;

update public.music_accompaniment_periods
set step_entity_id = null
where id = '1b5b079c-58c5-4b2e-934d-dc81707ec293'
  and step_entity_id = 'c0160038-0700-4000-8000-b59848410d5d';

delete from private.music_period_step_links_20261012
where period_id = '1b5b079c-58c5-4b2e-934d-dc81707ec293';

update public.music_accompaniment_periods m
set public_band_name = null
from private.music_period_public_names_tarea05 l
where m.id = l.period_id and m.public_band_name = l.public_band_name;

drop table if exists private.music_period_public_names_tarea05;

commit;
