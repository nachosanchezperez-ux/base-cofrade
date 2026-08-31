-- Hilo Cofrade · Extraordinarias Sevilla 2026 · música
-- Solo crea relaciones a fichas de banda ya existentes; el resto conserva el nombre literal.

delete from public.outing_music_positions omp
where omp.outing_id in (
  select id from public.outings where reference_code in (
    select ref from (values
      ('AZNALCOLLAR-SANTA-CRUZ-SANTA-ELENA-2026'),
      ('AZNALCAZAR-ANGUSTIAS-2026'),
      ('GERENA-SANGRE-2026'),
      ('PILAS-CRISTO-DEL-AMOR-2026'),
      ('GUADALCANAL-GUADITOCA-2026-09-27'),
      ('UTRERA-ANGUSTIAS-2026'),
      ('SEVILLA-REGLA-CORONADA-2026'),
      ('PILAS-BELEN-CORONADA-2026-10-04'),
      ('LOS-ROSALES-ROSARIO-DE-FATIMA-2026-10-10'),
      ('SEVILLA-DIVINA-GRACIA-2026'),
      ('EL-CASTILLO-DE-LAS-GUARDAS-DOLORES-2026'),
      ('MONTELLANO-DOLORES-2026'),
      ('PILAS-BELEN-CORONADA-2026-10-11'),
      ('SANLUCAR-LA-MAYOR-PIEDAD-2026'),
      ('PARADAS-MISERICORDIA-2026'),
      ('ESTEPA-JESUS-NAZARENO-2026-11-02'),
      ('GUADALCANAL-GUADITOCA-2026-11-02'),
      ('LOS-ROSALES-ROSARIO-DE-FATIMA-2026-11-02'),
      ('SEVILLA-AMPARO-2026'),
      ('ESTEPA-JESUS-NAZARENO-2026-11-15'),
      ('CORIA-DEL-RIO-SALUD-2026'),
      ('SEVILLA-SALUD-Y-BUEN-VIAJE-2026')
    ) as refs(ref)
  )
);

