-- TAREA 05 · Cambios respaldados por datos confirmados. NO APLICADO.
-- Requiere autorización expresa del propietario. Idempotente: cada bloque solo
-- actúa si el registro sigue en el estado auditado el 12/10/2026.
-- Reversión: rollback.sql.

begin;

-- 1 · Utrera 1989 · Presentación al Pueblo → Paso de Nazareno.
--     Evidencia: la posición nombra a Nuestro Padre Jesús Nazareno y esa imagen
--     solo procesiona en este paso (image_steps). Es el mismo criterio que los 27
--     enlaces ya aplicados. La fuente (historia oficial de la banda) acredita la
--     Hermandad y el año, no el paso.
insert into private.music_period_step_links_20261012 (period_id, step_id, step_name, score, applied_at)
select m.id, 'c0160038-0700-4000-8000-b59848410d5d', 'Paso de Nazareno · Jesús Nazareno', null, now()
from public.music_accompaniment_periods m
where m.id = '1b5b079c-58c5-4b2e-934d-dc81707ec293'
  and m.step_entity_id is null
  and exists (
    select 1 from public.brotherhood_steps bs
    where bs.brotherhood_entity_id = m.brotherhood_entity_id
      and bs.step_entity_id = 'c0160038-0700-4000-8000-b59848410d5d'
      and bs.status = 'published')
  and not exists (select 1 from private.music_period_step_links_20261012 l where l.period_id = m.id);

update public.music_accompaniment_periods m
set step_entity_id = 'c0160038-0700-4000-8000-b59848410d5d'
where m.id = '1b5b079c-58c5-4b2e-934d-dc81707ec293'
  and m.step_entity_id is null;

-- 2 · Nombre público de las formaciones históricas archivadas (12 periodos:
--     San Bernardo ×11 y Trinidad ×1). Todos publicados, con fuente y con paso.
--     Hoy no aparecen en el histórico porque la ficha archivada no es pública
--     y el periodo no guarda nombre. Se copia el nombre de la propia ficha; no se
--     crea enlace (public_band_slug sigue vacío) ni se cambia el estado de la ficha.
create table if not exists private.music_period_public_names_tarea05 (
  period_id uuid primary key,
  band_entity_id uuid not null,
  public_band_name text not null,
  applied_at timestamptz not null default now()
);

insert into private.music_period_public_names_tarea05 (period_id, band_entity_id, public_band_name)
select m.id, m.band_entity_id, be.name
from public.music_accompaniment_periods m
join public.entities be on be.id = m.band_entity_id
where m.status = 'published' and be.status = 'archived' and m.public_band_name is null
on conflict (period_id) do nothing;

update public.music_accompaniment_periods m
set public_band_name = l.public_band_name
from private.music_period_public_names_tarea05 l
where m.id = l.period_id and m.public_band_name is null;

-- Comprobación: deben salir 1 y 12.
select
  (select count(*) from public.music_accompaniment_periods where id = '1b5b079c-58c5-4b2e-934d-dc81707ec293' and step_entity_id = 'c0160038-0700-4000-8000-b59848410d5d') as utrera_enlazado,
  (select count(*) from public.music_accompaniment_periods m join private.music_period_public_names_tarea05 l on l.period_id = m.id where m.public_band_name = l.public_band_name) as nombres_historicos;

commit;
