-- Encuadre de la imagen principal de una salida: fotografía o cartel.
-- En la Agenda (#agenda-fotos) un cartel no se recorta: se muestra entero.
-- Mismos valores que entity_media.fit_mode y cult_media.fit_mode.
--   cover   -> fotografía: llena el encuadre (valor por defecto al leer)
--   contain -> cartel o pieza gráfica: se muestra entera
-- Cambio aditivo: columna opcional, no modifica ni borra filas existentes.
-- Sin cambios de RLS: las políticas vigentes de outings ya cubren la lectura
-- pública de lo publicado y la escritura de editores.

alter table public.outings
  add column if not exists hero_image_fit text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'outings_hero_image_fit_check') then
    alter table public.outings
      add constraint outings_hero_image_fit_check
      check (hero_image_fit is null or hero_image_fit in ('cover', 'contain'));
  end if;
end $$;

comment on column public.outings.hero_image_fit is
  'Encuadre de hero_image_path: cover (fotografía) o contain (cartel, se muestra entero). Nulo = fotografía.';
