do $$
declare
  band_id uuid;
  updated_count integer;
begin
  select id
    into band_id
  from public.entities
  where slug = 'agrupacion-musical-nuestra-senora-de-la-encarnacion'
    and entity_type = 'band';

  if band_id is null then
    raise exception 'No existe la Agrupación Musical Nuestra Señora de la Encarnación';
  end if;

  update public.band_releases as release
  set
    cover_image_path = covers.cover_path,
    cover_image_alt = covers.cover_alt,
    updated_at = now()
  from (
    values
      ('Hijos de la Encarnación','https://cdn.palbincdn.com/users/47975/images/AMDG016-1706531030.jpg','Portada del disco Hijos de la Encarnación'),
      ('XXV Aniversario','https://hermandaddesanbenito.net/wp-content/uploads/2023/09/Cd-agrupacion.jpg','Portada del disco XXV Aniversario de la Agrupación Musical Nuestra Señora de la Encarnación'),
      ('Al Estilo de Sevilla','https://www.amencarnacion.com/wp-content/uploads/2014/05/AL-ESTILO-DE-SEVILLA.jpg','Portada del disco Al Estilo de Sevilla'),
      ('De la “Calza” a Sevilla','https://www.amencarnacion.com/wp-content/uploads/2014/05/de-la-Calza-a-Sevilla.jpg','Portada del disco De la Calza a Sevilla'),
      ('A Mi Hermandad','https://www.amencarnacion.com/wp-content/uploads/2014/05/A-mi-Hermandad.jpg','Portada del disco A Mi Hermandad'),
      ('A las Hermandades de la Paz y San Benito','https://www.amencarnacion.com/wp-content/uploads/2014/05/Paz-y-San-Benito.jpg','Portada del disco A las Hermandades de la Paz y San Benito'),
      ('X Aniversario','https://www.amencarnacion.com/wp-content/uploads/2014/05/X-Aniversario.jpg','Portada del disco X Aniversario'),
      ('Presentando a Sevilla','https://www.amencarnacion.com/wp-content/uploads/2014/05/Presentado-a-Sevilla.jpg','Portada del disco Presentando a Sevilla'),
      ('Presentación y Sangre','https://www.amencarnacion.com/wp-content/uploads/2014/05/Presentacion-y-Sangre.jpg','Portada del disco Presentación y Sangre')
  ) as covers(title, cover_path, cover_alt)
  where release.band_entity_id = band_id
    and release.title = covers.title;

  get diagnostics updated_count = row_count;

  if updated_count <> 9 then
    raise exception 'Se esperaban 9 portadas actualizadas y se actualizaron %', updated_count;
  end if;
end
$$;
