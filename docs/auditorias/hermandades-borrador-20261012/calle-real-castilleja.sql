-- Hermandad de la Calle Real de Castilleja de la Cuesta: titulares y pasos (12/10/2026).
-- Encargo del propietario: crear sus pasos y enlazar su música. Todo se crea en BORRADOR, como la
-- Hermandad: no se publica nada sin autorización (TAREA 05: «No publiques fichas en borrador»).
-- Fuentes: Hermandad del Gran Poder de Sevilla (gran-poder.es), ArteSacro (2019) y Banda de la Cruz Roja.
-- Reversión: calle-real-castilleja-rollback.sql.

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes) values
 ('7a5c0e05-2026-4012-8000-00000000ca10', 'La Hermandad del Gran Poder de Castilleja de la Cuesta (Sevilla)', 'https://www.gran-poder.es/devocion/las-hermandades-del-gran-poder-historia-y-patrimonio/la-hermandad-del-gran-poder-de-castilleja-de-la-cuesta-sevilla/', 'Fuente institucional', 'Hermandad del Gran Poder de Sevilla', '2026-10-12',
  'Nombre oficial, sede, titulares con autorías y fechas, pasos y días de salida.'),
 ('7a5c0e05-2026-4012-8000-00000000ca11', 'Todos los datos del Jueves Santo y la Madrugada en Castilleja de la Cuesta', 'https://www.artesacro.org/Noticia.asp?idreg=129355', 'Prensa cofrade', 'ArteSacro', '2026-10-12',
  'Edición de 2019: Vuelta del Jueves Santo con el Cristo de la Vera Cruz y la Piedad (nuevo paso renacentista) y Madrugá con el Gran Poder y los Dolores.')
on conflict (id) do nothing;

update public.entities set summary = 'Hermandad Sacramental de la Inmaculada Concepción Coronada y Cofradía de Nazarenos de la Santísima Vera Cruz, Nuestro Padre Jesús del Gran Poder y María Santísima de los Dolores, con sede en la parroquia de la Purísima Concepción de la Calle Real de Castilleja de la Cuesta.'
where id = 'c6100000-0000-4000-8000-000000000007' and summary is null;
update public.brotherhoods set
  official_name = 'Pontificia, Real, Ilustre, Antigua y Franciscana Hermandad y Archicofradía Sacramental de la Inmaculada Concepción Coronada y de Nazarenos de la Santísima Vera Cruz y Sangre de Nuestro Señor Jesucristo, Nuestro Padre Jesús del Gran Poder y María Santísima de los Dolores',
  popular_name = 'Hermandad de la Calle Real',
  brotherhood_types = array['Sacramental','Penitencia','Gloria'],
  notes = 'Sede: Templo Parroquial de Nuestra Señora de la Purísima Concepción (Calle Real). Salidas: Vuelta del Jueves Santo (Vera Cruz), Estación de Penitencia en la madrugada del Viernes Santo (Gran Poder y Dolores) y Domingo de Resurrección (Inmaculada).'
where entity_id = 'c6100000-0000-4000-8000-000000000007' and official_name = 'Hermandad de la Calle Real de Castilleja de la Cuesta';