with data(ref, orden, banda, posicion_tramo, desde, hasta, notas, position_code) as (
  values
    ('AZNALCOLLAR-SANTA-CRUZ-SANTA-ELENA-2026', '1', 'Agrupación Musical de Nuestra Señora de Fuente Clara', 'Primera parte del itinerario matinal', 'Capilla de la Cruz de Abajo', '', 'Acompañamiento documentado durante la primera parte del recorrido.', 'processional_music'),
    ('AZNALCOLLAR-SANTA-CRUZ-SANTA-ELENA-2026', '2', 'Banda Municipal de Aznalcóllar', 'Segunda parte del itinerario matinal', '', 'Parroquia de Ntra. Sra. de Consolación', 'Acompañamiento documentado durante la segunda parte del recorrido.', 'processional_music'),
    ('AZNALCOLLAR-SANTA-CRUZ-SANTA-ELENA-2026', '3', 'Coral de San Felipe Neri', 'Santa Misa ante el Arco El Terrible', 'Arco El Terrible', 'Arco El Terrible', '', 'liturgical_music'),
    ('AZNALCAZAR-ANGUSTIAS-2026', '1', 'Banda Municipal de Música de Bollullos del Condado', 'Bando Anunciador', '', '', 'Acto celebrado el 21 de agosto.', 'announcement_music'),
    ('AZNALCAZAR-ANGUSTIAS-2026', '2', 'Banda Municipal de Música de Bollullos del Condado', 'Salida hasta la Plaza del Cabildo', 'Capilla-Oratorio de Santiago Apóstol', 'Plaza del Cabildo', '', 'processional_music'),
    ('AZNALCAZAR-ANGUSTIAS-2026', '3', 'Coro Apóstol Santiago', 'Misa Estacional', 'Plaza del Cabildo', 'Plaza del Cabildo', '', 'liturgical_music'),
    ('AZNALCAZAR-ANGUSTIAS-2026', '4', 'Banda de Música de la Oliva de Salteras', 'Procesión triunfal tras la misa', 'Plaza del Cabildo', 'Capilla-Oratorio de Santiago Apóstol', '', 'processional_music'),
    ('GERENA-SANGRE-2026', '1', 'Banda de Música Municipal de Gerena', 'Traslado de ida', 'Iglesia de San Benito Abad', 'Plaza Fernández Velasco', '', 'processional_music'),
    ('GERENA-SANGRE-2026', '2', 'Grupo de Cámara “SACRA”', 'Solemne Pontifical', 'Plaza Fernández Velasco', 'Plaza Fernández Velasco', 'Formación dirigida por Arturo Ártigas Campos; el dossier describe orquesta sinfónica de 57 músicos, coro mixto de 28 voces y solistas soprano, tenor, barítono y bajo.', 'liturgical_music'),
    ('GERENA-SANGRE-2026', '3', 'Banda de Cornetas y Tambores Stmo. Cristo de los Remedios de Castilleja de la Cuesta', 'Apertura de la procesión triunfal', 'Plaza Fernández Velasco', 'Iglesia de San Benito Abad', '', 'processional_music'),
    ('GERENA-SANGRE-2026', '4', 'Banda de Música Municipal de Gerena', 'Tras el paso en la procesión triunfal', 'Plaza Fernández Velasco', 'Iglesia de San Benito Abad', '', 'processional_music'),
    ('PILAS-CRISTO-DEL-AMOR-2026', '1', 'Sociedad Filarmónica de Pilas', 'Ida', 'Capilla del Sagrado Corazón de Jesús', 'Parroquia de Santa María la Mayor', 'Dato procedente del recopilatorio previo trabajado en el chat.', 'processional_music'),
    ('PILAS-CRISTO-DEL-AMOR-2026', '2', 'Agrupación Musical San Miguel Arcángel de Puertollano (Ciudad Real)', 'Regreso', 'Parroquia de Santa María la Mayor', 'Capilla del Sagrado Corazón de Jesús', 'Dato procedente del recopilatorio previo trabajado en el chat.', 'processional_music'),
    ('UTRERA-ANGUSTIAS-2026', '1', 'Formación de cámara de la Asociación Musical Álvarez Quintero', 'Traslado de ida', 'Capilla de San Bartolomé', 'Plaza del Altozano', '', 'processional_music'),
    ('UTRERA-ANGUSTIAS-2026', '2', 'Coro Santa María de Coria del Río', 'Misa de Coronación', 'Plaza del Altozano', 'Plaza del Altozano', '', 'liturgical_music'),
    ('UTRERA-ANGUSTIAS-2026', '3', 'Conjunto Orquestal Da Capo', 'Misa de Coronación', 'Plaza del Altozano', 'Plaza del Altozano', 'Bajo la dirección de Sergio Asián.', 'liturgical_music'),
    ('UTRERA-ANGUSTIAS-2026', '4', 'Banda de Música Virgen de las Angustias de Sanlúcar la Mayor', 'Procesión triunfal de regreso', 'Plaza del Altozano', 'Capilla de San Bartolomé', '', 'processional_music'),
    ('PILAS-BELEN-CORONADA-2026-10-04', '1', 'Sociedad Filarmónica Juvenil de Pilas', 'Rosario de la Aurora', '', '', 'La fuente recoge “Rezo del Santo Rosario y Sociedad Filarmónica Juvenil de Pilas”.', 'processional_music'),
    ('SEVILLA-DIVINA-GRACIA-2026', '1', 'Banda de Música Virgen de las Angustias de Sanlúcar la Mayor', 'Procesión extraordinaria', 'Parroquia de El Buen Pastor y San Juan de la Cruz', 'Parroquia de El Buen Pastor y San Juan de la Cruz', '', 'processional_music'),
    ('MONTELLANO-DOLORES-2026', '1', 'Banda Municipal de Música de Montellano', 'Acompañamiento procesional', '', '', 'No consta en el recopilatorio un punto exacto de relevo.', 'processional_music'),
    ('MONTELLANO-DOLORES-2026', '2', 'Sociedad Filarmónica Santa María de Las Nieves de Olivares', 'Segunda parte del recorrido', '', '', 'La información oficial señala que se sumará a la segunda parte del recorrido.', 'processional_music'),
    ('PILAS-BELEN-CORONADA-2026-10-11', '1', 'Sociedad Filarmónica de Pilas', 'Procesión gloriosa extraordinaria', '', '', '', 'processional_music')
)
insert into public.outing_music_positions(
  outing_id, step_entity_id, position_code, position_label, sequence_no, notes, status
)
select o.id, null, d.position_code, nullif(d.posicion_tramo, ''), d.orden::integer, null, 'published'
from data d
join public.outings o on o.reference_code = d.ref
order by o.id, d.orden::integer;

