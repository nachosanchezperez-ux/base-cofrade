-- Acto extraordinario (#agenda-prioridad, 08/11/2026): marca editorial que pone
-- un acto por delante dentro de su día en la Agenda, la portada y la ficha.
--   coronation             -> coronación canónica o pontificia
--   extraordinary_outing   -> salida extraordinaria
--   anniversary            -> aniversario (fundacional, de la bendición…)
-- Nulo = acto ordinario: el orden ya decidido (besamanos, certámenes y
-- salidas; después el resto de cultos) no cambia.
-- Se marca en la ocurrencia concreta (cult_occurrences) o en la salida
-- (outings), no en el culto genérico: un mismo culto anual solo es
-- extraordinario el año de la efeméride.
-- Cambio aditivo: columnas opcionales, no modifica ni borra filas existentes.
-- Sin cambios de RLS: las políticas vigentes ya cubren la lectura pública de lo
-- publicado y la escritura de editores en ambas tablas.

alter table public.outings
  add column if not exists extraordinary_kind text;

alter table public.cult_occurrences
  add column if not exists extraordinary_kind text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'outings_extraordinary_kind_check') then
    alter table public.outings
      add constraint outings_extraordinary_kind_check
      check (extraordinary_kind is null or extraordinary_kind in ('coronation', 'extraordinary_outing', 'anniversary'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'cult_occurrences_extraordinary_kind_check') then
    alter table public.cult_occurrences
      add constraint cult_occurrences_extraordinary_kind_check
      check (extraordinary_kind is null or extraordinary_kind in ('coronation', 'extraordinary_outing', 'anniversary'));
  end if;
end $$;

comment on column public.outings.extraordinary_kind is
  'Acto extraordinario: coronation, extraordinary_outing o anniversary. Va primero en su día en la Agenda, la portada y la ficha. Nulo = ordinario.';
comment on column public.cult_occurrences.extraordinary_kind is
  'Acto extraordinario: coronation, extraordinary_outing o anniversary. Va primero en su día en la Agenda, la portada y la ficha. Nulo = ordinario.';