insert into public.entities (id, entity_type, name, slug, summary, status) values
 ('7a5c0e05-2026-4012-8000-0000000057e1', 'image', 'Santísimo Cristo de la Vera Cruz', 'cristo-vera-cruz-castilleja-cuesta', 'Crucificado de tamaño natural, anónimo de escuela sevillana del siglo XVII. Antiguo titular de la Hermandad de la Calle Real: el Gran Poder lo sustituyó en la Estación de Penitencia en el siglo XVIII. Sale el Jueves Santo en la Vuelta de la Hermandad.', 'draft'),
 ('7a5c0e05-2026-4012-8000-0000000057e2', 'image', 'Nuestra Señora de la Piedad', 'piedad-castilleja-cuesta', 'Dolorosa del siglo XVII atribuida a Pedro Roldán, que acompaña al Cristo de la Vera Cruz el Jueves Santo.', 'draft'),
 ('7a5c0e05-2026-4012-8000-0000000057e3', 'image', 'Nuestro Padre Jesús del Gran Poder', 'gran-poder-castilleja-cuesta', 'Imagen de la primera mitad del siglo XVIII. Jorge Bernales Ballesteros la atribuye al círculo de Francisco Antonio Ruiz Gijón o de Pedro Roldán. Ya procesionaba antes de 1771. Sale en la madrugada del Viernes Santo.', 'draft'),
 ('7a5c0e05-2026-4012-8000-0000000057e4', 'image', 'María Santísima de los Dolores', 'dolores-castilleja-cuesta', 'Dolorosa de comienzos del siglo XVIII, procedente del convento de las Mínimas de la calle Sierpes de Sevilla. Llegó a la Hermandad en 1899. ArteSacro la atribuye al taller de Pedro Roldán. Sale bajo palio en la madrugada del Viernes Santo.', 'draft'),
 ('7a5c0e05-2026-4012-8000-0000000057e5', 'image', 'Inmaculada Concepción Coronada', 'inmaculada-concepcion-coronada-castilleja-cuesta', 'Obra de Gumersindo Jiménez Astorga (1878), realizada tras el incendio de 1877. Titular de la Hermandad Sacramental de la Calle Real. Procesiona la tarde del Domingo de Resurrección.', 'draft'),
 ('7a5c0e05-2026-4012-8000-0000000057f1', 'step', 'Paso del Santísimo Cristo de la Vera Cruz', 'paso-cristo-vera-cruz-castilleja-cuesta', 'Paso de estilo renacentista, estrenado en 2019, en el que el Cristo de la Vera Cruz sale el Jueves Santo con Nuestra Señora de la Piedad, San Juan Evangelista y Santa María Magdalena.', 'draft'),
 ('7a5c0e05-2026-4012-8000-0000000057f2', 'step', 'Paso de Nuestro Padre Jesús del Gran Poder', 'paso-gran-poder-castilleja-cuesta', 'Paso tallado y dorado, obra de José Gil, estrenado en 1913, con cuatro faroles de plata sobredorada del taller de Villarreal. Sale en la madrugada del Viernes Santo.', 'draft'),
 ('7a5c0e05-2026-4012-8000-0000000057f3', 'step', 'Paso de palio de María Santísima de los Dolores', 'paso-palio-dolores-castilleja-cuesta', 'Palio de terciopelo azul bordado en oro, con caídas de malla, del taller de Sobrinos de Esperanza Elena Caro (años ochenta). Varales de plata de Cayetano González y Joyería Dalmás. Sale en la madrugada del Viernes Santo.', 'draft'),
 ('7a5c0e05-2026-4012-8000-0000000057f4', 'step', 'Paso de la Inmaculada Concepción Coronada', 'paso-inmaculada-castilleja-cuesta', 'Paso de madera dorada con candelabros de guardabrisas, obra de José Gil. Sale la tarde del Domingo de Resurrección.', 'draft')
on conflict (id) do nothing;

insert into public.images (entity_id, image_type, description) values
 ('7a5c0e05-2026-4012-8000-0000000057e1', 'Crucificado', 'Crucificado de tamaño natural, anónimo de escuela sevillana del siglo XVII. Antiguo titular de la Hermandad de la Calle Real: el Gran Poder lo sustituyó en la Estación de Penitencia en el siglo XVIII. Sale el Jueves Santo en la Vuelta de la Hermandad.'),
 ('7a5c0e05-2026-4012-8000-0000000057e2', 'Dolorosa', 'Dolorosa del siglo XVII atribuida a Pedro Roldán, que acompaña al Cristo de la Vera Cruz el Jueves Santo.'),
 ('7a5c0e05-2026-4012-8000-0000000057e3', 'Nazareno', 'Imagen de la primera mitad del siglo XVIII. Jorge Bernales Ballesteros la atribuye al círculo de Francisco Antonio Ruiz Gijón o de Pedro Roldán. Ya procesionaba antes de 1771. Sale en la madrugada del Viernes Santo.'),
 ('7a5c0e05-2026-4012-8000-0000000057e4', 'Dolorosa', 'Dolorosa de comienzos del siglo XVIII, procedente del convento de las Mínimas de la calle Sierpes de Sevilla. Llegó a la Hermandad en 1899. ArteSacro la atribuye al taller de Pedro Roldán. Sale bajo palio en la madrugada del Viernes Santo.'),
 ('7a5c0e05-2026-4012-8000-0000000057e5', 'Inmaculada', 'Obra de Gumersindo Jiménez Astorga (1878), realizada tras el incendio de 1877. Titular de la Hermandad Sacramental de la Calle Real. Procesiona la tarde del Domingo de Resurrección.')