with data(ref, orden, banda, posicion_tramo, desde, hasta, notas, position_code) as (
  values
    ('AZNALCOLLAR-SANTA-CRUZ-SANTA-ELENA-2026', '1', 'Agrupación Musical de Nuestra Señora de Fuente Clara', 'Primera parte del itinerario matinal', 'Capilla de la Cruz de Abajo', '', 'Acompañamiento documentado durante la primera parte del recorrido.', 'processional_music'),
    ('AZNALCOLLAR-SANTA-CRUZ-SANTA-ELENA-2026', '2', 'Banda Municipal de Aznalcóllar', 'Segunda parte del itinerario matinal', '', 'Parroquia de Ntra. Sra. de Consolación', 'Acompañamiento documentado durante la segunda parte del recorrido.', 'processional_music'),
    ('AZNALCOLLAR-SANTA-CRUZ-SANTA-ELENA-2026', '3', 'Coral de San Felipe Neri', 'Santa Misa ante el Arco El Terrible', 'Arco El Terrible', 'Arco El Terrible', '', 'liturgical_music'),
    ('AZNALCAZAR-ANGUSTIAS-2026', '1', 'Banda Municipal de Música de Bollullos del Condado', 'Bando Anunciador', '', '', 'Acto celebrado el 21 de agosto.', 'announcement_music'),
    ('AZNALCAZAR-ANGUSTIAS-2026', '2', 'Banda Municipal de Música de Bollullos del Condado', 'Salida hasta la Plaza del Cabildo', 'Capilla-Oratorio de Santiago Apóstol', 'Plaza del Cabildo', '', 'processional_music'),
    ('AZNALCAZAR-ANGUSTIAS-2026', '3', 'Coro Apóstol Santiago', 'Misa Estacional', 'Plaza del Cabildo', 'Plaza del Cabildo', '', 'liturgical_music'),
    ('AZNALCAZAR-ANGUSTIAS-2026', '4', 'Banda de Música de la Oliva de Salteras', 'Procesión triunfal tras la misa', 'Plaza del Cabildo', 'Capilla-Oratorio de Santiago Apóstol', '', 'processional_music'),
    ('GERENA-SANGRE-2026', '1', 'Banda de Música Municipal de Gerena', 'Traslado de ida', 'Iglesia de San Benito Abad', 'Plaza Fernández Velasco', '', 'processional_music'),
    ('GERENA-SANGRE-2026', '2', 'Grupo de Cámara “SACRA”', 'Solemne Pontifical', 'Plaza Fernández Velasco', 'Plaza Fernández Velasco', 'Formación dirigida por Arturo Ártigas Campos; el dossier describe orquesta sinfónica de 57 músicos, coro mixto de 28 voces y solistas soprano, tenor, barítono y bajo.', 'liturgical_music'),
    ('GERENA-SANGRE-2026', '3', 'Banda de Cornetas y Tambores Stmo. Cristo de los Remedios de Castilleja de la Cuesta', 'Apertura de la procesión triunfal', 'Plaza Fernández Velasco', 'Iglesia de San Benito Abad', '', 'processional_music'),
    ('GERENA-SANGRE-2026', '4', 'Banda de Música Municipal de Gerena', 'Tras el paso en la procesión triunfal', 'Plaza Fernández Velasco', 'Iglesia de San Benito Abad', '', 'processional_music'),
    ('PILAS-CRISTO-DEL-AMOR-2026', '1', 'Sociedad Filarmónica de Pilas', 'Ida', 'Capilla del Sagrado Corazón de Jesús', 'Parroquia de Santa María la Mayor', 'Dato procedente del recopilatorio previo trabajado en el chat.', 'processional_music'),
    ('PILAS-CRISTO-DEL-AMOR-2026', '2', 'Agrupación Musical San Miguel Arcángel de Puertollano (Ciudad Real)', 'Regreso', 'Parroquia de Santa María la Mayor', 'Capilla del Sagrado Corazón de Jesús', 'Dato procedente del recopilatorio previo trabajado en el chat.', 'processional_music'),
    ('UTRERA-ANGUSTIAS-2026', '1', 'Formación de cámara de la Asociación Musical Álvarez Quintero', 'Traslado de ida', 'Capilla de San Bartolomé', 'Plaza del Altozano', '', 'processional_music'),
    ('UTRERA-ANGUSTIAS-2026', '2', 'Coro Santa María de Coria del Río', 'Misa de Coronación', 'Plaza del Altozano', 'Plaza del Altozano', '', 'liturgical_music'),
    ('UTRERA-ANGUSTIAS-2026', '3', 'Conjunto Orquestal Da Capo', 'Misa de Coronación', 'Plaza del Altozano', 'Plaza del Altozano', 'Bajo la dirección de Sergio Asián.', 'liturgical_music'),
    ('UTRERA-ANGUSTIAS-2026', '4', 'Banda de Música Virgen de las Angustias de Sanlúcar la Mayor', 'Procesión triunfal de regreso', 'Plaza del Altozano', 'Capilla de San Bartolomé', '', 'processional_music'),
    ('PILAS-BELEN-CORONADA-2026-10-04', '1', 'Sociedad Filarmónica Juvenil de Pilas', 'Rosario de la Aurora', '', '', 'La fuente recoge “Rezo del Santo Rosario y Sociedad Filarmónica Juvenil de Pilas”.', 'processional_music'),
    ('SEVILLA-DIVINA-GRACIA-2026', '1', 'Banda de Música Virgen de las Angustias de Sanlúcar la Mayor', 'Procesión extraordinaria', 'Parroquia de El Buen Pastor y San Juan de la Cruz', 'Parroquia de El Buen Pastor y San Juan de la Cruz', '', 'processional_music'),
    ('MONTELLANO-DOLORES-2026', '1', 'Banda Municipal de Música de Montellano', 'Acompañamiento procesional', '', '', 'No consta en el recopilatorio un punto exacto de relevo.', 'processional_music'),
    ('MONTELLANO-DOLORES-2026', '2', 'Sociedad Filarmónica Santa María de Las Nieves de Olivares', 'Segunda parte del recorrido', '', '', 'La información oficial señala que se sumará a la segunda parte del recorrido.', 'processional_music'),
    ('PILAS-BELEN-CORONADA-2026-10-11', '1', 'Sociedad Filarmónica de Pilas', 'Procesión gloriosa extraordinaria', '', '', '', 'processional_music')
)
insert into public.outing_music_assignments(
  music_position_id, band_entity_id, band_name_text, participation_mode, sequence_no,
  segment_start_label, segment_end_label, notes, status
)
select
  omp.id,
  (select e.id from public.entities e where e.entity_type = 'band' and lower(e.name) = lower(d.banda) limit 1),
  d.banda,
  case when nullif(d.desde, '') is not null or nullif(d.hasta, '') is not null then 'segment' else 'unspecified' end,
  1,
  nullif(d.desde, ''),
  nullif(d.hasta, ''),
  nullif(d.notas, ''),
  'published'
from data d
join public.outings o on o.reference_code = d.ref
join public.outing_music_positions omp on omp.outing_id = o.id and omp.sequence_no = d.orden::integer
order by o.id, d.orden::integer;
