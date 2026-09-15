begin;
update public."events" set "event_status" = 'held' where "entity_id" = '35000000-0000-0000-0000-000000000001';

update public."events" set "event_status" = 'held' where "entity_id" = '0f528808-a102-49b1-a30c-11ec7b41a7a5';

update public."events" set "event_status" = 'held' where "entity_id" = '15000000-0000-0000-0000-000000000002';

update public."events" set "event_status" = 'held' where "entity_id" = '15000000-0000-0000-0000-000000000003';

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "publication_date", "accessed_at", "notes")
values ('a3df0602-e66b-4668-889c-fcfc68b07f48', 'Miles de fieles acompañan a la Virgen de Consolación en su procesión por Utrera', 'https://www.utreraweb.com/noticias-de-utrera/feria/2026/21420/miles-de-fieles-acompanan-a-la-virgen-de-consolacion-en-su-procesion-por-utrera-video/', 'Prensa local', 'UtreraWeb', '2026-09-08', '2026-09-15', 'Crónica posterior que documenta la salida, el recorrido y la participación del 8 de septiembre de 2026.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "publication_date" = excluded."publication_date", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "publication_date", "accessed_at", "notes")
values ('c2aa94a7-53a9-4613-8df4-f3228a97bd78', 'La devoción a la Virgen de Setefilla, a través del objetivo de Antonio Nuño', 'https://lacajacofrade.es/virgen-setefilla-2026-galeria-antonio-nuno/', 'Prensa cofrade', 'La Caja Cofrade', '2026-09-12', '2026-09-15', 'Crónica fotográfica posterior de la Romería de Setefilla de 2026.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "publication_date" = excluded."publication_date", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "publication_date", "accessed_at", "notes")
values ('d691832b-6267-4b68-86a3-6e383d71c00f', 'La Virgen de la Estrella realizó su procesión de Gloria de 2026', 'https://www.facebook.com/aytocoriario/posts/la-virgen-de-la-estrella-patrona-de-coria-del-r%C3%ADo-realiz%C3%B3-ayer-su-procesi%C3%B3n-de-g/1392817602980906/', 'Red social institucional', 'Ayuntamiento de Coria del Río', null, '2026-09-15', 'Comunicación municipal posterior que confirma la procesión del 8 de septiembre de 2026.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "publication_date" = excluded."publication_date", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "publication_date", "accessed_at", "notes")
values ('f9691f63-b6eb-408e-bf9f-b7873617c307', 'La Hermandad del Rocío de Écija acompaña a la Virgen del Valle en su procesión', 'https://www.rocio.com/radar/historias/la-hermandad-del-rocio-de-ecija-acompana-a-la-virgen-del-valle-en-su-procesion', 'Fuente institucional', 'Hermandad del Rocío de Écija / Rocio.com', null, '2026-09-15', 'Comunicación posterior de una corporación participante en la procesión del 8 de septiembre de 2026.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "publication_date" = excluded."publication_date", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "publication_date", "accessed_at", "notes")
values ('fe4afced-afbb-4b99-9144-f17d0a832fe1', 'Participación en la procesión de Nuestra Señora de Consolación de Osuna', 'https://www.instagram.com/p/DdGliUVFYmE/', 'Red social oficial', 'Hermandad de Fátima de Osuna', null, '2026-09-15', 'Comunicación posterior de una corporación participante que confirma la procesión del 8 de septiembre de 2026.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "publication_date" = excluded."publication_date", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "publication_date", "accessed_at", "notes")
values ('1accde5a-be1c-4eca-b393-7d086342c5e4', 'Gerena vive una jornada histórica con la Coronación Canónica de la Virgen de la Sangre', 'https://www.mundocofrade.es/articulo/actualidad/gerena-vive-jornada-historica-coronacion-canonica-virgen-sangre/20260914123359007998.html', 'Prensa cofrade', 'Mundo Cofrade', '2026-09-14', '2026-09-15', 'Crónica posterior de la coronación y procesión triunfal celebradas el 12 de septiembre de 2026.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "publication_date" = excluded."publication_date", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "publication_date", "accessed_at", "notes")
values ('1b023f3e-5423-48c1-a47a-f1008047e6dc', 'Crónica de la procesión del Cristo de la Vera Cruz de Tocina de 2026', 'https://www.facebook.com/elpespunte.es/posts/%EF%B8%8Ftocina-celebra-este-lunes-la-funci%C3%B3n-del-se%C3%B1or-todos-los-detalles-de-la-procesi/1722841523182628/', 'Prensa local', 'El Pespunte', null, '2026-09-15', 'Publicación posterior que documenta la procesión celebrada el 14 de septiembre de 2026.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "publication_date" = excluded."publication_date", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "publication_date", "accessed_at", "notes")
values ('c23adcd6-4318-4d97-8899-b0447fa559ea', 'San Bernardo recuperó el paso del Niño Jesús en la procesión del Santísimo', 'https://www.artesacro.org/Noticia/Ver/169082/san-bernardo-recupero-paso-nino-jesus-procesion-santisimo', 'Prensa cofrade', 'Arte Sacro', '2026-09-15', '2026-09-15', 'Crónica posterior que confirma la Función de la Santa Cruz y la procesión eucarística del 14 de septiembre de 2026.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "publication_date" = excluded."publication_date", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

update public."outings" set "event_status" = 'held' where "id" = 'd4debf08-2ffc-40ef-9e9b-001056634cf8';

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('8708470e-d340-43d4-a263-dd8b29f8f03c', 'a3df0602-e66b-4668-889c-fcfc68b07f48', 'd4debf08-2ffc-40ef-9e9b-001056634cf8', 'Evidencia posterior de celebración · 2026') on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

update public."outings" set "event_status" = 'held' where "id" = 'f2269fd6-67d9-470f-a1c3-1bc4f39c65db';

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('4118e874-6b40-475a-ae97-82e2e0da30bf', 'c2aa94a7-53a9-4613-8df4-f3228a97bd78', 'f2269fd6-67d9-470f-a1c3-1bc4f39c65db', 'Evidencia posterior de celebración · 2026') on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

update public."outings" set "event_status" = 'held' where "id" = 'fe8a73c6-d4bb-404e-9509-d3c911d862ce';

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('e10950dc-6a73-440a-9201-33a1a9f63f76', 'd691832b-6267-4b68-86a3-6e383d71c00f', 'fe8a73c6-d4bb-404e-9509-d3c911d862ce', 'Evidencia posterior de celebración · 2026') on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

update public."outings" set "event_status" = 'held' where "id" = 'ddb20bf2-4bf5-4976-b8e1-c8ec1b94e04e';

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('3b59709c-aacc-4087-af94-b7de1fb52c6b', 'f9691f63-b6eb-408e-bf9f-b7873617c307', 'ddb20bf2-4bf5-4976-b8e1-c8ec1b94e04e', 'Evidencia posterior de celebración · 2026') on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

update public."outings" set "event_status" = 'held' where "id" = '99467611-8d13-4f7e-8e31-2bb46f905e1e';

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('f155cf90-5890-4f29-8789-8de794a0b8ca', 'fe4afced-afbb-4b99-9144-f17d0a832fe1', '99467611-8d13-4f7e-8e31-2bb46f905e1e', 'Evidencia posterior de celebración · 2026') on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

update public."outings" set "event_status" = 'held' where "id" = 'f5d2e6a6-21b4-4462-9510-e4f9292ae4af';

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('537bbeef-6a0b-4f0d-b228-393b8c2990a5', '1accde5a-be1c-4eca-b393-7d086342c5e4', 'f5d2e6a6-21b4-4462-9510-e4f9292ae4af', 'Evidencia posterior de celebración · 2026') on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

update public."outings" set "event_status" = 'held' where "id" = '323a20d6-b16e-4004-b171-351ecc420a2d';

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('98dbe282-3814-44cf-98d0-3a856cd264f1', '1b023f3e-5423-48c1-a47a-f1008047e6dc', '323a20d6-b16e-4004-b171-351ecc420a2d', 'Evidencia posterior de celebración · 2026') on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

update public."outings" set "event_status" = 'held' where "id" = '34fd555f-8ca2-4651-90d6-ff7712635ec4';

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('bf3c446c-e8bf-4eb3-9abd-801d0d2eafbb', 'c23adcd6-4318-4d97-8899-b0447fa559ea', '34fd555f-8ca2-4651-90d6-ff7712635ec4', 'Evidencia posterior de celebración · 2026') on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

update public."cult_occurrences" set "event_status" = 'held' where "id" = 'e8a729e6-3f7c-47ea-a2d1-7e8d0440ff64';

insert into public."source_links" ("id", "source_id", "cult_occurrence_id", "scope")
values ('76b47d84-37f4-4c1b-81f0-7f0a96dbffcf', 'c23adcd6-4318-4d97-8899-b0447fa559ea', 'e8a729e6-3f7c-47ea-a2d1-7e8d0440ff64', 'Evidencia posterior de la función y procesión · 14 de septiembre de 2026') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_occurrence_id" = excluded."cult_occurrence_id", "scope" = excluded."scope";
commit;
