-- Tarea 06 · Destacados de la portada gestionables desde el Panel.
--
-- Hasta ahora los destacados de la Home se definían en código
-- (lib/home-editorial-focus.js) con el UUID de la salida y unas fechas, de modo
-- que cada destacado exigía una PR y un despliegue.
--
-- El destacado es un atributo editorial de la propia salida, así que se guarda en
-- public.outings en lugar de en una tabla paralela:
--   * home_featured_starts_on / home_featured_ends_on: ventana (fechas de Madrid,
--     ambas incluidas) en la que la salida puede ocupar el bloque destacado;
--   * home_featured_priority: orden entre destacados simultáneos (mayor primero).
--
-- La Home solo muestra el destacado mientras la salida no haya terminado, aunque
-- la ventana siga abierta (regla ya existente en getHomeEditorialFocuses).
--
-- Sin cambios de RLS: la política vigente «Editors can update outings» ya exige
-- can_edit_panel() y, para salidas publicadas, can_publish_panel(). Las columnas
-- son legibles con la misma política pública que el resto de la salida.
--
-- Cambio aditivo: no modifica ni borra filas existentes.

alter table public.outings
  add column if not exists home_featured_starts_on date,
  add column if not exists home_featured_ends_on date,
  add column if not exists home_featured_priority smallint not null default 0;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'outings_home_featured_window_check'
      and conrelid = 'public.outings'::regclass
  ) then
    alter table public.outings
      add constraint outings_home_featured_window_check check (
        (home_featured_starts_on is null and home_featured_ends_on is null)
        or (
          home_featured_starts_on is not null
          and home_featured_ends_on is not null
          and home_featured_ends_on >= home_featured_starts_on
        )
      );
  end if;
end
$$;

create index if not exists outings_home_featured_window_idx
  on public.outings (home_featured_ends_on, home_featured_starts_on)
  where home_featured_starts_on is not null;

comment on column public.outings.home_featured_starts_on is
  'Primer día (Europe/Madrid, incluido) en que la salida puede aparecer como destacado de la portada. Gestionado desde Panel → Portada editorial → Destacados.';
comment on column public.outings.home_featured_ends_on is
  'Último día (Europe/Madrid, incluido) del destacado en portada. La Home lo retira antes si la salida ya ha terminado.';
comment on column public.outings.home_featured_priority is
  'Orden entre destacados simultáneos de la portada; mayor valor, más arriba.';
