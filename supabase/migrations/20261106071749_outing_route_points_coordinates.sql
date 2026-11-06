-- Coordenadas de los puntos del recorrido de una salida, para dibujar el
-- recorrido en un mapa en la ficha de Hermandad y en la Agenda.
-- Cada punto (calle, templo o hito) guarda un par latitud/longitud aproximado
-- (WGS84) y de dónde sale: una calle es un tramo, no un punto, así que el
-- trazado resultante es aproximado y se presenta como tal.
-- Cambio aditivo: columnas opcionales, no modifica ni borra filas existentes.
-- Sin cambios de RLS: las políticas vigentes de outing_route_points ya cubren
-- la lectura pública y la escritura de editores.

alter table public.outing_route_points
  add column if not exists latitude numeric(9, 6),
  add column if not exists longitude numeric(9, 6),
  add column if not exists coordinates_source text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'outing_route_points_coordinates_check') then
    alter table public.outing_route_points
      add constraint outing_route_points_coordinates_check
      check (
        (latitude is null and longitude is null)
        or (latitude between -90 and 90 and longitude between -180 and 180)
      );
  end if;
end $$;

comment on column public.outing_route_points.latitude is
  'Latitud aproximada del punto (WGS84). Nula si no está geolocalizado.';
comment on column public.outing_route_points.longitude is
  'Longitud aproximada del punto (WGS84). Nula si no está geolocalizado.';
comment on column public.outing_route_points.coordinates_source is
  'Origen de las coordenadas, p. ej. «OpenStreetMap (Nominatim)» o «Manual».';
