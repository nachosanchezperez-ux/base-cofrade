-- Hilo Cofrade · Carga inicial de Extraordinarias Sevilla 2026 · núcleo
-- Conserva las REF del recopilatorio y no completa campos vacíos.

create temp table extraordinarias_import_data (
  ref text,
  localidad text,
  localidad_slug text,
  hermandad text,
  titular text,
  fecha text,
  tipo text,
  motivo text,
  hora_salida text,
  hora_entrada text,
  origen text,
  destino text,
  recorrido text,
  estado text,
  notas text,
  imagen_url text,
  proposed_slug text
) on commit drop;

insert into extraordinarias_import_data values
  ('AZNALCOLLAR-SANTA-CRUZ-SANTA-ELENA-2026', 'Aznalcóllar', 'aznalcollar', 'Hermandad de la Santa Cruz de Abajo y la Gloriosa Emperatriz Santa Elena', 'Santa Cruz de Abajo y Gloriosa Emperatriz Santa Elena', '2026-08-16', 'Procesión extraordinaria', 'Centenario de la bendición del Arco de “El Terrible” y 1.700 años del hallazgo de la Vera Cruz atribuido a Santa Elena en el año 326', '08:00', '', 'Capilla de la Cruz de Abajo', 'Capilla de la Cruz de Abajo', 'Mañana: Capilla de la Cruz de Abajo, Plz. del Alamillo, Pedro Gómez del Castillo, Ayuntamiento, Arco El Terrible, Clemencia Buiza y Parroquia de Ntra. Sra. de Consolación. Por la tarde: Parroquia de Ntra. Sra. de Consolación, Sevilla, Guillermo Gutiérrez Vidal, 28 de febrero, Juan Carlos I, Concejo, Avd. de Andalucía, Mina, Ramón y Cajal, Blas Infante, Avd. de Andalucía, 28 de febrero, Real, Guillermo Gutiérrez Vidal, Clemencia Buiza, Arco El Terrible, Ayuntamiento, Pedro Gómez del Castillo y Plz. del Alamillo, con regreso a la Capilla de la Cruz de Abajo.', 'Celebrada', 'Ambos titulares procesionaron sobre un mismo paso. Permanecieron durante parte de la jornada en el Templo Parroquial de Nuestra Señora de Consolación. Se celebró Santa Misa ante el Arco El Terrible. La romería prevista en las fiestas había sido suspendida por la situación provocada por el incendio de Niebla, pero la procesión extraordinaria sí se celebró.', '', 'aznalcollar-santa-cruz-santa-elena-2026'),
  ('AZNALCAZAR-ANGUSTIAS-2026', 'Aznalcázar', 'aznalcazar', 'Real, Ilustre, Fervorosa y Muy Antigua Hermandad de Santiago Apóstol y Cofradía de Nazarenos del Santísimo Cristo del Buen Fin, María Santísima de las Angustias y San Juan Evangelista', 'María Santísima de las Angustias', '2026-08-22', 'Procesión extraordinaria', '450 aniversario fundacional y colofón del Año Angustias Porta Coeli', '19:00', '', 'Capilla-Oratorio de Santiago Apóstol', 'Capilla-Oratorio de Santiago Apóstol', 'Ida: Capilla-Oratorio de Santiago Apóstol, Pedro Mora, Plaza Virgen del Rocío, Alhelí, Avenida Nuestro Padre Jesús, Plaza de España, Domingo Manfredi y Plaza del Cabildo. Regreso: Plaza del Cabildo, Domingo Manfredi, Campanas, Ramón y Cajal, Miguel de Cervantes, Maestro Francisco Báez, Juan Carlos I, Cruces, Nueva, Barrio Nuevo, Plaza Virgen del Rocío, Alhelí, Padre Jesús, Juan Carlos I, Pedro Mora y Capilla-Oratorio de Santiago Apóstol.', 'Anunciada', 'La Virgen realizará la procesión triunfal bajo palio. La Parroquia de San Pablo se encuentra en obras y los titulares reciben culto en la Capilla-Oratorio de Santiago Apóstol. El 21 de agosto se celebra Bando Anunciador a cargo de la Banda Municipal de Música de Bollullos del Condado.', '', 'aznalcazar-angustias-2026'),
  ('GERENA-SANGRE-2026', 'Gerena', 'gerena', 'Pontificia, Real y Antigua Hermandad de San Benito Abad Copatrón de la Villa de Gerena, y Cofradía de Nazarenos del Santísimo Cristo de la Vera Cruz y María Santísima de la Sangre', 'María Santísima de la Sangre', '2026-09-12', 'Procesión extraordinaria', 'Coronación Canónica', '17:00', '', 'Iglesia de San Benito Abad', 'Iglesia de San Benito Abad', 'Ida: Cristo de la Vera Cruz, 28 de Febrero, La Lonja, Virgen del Rosario, Pintor Pablo Picasso, Jesús del Gran Poder, La Cantina, Avd. de los Canteros y Plaza Fernández Velasco. Regreso: Plaza Fernández Velasco, Avenida de los Canteros, Plaza de la Cantina, Miguel de Cervantes, Virgen de la Sangre, Plaza de San José, Virgen de la Soledad, Blas Infante, La Lonja, Federico García Lorca, Alcalde Manuel Vega Tabares, Hermanos Machado, 28 de Febrero, Antonio Álvarez, Callejilla de los Canarios, Plaza de la Corredera, Plaza de la Constitución, Calle La Plaza, Cristo de la Vera-Cruz y entrada en San Benito.', 'Anunciada', 'La imagen será entronizada en el altar de la Plaza Fernández Velasco antes del Solemne Pontifical. Durante el recorrido triunfal está prevista la inauguración de un monumento conmemorativo en la Plaza de la Cantina.', '', 'gerena-sangre-2026'),
  ('PILAS-CRISTO-DEL-AMOR-2026', 'Pilas', 'pilas', 'Grupo Parroquial de Fieles del Santísimo Cristo del Amor en su Entrada Triunfal en Jerusalén, Sagrado Corazón de Jesús y Patriarca San José', 'Santísimo Cristo del Amor en su Entrada Triunfal en Jerusalén', '2026-09-26', 'Procesión extraordinaria', '25 aniversario de la hechura de su imagen', '17:00', '', 'Capilla del Sagrado Corazón de Jesús', 'Parroquia de Santa María la Mayor', 'Salida desde la Capilla del Sagrado Corazón de Jesús hasta la Parroquia de Santa María la Mayor, con regreso posterior a la capilla.', 'Anunciada', 'La talla fue realizada por Miguel Ángel Valverde en 2001. La corporación anunció dos cuadrillas de 45 costaleros. El regreso figura en el recopilatorio previo en torno a las 20:30.', '', 'pilas-cristo-del-amor-2026'),
  ('GUADALCANAL-GUADITOCA-2026-09-27', 'Guadalcanal', 'guadalcanal', 'Real e Ilustre Hermandad de Nuestra Señora de Guaditoca, Patrona de Guadalcanal', 'Ntra. Sra. de Guaditoca', '2026-09-27', 'Traslado extraordinario', 'Actos preparatorios de la Coronación Canónica', '', '', 'Guadalcanal', 'Guadalcanal', 'Traslado extraordinario a Guadalcanal.', 'Anunciada', 'Acompañamiento musical por determinar.', '', 'guadalcanal-guaditoca-2026-09-27'),
  ('UTRERA-ANGUSTIAS-2026', 'Utrera', 'utrera', 'Real e Ilustre Hermandad de Nuestro Padre Jesús Nazareno, Santa Cruz de Jerusalén, Sagrada Oración de Nuestro Señor Jesucristo en El Huerto, Nuestra Señora de Las Angustias, de la Inmaculada Concepción, San Bartolomé Apóstol y Santa Bárbara', 'Nuestra Señora de Las Angustias', '2026-10-03', 'Procesión extraordinaria', 'Coronación Canónica', '16:30', '', 'Capilla de San Bartolomé', 'Capilla de San Bartolomé', 'Ida: San Juan Bosco, Ramón y Cajal, Clemente de la Cuadra y Plaza del Altozano. Regreso: Plaza del Altozano, San Francisco, Clemente de la Cuadra, Ayuntamiento, Álvarez Quintero, Sevilla, Plaza de la Constitución, Ruiz Gijón, Parroquia de Santiago, Ponce de León, Catalina de Perea, Plaza Enrique de la Cuadra, San Fernando, Santa Ángela de la Cruz, Convento de las Hermanas de la Cruz, Sor Marciala de la Cruz, Parroquia de Santa María, Porche de Santa María, Mota de Santa María, Menéndez Pelayo, Fray Cipriano de Utrera, Alcalde Antonio Sousa, Álvarez Hazañas, Plaza del Altozano, Virgen de Consolación y San Juan Bosco, hasta finalizar en la Capilla de San Bartolomé.', 'Anunciada', 'La ida tiene carácter de traslado hacia el Altozano. Tras la Coronación Canónica se celebrará la procesión triunfal de regreso. La entrada se producirá ya entrada la madrugada del 4 de octubre.', '', 'utrera-angustias-2026'),
  ('SEVILLA-REGLA-CORONADA-2026', 'Sevilla', 'sevilla', 'Pontificia, Real, Ilustre y Fervorosa Hermandad y Archicofradía de Nazarenos de Nuestro Padre Jesús del Soberano Poder en su Prendimiento, María Santísima de Regla Coronada y San Andrés Apóstol', 'María Santísima de Regla Coronada', '2026-10-04', 'Rosario matutino extraordinario', '425 aniversario fundacional', '', '', '', 'Convento de San Leandro', 'Rosario Matutino hasta el Convento de San Leandro.', 'Anunciada', 'Acto incluido en el programa conmemorativo del 425 aniversario fundacional.', '', 'sevilla-regla-coronada-2026'),
  ('PILAS-BELEN-CORONADA-2026-10-04', 'Pilas', 'pilas', 'Venerable y Real Hermandad y Cofradía de la Santa Vera-Cruz, Madre de Dios de Belén Coronada y Santiago Apóstol', 'Ntra. Sra. de Belén Coronada', '2026-10-04', 'Rosario de la Aurora', 'XXX aniversario de la Coronación Canónica', '', '', '', '', '', 'Anunciada', 'El programa conmemorativo del XXX aniversario de la Coronación Canónica contempla cultos y actos extraordinarios durante octubre de 2026.', '', 'pilas-belen-coronada-2026-10-04'),
  ('LOS-ROSALES-ROSARIO-DE-FATIMA-2026-10-10', 'Los Rosales', 'los-rosales', 'Grupo Parroquial de Ntra. Sra. de Fátima', 'Ntra. Sra. del Rosario de Fátima', '2026-10-10', 'Rosario vespertino extraordinario', '75 aniversario de la llegada de la imagen a la feligresía', '', '', '', 'Barrio de la Estación', 'Rosario vespertino extraordinario hacia el Barrio de la Estación; permanencia durante la noche; regreso a su parroquia el 11 de octubre tras la función principal en el CEIP Menéndez Pidal.', 'Anunciada', 'La imagen permanecerá durante la noche en el Barrio de la Estación. Está documentado acompañamiento musical, pero no la formación. La salida procesional extraordinaria propiamente dicha del aniversario está prevista para 2027.', '', 'los-rosales-rosario-de-fatima-2026-10-10'),
  ('SEVILLA-DIVINA-GRACIA-2026', 'Sevilla', 'sevilla', 'Hermandad Sacramental de Nuestro Padre Jesús de la Salud y Clemencia, Santísima Virgen Madre de la Divina Gracia y San Juan de la Cruz', 'Santísima Virgen Madre de la Divina Gracia', '2026-10-11', 'Procesión extraordinaria', 'XXV aniversario de la Parroquia de El Buen Pastor y San Juan de la Cruz', '18:00', '00:00', 'Parroquia de El Buen Pastor y San Juan de la Cruz', 'Parroquia de El Buen Pastor y San Juan de la Cruz', 'Parroquia de El Buen Pastor y San Juan de la Cruz, Auxiliar Ronda de Padre Pío, Doctora Oeste, San Juan de Aznalfarache, Valencina de la Concepción, La Roda de Andalucía, Alájar, Lora de Estepa, Puebla del Río, Ronda de Padre Pío, Rafael García Miquel, Villaverde, Carrión de los Céspedes, Castilleja de la Cuesta, Castilblanco de los Arroyos, Puebla de los Infantes, Carrión de los Céspedes, Villamanrique, El Castillo de las Guardas, Villaverde, La Pañoleta, Ronda de Padre Pío y entrada en la Parroquia de El Buen Pastor y San Juan de la Cruz.', 'Anunciada', 'La Virgen procesionará bajo palio y alcanzará calles por las que no había discurrido anteriormente. La entrada está prevista a las 00:00 del 12 de octubre. El 12 de octubre se celebrará la función por las bodas de plata de la dedicación del templo.', '', 'sevilla-divina-gracia-2026'),
  ('EL-CASTILLO-DE-LAS-GUARDAS-DOLORES-2026', 'El Castillo de las Guardas', 'el-castillo-de-las-guardas', 'Hermandad y Cofradía de Nazarenos del Santísimo Cristo de la Misericordia y Nuestra Señora de los Dolores', 'Nuestra Señora de los Dolores', '2026-10-11', 'Procesión extraordinaria', 'Nombramiento como Alcaldesa Perpetua', '', '', '', '', '', 'Anunciada', 'Acompañamiento musical por determinar.', '', 'el-castillo-de-las-guardas-dolores-2026'),
  ('MONTELLANO-DOLORES-2026', 'Montellano', 'montellano', 'Hermandad del Santísimo Sacramento y Cofradía de Nazarenos de Nuestro Padre Jesús del Gran Poder, María Santísima de los Dolores y Beato Antonio Martínez Gil', 'María Santísima de los Dolores', '2026-10-11', 'Procesión extraordinaria', '300 aniversario de la Antigua Hermandad Servita y su Sagrada Titular', '', '', '', '', 'Procesión por las calles de Montellano.', 'Anunciada', 'La procesión extraordinaria tendrá lugar tras una Solemne Misa Pontifical. La Sociedad Filarmónica Santa María de Las Nieves de Olivares se incorporará en la segunda parte del recorrido.', '', 'montellano-dolores-2026'),
  ('PILAS-BELEN-CORONADA-2026-10-11', 'Pilas', 'pilas', 'Venerable y Real Hermandad y Cofradía de la Santa Vera-Cruz, Madre de Dios de Belén Coronada y Santiago Apóstol', 'Ntra. Sra. de Belén Coronada', '2026-10-11', 'Procesión gloriosa extraordinaria', 'XXX aniversario de la Coronación Canónica', '', '', '', '', '', 'Anunciada', 'Acto incluido en el programa conmemorativo del XXX aniversario de la Coronación Canónica.', '', 'pilas-belen-coronada-2026-10-11'),
  ('SANLUCAR-LA-MAYOR-PIEDAD-2026', 'Sanlúcar la Mayor', 'sanlucar-la-mayor', 'Muy Antigua, Real, Ilustre, Fervorosa Hermandad y Cofradía de Nazarenos del Santísimo Cristo de la Vera Cruz, Santísimo Cristo de la Humildad en su Flagelación y María Santísima de la Piedad', 'María Santísima de la Piedad', '2026-10-11', 'Traslado extraordinario', 'Acto previo a la Coronación Canónica de 2027', '', '', 'Capilla de la Vera Cruz', '', 'Capilla de la Vera Cruz; visita a las residencias San Eustaquio, San Miguel, Esperanza Macarena y Nuestro Padre Jesús; itinerario aún por configurar.', 'Anunciada', 'La Virgen será portada en andas. El itinerario definitivo se encontraba aún en configuración.', '', 'sanlucar-la-mayor-piedad-2026'),
  ('PARADAS-MISERICORDIA-2026', 'Paradas', 'paradas', 'Real Hermandad del Dulce Nombre de Jesús y Santo Entierro de Nuestro Señor Jesucristo y Cofradía de Nazarenos del Santísimo Cristo de la Misericordia en su Traslado al Sepulcro, María Santísima de la Amargura, San Juan Evangelista y Santa María Magdalena', 'Santísimo Cristo de la Misericordia en su Traslado al Sepulcro', '2026-10-24', 'Procesión extraordinaria', '50 aniversario de la refundación', '', '', '', '', '', 'Anunciada', 'El calendario provincial más reciente denomina el acto “Procesión extraordinaria de los titulares del Santo Entierro”. Acompañamiento musical por determinar.', '', 'paradas-misericordia-2026'),
  ('ESTEPA-JESUS-NAZARENO-2026-11-02', 'Estepa', 'estepa', 'Pontificia y Real Hermandad Sacramental y de Ánimas y Cofradía de Nuestro Padre Jesús Nazareno y María Santísima de los Dolores', 'Nuestro Padre Jesús Nazareno', '2026-11-02', 'Traslado extraordinario', '400 aniversario fundacional y 225 aniversario de la fusión de 1801 con la Hermandad de Ánimas y Sacramental de la Parroquia de San Sebastián', '', '', '', 'Cementerio Municipal de Estepa', 'Traslado al Cementerio Municipal de Estepa; Santa Misa por todos los difuntos; a su conclusión, traslado de regreso a San Sebastián.', 'Anunciada', 'El acto conmemora específicamente los 225 años de la fusión de 1801 con la Hermandad de Ánimas y Sacramental de la Parroquia de San Sebastián.', '', 'estepa-jesus-nazareno-2026-11-02'),
  ('GUADALCANAL-GUADITOCA-2026-11-02', 'Guadalcanal', 'guadalcanal', 'Real e Ilustre Hermandad de Nuestra Señora de Guaditoca, Patrona de Guadalcanal', 'Ntra. Sra. de Guaditoca', '2026-11-02', 'Traslado extraordinario', 'Actos preparatorios de la Coronación Canónica', '', '', '', 'Cementerio', 'Traslado extraordinario al cementerio.', 'Anunciada', 'Acompañamiento musical por determinar.', '', 'guadalcanal-guaditoca-2026-11-02'),
  ('LOS-ROSALES-ROSARIO-DE-FATIMA-2026-11-02', 'Los Rosales', 'los-rosales', 'Grupo Parroquial de Ntra. Sra. de Fátima', 'Ntra. Sra. del Rosario de Fátima', '2026-11-02', 'Rosario de la Aurora', '75 aniversario de la llegada de la imagen a la feligresía', '', '', '', 'Cementerio Municipal', 'Rosario de la Aurora hacia el Cementerio Municipal; regreso el mismo día a su parroquia.', 'Anunciada', 'El calendario provincial general también ha denominado este acto traslado extraordinario al cementerio.', '', 'los-rosales-rosario-de-fatima-2026-11-02'),
  ('SEVILLA-AMPARO-2026', 'Sevilla', 'sevilla', 'Real, Venerable e Ilustre Hermandad de Nuestra Señora del Amparo', 'Nuestra Señora del Amparo', '2026-11-08', 'Procesión extraordinaria', 'Coronación Canónica', '17:00', '', '', '', 'Visita al Excelentísimo Ayuntamiento de Sevilla y posterior procesión por las calles de la feligresía.', 'Anunciada', 'La Coronación Canónica tendrá lugar durante la Función Principal de las 10:00 en la Real Parroquia de Santa María Magdalena.', '', 'sevilla-amparo-2026'),
  ('ESTEPA-JESUS-NAZARENO-2026-11-15', 'Estepa', 'estepa', 'Pontificia y Real Hermandad Sacramental y de Ánimas y Cofradía de Nuestro Padre Jesús Nazareno y María Santísima de los Dolores', 'Nuestro Padre Jesús Nazareno', '2026-11-15', 'Procesión extraordinaria', '400 aniversario fundacional', '', '', '', '', 'Procesión al alba por las calles de la feligresía; en torno al mediodía, Eucaristía de acción de gracias y clausura en la Iglesia de San Sebastián.', 'Anunciada', 'El Señor procesionará sobre su propio paso de salida.', '', 'estepa-jesus-nazareno-2026-11-15'),
  ('CORIA-DEL-RIO-SALUD-2026', 'Coria del Río', 'coria-del-rio', 'Hermandad y Cofradía de Nazarenos del Santísimo Cristo de la Salud en su Sagrada Entrada en Jerusalén, María Santísima de la Victoria, San Pedro Apóstol y San Juan Evangelista', 'Santísimo Cristo de la Salud en su Sagrada Entrada en Jerusalén', '2026-11-22', 'Procesión extraordinaria', '25 aniversario de la bendición de la imagen', '', '', '', '', '', 'Anunciada', 'Acompañamiento musical por determinar. La imagen fue bendecida el 29 de junio de 2001.', '', 'coria-del-rio-salud-2026'),
  ('SEVILLA-SALUD-Y-BUEN-VIAJE-2026', 'Sevilla', 'sevilla', 'Fervorosa Hermandad y Cofradía de Nazarenos de Nuestro Padre Jesús de la Salud y Buen Viaje, María Santísima Madre de los Desamparados, San Juan de Ribera y Protomártir San Esteban', 'Nuestro Padre Jesús de la Salud y Buen Viaje', '2026-11-22', 'Procesión extraordinaria', 'I centenario fundacional', '', '', 'Santa Iglesia Catedral de Sevilla', 'Iglesia de San Esteban', 'Regreso procesional desde la Santa Iglesia Catedral de Sevilla hasta la Iglesia de San Esteban; el Señor procesionará sobre su paso de salida sin el misterio.', 'Anunciada', 'El 21 de noviembre se realizará el traslado en andas desde la Iglesia de San Esteban hasta la Catedral, pasando por enclaves vinculados a la Hermandad como la Parroquia de San Bartolomé. El 22 de noviembre se celebrará a las 11:00 la misa de Cristo Rey en la Catedral y, tras ella, la procesión extraordinaria de regreso. Hermanos Caballero adaptarán el paso mediante un nuevo monte y modificaciones en los candelabros. Los horarios del programa pueden estar sujetos a modificaciones.', '', 'sevilla-salud-y-buen-viaje-2026');