on conflict (entity_id) do nothing;

insert into public.steps (entity_id, step_type, description, execution_date_text) values
 ('7a5c0e05-2026-4012-8000-0000000057f1', 'Paso de misterio', 'Paso de estilo renacentista, estrenado en 2019, en el que el Cristo de la Vera Cruz sale el Jueves Santo con Nuestra Señora de la Piedad, San Juan Evangelista y Santa María Magdalena.', '2019'),
 ('7a5c0e05-2026-4012-8000-0000000057f2', 'Paso de Cristo', 'Paso tallado y dorado, obra de José Gil, estrenado en 1913, con cuatro faroles de plata sobredorada del taller de Villarreal. Sale en la madrugada del Viernes Santo.', '1913'),
 ('7a5c0e05-2026-4012-8000-0000000057f3', 'Paso de palio', 'Palio de terciopelo azul bordado en oro, con caídas de malla, del taller de Sobrinos de Esperanza Elena Caro (años ochenta). Varales de plata de Cayetano González y Joyería Dalmás. Sale en la madrugada del Viernes Santo.', 'Años ochenta (palio)'),
 ('7a5c0e05-2026-4012-8000-0000000057f4', 'Paso de Gloria', 'Paso de madera dorada con candelabros de guardabrisas, obra de José Gil. Sale la tarde del Domingo de Resurrección.', null)
on conflict (entity_id) do nothing;

insert into public.brotherhood_images (id, brotherhood_entity_id, image_entity_id, relation_type, status) values
 ('7a5c0e05-2026-4012-8000-000000000581', 'c6100000-0000-4000-8000-000000000007', '7a5c0e05-2026-4012-8000-0000000057e1', 'titular', 'draft'),
 ('7a5c0e05-2026-4012-8000-000000000582', 'c6100000-0000-4000-8000-000000000007', '7a5c0e05-2026-4012-8000-0000000057e2', 'titular', 'draft'),
 ('7a5c0e05-2026-4012-8000-000000000583', 'c6100000-0000-4000-8000-000000000007', '7a5c0e05-2026-4012-8000-0000000057e3', 'titular', 'draft'),
 ('7a5c0e05-2026-4012-8000-000000000584', 'c6100000-0000-4000-8000-000000000007', '7a5c0e05-2026-4012-8000-0000000057e4', 'titular', 'draft'),
 ('7a5c0e05-2026-4012-8000-000000000585', 'c6100000-0000-4000-8000-000000000007', '7a5c0e05-2026-4012-8000-0000000057e5', 'titular', 'draft')
on conflict (id) do nothing;

insert into public.brotherhood_steps (id, brotherhood_entity_id, step_entity_id, relation_type, status) values
 ('7a5c0e05-2026-4012-8000-000000000591', 'c6100000-0000-4000-8000-000000000007', '7a5c0e05-2026-4012-8000-0000000057f1', 'processional_step', 'draft'),
 ('7a5c0e05-2026-4012-8000-000000000592', 'c6100000-0000-4000-8000-000000000007', '7a5c0e05-2026-4012-8000-0000000057f2', 'processional_step', 'draft'),
 ('7a5c0e05-2026-4012-8000-000000000593', 'c6100000-0000-4000-8000-000000000007', '7a5c0e05-2026-4012-8000-0000000057f3', 'processional_step', 'draft'),
 ('7a5c0e05-2026-4012-8000-000000000594', 'c6100000-0000-4000-8000-000000000007', '7a5c0e05-2026-4012-8000-0000000057f4', 'processional_step', 'draft')
on conflict (id) do nothing;

