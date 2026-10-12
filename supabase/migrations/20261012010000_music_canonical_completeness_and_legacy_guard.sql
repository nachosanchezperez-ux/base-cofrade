-- HC-006 · Fuente única de los acompañamientos musicales.
--
-- La música se modela en dos capas canónicas:
--   * music_accompaniment_periods: relación estable Hermandad–Banda–Paso, con
--     vigencia, histórico y antigüedad (alimenta Hermandad, Banda, Paso y Música 2027);
--   * outing_music_positions + outing_music_assignments: música de una salida concreta
--     (alimenta Agenda, rosarios, Glorias, extraordinarias y la portada).
--
-- public.accompaniments es la tabla anterior a ese modelo (migración 011 de la primera
-- edición la conservó «para no romper datos existentes»). Ninguna vista pública la lee,
-- pero la señal `music` de completitud dependía de ella, lo que llevaba a seguir
-- escribiendo filas que nunca llegaban al lector.
--
-- Esta migración:
--   1. mide la señal `music` sobre las capas canónicas;
--   2. documenta la tabla como legado;
--   3. impide nuevas inserciones en ella. No borra ni modifica filas existentes.

create schema if not exists private;

-- 1 · Señal de completitud sobre las capas canónicas (mismas columnas y orden).
create or replace view public.brotherhood_completeness_signals
with (security_invoker = true) as
select
  b.entity_id,
  b.popular_name is not null and b.official_name is not null and b.foundation_text is not null as identity,
  b.crest_path is not null as crest,
  b.canonical_see_place_id is not null as canonical_see,
  b.current_procession_day is not null as procession_day,
  exists (
    select 1 from public.brotherhood_images bi
    where bi.brotherhood_entity_id = b.entity_id and bi.status = 'published'
  ) as images,
  exists (
    select 1 from public.brotherhood_steps bs
    where bs.brotherhood_entity_id = b.entity_id and bs.status = 'published'
  ) as steps,
  exists (
    select 1 from public.cults c
    where c.brotherhood_entity_id = b.entity_id and c.status = 'published'
  ) as cults,
  exists (
    select 1 from public.outings o
    where o.brotherhood_entity_id = b.entity_id and o.status = 'published'
  ) as outings,
  (
    exists (
      select 1 from public.music_accompaniment_periods m
      where m.brotherhood_entity_id = b.entity_id
        and m.status = 'published'
        and m.is_current
    )
    or exists (
      select 1
      from public.outings o
      join public.outing_music_positions p on p.outing_id = o.id and p.status = 'published'
      join public.outing_music_assignments a on a.music_position_id = p.id and a.status = 'published'
      where o.brotherhood_entity_id = b.entity_id and o.status = 'published'
    )
  ) as music,
  exists (
    select 1 from public.source_links sl
    where sl.entity_id = b.entity_id
  ) as sources
from public.brotherhoods b;

-- 2 · Documentación del legado.
comment on table public.accompaniments is
  'LEGADO (HC-006). No se lee en la web. La música de una salida concreta va en outing_music_positions + outing_music_assignments; la relación estable, en music_accompaniment_periods. Las filas existentes se conservan como evidencia; no se admiten inserciones nuevas.';

-- 3 · Barrera contra nuevas inserciones. UPDATE y DELETE siguen disponibles para
--     una futura conversión o archivado gobernado de las filas existentes.
create or replace function private.reject_legacy_accompaniments_insert()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception using
    errcode = 'check_violation',
    message = 'public.accompaniments es una tabla heredada (HC-006) y no admite filas nuevas.',
    hint = 'Registra la música de una salida en outing_music_positions + outing_music_assignments y la relación estable en music_accompaniment_periods.';
end;
$$;

revoke all on function private.reject_legacy_accompaniments_insert() from public, anon, authenticated;

drop trigger if exists accompaniments_reject_legacy_insert on public.accompaniments;

create trigger accompaniments_reject_legacy_insert
  before insert on public.accompaniments
  for each row execute function private.reject_legacy_accompaniments_insert();
