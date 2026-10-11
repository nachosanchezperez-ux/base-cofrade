-- Normaliza public.outings.outing_type a la lista cerrada de tipos de salida.
--
-- Por qué en la base de datos: las salidas entran por el Panel, por el circuito HC-016
-- y por apply_document_import. Un único trigger evita que cada ruta reintroduzca
-- variantes ("Estación de penitencia", "Rosario público", "Procesión extraordinaria"…).
--
-- Reglas:
--   * Solo reescribe variantes conocidas; cualquier otro valor se deja tal cual.
--   * Si la variante antigua decía "extraordinario/a", fuerza character = 'extraordinary'
--     para no perder ese dato al acortar el tipo.
--   * La variante (misional, de regreso…) pasa a outing_subtype si esta venía vacía.
--
-- Para revertir datos con una copia de seguridad hay que desactivarlo antes:
--   alter table public.outings disable trigger outings_normalize_outing_type;
-- y reactivarlo después:
--   alter table public.outings enable trigger outings_normalize_outing_type;

create or replace function public.normalize_outing_type()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  key text;
  canonical text;
  variant text;
begin
  if new.outing_type is null then
    return new;
  end if;

  key := lower(translate(
    regexp_replace(btrim(new.outing_type), '\s+', ' ', 'g'),
    'ÁÉÍÓÚÜáéíóúü',
    'AEIOUUaeiouu'
  ));

  canonical := case key
    when 'estacion de penitencia'                 then 'Estación de Penitencia'
    when 'station_of_penance'                     then 'Estación de Penitencia'
    when 'procesion de gloria'                    then 'Procesión de Gloria'
    when 'procesion eucaristica'                  then 'Procesión sacramental'
    when 'procesion sacramental'                  then 'Procesión sacramental'
    when 'procesion'                              then 'Procesión'
    when 'procesion extraordinaria'               then 'Procesión'
    when 'rosario matutino'                       then 'Rosario Matutino'
    when 'rosario matinal'                        then 'Rosario Matutino'
    when 'rosario matutino extraordinario'        then 'Rosario Matutino'
    when 'rosario vespertino'                     then 'Rosario Vespertino'
    when 'rosario vespertino extraordinario'      then 'Rosario Vespertino'
    when 'rosario de la aurora'                   then 'Rosario de la Aurora'
    when 'rosario'                                then 'Rosario Público'
    when 'rosario publico'                        then 'Rosario Público'
    when 'rosario extraordinario'                 then 'Rosario Extraordinario'
    when 'traslado'                               then 'Traslado'
    when 'traslado extraordinario'                then 'Traslado'
    when 'traslado de regreso'                    then 'Traslado'
    when 'traslado en via crucis'                 then 'Traslado'
    when 'traslado extraordinario colectivo'      then 'Traslado'
    when 'traslado misional'                      then 'Traslado'
    when 'via crucis'                             then 'Vía Crucis'
    when 'via crucis extraordinario'              then 'Vía Crucis'
    when 'via crucis del consejo'                 then 'Vía Crucis'
    when 'via crucis de las cofradias'            then 'Vía Crucis'
    when 'via lucis'                              then 'Vía Lucis'
    when 'romeria'                                then 'Romería'
    else null
  end;

  if canonical is null then
    return new;
  end if;

  variant := case key
    when 'traslado de regreso'                    then 'de regreso'
    when 'traslado en via crucis'                 then 'en Vía Crucis'
    when 'traslado extraordinario colectivo'      then 'colectivo'
    when 'traslado misional'                      then 'misional'
    when 'via crucis del consejo'                 then 'del Consejo de Hermandades y Cofradías'
    when 'via crucis de las cofradias'            then 'del Consejo de Hermandades y Cofradías'
    else null
  end;

  if key like '%extraordinari%' then
    new."character" := 'extraordinary';
  end if;

  if variant is not null and nullif(btrim(coalesce(new.outing_subtype, '')), '') is null then
    new.outing_subtype := variant;
  end if;

  new.outing_type := canonical;
  return new;
end;
$$;

drop trigger if exists outings_normalize_outing_type on public.outings;

create trigger outings_normalize_outing_type
  before insert or update of outing_type on public.outings
  for each row execute function public.normalize_outing_type();