insert into public.image_steps (id, image_entity_id, step_entity_id, relation_type, status) values
 ('7a5c0e05-2026-4012-8000-0000000005a1', '7a5c0e05-2026-4012-8000-0000000057e1', '7a5c0e05-2026-4012-8000-0000000057f1', 'processes_on', 'draft'),
 ('7a5c0e05-2026-4012-8000-0000000005a2', '7a5c0e05-2026-4012-8000-0000000057e2', '7a5c0e05-2026-4012-8000-0000000057f1', 'processes_on', 'draft'),
 ('7a5c0e05-2026-4012-8000-0000000005a3', '7a5c0e05-2026-4012-8000-0000000057e3', '7a5c0e05-2026-4012-8000-0000000057f2', 'processes_on', 'draft'),
 ('7a5c0e05-2026-4012-8000-0000000005a4', '7a5c0e05-2026-4012-8000-0000000057e4', '7a5c0e05-2026-4012-8000-0000000057f3', 'processes_on', 'draft'),
 ('7a5c0e05-2026-4012-8000-0000000005a5', '7a5c0e05-2026-4012-8000-0000000057e5', '7a5c0e05-2026-4012-8000-0000000057f4', 'processes_on', 'draft')
on conflict (id) do nothing;

insert into public.source_links (source_id, entity_id, brotherhood_step_id, image_step_id, scope)
select v.s, v.e, v.bs, v.isx, 'Documentación de la Hermandad de la Calle Real' from (values
  ('7a5c0e05-2026-4012-8000-00000000ca11'::uuid, '7a5c0e05-2026-4012-8000-0000000057e1'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca11'::uuid, '7a5c0e05-2026-4012-8000-0000000057e2'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca10'::uuid, '7a5c0e05-2026-4012-8000-0000000057e3'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca10'::uuid, '7a5c0e05-2026-4012-8000-0000000057e4'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca10'::uuid, '7a5c0e05-2026-4012-8000-0000000057e5'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca11'::uuid, '7a5c0e05-2026-4012-8000-0000000057f1'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca11'::uuid, null::uuid, '7a5c0e05-2026-4012-8000-000000000591'::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca11'::uuid, null::uuid, null::uuid, '7a5c0e05-2026-4012-8000-0000000005a1'::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca11'::uuid, null::uuid, null::uuid, '7a5c0e05-2026-4012-8000-0000000005a2'::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca10'::uuid, '7a5c0e05-2026-4012-8000-0000000057f2'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca10'::uuid, null::uuid, '7a5c0e05-2026-4012-8000-000000000592'::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca10'::uuid, null::uuid, null::uuid, '7a5c0e05-2026-4012-8000-0000000005a3'::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca10'::uuid, '7a5c0e05-2026-4012-8000-0000000057f3'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca10'::uuid, null::uuid, '7a5c0e05-2026-4012-8000-000000000593'::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca10'::uuid, null::uuid, null::uuid, '7a5c0e05-2026-4012-8000-0000000005a4'::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca10'::uuid, '7a5c0e05-2026-4012-8000-0000000057f4'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca10'::uuid, null::uuid, '7a5c0e05-2026-4012-8000-000000000594'::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca10'::uuid, null::uuid, null::uuid, '7a5c0e05-2026-4012-8000-0000000005a5'::uuid),
  ('840a0e5c-7ac1-4ce8-b99f-17155a7de46d'::uuid, '7a5c0e05-2026-4012-8000-0000000057f4'::uuid, null::uuid, null::uuid)
) v(s, e, bs, isx)
where not exists (select 1 from public.source_links x where x.source_id = v.s and x.entity_id is not distinct from v.e and x.brotherhood_step_id is not distinct from v.bs and x.image_step_id is not distinct from v.isx);

update public.music_accompaniment_periods m set step_entity_id = v.step, public_step_name = e.name
from (values
  ('ad90cae2-d395-4a54-9644-8a18bb565bda'::uuid, '7a5c0e05-2026-4012-8000-0000000057f1'::uuid),
  ('26ebeba4-0777-4944-95cb-7d3be79b5334'::uuid, '7a5c0e05-2026-4012-8000-0000000057f2'::uuid),
  ('15c7978e-ca6e-4f0b-b951-c7745fdc60d0'::uuid, '7a5c0e05-2026-4012-8000-0000000057f2'::uuid),
  ('376a7157-322d-4c4f-8c54-6780c53ab1f4'::uuid, '7a5c0e05-2026-4012-8000-0000000057f4'::uuid)
) v(id, step) join public.entities e on e.id = v.step
where m.id = v.id and m.step_entity_id is null;