insert into public.municipalities(name, slug, province, autonomous_community, country)
select distinct localidad, localidad_slug, 'Sevilla', 'Andalucía', 'España'
from extraordinarias_import_data
on conflict (slug) do update set
  name = excluded.name,
  province = excluded.province,
  autonomous_community = excluded.autonomous_community,
  country = excluded.country;

update public.outings o
set reference_code = d.ref
from extraordinarias_import_data d
join public.municipalities m on m.slug = d.localidad_slug
where o.reference_code is null
  and o.character = 'extraordinary'
  and o.outing_date = nullif(d.fecha, '')::date
  and lower(coalesce(o.title, '')) = lower(d.titular)
  and o.municipality_id = m.id;

insert into public.outings(
  reference_code, slug, brotherhood_entity_id, organizer_name, outing_type, character,
  title, outing_date, year, departure_time, return_time, return_date, municipality_id,
  origin_text, destination_text, reason, route_summary, public_notes, event_status, status
)
select
  d.ref,
  d.proposed_slug,
  (
    select b.entity_id
    from public.brotherhoods b
    join public.entities e on e.id = b.entity_id
    where lower(b.official_name) = lower(d.hermandad)
       or lower(e.name) = lower(d.hermandad)
    order by case when lower(b.official_name) = lower(d.hermandad) then 0 else 1 end
    limit 1
  ),
  d.hermandad,
  d.tipo,
  'extraordinary',
  d.titular,
  nullif(d.fecha, '')::date,
  extract(year from nullif(d.fecha, '')::date)::integer,
  nullif(d.hora_salida, '')::time,
  nullif(d.hora_entrada, '')::time,
  case
    when nullif(d.hora_entrada, '') is not null and nullif(d.hora_salida, '') is not null
      and nullif(d.hora_entrada, '')::time < nullif(d.hora_salida, '')::time then nullif(d.fecha, '')::date + 1
    when nullif(d.hora_entrada, '') is not null then nullif(d.fecha, '')::date
    else null
  end,
  m.id,
  nullif(d.origen, ''),
  nullif(d.destino, ''),
  nullif(d.motivo, ''),
  nullif(d.recorrido, ''),
  nullif(d.notas, ''),
  case d.estado when 'Celebrada' then 'held' when 'Cancelada' then 'cancelled' else 'announced' end,
  'published'
from extraordinarias_import_data d
join public.municipalities m on m.slug = d.localidad_slug
on conflict (reference_code) do update set
  slug = coalesce(public.outings.slug, excluded.slug),
  brotherhood_entity_id = coalesce(public.outings.brotherhood_entity_id, excluded.brotherhood_entity_id),
  organizer_name = excluded.organizer_name,
  outing_type = excluded.outing_type,
  character = excluded.character,
  title = excluded.title,
  outing_date = excluded.outing_date,
  year = excluded.year,
  departure_time = excluded.departure_time,
  return_time = excluded.return_time,
  return_date = excluded.return_date,
  municipality_id = excluded.municipality_id,
  origin_text = excluded.origin_text,
  destination_text = excluded.destination_text,
  reason = excluded.reason,
  route_summary = excluded.route_summary,
  public_notes = excluded.public_notes,
  event_status = excluded.event_status,
  status = excluded.status;
