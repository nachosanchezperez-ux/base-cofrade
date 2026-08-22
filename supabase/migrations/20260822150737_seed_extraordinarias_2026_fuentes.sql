-- Hilo Cofrade · Extraordinarias Sevilla 2026 · fuentes

create temp table extraordinarias_fuentes_import (
  ref text,
  fuente text,
  url text,
  tipo text,
  fecha_publicacion text,
  que_documenta text,
  notas text
) on commit drop;

insert into extraordinarias_fuentes_import values
  ('AZNALCOLLAR-SANTA-CRUZ-SANTA-ELENA-2026', 'Provincia Cofrade', 'https://provinciacofrade.wordpress.com/2026/08/07/aznalcollar-comienzan-las-fiestas-grandes-de-la-cruz-de-abajo-bajo-el-centenario-de-el-terrible-y-el-descubrimiento-de-la-santa-cruz-en-el-326/', 'Medio cofrade', '2026-08-07', 'Fecha, motivo, horarios, recorrido y actos', ''),
  ('AZNALCOLLAR-SANTA-CRUZ-SANTA-ELENA-2026', 'Arte Sacro', 'https://www.artesacro.org/Noticia/Ver/168755/provincia-extraordinaria-procesion-santa-cruz-abajo-y-emperatriz-santa', 'Medio cofrade', '2026-08-18', 'Celebración efectiva y acompañamientos musicales', 'Confirma que la procesión se celebró.'),
  ('AZNALCAZAR-ANGUSTIAS-2026', 'Diario de Sevilla', 'https://www.diariodesevilla.es/semana_santa/salida-extraordinaria-angustias-aznalcazar-horarios_0_2007757171.html', 'Prensa', '2026-08-21', 'Recorrido, horarios y acompañamiento musical', ''),
  ('AZNALCAZAR-ANGUSTIAS-2026', 'El Pespunte', 'https://www.elpespunte.es/articulo/cofrade/aznalcazar-abre-tiempo-virgen-angustias-todos-cultos-actos-salida-22-agosto/20260803093435143831.html', 'Medio', '2026-08-03', 'Fecha, motivo y programa de actos', ''),
  ('GERENA-SANGRE-2026', 'Provincia Cofrade', 'https://provinciacofrade.wordpress.com/2026/07/14/gerena-trece-horas-de-procesion-y-seis-bandas-horarios-itinerarios-y-detalles-de-la-coronacion-de-la-virgen-de-la-sangre/', 'Medio cofrade', '2026-07-14', 'Horarios, itinerarios, Coronación y acompañamientos musicales', ''),
  ('GERENA-SANGRE-2026', 'Dossier de la Coronación', 'https://fliphtml5.com/enpwe/FORMATO-DOSSIER-ACTOS-CORONACION/', 'Dossier', '2026-07-13', 'Programa, horarios y datos musicales', ''),
  ('GERENA-SANGRE-2026', 'Diario de Sevilla', 'https://www.diariodesevilla.es/semana_santa/sangre-gerena-estara-doce-horas_0_2007438845.html', 'Prensa', '2026-07-14', 'Recorrido, horarios y monumento conmemorativo', ''),
  ('PILAS-CRISTO-DEL-AMOR-2026', 'Aljarafe Digital', 'https://www.aljarafedigital.com/aljarafe/pilas/la-borriquita-de-pilas-anuncia-una-salida-extraordinaria-por-el-25-aniversario-de-su-imagen/', 'Medio', '2026-05-18', 'Fecha, motivo y datos de la imagen', ''),
  ('PILAS-CRISTO-DEL-AMOR-2026', 'Provincia Cofrade', 'https://provinciacofrade.wordpress.com/salidas-extraordinarias/', 'Calendario cofrade', '2026-07-15', 'Fecha, motivo y acompañamientos musicales', ''),
  ('PILAS-CRISTO-DEL-AMOR-2026', 'Recopilatorio previo del chat', '', 'Dato recopilado', '', 'Horarios, lugares y reparto por tramos del acompañamiento musical', 'Conviene recuperar la fuente pública original de los datos de las 17:00, regreso sobre las 20:30 y reparto de bandas.'),
  ('GUADALCANAL-GUADITOCA-2026-09-27', 'Provincia Cofrade', 'https://provinciacofrade.wordpress.com/salidas-extraordinarias/', 'Calendario cofrade', '2026-07-15', 'Fecha, tipo, destino, motivo y estado del acompañamiento musical', ''),
  ('GUADALCANAL-GUADITOCA-2026-09-27', 'Hermandad de Nuestra Señora de Guaditoca', 'https://guaditoca.blogspot.com/2008/09/pendientes-del-tiempo.html', 'Blog de la Hermandad', '2008-09-25', 'Datos de la Hermandad', 'Fuente histórica para la denominación de la corporación.'),
  ('UTRERA-ANGUSTIAS-2026', 'Hermandad de Jesús Nazareno de Utrera', 'https://jesusnazarenoutrera.es/actualidad/nuestra-senora-de-las-angustias-sera-coronada-canonicamente', 'Fuente oficial', '2024-06-19', 'Fecha y Coronación Canónica', ''),
  ('UTRERA-ANGUSTIAS-2026', 'Utrera al Día', 'https://utreraaldia.com/la-hermandad-de-jesus-nazareno-publica-los-horarios-e-itinerarios-de-la-coronacion-canonica-de-nuestra-senora-de-las-angustias/', 'Medio local', '2026-08-10', 'Horarios e itinerarios', ''),
  ('UTRERA-ANGUSTIAS-2026', 'El Diario Cofrade', 'https://eldiariocofrade.org/sevilla/utrera-se-prepara-para-una-coronacion-historica-de-la-virgen-de-las-angustias-con-el-altozano-como-epicentro-de-la-celebracion/', 'Medio cofrade', '2026-08-10', 'Acompañamientos musicales y desarrollo de la Coronación', ''),
  ('SEVILLA-REGLA-CORONADA-2026', 'Hermandad de los Panaderos', 'https://www.hdadpanaderos.es/2025/12/17/425-aniversario-presentacion-del-logotipo-cartel-y-programa-de-actos/', 'Fuente oficial', '2025-12-17', 'Fecha, motivo y Rosario Matutino al Convento de San Leandro', ''),
  ('SEVILLA-REGLA-CORONADA-2026', 'Cadena SER', 'https://cadenaser.com/andalucia/2025/12/11/la-hermandad-de-los-panaderos-presenta-los-actos-de-su-425-aniversario-fundacional-radio-sevilla/', 'Prensa', '2025-12-11', 'Programa del 425 aniversario', ''),
  ('PILAS-BELEN-CORONADA-2026-10-04', 'Provincia Cofrade', 'https://provinciacofrade.wordpress.com/salidas-extraordinarias/', 'Calendario cofrade', '2026-07-15', 'Fecha, motivo y acompañamiento musical', ''),
  ('PILAS-BELEN-CORONADA-2026-10-04', 'Hermandad de Belén', 'https://www.hermandaddebelen.com/home/cabildo-general-extraordinario-de-hermanos/', 'Fuente oficial', '2025-09-07', 'Programa del XXX aniversario de la Coronación Canónica', ''),
  ('PILAS-BELEN-CORONADA-2026-10-04', 'Hermandad de Belén', 'https://www.hermandaddebelen.com/data/documents/BOLETIN-ANUAL-2026.pdf', 'Boletín oficial', '', 'Actos y cultos del XXX aniversario durante octubre de 2026', ''),
  ('LOS-ROSALES-ROSARIO-DE-FATIMA-2026-10-10', 'Provincia Cofrade', 'https://provinciacofrade.wordpress.com/2026/07/16/los-rosales-la-virgen-de-fatima-presidira-tres-rosarios-publicos-y-una-salida-extraordinaria-entre-2026-y-2027/', 'Medio cofrade', '2026-07-16', 'Tipo de acto, recorrido general, pernocta y regreso del 11 de octubre', ''),
  ('LOS-ROSALES-ROSARIO-DE-FATIMA-2026-10-10', 'Provincia Cofrade', 'https://provinciacofrade.wordpress.com/salidas-extraordinarias/', 'Calendario cofrade', '2026-07-15', 'Fecha y motivo', 'La denominación del acto difiere de la información detallada publicada el 16 de julio.'),
  ('SEVILLA-DIVINA-GRACIA-2026', 'Diario de Sevilla', 'https://www.diariodesevilla.es/semana_santa/horarios-e-itinerarios-salida-extraordinaria_0_2007569466.html', 'Prensa', '2026-07-24', 'Fecha, horario, itinerario y acompañamiento musical', ''),
  ('SEVILLA-DIVINA-GRACIA-2026', 'Arte Sacro', 'https://www.artesacro.org/Noticia/Ver/168564/divina-gracia-llevara-su-bendicion-nuevas-calles-padre-pio-salida', 'Medio cofrade', '2026-08-11', 'Recorrido y datos de la salida extraordinaria', ''),
  ('EL-CASTILLO-DE-LAS-GUARDAS-DOLORES-2026', 'Provincia Cofrade', 'https://provinciacofrade.wordpress.com/salidas-extraordinarias/', 'Calendario cofrade', '2026-07-15', 'Fecha, titular, motivo y estado del acompañamiento musical', ''),
  ('MONTELLANO-DOLORES-2026', 'Hermandad del Gran Poder de Montellano', 'https://www.granpodermontellano.es/300-aniversario-servita/cultos-extraordinarios', 'Fuente oficial', '', 'Motivo, Misa Pontifical y procesión extraordinaria', ''),
  ('MONTELLANO-DOLORES-2026', 'Hermandad del Gran Poder de Montellano', 'https://www.granpodermontellano.es/3238726_acompanamiento-musical-salida-extraordinaria-de-la-virgen-de-los-dolores', 'Fuente oficial', '2026-06-22', 'Acompañamiento musical', 'Confirma la incorporación de Las Nieves de Olivares en la segunda parte del recorrido.'),
  ('MONTELLANO-DOLORES-2026', 'Provincia Cofrade', 'https://provinciacofrade.wordpress.com/salidas-extraordinarias/', 'Calendario cofrade', '2026-07-15', 'Fecha, motivo y bandas', ''),
  ('PILAS-BELEN-CORONADA-2026-10-11', 'Provincia Cofrade', 'https://provinciacofrade.wordpress.com/salidas-extraordinarias/', 'Calendario cofrade', '2026-07-15', 'Fecha, tipo, motivo y acompañamiento musical', ''),
  ('PILAS-BELEN-CORONADA-2026-10-11', 'Hermandad de Belén', 'https://www.hermandaddebelen.com/home/cabildo-general-extraordinario-de-hermanos/', 'Fuente oficial', '2025-09-07', 'Programa del XXX aniversario de la Coronación Canónica', ''),
  ('SANLUCAR-LA-MAYOR-PIEDAD-2026', 'Provincia Cofrade', 'https://provinciacofrade.wordpress.com/2026/07/30/sanlucar-la-mayor-la-virgen-de-la-piedad-visitara-este-octubre-las-cuatro-residencias-del-municipio/', 'Medio cofrade', '2026-07-30', 'Fecha, visitas previstas, traslado en andas y estado del itinerario', ''),
  ('PARADAS-MISERICORDIA-2026', 'Provincia Cofrade', 'https://provinciacofrade.wordpress.com/salidas-extraordinarias/', 'Calendario cofrade', '2026-07-15', 'Fecha, motivo y denominación de la procesión', ''),
  ('ESTEPA-JESUS-NAZARENO-2026-11-02', 'Devociones de Estepa', 'https://devocionesdeestepa.blogspot.com/2026/02/400-aniversario-de-la-hermandad-de-ntro.html', 'Medio local', '2026-02-28', 'Motivo, traslado al cementerio, misa y regreso a San Sebastián', ''),
  ('ESTEPA-JESUS-NAZARENO-2026-11-02', 'Provincia Cofrade', 'https://provinciacofrade.wordpress.com/salidas-extraordinarias/', 'Calendario cofrade', '2026-07-15', 'Fecha y traslado extraordinario', ''),
  ('GUADALCANAL-GUADITOCA-2026-11-02', 'Provincia Cofrade', 'https://provinciacofrade.wordpress.com/salidas-extraordinarias/', 'Calendario cofrade', '2026-07-15', 'Fecha, destino, motivo y estado del acompañamiento musical', ''),
  ('LOS-ROSALES-ROSARIO-DE-FATIMA-2026-11-02', 'Provincia Cofrade', 'https://provinciacofrade.wordpress.com/2026/07/16/los-rosales-la-virgen-de-fatima-presidira-tres-rosarios-publicos-y-una-salida-extraordinaria-entre-2026-y-2027/', 'Medio cofrade', '2026-07-16', 'Rosario de la Aurora al cementerio y regreso el mismo día', ''),
  ('SEVILLA-AMPARO-2026', 'Hermandad del Amparo', 'https://hermandaddelamparo.com/coronacion-canonica-proyecto-pastoral-y-formativo/', 'Fuente oficial', '', 'Coronación Canónica, horarios y procesión extraordinaria', ''),
  ('ESTEPA-JESUS-NAZARENO-2026-11-15', 'Devociones de Estepa', 'https://devocionesdeestepa.blogspot.com/2026/02/400-aniversario-de-la-hermandad-de-ntro.html', 'Medio local', '2026-02-28', 'Procesión al alba, calles de la feligresía y Eucaristía de clausura', ''),
  ('ESTEPA-JESUS-NAZARENO-2026-11-15', 'Provincia Cofrade', 'https://provinciacofrade.wordpress.com/salidas-extraordinarias/', 'Calendario cofrade', '2026-07-15', 'Fecha', 'La descripción del destino entra en contradicción con la fuente local detallada.'),
  ('CORIA-DEL-RIO-SALUD-2026', 'Provincia Cofrade', 'https://provinciacofrade.wordpress.com/salidas-extraordinarias/', 'Calendario cofrade', '2026-07-15', 'Fecha, tipo, motivo y estado del acompañamiento musical', ''),
  ('CORIA-DEL-RIO-SALUD-2026', 'Consejo General de Hermandades y Cofradías de Coria del Río', 'https://www.consejohermandadescoria.com/hermandad-de-la-borriquita', 'Fuente oficial', '', 'Datos de la Hermandad, titular y fecha de bendición de la imagen', ''),
  ('SEVILLA-SALUD-Y-BUEN-VIAJE-2026', 'Arte Sacro', 'https://www.artesacro.org/Noticia/Ver/166005/san-esteban-presenta-oficialmente-cartel-y-actos-conmemorativos-su', 'Medio cofrade', '2026-01-28', 'Programa del centenario, traslado, misa y procesión extraordinaria', ''),
  ('SEVILLA-SALUD-Y-BUEN-VIAJE-2026', 'Cofradía Plus', 'https://cofradiaplus.com/sevilla/la-hermandad-de-san-esteban-prepara-la-procesion-del-centenario-con-el-senor-de-la-salud-y-buen-viaje/', 'Medio cofrade', '2026-02-14', 'Traslado a la Catedral, paso por San Bartolomé y procesión de regreso', ''),
  ('SEVILLA-SALUD-Y-BUEN-VIAJE-2026', 'Andalucía Información', 'https://www.andaluciainformacion.es/articulo/la-pasion/hermanos-caballero-adaptaran-paso-san-esteban-extraordinaria/202605261539003392443.html', 'Prensa', '2026-05-26', 'Adaptación del paso para la extraordinaria', '');

