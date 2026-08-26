-- Hilo Cofrade · Extraordinarias Sevilla 2026 · horarios

delete from public.outing_schedule_items osi
where osi.outing_id in (
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

with data(ref, orden, hito, fecha, hora, hora_texto, lugar, notas) as (
  values
    ('AZNALCOLLAR-SANTA-CRUZ-SANTA-ELENA-2026', '1', 'Salida', '2026-08-16', '08:00', '', 'Capilla de la Cruz de Abajo', 'Salida hacia la Parroquia de Ntra. Sra. de Consolación.'),
    ('AZNALCOLLAR-SANTA-CRUZ-SANTA-ELENA-2026', '2', 'Llegada', '2026-08-16', '', 'Sobre las 10:30', 'Parroquia de Ntra. Sra. de Consolación', ''),
    ('AZNALCOLLAR-SANTA-CRUZ-SANTA-ELENA-2026', '3', 'Salida', '2026-08-16', '20:00', '', 'Parroquia de Ntra. Sra. de Consolación', 'Regreso a las calles en dirección al Arco El Terrible.'),
    ('AZNALCOLLAR-SANTA-CRUZ-SANTA-ELENA-2026', '4', 'Santa Misa', '2026-08-16', '', '', 'Arco El Terrible', 'Misa celebrada ante el arco antes de continuar el recorrido.'),
    ('AZNALCOLLAR-SANTA-CRUZ-SANTA-ELENA-2026', '5', 'Entrada', '2026-08-17', '', 'Entre las 01:30 y las 02:00', 'Capilla de la Cruz de Abajo', ''),
    ('AZNALCAZAR-ANGUSTIAS-2026', '1', 'Bando Anunciador', '2026-08-21', '21:00', '', '', 'A cargo de la Banda Municipal de Música de Bollullos del Condado.'),
    ('AZNALCAZAR-ANGUSTIAS-2026', '2', 'Salida', '2026-08-22', '19:00', '', 'Capilla-Oratorio de Santiago Apóstol', ''),
    ('AZNALCAZAR-ANGUSTIAS-2026', '3', 'Misa estacional', '2026-08-22', '20:00', '', 'Plaza del Cabildo', ''),
    ('AZNALCAZAR-ANGUSTIAS-2026', '4', 'Procesión triunfal', '2026-08-22', '', 'En torno a las 22:00', 'Plaza del Cabildo', 'Comienzo tras finalizar la celebración litúrgica.'),
    ('AZNALCAZAR-ANGUSTIAS-2026', '5', 'Entrada', '2026-08-23', '', 'Sobre las 04:00', 'Capilla-Oratorio de Santiago Apóstol', ''),
    ('GERENA-SANGRE-2026', '1', 'Salida', '2026-09-12', '17:00', '', 'Iglesia de San Benito Abad', ''),
    ('GERENA-SANGRE-2026', '2', 'Entronización', '2026-09-12', '18:30', '', 'Plaza Fernández Velasco', 'Entronización de la Virgen en el altar de la Coronación.'),
    ('GERENA-SANGRE-2026', '3', 'Solemne Pontifical', '2026-09-12', '19:30', '', 'Plaza Fernández Velasco', 'Coronación Canónica.'),
    ('GERENA-SANGRE-2026', '4', 'Procesión triunfal', '2026-09-12', '22:30', '', 'Plaza Fernández Velasco', ''),
    ('GERENA-SANGRE-2026', '5', 'Inauguración de monumento conmemorativo', '2026-09-12', '', '', 'Plaza de la Cantina', 'Hito previsto durante el recorrido triunfal.'),
    ('GERENA-SANGRE-2026', '6', 'Entrada', '2026-09-13', '', 'Sobre las 06:00', 'Iglesia de San Benito Abad', ''),
    ('PILAS-CRISTO-DEL-AMOR-2026', '1', 'Salida', '2026-09-26', '17:00', '', 'Capilla del Sagrado Corazón de Jesús', ''),
    ('PILAS-CRISTO-DEL-AMOR-2026', '2', 'Llegada', '2026-09-26', '', '', 'Parroquia de Santa María la Mayor', ''),
    ('PILAS-CRISTO-DEL-AMOR-2026', '3', 'Regreso', '2026-09-26', '', 'Sobre las 20:30', 'Parroquia de Santa María la Mayor', 'Dato del recopilatorio previo; conviene confirmar si las 20:30 corresponden al inicio del regreso o a la llegada final.'),
    ('GUADALCANAL-GUADITOCA-2026-09-27', '1', 'Traslado', '2026-09-27', '', '', 'Guadalcanal', 'Traslado extraordinario a Guadalcanal.'),
    ('UTRERA-ANGUSTIAS-2026', '1', 'Salida', '2026-10-03', '16:30', '', 'Capilla de San Bartolomé', 'Inicio del traslado hacia el Altozano.'),
    ('UTRERA-ANGUSTIAS-2026', '2', 'Llegada', '2026-10-03', '', 'Alrededor de las 17:30', 'Plaza del Altozano', ''),
    ('UTRERA-ANGUSTIAS-2026', '3', 'Misa estacional', '2026-10-03', '19:00', '', 'Plaza del Altozano', 'Coronación Canónica de Nuestra Señora de Las Angustias.'),
    ('UTRERA-ANGUSTIAS-2026', '4', 'Procesión triunfal', '2026-10-03', '22:00', '', 'Plaza del Altozano', 'Hora prevista de comienzo del regreso.'),
    ('UTRERA-ANGUSTIAS-2026', '5', 'Entrada', '2026-10-04', '', 'Ya entrada la madrugada', 'Capilla de San Bartolomé', ''),
    ('SEVILLA-REGLA-CORONADA-2026', '1', 'Rosario matutino extraordinario', '2026-10-04', '', '', 'Convento de San Leandro', 'Rosario hasta el Convento de San Leandro.'),
    ('PILAS-BELEN-CORONADA-2026-10-04', '1', 'Rosario de la Aurora', '2026-10-04', '', '', '', 'Acto del XXX aniversario de la Coronación Canónica.'),
    ('LOS-ROSALES-ROSARIO-DE-FATIMA-2026-10-10', '1', 'Rosario vespertino extraordinario', '2026-10-10', '', '', 'Barrio de la Estación', ''),
    ('LOS-ROSALES-ROSARIO-DE-FATIMA-2026-10-10', '2', 'Pernocta', '2026-10-10', '', '', 'Barrio de la Estación', 'La imagen permanecerá durante la noche en el barrio.'),
    ('LOS-ROSALES-ROSARIO-DE-FATIMA-2026-10-10', '3', 'Función principal', '2026-10-11', '', '', 'CEIP Menéndez Pidal', ''),
    ('LOS-ROSALES-ROSARIO-DE-FATIMA-2026-10-10', '4', 'Regreso', '2026-10-11', '', 'Tras la función principal', 'Su parroquia', ''),
    ('SEVILLA-DIVINA-GRACIA-2026', '1', 'Salida', '2026-10-11', '18:00', '', 'Parroquia de El Buen Pastor y San Juan de la Cruz', ''),
    ('SEVILLA-DIVINA-GRACIA-2026', '2', 'Entrada', '2026-10-12', '00:00', '', 'Parroquia de El Buen Pastor y San Juan de la Cruz', ''),
    ('EL-CASTILLO-DE-LAS-GUARDAS-DOLORES-2026', '1', 'Procesión extraordinaria', '2026-10-11', '', '', '', 'Procesión con motivo del nombramiento como Alcaldesa Perpetua.'),
    ('MONTELLANO-DOLORES-2026', '1', 'Solemne Misa Pontifical', '2026-10-11', '', '', '', 'Acto previo a la procesión extraordinaria.'),
    ('MONTELLANO-DOLORES-2026', '2', 'Procesión extraordinaria', '2026-10-11', '', 'Tras la Solemne Misa Pontifical', 'Montellano', ''),
    ('PILAS-BELEN-CORONADA-2026-10-11', '1', 'Procesión gloriosa extraordinaria', '2026-10-11', '', '', '', 'Acto del XXX aniversario de la Coronación Canónica.'),
    ('SANLUCAR-LA-MAYOR-PIEDAD-2026', '1', 'Salida', '2026-10-11', '', '', 'Capilla de la Vera Cruz', 'Inicio del traslado extraordinario.'),
    ('SANLUCAR-LA-MAYOR-PIEDAD-2026', '2', 'Visita', '2026-10-11', '', '', 'San Eustaquio', 'Visita a una de las cuatro residencias previstas.'),
    ('SANLUCAR-LA-MAYOR-PIEDAD-2026', '3', 'Visita', '2026-10-11', '', '', 'San Miguel', 'Visita a una de las cuatro residencias previstas.'),
    ('SANLUCAR-LA-MAYOR-PIEDAD-2026', '4', 'Visita', '2026-10-11', '', '', 'Esperanza Macarena', 'Visita a una de las cuatro residencias previstas.'),
    ('SANLUCAR-LA-MAYOR-PIEDAD-2026', '5', 'Visita', '2026-10-11', '', '', 'Nuestro Padre Jesús', 'Visita a una de las cuatro residencias previstas.'),
    ('PARADAS-MISERICORDIA-2026', '1', 'Procesión extraordinaria', '2026-10-24', '', '', '', 'Procesión extraordinaria vinculada al Santo Entierro.'),
    ('ESTEPA-JESUS-NAZARENO-2026-11-02', '1', 'Traslado', '2026-11-02', '', '', 'Cementerio Municipal de Estepa', ''),
    ('ESTEPA-JESUS-NAZARENO-2026-11-02', '2', 'Santa Misa', '2026-11-02', '', '', 'Cementerio Municipal de Estepa', 'Misa por todos los difuntos.'),
    ('ESTEPA-JESUS-NAZARENO-2026-11-02', '3', 'Regreso', '2026-11-02', '', 'A su conclusión', 'San Sebastián', 'Regreso tras finalizar la Santa Misa.'),
    ('GUADALCANAL-GUADITOCA-2026-11-02', '1', 'Traslado', '2026-11-02', '', '', 'Cementerio', 'Traslado extraordinario al cementerio.'),
    ('LOS-ROSALES-ROSARIO-DE-FATIMA-2026-11-02', '1', 'Rosario de la Aurora', '2026-11-02', '', '', 'Cementerio Municipal', ''),
    ('LOS-ROSALES-ROSARIO-DE-FATIMA-2026-11-02', '2', 'Regreso', '2026-11-02', '', 'El mismo día', 'Su parroquia', ''),
    ('SEVILLA-AMPARO-2026', '1', 'Función Principal y Coronación Canónica', '2026-11-08', '10:00', '', 'Real Parroquia de Santa María Magdalena', ''),
    ('SEVILLA-AMPARO-2026', '2', 'Procesión', '2026-11-08', '17:00', '', '', 'Procesión extraordinaria posterior a la Coronación Canónica.'),
    ('SEVILLA-AMPARO-2026', '3', 'Visita', '2026-11-08', '', '', 'Excelentísimo Ayuntamiento de Sevilla', 'Visita prevista dentro del recorrido procesional.'),
    ('ESTEPA-JESUS-NAZARENO-2026-11-15', '1', 'Procesión extraordinaria', '2026-11-15', '', 'Al alba', 'Calles de la feligresía', 'El Señor procesionará sobre su paso de salida.'),
    ('ESTEPA-JESUS-NAZARENO-2026-11-15', '2', 'Eucaristía de acción de gracias y clausura', '2026-11-15', '', 'En torno al mediodía', 'Iglesia de San Sebastián', ''),
    ('CORIA-DEL-RIO-SALUD-2026', '1', 'Procesión extraordinaria', '2026-11-22', '', '', '', 'Con motivo del 25 aniversario de la bendición de la imagen.'),
    ('SEVILLA-SALUD-Y-BUEN-VIAJE-2026', '1', 'Traslado', '2026-11-21', '', '', 'Iglesia de San Esteban', 'Traslado en andas desde San Esteban hasta la Catedral.'),
    ('SEVILLA-SALUD-Y-BUEN-VIAJE-2026', '2', 'Paso por punto destacado', '2026-11-21', '', '', 'Parroquia de San Bartolomé', 'Enclave vinculado a la historia de la Hermandad previsto en el traslado.'),
    ('SEVILLA-SALUD-Y-BUEN-VIAJE-2026', '3', 'Misa solemne de Cristo Rey', '2026-11-22', '11:00', '', 'Santa Iglesia Catedral de Sevilla', ''),
    ('SEVILLA-SALUD-Y-BUEN-VIAJE-2026', '4', 'Procesión extraordinaria', '2026-11-22', '', 'Tras la misa solemne', 'Santa Iglesia Catedral de Sevilla', 'Regreso hasta la Iglesia de San Esteban sobre su paso de salida sin el misterio.')
)
insert into public.outing_schedule_items(
  outing_id, sequence_no, label, item_date, item_time, time_text, place_id, place_text, notes
)
select
  o.id,
  d.orden::integer,
  d.hito,
  nullif(d.fecha, '')::date,
  nullif(d.hora, '')::time,
  nullif(d.hora_texto, ''),
  (
    select p.id from public.places p
    where p.municipality_id = o.municipality_id and lower(p.name) = lower(d.lugar)
    limit 1
  ),
  nullif(d.lugar, ''),
  nullif(d.notas, '')
from data d
join public.outings o on o.reference_code = d.ref
order by o.id, d.orden::integer;
