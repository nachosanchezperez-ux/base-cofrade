-- Hilo Cofrade · Pistas de la discografía de la Banda de la Sangre
--
-- Completa los 13 lanzamientos ya documentados con el orden de pistas y los
-- enlaces de escucha publicados en el perfil oficial de Spotify. La operación
-- es idempotente y valida el catálogo antes de terminar.

do $migration$
declare
  band_id uuid;
  release_rows integer;
  track_rows integer;
begin
  select id
    into band_id
  from public.entities
  where slug = 'sangre-de-san-benito'
    and entity_type = 'band';

  if band_id is null then
    raise exception 'No existe la Banda de la Sangre de San Benito';
  end if;

  create temporary table _hc_sangre_release_tracks (
    spotify_album_id text not null,
    sequence_no integer not null,
    title text not null,
    spotify_track_id text not null,
    primary key (spotify_album_id, sequence_no)
  ) on commit drop;

  insert into _hc_sangre_release_tracks values
    ('0NraULFrl2TyNs8aAWgzrK', 1, 'Y fue azotado (Los Negritos 2025)', '5u6zipZjrr6RTs2DcZWd0h'),
    ('0NraULFrl2TyNs8aAWgzrK', 2, 'Amor de Madre (Los Negritos 2025)', '3goKv1y7b9NzA0aaxVV39Y'),
    ('0NraULFrl2TyNs8aAWgzrK', 3, 'Ave María Encarnación (Los Negritos 2025)', '1jj2OtsfR7DcDL89Cxnoub'),
    ('0NraULFrl2TyNs8aAWgzrK', 4, 'Camino al Calvario (Los Negritos 2025)', '7cNg2IzzCeA2ByVRjgGMAE'),
    ('0NraULFrl2TyNs8aAWgzrK', 5, 'Costalero del Soberano (Los Negritos 2025)', '1zAJVfeY2ZgASUnMAdHlru'),
    ('0NraULFrl2TyNs8aAWgzrK', 6, 'María Santísima del Rocío (Los Negritos 2025)', '4Bky5KNky2WzdnLrYOTz7v'),
    ('0NraULFrl2TyNs8aAWgzrK', 7, 'Marcha Real (Los Negritos 2025)', '3ARxXFLeOzGh8wZgSItigi'),
    ('0NraULFrl2TyNs8aAWgzrK', 8, 'Penas de Triana (La Palma del Condado 2025)', '54EPz9UfkaHAOVCKWTwy4S'),
    ('0NraULFrl2TyNs8aAWgzrK', 9, 'Sangre Redentora (La Palma del Condado 2025)', '2BwGsBeLjZvVQamXtcfq9P'),
    ('0NraULFrl2TyNs8aAWgzrK', 10, 'La Sangre del Justo (Salesianos Triana 2025)', '2rOTmEnl2wNEPhAkCPLRO8'),
    ('0NraULFrl2TyNs8aAWgzrK', 11, 'El Pacto de Sangre (Salesianos Triana 2025)', '0g5o8o8gULa7ZHxYVWPtPg'),
    ('0W24qmqWhFej2Fx1TXYypH', 1, 'El Desprecio de Herodes', '3QUCcTX3mxy4lxmGbBCxWV'),
    ('0W24qmqWhFej2Fx1TXYypH', 2, 'Dulce Nombre de María', '1hfjAmDxREZmefRUPe5czG'),
    ('0W24qmqWhFej2Fx1TXYypH', 3, 'Costalero del Soberano', '68UIbuH7RpKN5YzsMzL4Od'),
    ('0fBdo1KWuG0ScEYoLsTmh0', 1, 'Ave María Encarnación - En Directo', '0qFUUZeW9AV2vLoh9ZkMZS'),
    ('2AEXdL7TzncPjFvmtNaXh2', 1, 'Salida Cristo de la Sangre', '6XJDwAlH7ILZ5uELbseSqY'),
    ('2AEXdL7TzncPjFvmtNaXh2', 2, 'Soledad de San Pablo', '1wUM7ffkufkLKK93C7v7vS'),
    ('2AEXdL7TzncPjFvmtNaXh2', 3, 'Macarena', '4n6ZpetJO51T1CmpTkbuyq'),
    ('2AEXdL7TzncPjFvmtNaXh2', 4, 'Cristo del Amor', '74uJxwXUmxXGWio4HQ5Gam'),
    ('2AEXdL7TzncPjFvmtNaXh2', 5, 'Santa Catalina', '3kxbFQtXrfVImjbP9pU1Ir'),
    ('2AEXdL7TzncPjFvmtNaXh2', 6, 'La Virgen de la Paloma', '7rWSlH6NtByEM6RTLrco9u'),
    ('2AEXdL7TzncPjFvmtNaXh2', 7, 'María', '06X7BHdWtwJkBqJHhhPCfi'),
    ('2AEXdL7TzncPjFvmtNaXh2', 8, 'Penas de Triana', '2g0Dc8PawNcPlDQCpdCDgz'),
    ('2AEXdL7TzncPjFvmtNaXh2', 9, 'Revirá Laraña - Orfila', '4Dy7IkySISORl9v8cfot44'),
    ('2AEXdL7TzncPjFvmtNaXh2', 10, 'Tus Lágrimas', '6lLaaJtaXulseIpNUstHiE'),
    ('2AEXdL7TzncPjFvmtNaXh2', 11, 'Pasión, Muerte y Resurrección', '4kjNDSgLd3Lu6asvHIB9eE'),
    ('2AEXdL7TzncPjFvmtNaXh2', 12, 'Plaza de la Campana', '5ife1gSLaBVthC2NSvH638'),
    ('2AEXdL7TzncPjFvmtNaXh2', 13, 'Cristo de la Buena Muerte', '02Zvfi44A9sgCb495mStlg'),
    ('2AEXdL7TzncPjFvmtNaXh2', 14, 'Cuesta del Rosario', '0wG1K3SoX4xuH11X85n6uZ'),
    ('2AEXdL7TzncPjFvmtNaXh2', 15, 'Señor de Sevilla', '5Sn7LbFkslE8ng7Zkf0YLm'),
    ('2AEXdL7TzncPjFvmtNaXh2', 16, 'Ave María', '4slSxGDwmmSgiSa5ccHbEF'),
    ('2AEXdL7TzncPjFvmtNaXh2', 17, 'Al Pie de Tu Santa Cruz', '4TS5mc59DTGTKt99vG5J6U'),
    ('2AEXdL7TzncPjFvmtNaXh2', 18, 'Refúgiame', '2NhJnjmlenO3G9T2Rq8sV8'),
    ('2AEXdL7TzncPjFvmtNaXh2', 19, 'Revirá Santiago', '2oqYe6mJI0hxAwaKBa4BdW'),
    ('2AEXdL7TzncPjFvmtNaXh2', 20, 'La Pasión', '5iKVUWtljrlG4Hrg3ORs2P'),
    ('2AEXdL7TzncPjFvmtNaXh2', 21, 'Sagrada Lanzada', '2pZo6PihUmIwgrlBev2mQs'),
    ('2AEXdL7TzncPjFvmtNaXh2', 22, 'Eucaristía', '6vJKdTo6vhTMp8q5XP15bJ'),
    ('2AEXdL7TzncPjFvmtNaXh2', 23, 'Entrada del Cristo de la Sangre', '6S8ui9j8iIbx7hlXC9qAqs'),
    ('33T7aCnO5EluQOL0piqhNb', 1, 'Al Stmo. Cristo de la Sangre', '18D6IonVQfgwEvjFXbCITy'),
    ('33T7aCnO5EluQOL0piqhNb', 2, 'Misericordia Isleña', '1R23LbPXqNcfBtEWgNAX0v'),
    ('33T7aCnO5EluQOL0piqhNb', 3, 'El Buen Fin de Cristo', '1vKlqnyDI7LT1urjEEc7nR'),
    ('33T7aCnO5EluQOL0piqhNb', 4, 'Virgen de la Salud', '7pl9jnMiZ47PZaCIehuoLP'),
    ('33T7aCnO5EluQOL0piqhNb', 5, 'Misericordia en el Arenal', '2a554D9fMkRJ8FmkJfOijW'),
    ('33T7aCnO5EluQOL0piqhNb', 6, 'Macarena', '6LFr3MXtcViEWblIhiO2Ao'),
    ('33T7aCnO5EluQOL0piqhNb', 7, 'Soledad de San Pablo', '76scLRobvqoUvBy0uwtz09'),
    ('33T7aCnO5EluQOL0piqhNb', 8, 'Llora Sevilla', '5dO3xy8Fu4xaXCvBtYqCCW'),
    ('33T7aCnO5EluQOL0piqhNb', 9, 'Santa Cruz', '7LhUabb9No4aNczrWMUaNs'),
    ('33T7aCnO5EluQOL0piqhNb', 10, 'El Dios del Perdón', '5fehMl3CzwXo4QZuUoEawA'),
    ('33T7aCnO5EluQOL0piqhNb', 11, 'Estampa del Cristo de la Sangre', '5YPZCLrrk5nE61jfpYIaiX'),
    ('3aOnbW85SC8YLGF1fjYQBc', 1, 'Camino al Calvario - Estreno 2023', '5USaiAzqlMgTgi9KgIahqo'),
    ('4AB7RacwFb0smtMaSgGE20', 1, 'Pasan Los Campanilleros', '1hKmsrZ5N0dK5A2xOKk2Ol'),
    ('5ZJq9UnungLaXStG9IaBfo', 1, 'Ave María - Vavilov', '2etO5HACvZv7Syzk3vLkWe'),
    ('5ZJq9UnungLaXStG9IaBfo', 2, 'De Profundis', '2gjAWsjmjUzOkQdzh9V9g9'),
    ('5ZJq9UnungLaXStG9IaBfo', 3, 'Caresse sur l''océan', '3cKqRLemSrf2S3XNQio3zc'),
    ('5ZJq9UnungLaXStG9IaBfo', 4, 'Hymne a la Nuit', '06xeG7UyMSVK1nn4YMszKv'),
    ('5ZJq9UnungLaXStG9IaBfo', 5, 'Ave María - Gounod', '5m5s4g6ffwtIKiauU0JCT3'),
    ('5ZJq9UnungLaXStG9IaBfo', 6, 'Lacrymosa', '7GXuXCxk7IqjHsKuDGSMGZ'),
    ('5ZJq9UnungLaXStG9IaBfo', 7, 'Vois sur ton Chemin', '5kfOJK0acBOZopXs2JJNP6'),
    ('5ZJq9UnungLaXStG9IaBfo', 8, 'La Chica de Ipanema', '4AifAGmLTgUPoTcnSPK5tE'),
    ('5ZJq9UnungLaXStG9IaBfo', 9, 'El Villancico de la Calzá', '7vZKb3Nr4amcQJHZNo1mMm'),
    ('5qdwwlZI6ORpHzIn3GU35e', 1, 'Comentario 1', '2sWSkw9L54Pnek64i74PVm'),
    ('5qdwwlZI6ORpHzIn3GU35e', 2, 'El Cristo de la Sangre', '5yFQSV97uZilq727MdUS4m'),
    ('5qdwwlZI6ORpHzIn3GU35e', 3, 'El Cachorro', '7xc5h7JTjYRgJqztlvmnKj'),
    ('5qdwwlZI6ORpHzIn3GU35e', 4, 'Sagradas Vestiduras', '231K78xSRDrdP58iCTzjRd'),
    ('5qdwwlZI6ORpHzIn3GU35e', 5, 'Comentario 2', '5u9YPC1un7Td25Mz7c2tGj'),
    ('5qdwwlZI6ORpHzIn3GU35e', 6, 'Oración de Gloria', '6ix0kinWaVoD66YowgwT7N'),
    ('5qdwwlZI6ORpHzIn3GU35e', 7, 'Réquiem', '0r7sCUq046wL9VSic1r9vR'),
    ('5qdwwlZI6ORpHzIn3GU35e', 8, 'Stella Maris', '1S3hzPkpE4GasxSTn5cMDJ'),
    ('5qdwwlZI6ORpHzIn3GU35e', 9, 'Comentario Día de Reyes 1997', '7gFR8kiWqfk8mnO97O0H1Q'),
    ('5qdwwlZI6ORpHzIn3GU35e', 10, 'Retransmisión de la Salida Procesional del Stmo. Cristo de la Sangre', '6wrGIwbTEa8VWqT4U7zoOl'),
    ('5qdwwlZI6ORpHzIn3GU35e', 11, 'Sangre', '0CoWDfpF8lsPjNOlXrN4ar'),
    ('5qdwwlZI6ORpHzIn3GU35e', 12, 'Y Sintiéndolo Lloró', '2q30BqbId3tLclDxwM0etE'),
    ('5qdwwlZI6ORpHzIn3GU35e', 13, 'Amén', '1RjkcUcCEtSngEuTrRLz86'),
    ('5qdwwlZI6ORpHzIn3GU35e', 14, 'Comentario 3', '0sI2yU5QsEPBLYHGVCkc71'),
    ('62eOplYLH8NdQX2pdwAck3', 1, 'El Pacto de Sangre - Estreno 2024', '6NdwYsCTWleWmxnjK8h9Fe'),
    ('6pyyttj7Y0zGpJ0M84YVYi', 1, 'Salud de San Bernardo', '7ixZOHCbKlRBl1x3TNHmfk'),
    ('6wELXlIMj7E9sTSinXZVt4', 1, 'Promesa y Pasión - en Directo', '44Ma0IEdc5w8IXxdeJTv1c'),
    ('7q6u2YSnA1l2hFYBvGbAxb', 1, 'Cristo de la Sangre en la Cuesta del Rosario 2023', '0mljLrIHHDjenIemuRqIog');

  select count(*)::integer
    into track_rows
  from _hc_sangre_release_tracks;

  if track_rows <> 78 then
    raise exception 'Se esperaban 78 pistas preparadas y se encontraron %', track_rows;
  end if;

  select count(distinct release.id)::integer
    into release_rows
  from _hc_sangre_release_tracks track
  join public.band_releases release
    on release.band_entity_id = band_id
   and release.spotify_url = 'https://open.spotify.com/album/' || track.spotify_album_id;

  if release_rows <> 13 then
    raise exception 'Se esperaban 13 lanzamientos de Spotify y se encontraron %', release_rows;
  end if;

  insert into public.band_release_tracks (
    release_id, sequence_no, title, spotify_url, notes
  )
  select
    release.id,
    track.sequence_no,
    track.title,
    'https://open.spotify.com/track/' || track.spotify_track_id,
    'Lista de pistas oficial de Spotify'
  from _hc_sangre_release_tracks track
  join public.band_releases release
    on release.band_entity_id = band_id
   and release.spotify_url = 'https://open.spotify.com/album/' || track.spotify_album_id
  on conflict (release_id, sequence_no) do update set
    title = excluded.title,
    spotify_url = excluded.spotify_url,
    notes = excluded.notes;

  select count(*)::integer
    into track_rows
  from _hc_sangre_release_tracks expected
  join public.band_releases release
    on release.band_entity_id = band_id
   and release.spotify_url = 'https://open.spotify.com/album/' || expected.spotify_album_id
  join public.band_release_tracks track
    on track.release_id = release.id
   and track.sequence_no = expected.sequence_no
   and track.title = expected.title
   and track.spotify_url = 'https://open.spotify.com/track/' || expected.spotify_track_id;

  if track_rows <> 78 then
    raise exception 'Se esperaban 78 pistas verificadas y se encontraron %', track_rows;
  end if;
end
$migration$;
