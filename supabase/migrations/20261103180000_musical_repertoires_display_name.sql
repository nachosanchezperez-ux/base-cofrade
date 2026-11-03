-- Nombre propio de una cruceta (03/11/2026).
-- La cruceta se identifica por defecto con el nombre popular de la Hermandad
-- («La Macarena · 25 de octubre de 2026»). Cuando la salida es de una titular
-- concreta y el nombre de la Hermandad no basta para identificarla, el editor
-- puede fijar aquí el nombre con el que se presenta: «Virgen del Rosario de la
-- Macarena». Nulo = se usa el nombre de la Hermandad.
-- Cambio aditivo: columna opcional, no modifica ni borra filas existentes.
-- Sin cambios de RLS ni permisos: las políticas y grants vigentes de
-- musical_repertoires son de tabla y cubren la nueva columna.

alter table public.musical_repertoires
  add column if not exists display_name text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'musical_repertoires_display_name_check') then
    alter table public.musical_repertoires
      add constraint musical_repertoires_display_name_check
      check (display_name is null or length(btrim(display_name)) between 1 and 120);
  end if;
end $$;

comment on column public.musical_repertoires.display_name is
  'Nombre con el que se presenta la cruceta en lugar del nombre popular de la Hermandad. Nulo = nombre de la Hermandad.';