insert into public.sources(name, url, source_type, publication_date, notes)
select distinct on (coalesce(nullif(url,''), fuente || '|' || tipo))
  fuente, nullif(url, ''), tipo, nullif(fecha_publicacion, '')::date, nullif(notas, '')
from extraordinarias_fuentes_import d
where not exists (
  select 1 from public.sources s
  where (nullif(d.url, '') is not null and s.url = d.url)
     or (nullif(d.url, '') is null and s.url is null and s.name = d.fuente and s.source_type = d.tipo)
)
order by coalesce(nullif(url,''), fuente || '|' || tipo), ref;

with resolved as (
  select d.*,
    (select s.id from public.sources s
      where (nullif(d.url, '') is not null and s.url = d.url)
         or (nullif(d.url, '') is null and s.url is null and s.name = d.fuente and s.source_type = d.tipo)
      order by s.created_at limit 1) as source_id,
    o.id as outing_id
  from extraordinarias_fuentes_import d
  join public.outings o on o.reference_code = d.ref
)
insert into public.source_links(source_id, outing_id, scope, notes)
select source_id, outing_id, nullif(que_documenta, ''), nullif(notas, '')
from resolved r
where source_id is not null
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id = r.source_id and sl.outing_id = r.outing_id
      and coalesce(sl.scope, '') = coalesce(nullif(r.que_documenta, ''), '')
  );
