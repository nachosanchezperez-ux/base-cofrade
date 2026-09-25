-- ARCHIVO DML DE PREFLIGHT · HC-016 · CARMONA · 25-09-2026
-- SOLO VALIDACIÓN. NO ES APPLY. TERMINA OBLIGATORIAMENTE EN ROLLBACK.
-- Base de planificación: f1bcda7f2e166038a8d3dc447ce424d959fbb3f9
-- Rama: hc016/carmona-pre-row-by-row
-- Contrato lógico: 530 DML · 8 REUSE externos · 0 DELETE · 0 DDL · 0 RLS.
-- NO EJECUTADO al crear este archivo.

begin;

-- Guardia 1: el namespace debe seguir virgen antes del ensayo.
do $$
begin
  if exists (select 1 from public.entities where id::text like 'c0160035-%') then raise exception 'carmona_namespace_entities_not_empty'; end if;
  if exists (select 1 from public.sources where id::text like 'c0160035-%') then raise exception 'carmona_namespace_sources_not_empty'; end if;
  if exists (select 1 from public.places where id::text like 'c0160035-%') then raise exception 'carmona_namespace_places_not_empty'; end if;
  if exists (select 1 from public.outings where id::text like 'c0160035-%') then raise exception 'carmona_namespace_outings_not_empty'; end if;
  if exists (select 1 from public.outing_series where id::text like 'c0160035-%') then raise exception 'carmona_namespace_series_not_empty'; end if;
  if exists (select 1 from public.source_links where id::text like 'c0160035-%') then raise exception 'carmona_namespace_source_links_not_empty'; end if;
end $$;

-- Guardia 2: los ocho REUSE externos deben existir con sus UUID exactos.
do $$
begin
  if not exists (select 1 from public.municipalities where id='bf024af2-3eda-4989-b1b5-0a723dcf9cb4') then raise exception 'carmona_municipality_reuse_missing'; end if;
  if not exists (select 1 from public.sources where id='f5c7c0c1-63c8-42b3-b1e8-fac89b01de83') then raise exception 'carmona_servitas_source_reuse_missing'; end if;
  if not exists (select 1 from public.outings where id='ea6ab0d1-e6c4-4ea1-8727-92cee4ce3218' and slug='carmona-servitas-dolores-santo-escapulario-2026-09-19') then raise exception 'carmona_servitas_outing_reuse_missing'; end if;
  if not exists (select 1 from public.bands where entity_id='c0160032-0402-4000-8000-000000000002') then raise exception 'carmona_band_paz_reuse_missing'; end if;
  if not exists (select 1 from public.bands where entity_id='4e4d493c-5273-44aa-8066-72dd1faa1ed8') then raise exception 'carmona_band_valme_reuse_missing'; end if;
  if not exists (select 1 from public.bands where entity_id='97f62582-42f5-4d5f-80e0-376398af98e8') then raise exception 'carmona_band_victoria_reuse_missing'; end if;
  if not exists (select 1 from public.bands where entity_id='d6852052-92bb-4b54-b551-e52b656dea6d') then raise exception 'carmona_band_mairena_reuse_missing'; end if;
  if not exists (select 1 from public.bands where entity_id='c0160033-0404-4000-8000-000000000004') then raise exception 'carmona_band_amor_reuse_missing'; end if;
end $$;

-- Guardia 3: no aceptar colisiones semánticas creadas después de congelar el plan.
do $$
begin
  if exists (select 1 from public.entities where slug = any(array['orden-seglar-servita-carmona','esperanza-carmona','amargura-carmona','expiracion-carmona','quinta-angustia-carmona','santiago-carmona','nuestro-padre-carmona','humildad-carmona','santo-entierro-carmona','banda-musica-nuestra-senora-guaditoca-guadalcanal','banda-municipal-musica-aznalcollar','bct-jesus-rescatado-la-solana','banda-musica-el-arrabal-carmona','bct-nuestra-senora-gracia-carmona','banda-musica-maferman-carmona','virgen-dolores-servitas-carmona','coronacion-espinas-carmona','virgen-esperanza-carmona','san-juan-esperanza-carmona','cristo-desamparados-carmona','senor-amargura-carmona','virgen-mayor-dolor-carmona','cristo-san-felipe-carmona','cristo-expiracion-carmona','virgen-dolores-expiracion-carmona','cristo-calvario-carmona','san-juan-expiracion-carmona','san-blas-expiracion-carmona','cristo-sagrado-descendimiento-carmona','virgen-angustias-carmona','virgen-angeles-quinta-angustia-carmona','cautivo-belen-carmona','jesus-columna-carmona','virgen-paciencia-carmona','jesus-nazareno-carmona','virgen-dolores-nuestro-padre-carmona','divina-pastora-nuestro-padre-carmona','sagrada-entrada-carmona','humildad-paciencia-carmona','virgen-dolores-humildad-carmona','san-juan-humildad-carmona','cristo-yacente-carmona','virgen-soledad-carmona','santa-ana-santo-entierro-carmona','sanedrita-coronacion-carmona','soldado-romano-1-coronacion-carmona','soldado-romano-2-coronacion-carmona','poncio-pilatos-coronacion-carmona','dimas-expiracion-carmona','gestas-expiracion-carmona','maria-magdalena-expiracion-carmona','virgen-lagrimas-descendimiento-carmona','sanedrita-columna-carmona','sayon-columna-carmona','centurion-columna-carmona','jose-arimatea-santo-entierro-carmona','nicodemo-santo-entierro-carmona','paso-palio-dolores-servitas-carmona','paso-borriquita-carmona','paso-coronacion-espinas-carmona','palio-esperanza-carmona','paso-senor-amargura-carmona','palio-mayor-dolor-carmona','paso-misterio-expiracion-carmona','palio-dolores-expiracion-carmona','paso-sagrado-descendimiento-carmona','palio-angustias-carmona','paso-columna-carmona','palio-paciencia-carmona','paso-jesus-nazareno-carmona','palio-dolores-nuestro-padre-carmona','urna-cristo-desamparados-carmona','paso-humildad-paciencia-carmona','palio-dolores-humildad-carmona','paso-santo-entierro-carmona']::text[])) then
    raise exception 'carmona_entity_slug_collision';
  end if;
  if exists (select 1 from public.entities where entity_type='band' and lower(name) = any(array['banda de música nuestra señora de guaditoca','banda municipal de música de aznalcóllar','banda de cornetas y tambores nuestro padre jesús rescatado de la solana','banda de música el arrabal de carmona','banda de cornetas y tambores nuestra señora de gracia de carmona','banda de música del maestro manuel fernández manzanar (maferman)']::text[])) then
    raise exception 'carmona_band_name_collision';
  end if;
  if exists (select 1 from public.places where slug = any(array['real-iglesia-divino-salvador-carmona','iglesia-san-felipe-carmona','iglesia-san-blas-carmona','capilla-san-francisco-carmona','iglesia-santiago-carmona','iglesia-san-bartolome-carmona','iglesia-san-pedro-carmona']::text[])) then
    raise exception 'carmona_place_slug_collision';
  end if;
  if exists (select 1 from public.sources where url = any(array['https://consejohermandadescarmona.es/hdaesperanza/','https://consejohermandadescarmona.es/hermandad-de-nuestro-padre/','https://consejohermandadescarmona.es/hermandad-de-la-expiracion/','https://consejohermandadescarmona.es/quinta-angustia-2/','https://consejohermandadescarmona.es/hermandad-de-santiago/','https://consejohermandadescarmona.es/hermandad-de-la-humildad/','https://consejohermandadescarmona.es/san-felipe/','https://consejohermandadescarmona.es/hermandad-del-santo-entierro/','https://www.turismosevilla.org/es/eventos-y-fiestas/semana-santa-2026-carmona','https://turismo.carmona.org/wp-content/uploads/Carmona-Penitente-sin-publi-1.pdf','https://play.televisioncarmona.com/v/Wb1GQFWIeHX0e5LC2q/SERVITAS-REPORTAJE-TVC//','https://play.televisioncarmona.com/v/zXMfLnWu4r4Dr4azMF/HERMANDAD-DE-LA-ESPERANZA-REPORTAJE-TVC//','https://play.televisioncarmona.com/v/qr2hy93oqRTOHdUYOn/HERMANDAD-DE-SAN-FELIPE-REPORTAJE-TVC//','https://play.televisioncarmona.com/v/U8chRcbT3j3uDRFP9H/HERMANDAD-DE-SAN-BLAS-REPORTAJE-TVC//','https://play.televisioncarmona.com/v/bto3LTLIsgaqKsFfCY/HERMANDAD-DE-LA-QUINTA-ANGUSTIA-REPORTAJE-TVC//','https://play.televisioncarmona.com/v/8R5I6BUGMu2FqEz73k/HERMANDAD-DE-SANTIAGO-REPORTAJE-TVC//','https://play.televisioncarmona.com/v/84jhfcoMZ8YXNuunmL/HERMANDAD-DE-EL-SILENCIO-REPORTAJE-TVC//','https://play.televisioncarmona.com/v/LwOZnudoEYetI0gXnn/CRISTO-DE-LOS-DESAMPARADOS-REALIZACION//','https://play.televisioncarmona.com/v/Imqv1GlpxvEHKd1B9I/HERMANDAD-DE-SAN-PEDRO-REPORTAJE-TVC//','https://play.televisioncarmona.com/v/d4cj4lCGq1gPR3ixCX/HERMANDAD-DEL-SANTO-ENTIERRO-REPORTAJE-TVC//','https://servitascarmona.com/','https://play.televisioncarmona.com/v/JeNyAaqE2pPPq7ZqSd/LA-BORRIQUITA-HERMANDAD-DE-LA-HUMILDAD-REPORTAJE-TVC//','https://www.ampazycaridad.com/semana-santa-2026.php','https://www.youtube.com/watch?v=PCCkBQSM1z8','https://hermandaddelcastillo.org/wp-content/uploads/2025/04/MAQUETACION-BOLETIN-26-2025-EL-CASTILLO-para-revision-2.pdf','https://www.televisioncarmona.com/noticia/16821/0/DOSIER-INFORMATIVO-CORPUS-CHRISTI-2026-EN-CARMONA/','https://www.artesacro.org/Noticia.asp?idreg=167327','https://www.artesacro.org/Noticia/Ver/169164/provincia-triduo-virgen-dolores-siervos-maria-carmona','https://federband.org/banda/banda-de-musica-nuestra-senora-de-guaditoca','https://bmaznalcollar.es/es/','https://rescatadolasolana.es/historia/','https://federband.org/banda/asociacion-cultural-filarmonica-el-arrabal','https://bandacarmona.webador.es/historia-1','https://www.larevistacarmona.es/texto-diario/mostrar/5943876/ciudadanos-musica-2']::text[])) then
    raise exception 'carmona_source_url_collision';
  end if;
end $$;

-- 1–35 · Fuentes
insert into public.sources ("id","name","url","source_type","author_or_publisher","publication_date","accessed_at","notes") values
('c0160035-0101-4000-8000-000000000001','Consejo · Esperanza','https://consejohermandadescarmona.es/hdaesperanza/','Web institucional','Consejo de Hermandades y Cofradías de Carmona',null::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0102-4000-8000-000000000002','Consejo · Nuestro Padre','https://consejohermandadescarmona.es/hermandad-de-nuestro-padre/','Web institucional','Consejo de Hermandades y Cofradías de Carmona',null::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0103-4000-8000-000000000003','Consejo · Expiración','https://consejohermandadescarmona.es/hermandad-de-la-expiracion/','Web institucional','Consejo de Hermandades y Cofradías de Carmona',null::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0104-4000-8000-000000000004','Consejo · Quinta Angustia','https://consejohermandadescarmona.es/quinta-angustia-2/','Web institucional','Consejo de Hermandades y Cofradías de Carmona',null::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0105-4000-8000-000000000005','Consejo · Santiago','https://consejohermandadescarmona.es/hermandad-de-santiago/','Web institucional','Consejo de Hermandades y Cofradías de Carmona',null::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0106-4000-8000-000000000006','Consejo · Humildad','https://consejohermandadescarmona.es/hermandad-de-la-humildad/','Web institucional','Consejo de Hermandades y Cofradías de Carmona',null::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0107-4000-8000-000000000007','Consejo · Amargura / San Felipe','https://consejohermandadescarmona.es/san-felipe/','Web institucional','Consejo de Hermandades y Cofradías de Carmona',null::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0108-4000-8000-000000000008','Consejo · Santo Entierro','https://consejohermandadescarmona.es/hermandad-del-santo-entierro/','Web institucional','Consejo de Hermandades y Cofradías de Carmona',null::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0109-4000-8000-000000000009','Turismo provincial · Semana Santa de Carmona 2026','https://www.turismosevilla.org/es/eventos-y-fiestas/semana-santa-2026-carmona','Web institucional','Turismo de la Provincia de Sevilla',null::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0110-4000-8000-000000000010','PDF municipal · Carmona Penitente 2026','https://turismo.carmona.org/wp-content/uploads/Carmona-Penitente-sin-publi-1.pdf','PDF institucional','Ayuntamiento de Carmona · Turismo',null::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0113-4000-8000-000000000013','TV Carmona · Servitas','https://play.televisioncarmona.com/v/Wb1GQFWIeHX0e5LC2q/SERVITAS-REPORTAJE-TVC//','Medio audiovisual','Televisión Carmona','2026-04-07'::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0114-4000-8000-000000000014','TV Carmona · Esperanza','https://play.televisioncarmona.com/v/zXMfLnWu4r4Dr4azMF/HERMANDAD-DE-LA-ESPERANZA-REPORTAJE-TVC//','Medio audiovisual','Televisión Carmona',null::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0115-4000-8000-000000000015','TV Carmona · San Felipe','https://play.televisioncarmona.com/v/qr2hy93oqRTOHdUYOn/HERMANDAD-DE-SAN-FELIPE-REPORTAJE-TVC//','Medio audiovisual','Televisión Carmona',null::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0116-4000-8000-000000000016','TV Carmona · San Blas','https://play.televisioncarmona.com/v/U8chRcbT3j3uDRFP9H/HERMANDAD-DE-SAN-BLAS-REPORTAJE-TVC//','Medio audiovisual','Televisión Carmona',null::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0117-4000-8000-000000000017','TV Carmona · Quinta Angustia','https://play.televisioncarmona.com/v/bto3LTLIsgaqKsFfCY/HERMANDAD-DE-LA-QUINTA-ANGUSTIA-REPORTAJE-TVC//','Medio audiovisual','Televisión Carmona',null::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0118-4000-8000-000000000018','TV Carmona · Santiago','https://play.televisioncarmona.com/v/8R5I6BUGMu2FqEz73k/HERMANDAD-DE-SANTIAGO-REPORTAJE-TVC//','Medio audiovisual','Televisión Carmona',null::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0119-4000-8000-000000000019','TV Carmona · El Silencio / Nuestro Padre','https://play.televisioncarmona.com/v/84jhfcoMZ8YXNuunmL/HERMANDAD-DE-EL-SILENCIO-REPORTAJE-TVC//','Medio audiovisual','Televisión Carmona',null::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0120-4000-8000-000000000020','TV Carmona · Desamparados','https://play.televisioncarmona.com/v/LwOZnudoEYetI0gXnn/CRISTO-DE-LOS-DESAMPARADOS-REALIZACION//','Medio audiovisual','Televisión Carmona',null::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0121-4000-8000-000000000021','TV Carmona · San Pedro / Humildad','https://play.televisioncarmona.com/v/Imqv1GlpxvEHKd1B9I/HERMANDAD-DE-SAN-PEDRO-REPORTAJE-TVC//','Medio audiovisual','Televisión Carmona',null::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0122-4000-8000-000000000022','TV Carmona · Santo Entierro','https://play.televisioncarmona.com/v/d4cj4lCGq1gPR3ixCX/HERMANDAD-DEL-SANTO-ENTIERRO-REPORTAJE-TVC//','Medio audiovisual','Televisión Carmona',null::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0123-4000-8000-000000000023','Servitas Carmona · web oficial','https://servitascarmona.com/','Web oficial','Orden Seglar Servita Carmona',null::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0124-4000-8000-000000000024','TV Carmona · La Borriquita','https://play.televisioncarmona.com/v/JeNyAaqE2pPPq7ZqSd/LA-BORRIQUITA-HERMANDAD-DE-LA-HUMILDAD-REPORTAJE-TVC//','Medio audiovisual','Televisión Carmona',null::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0125-4000-8000-000000000025','Paz y Caridad · Semana Santa 2026','https://www.ampazycaridad.com/semana-santa-2026.php','Web oficial','Agrupación Musical Paz y Caridad de Estepa',null::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0127-4000-8000-000000000027','Banda Municipal de Mairena · Servitas de Carmona 2026','https://www.youtube.com/watch?v=PCCkBQSM1z8','Canal oficial','Banda Municipal de Música de Mairena del Alcor','2026-03-30'::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0128-4000-8000-000000000028','Amor y Sacrificio · entrevista de dirección','https://hermandaddelcastillo.org/wp-content/uploads/2025/04/MAQUETACION-BOLETIN-26-2025-EL-CASTILLO-para-revision-2.pdf','Publicación cofrade','Hermandad del Castillo de Lebrija',null::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0129-4000-8000-000000000029','TV Carmona · Dosier Corpus Christi 2026','https://www.televisioncarmona.com/noticia/16821/0/DOSIER-INFORMATIVO-CORPUS-CHRISTI-2026-EN-CARMONA/','Medio audiovisual','Televisión Carmona',null::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0130-4000-8000-000000000030','ArteSacro · Desamparados en silencio','https://www.artesacro.org/Noticia.asp?idreg=167327','Medio especializado','ArteSacro',null::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0131-4000-8000-000000000031','ArteSacro · Servitas · Procesión del Escapulario 2026','https://www.artesacro.org/Noticia/Ver/169164/provincia-triduo-virgen-dolores-siervos-maria-carmona','Medio especializado','ArteSacro','2026-09-23'::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0132-4000-8000-000000000032','Federband · Banda de Música Nuestra Señora de Guaditoca','https://federband.org/banda/banda-de-musica-nuestra-senora-de-guaditoca','Directorio federativo','Federband',null::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0133-4000-8000-000000000033','Banda Municipal de Aznalcóllar · web oficial','https://bmaznalcollar.es/es/','Web oficial','Banda Municipal de Música de Aznalcóllar',null::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0134-4000-8000-000000000034','BCT Rescatado La Solana · historia oficial','https://rescatadolasolana.es/historia/','Web oficial','BCT Nuestro Padre Jesús Rescatado de La Solana',null::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0135-4000-8000-000000000035','Federband · Asociación Cultural Filarmónica El Arrabal','https://federband.org/banda/asociacion-cultural-filarmonica-el-arrabal','Directorio federativo','Federband',null::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0136-4000-8000-000000000036','BCT Nuestra Señora de Gracia de Carmona · historia','https://bandacarmona.webador.es/historia-1','Web oficial','BCT Nuestra Señora de Gracia de Carmona',null::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-0137-4000-8000-000000000037','La Revista Carmona · Maferman bajo un arco iris musical','https://www.larevistacarmona.es/texto-diario/mostrar/5943876/ciudadanos-musica-2','Medio local','La Revista Carmona',null::date,'2026-09-25','Fuente del octavo macrolote municipal HC-016 · Carmona.')
on conflict ("id") do update set
"name"=excluded."name","url"=excluded."url","source_type"=excluded."source_type",
"author_or_publisher"=excluded."author_or_publisher","publication_date"=excluded."publication_date",
"accessed_at"=excluded."accessed_at","notes"=excluded."notes";

update public.sources
set name='Servitas Carmona · convocatoria oficial de la Procesión del Escapulario 2026',
    url='https://www.facebook.com/ServitasCarmona/posts/1392126423115930/',
    source_type='Red social oficial',
    author_or_publisher='Orden Seglar Servita Carmona',
    accessed_at='2026-09-25',
    notes='REUSE CAR-F12. Se repara la trazabilidad de la convocatoria oficial; no se inventa publication_date.'
where id='f5c7c0c1-63c8-42b3-b1e8-fac89b01de83';

-- 36–42 · Lugares
insert into public.places ("id","municipality_id","name","slug","place_type","address","notes") values
('c0160035-0201-4000-8000-000000000001','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','Real Iglesia del Divino Salvador','real-iglesia-divino-salvador-carmona','Iglesia',null,'Sede canónica documentada para el lote HC-016 Carmona.'),
('c0160035-0202-4000-8000-000000000002','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','Iglesia de San Felipe','iglesia-san-felipe-carmona','Iglesia',null,'Sede canónica documentada para el lote HC-016 Carmona.'),
('c0160035-0203-4000-8000-000000000003','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','Iglesia de San Blas','iglesia-san-blas-carmona','Iglesia',null,'Sede canónica documentada para el lote HC-016 Carmona.'),
('c0160035-0204-4000-8000-000000000004','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','Capilla de San Francisco','capilla-san-francisco-carmona','Capilla',null,'Sede canónica documentada para el lote HC-016 Carmona.'),
('c0160035-0205-4000-8000-000000000005','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','Iglesia de Santiago','iglesia-santiago-carmona','Iglesia',null,'Sede canónica documentada para el lote HC-016 Carmona.'),
('c0160035-0206-4000-8000-000000000006','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','Iglesia de San Bartolomé','iglesia-san-bartolome-carmona','Iglesia',null,'Sede canónica documentada para el lote HC-016 Carmona.'),
('c0160035-0207-4000-8000-000000000007','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','Iglesia de San Pedro','iglesia-san-pedro-carmona','Iglesia',null,'Sede canónica documentada para el lote HC-016 Carmona.')
on conflict ("id") do update set "municipality_id"=excluded."municipality_id","name"=excluded."name","slug"=excluded."slug","place_type"=excluded."place_type","address"=excluded."address","notes"=excluded."notes";

-- 43–117 · Entidades
insert into public.entities ("id","entity_type","name","slug","summary","status") values
('c0160035-0301-4000-8000-000000000001','brotherhood','Orden Seglar Servita Carmona','orden-seglar-servita-carmona','Corporación penitencial de Carmona documentada en HC-016.','published'),
('c0160035-0302-4000-8000-000000000002','brotherhood','Esperanza de Carmona','esperanza-carmona','Corporación penitencial de Carmona documentada en HC-016.','published'),
('c0160035-0303-4000-8000-000000000003','brotherhood','Amargura de Carmona','amargura-carmona','Corporación penitencial de Carmona documentada en HC-016.','published'),
('c0160035-0304-4000-8000-000000000004','brotherhood','Expiración de Carmona','expiracion-carmona','Corporación penitencial de Carmona documentada en HC-016.','published'),
('c0160035-0305-4000-8000-000000000005','brotherhood','Quinta Angustia de Carmona','quinta-angustia-carmona','Corporación penitencial de Carmona documentada en HC-016.','published'),
('c0160035-0306-4000-8000-000000000006','brotherhood','Santiago de Carmona','santiago-carmona','Corporación penitencial de Carmona documentada en HC-016.','published'),
('c0160035-0307-4000-8000-000000000007','brotherhood','Nuestro Padre de Carmona','nuestro-padre-carmona','Corporación penitencial de Carmona documentada en HC-016.','published'),
('c0160035-0308-4000-8000-000000000008','brotherhood','Humildad de Carmona','humildad-carmona','Corporación penitencial de Carmona documentada en HC-016.','published'),
('c0160035-0309-4000-8000-000000000009','brotherhood','Santo Entierro de Carmona','santo-entierro-carmona','Corporación penitencial de Carmona documentada en HC-016.','published'),
('c0160035-0401-4000-8000-000000000001','band','Banda de Música Nuestra Señora de Guaditoca','banda-musica-nuestra-senora-guaditoca-guadalcanal','Formación musical de Guadalcanal documentada en HC-016 Carmona.','published'),
('c0160035-0402-4000-8000-000000000002','band','Banda Municipal de Música de Aznalcóllar','banda-municipal-musica-aznalcollar','Formación musical de Aznalcóllar documentada en HC-016 Carmona.','published'),
('c0160035-0403-4000-8000-000000000003','band','Banda de Cornetas y Tambores Nuestro Padre Jesús Rescatado de La Solana','bct-jesus-rescatado-la-solana','Formación musical de La Solana documentada en HC-016 Carmona.','published'),
('c0160035-0404-4000-8000-000000000004','band','Banda de Música El Arrabal de Carmona','banda-musica-el-arrabal-carmona','Formación musical de Carmona documentada en HC-016 Carmona.','published'),
('c0160035-0405-4000-8000-000000000005','band','Banda de Cornetas y Tambores Nuestra Señora de Gracia de Carmona','bct-nuestra-senora-gracia-carmona','Formación musical de Carmona documentada en HC-016 Carmona.','published'),
('c0160035-0406-4000-8000-000000000006','band','Banda de Música del Maestro Manuel Fernández Manzanar (MAFERMAN)','banda-musica-maferman-carmona','Formación musical de Carmona documentada en HC-016 Carmona.','published'),
('c0160035-0601-4000-8000-000000000001','image','María Santísima de los Dolores','virgen-dolores-servitas-carmona','Imagen titular documentada para Carmona.','published'),
('c0160035-0602-4000-8000-000000000002','image','Nuestro Padre Jesús de la Coronación de Espinas','coronacion-espinas-carmona','Imagen titular documentada para Carmona.','published'),
('c0160035-0603-4000-8000-000000000003','image','María Santísima de la Esperanza','virgen-esperanza-carmona','Imagen titular documentada para Carmona.','published'),
('c0160035-0604-4000-8000-000000000004','image','San Juan Evangelista','san-juan-esperanza-carmona','Imagen titular documentada para Carmona.','published'),
('c0160035-0605-4000-8000-000000000005','image','Santísimo Cristo de los Desamparados','cristo-desamparados-carmona','Imagen titular documentada para Carmona.','published'),
('c0160035-0606-4000-8000-000000000006','image','Señor de la Amargura','senor-amargura-carmona','Imagen titular documentada para Carmona.','published'),
('c0160035-0607-4000-8000-000000000007','image','María Santísima del Mayor Dolor','virgen-mayor-dolor-carmona','Imagen titular documentada para Carmona.','published'),
('c0160035-0608-4000-8000-000000000008','image','Santísimo Cristo de San Felipe','cristo-san-felipe-carmona','Imagen titular documentada para Carmona.','published'),
('c0160035-0609-4000-8000-000000000009','image','Santísimo Cristo de la Expiración','cristo-expiracion-carmona','Imagen titular documentada para Carmona.','published'),
('c0160035-0610-4000-8000-000000000010','image','María Santísima de los Dolores','virgen-dolores-expiracion-carmona','Imagen titular documentada para Carmona.','published'),
('c0160035-0611-4000-8000-000000000011','image','Santísimo Cristo del Calvario','cristo-calvario-carmona','Imagen titular documentada para Carmona.','published'),
('c0160035-0612-4000-8000-000000000012','image','San Juan Evangelista','san-juan-expiracion-carmona','Imagen titular documentada para Carmona.','published'),
('c0160035-0613-4000-8000-000000000013','image','San Blas','san-blas-expiracion-carmona','Imagen titular documentada para Carmona.','published'),
('c0160035-0614-4000-8000-000000000014','image','Santísimo Cristo del Sagrado Descendimiento','cristo-sagrado-descendimiento-carmona','Imagen titular documentada para Carmona.','published'),
('c0160035-0615-4000-8000-000000000015','image','Nuestra Señora y Madre de las Angustias','virgen-angustias-carmona','Imagen titular documentada para Carmona.','published'),
('c0160035-0616-4000-8000-000000000016','image','Nuestra Señora de los Ángeles','virgen-angeles-quinta-angustia-carmona','Imagen titular documentada para Carmona.','published'),
('c0160035-0617-4000-8000-000000000017','image','Nuestro Padre Jesús Cautivo de Belén','cautivo-belen-carmona','Imagen titular documentada para Carmona.','published'),
('c0160035-0618-4000-8000-000000000018','image','Nuestro Padre Jesús en la Columna','jesus-columna-carmona','Imagen titular documentada para Carmona.','published'),
('c0160035-0619-4000-8000-000000000019','image','María Santísima de la Paciencia','virgen-paciencia-carmona','Imagen titular documentada para Carmona.','published'),
('c0160035-0620-4000-8000-000000000020','image','Nuestro Padre Jesús Nazareno','jesus-nazareno-carmona','Imagen titular documentada para Carmona.','published'),
('c0160035-0621-4000-8000-000000000021','image','María Santísima de los Dolores','virgen-dolores-nuestro-padre-carmona','Imagen titular documentada para Carmona.','published'),
('c0160035-0622-4000-8000-000000000022','image','Divina Pastora de las Almas','divina-pastora-nuestro-padre-carmona','Imagen titular documentada para Carmona.','published'),
('c0160035-0623-4000-8000-000000000023','image','Sagrada Entrada de Jesús en Jerusalén','sagrada-entrada-carmona','Imagen titular documentada para Carmona.','published'),
('c0160035-0624-4000-8000-000000000024','image','Nuestro Padre Jesús de la Humildad y Paciencia','humildad-paciencia-carmona','Imagen titular documentada para Carmona.','published'),
('c0160035-0625-4000-8000-000000000025','image','María Santísima de los Dolores','virgen-dolores-humildad-carmona','Imagen titular documentada para Carmona.','published'),
('c0160035-0626-4000-8000-000000000026','image','San Juan Evangelista','san-juan-humildad-carmona','Imagen titular documentada para Carmona.','published'),
('c0160035-0627-4000-8000-000000000027','image','Santísimo Cristo Yacente','cristo-yacente-carmona','Imagen titular documentada para Carmona.','published'),
('c0160035-0628-4000-8000-000000000028','image','María Santísima de la Soledad','virgen-soledad-carmona','Imagen titular documentada para Carmona.','published'),
('c0160035-0629-4000-8000-000000000029','image','Santa Ana','santa-ana-santo-entierro-carmona','Imagen titular documentada para Carmona.','published'),
('c0160035-0630-4000-8000-000000000030','image','Sanedrita del misterio de la Coronación de Espinas','sanedrita-coronacion-carmona','Figura secundaria documentada en la composición procesional de 2026.','published'),
('c0160035-0631-4000-8000-000000000031','image','Soldado romano I del misterio de la Coronación de Espinas','soldado-romano-1-coronacion-carmona','Figura secundaria documentada en la composición procesional de 2026.','published'),
('c0160035-0632-4000-8000-000000000032','image','Soldado romano II del misterio de la Coronación de Espinas','soldado-romano-2-coronacion-carmona','Figura secundaria documentada en la composición procesional de 2026.','published'),
('c0160035-0633-4000-8000-000000000033','image','Poncio Pilatos del misterio de la Coronación de Espinas','poncio-pilatos-coronacion-carmona','Figura secundaria documentada en la composición procesional de 2026.','published'),
('c0160035-0634-4000-8000-000000000034','image','Dimas del misterio de la Expiración','dimas-expiracion-carmona','Figura secundaria documentada en la composición procesional de 2026.','published'),
('c0160035-0635-4000-8000-000000000035','image','Gestas del misterio de la Expiración','gestas-expiracion-carmona','Figura secundaria documentada en la composición procesional de 2026.','published'),
('c0160035-0636-4000-8000-000000000036','image','María Magdalena del misterio de la Expiración','maria-magdalena-expiracion-carmona','Figura secundaria documentada en la composición procesional de 2026.','published'),
('c0160035-0637-4000-8000-000000000037','image','Virgen de las Lágrimas del misterio del Sagrado Descendimiento','virgen-lagrimas-descendimiento-carmona','Figura secundaria documentada en la composición procesional de 2026.','published'),
('c0160035-0638-4000-8000-000000000038','image','Sanedrita del misterio de la Columna','sanedrita-columna-carmona','Figura secundaria documentada en la composición procesional de 2026.','published'),
('c0160035-0639-4000-8000-000000000039','image','Sayón del misterio de la Columna','sayon-columna-carmona','Figura secundaria documentada en la composición procesional de 2026.','published'),
('c0160035-0640-4000-8000-000000000040','image','Centurión romano del misterio de la Columna','centurion-columna-carmona','Figura secundaria documentada en la composición procesional de 2026.','published'),
('c0160035-0641-4000-8000-000000000041','image','José de Arimatea del misterio del Santo Entierro','jose-arimatea-santo-entierro-carmona','Figura secundaria documentada en la composición procesional de 2026.','published'),
('c0160035-0642-4000-8000-000000000042','image','Nicodemo del misterio del Santo Entierro','nicodemo-santo-entierro-carmona','Figura secundaria documentada en la composición procesional de 2026.','published'),
('c0160035-0701-4000-8000-000000000001','step','Paso de palio de María Santísima de los Dolores','paso-palio-dolores-servitas-carmona','Paso procesional documentado en la Semana Santa de Carmona 2026.','published'),
('c0160035-0702-4000-8000-000000000002','step','Paso de la Sagrada Entrada en Jerusalén · La Borriquita','paso-borriquita-carmona','Paso procesional documentado en la Semana Santa de Carmona 2026.','published'),
('c0160035-0703-4000-8000-000000000003','step','Misterio de la Coronación de Espinas','paso-coronacion-espinas-carmona','Paso procesional documentado en la Semana Santa de Carmona 2026.','published'),
('c0160035-0704-4000-8000-000000000004','step','Palio de María Santísima de la Esperanza','palio-esperanza-carmona','Paso procesional documentado en la Semana Santa de Carmona 2026.','published'),
('c0160035-0705-4000-8000-000000000005','step','Paso del Señor de la Amargura','paso-senor-amargura-carmona','Paso procesional documentado en la Semana Santa de Carmona 2026.','published'),
('c0160035-0706-4000-8000-000000000006','step','Palio de María Santísima del Mayor Dolor','palio-mayor-dolor-carmona','Paso procesional documentado en la Semana Santa de Carmona 2026.','published'),
('c0160035-0707-4000-8000-000000000007','step','Misterio de la Expiración','paso-misterio-expiracion-carmona','Paso procesional documentado en la Semana Santa de Carmona 2026.','published'),
('c0160035-0708-4000-8000-000000000008','step','Palio de María Santísima de los Dolores','palio-dolores-expiracion-carmona','Paso procesional documentado en la Semana Santa de Carmona 2026.','published'),
('c0160035-0709-4000-8000-000000000009','step','Misterio del Sagrado Descendimiento','paso-sagrado-descendimiento-carmona','Paso procesional documentado en la Semana Santa de Carmona 2026.','published'),
('c0160035-0710-4000-8000-000000000010','step','Palio de Nuestra Señora y Madre de las Angustias','palio-angustias-carmona','Paso procesional documentado en la Semana Santa de Carmona 2026.','published'),
('c0160035-0711-4000-8000-000000000011','step','Misterio de la Columna','paso-columna-carmona','Paso procesional documentado en la Semana Santa de Carmona 2026.','published'),
('c0160035-0712-4000-8000-000000000012','step','Palio de María Santísima de la Paciencia','palio-paciencia-carmona','Paso procesional documentado en la Semana Santa de Carmona 2026.','published'),
('c0160035-0713-4000-8000-000000000013','step','Paso de Nuestro Padre Jesús Nazareno','paso-jesus-nazareno-carmona','Paso procesional documentado en la Semana Santa de Carmona 2026.','published'),
('c0160035-0714-4000-8000-000000000014','step','Palio de María Santísima de los Dolores','palio-dolores-nuestro-padre-carmona','Paso procesional documentado en la Semana Santa de Carmona 2026.','published'),
('c0160035-0715-4000-8000-000000000015','step','Urna del Santísimo Cristo de los Desamparados','urna-cristo-desamparados-carmona','Paso procesional documentado en la Semana Santa de Carmona 2026.','published'),
('c0160035-0716-4000-8000-000000000016','step','Misterio de Nuestro Padre Jesús de la Humildad y Paciencia','paso-humildad-paciencia-carmona','Paso procesional documentado en la Semana Santa de Carmona 2026.','published'),
('c0160035-0717-4000-8000-000000000017','step','Palio de María Santísima de los Dolores','palio-dolores-humildad-carmona','Paso procesional documentado en la Semana Santa de Carmona 2026.','published'),
('c0160035-0718-4000-8000-000000000018','step','Misterio del Santo Entierro','paso-santo-entierro-carmona','Paso procesional documentado en la Semana Santa de Carmona 2026.','published')
on conflict ("id") do update set "entity_type"=excluded."entity_type","name"=excluded."name","slug"=excluded."slug","summary"=excluded."summary","status"=excluded."status";

-- 118–126 · Corporaciones
insert into public.brotherhoods ("entity_id","official_name","popular_name","municipality_id","canonical_see_place_id","website_url","brotherhood_types","current_procession_day","notes") values
('c0160035-0301-4000-8000-000000000001','Orden Seglar Siervos de María','Servitas','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','c0160035-0201-4000-8000-000000000001','https://servitascarmona.com/',array['Penitencia']::text[],'Viernes de Dolores','Denominación institucional resumida según inventario HC-016; sin escudo ni fotografía incorporados.'),
('c0160035-0302-4000-8000-000000000002','Hermandad de la Coronación de Espinas, Esperanza y Cristo de los Desamparados','Esperanza','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','c0160035-0201-4000-8000-000000000001',null,array['Penitencia']::text[],'Domingo de Ramos y Viernes Santo','Denominación institucional resumida según inventario HC-016; sin escudo ni fotografía incorporados.'),
('c0160035-0303-4000-8000-000000000003','Hermandad del Señor de la Amargura y María Santísima del Mayor Dolor','Amargura','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','c0160035-0202-4000-8000-000000000002',null,array['Penitencia']::text[],'Lunes Santo','Denominación institucional resumida según inventario HC-016; sin escudo ni fotografía incorporados.'),
('c0160035-0304-4000-8000-000000000004','Hermandad del Santísimo Cristo de la Expiración y María Santísima de los Dolores','Expiración','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','c0160035-0203-4000-8000-000000000003',null,array['Penitencia']::text[],'Martes Santo','Denominación institucional resumida según inventario HC-016; sin escudo ni fotografía incorporados.'),
('c0160035-0305-4000-8000-000000000005','Hermandad del Sagrado Descendimiento y Nuestra Señora y Madre de las Angustias','Quinta Angustia','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','c0160035-0204-4000-8000-000000000004',null,array['Penitencia']::text[],'Miércoles Santo','Denominación institucional resumida según inventario HC-016; sin escudo ni fotografía incorporados.'),
('c0160035-0306-4000-8000-000000000006','Hermandad de Nuestro Padre Jesús en la Columna y María Santísima de la Paciencia','Santiago','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','c0160035-0205-4000-8000-000000000005',null,array['Penitencia']::text[],'Jueves Santo','Denominación institucional resumida según inventario HC-016; sin escudo ni fotografía incorporados.'),
('c0160035-0307-4000-8000-000000000007','Hermandad de Nuestro Padre Jesús Nazareno y María Santísima de los Dolores','Nuestro Padre','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','c0160035-0206-4000-8000-000000000006',null,array['Penitencia']::text[],'Viernes Santo','Denominación institucional resumida según inventario HC-016; sin escudo ni fotografía incorporados.'),
('c0160035-0308-4000-8000-000000000008','Hermandad de la Sagrada Entrada en Jerusalén, Nuestro Padre Jesús de la Humildad y Paciencia y María Santísima de los Dolores','Humildad','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','c0160035-0207-4000-8000-000000000007',null,array['Penitencia']::text[],'Domingo de Ramos y Viernes Santo','Denominación institucional resumida según inventario HC-016; sin escudo ni fotografía incorporados.'),
('c0160035-0309-4000-8000-000000000009','Hermandad del Santo Entierro y María Santísima de la Soledad','Santo Entierro','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','c0160035-0206-4000-8000-000000000006',null,array['Penitencia']::text[],'Sábado Santo','Denominación institucional resumida según inventario HC-016; sin escudo ni fotografía incorporados.')
on conflict ("entity_id") do update set
"official_name"=excluded."official_name","popular_name"=excluded."popular_name","municipality_id"=excluded."municipality_id",
"canonical_see_place_id"=excluded."canonical_see_place_id","website_url"=excluded."website_url",
"brotherhood_types"=excluded."brotherhood_types","current_procession_day"=excluded."current_procession_day","notes"=excluded."notes";

-- 127–132 · Bandas nuevas
insert into public.bands ("entity_id","band_type","municipality_id","website_url","description","headquarters_text") values
('c0160035-0401-4000-8000-000000000001','Banda de Música','6ad7b2d3-6bbd-4b41-a7e7-bc2286608c99','https://bandademusicaguadalcanal.es/','Formación de Guadalcanal documentada para acompañamientos de Carmona 2026.','Guadalcanal'),
('c0160035-0402-4000-8000-000000000002','Banda de Música','88ca0e56-bf93-4ac0-a72c-b2bee7a8e4d8','https://bmaznalcollar.es/es/','Formación de Aznalcóllar documentada para acompañamientos de Carmona 2026.','Aznalcóllar'),
('c0160035-0403-4000-8000-000000000003','Cornetas y Tambores',null,'https://rescatadolasolana.es/','Formación de La Solana documentada para acompañamientos de Carmona 2026.','La Solana'),
('c0160035-0404-4000-8000-000000000004','Banda de Música','bf024af2-3eda-4989-b1b5-0a723dcf9cb4',null,'Formación de Carmona documentada para acompañamientos de Carmona 2026.','Carmona'),
('c0160035-0405-4000-8000-000000000005','Cornetas y Tambores','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','https://bandacarmona.webador.es/','Formación de Carmona documentada para acompañamientos de Carmona 2026.','Carmona'),
('c0160035-0406-4000-8000-000000000006','Banda de Música','bf024af2-3eda-4989-b1b5-0a723dcf9cb4',null,'Formación de Carmona documentada para acompañamientos de Carmona 2026.','Carmona')
on conflict ("entity_id") do update set
"band_type"=excluded."band_type","municipality_id"=excluded."municipality_id","website_url"=excluded."website_url",
"description"=excluded."description","headquarters_text"=excluded."headquarters_text";

-- 133–174 · Imágenes
insert into public.images ("entity_id","image_type","execution_date_text","current_condition","description","notes") values
('c0160035-0601-4000-8000-000000000001','Dolorosa',null,'extant','Imagen titular documentada en el inventario HC-016 Carmona.',null),
('c0160035-0602-4000-8000-000000000002','Cristo',null,'extant','Imagen titular documentada en el inventario HC-016 Carmona.',null),
('c0160035-0603-4000-8000-000000000003','Dolorosa',null,'extant','Imagen titular documentada en el inventario HC-016 Carmona.',null),
('c0160035-0604-4000-8000-000000000004','Santo',null,'extant','Imagen titular documentada en el inventario HC-016 Carmona.',null),
('c0160035-0605-4000-8000-000000000005','Cristo',null,'extant','Imagen titular documentada en el inventario HC-016 Carmona.',null),
('c0160035-0606-4000-8000-000000000006','Cristo',null,'extant','Imagen titular documentada en el inventario HC-016 Carmona.',null),
('c0160035-0607-4000-8000-000000000007','Dolorosa',null,'extant','Imagen titular documentada en el inventario HC-016 Carmona.',null),
('c0160035-0608-4000-8000-000000000008','Crucificado',null,'extant','Imagen titular documentada en el inventario HC-016 Carmona.',null),
('c0160035-0609-4000-8000-000000000009','Crucificado',null,'extant','Imagen titular documentada en el inventario HC-016 Carmona.',null),
('c0160035-0610-4000-8000-000000000010','Dolorosa',null,'extant','Imagen titular documentada en el inventario HC-016 Carmona.',null),
('c0160035-0611-4000-8000-000000000011','Crucificado',null,'extant','Imagen titular documentada en el inventario HC-016 Carmona.',null),
('c0160035-0612-4000-8000-000000000012','Santo',null,'extant','Imagen titular documentada en el inventario HC-016 Carmona.',null),
('c0160035-0613-4000-8000-000000000013','Santo',null,'extant','Imagen titular documentada en el inventario HC-016 Carmona.',null),
('c0160035-0614-4000-8000-000000000014','Cristo',null,'extant','Imagen titular documentada en el inventario HC-016 Carmona.',null),
('c0160035-0615-4000-8000-000000000015','Dolorosa',null,'extant','Imagen titular documentada en el inventario HC-016 Carmona.',null),
('c0160035-0616-4000-8000-000000000016','Dolorosa',null,'extant','Imagen titular documentada en el inventario HC-016 Carmona.',null),
('c0160035-0617-4000-8000-000000000017','Cristo',null,'extant','Imagen titular documentada en el inventario HC-016 Carmona.',null),
('c0160035-0618-4000-8000-000000000018','Cristo',null,'extant','Imagen titular documentada en el inventario HC-016 Carmona.',null),
('c0160035-0619-4000-8000-000000000019','Dolorosa',null,'extant','Imagen titular documentada en el inventario HC-016 Carmona.',null),
('c0160035-0620-4000-8000-000000000020','Nazareno',null,'extant','Imagen titular documentada en el inventario HC-016 Carmona.',null),
('c0160035-0621-4000-8000-000000000021','Dolorosa',null,'extant','Imagen titular documentada en el inventario HC-016 Carmona.',null),
('c0160035-0622-4000-8000-000000000022','Dolorosa',null,'extant','Imagen titular documentada en el inventario HC-016 Carmona.',null),
('c0160035-0623-4000-8000-000000000023','Cristo','2026','extant','Imagen titular documentada en el inventario HC-016 Carmona.','Obra de José Antonio Navarro Arteaga, 2026, según Carmona Penitente 2026.'),
('c0160035-0624-4000-8000-000000000024','Cristo',null,'extant','Imagen titular documentada en el inventario HC-016 Carmona.',null),
('c0160035-0625-4000-8000-000000000025','Dolorosa',null,'extant','Imagen titular documentada en el inventario HC-016 Carmona.',null),
('c0160035-0626-4000-8000-000000000026','Santo',null,'extant','Imagen titular documentada en el inventario HC-016 Carmona.',null),
('c0160035-0627-4000-8000-000000000027','Yacente',null,'extant','Imagen titular documentada en el inventario HC-016 Carmona.',null),
('c0160035-0628-4000-8000-000000000028','Dolorosa',null,'extant','Imagen titular documentada en el inventario HC-016 Carmona.',null),
('c0160035-0629-4000-8000-000000000029','Santa',null,'extant','Imagen titular documentada en el inventario HC-016 Carmona.',null),
('c0160035-0630-4000-8000-000000000030','Figura secundaria',null,'extant','Figura secundaria documentada exclusivamente para la composición procesional de 2026.',null),
('c0160035-0631-4000-8000-000000000031','Figura secundaria',null,'extant','Figura secundaria documentada exclusivamente para la composición procesional de 2026.',null),
('c0160035-0632-4000-8000-000000000032','Figura secundaria',null,'extant','Figura secundaria documentada exclusivamente para la composición procesional de 2026.',null),
('c0160035-0633-4000-8000-000000000033','Figura secundaria',null,'extant','Figura secundaria documentada exclusivamente para la composición procesional de 2026.',null),
('c0160035-0634-4000-8000-000000000034','Figura secundaria',null,'extant','Figura secundaria documentada exclusivamente para la composición procesional de 2026.',null),
('c0160035-0635-4000-8000-000000000035','Figura secundaria',null,'extant','Figura secundaria documentada exclusivamente para la composición procesional de 2026.',null),
('c0160035-0636-4000-8000-000000000036','Figura secundaria',null,'extant','Figura secundaria documentada exclusivamente para la composición procesional de 2026.',null),
('c0160035-0637-4000-8000-000000000037','Figura secundaria',null,'extant','Figura secundaria documentada exclusivamente para la composición procesional de 2026.',null),
('c0160035-0638-4000-8000-000000000038','Figura secundaria',null,'extant','Figura secundaria documentada exclusivamente para la composición procesional de 2026.',null),
('c0160035-0639-4000-8000-000000000039','Figura secundaria',null,'extant','Figura secundaria documentada exclusivamente para la composición procesional de 2026.',null),
('c0160035-0640-4000-8000-000000000040','Figura secundaria',null,'extant','Figura secundaria documentada exclusivamente para la composición procesional de 2026.',null),
('c0160035-0641-4000-8000-000000000041','Figura secundaria',null,'extant','Figura secundaria documentada exclusivamente para la composición procesional de 2026.',null),
('c0160035-0642-4000-8000-000000000042','Figura secundaria',null,'extant','Figura secundaria documentada exclusivamente para la composición procesional de 2026.',null)
on conflict ("entity_id") do update set
"image_type"=excluded."image_type","execution_date_text"=excluded."execution_date_text","current_condition"=excluded."current_condition",
"description"=excluded."description","notes"=excluded."notes";

-- 175–203 · Titularidades
insert into public.brotherhood_images ("id","brotherhood_entity_id","image_entity_id","relation_type","status") values
('c0160035-0801-4000-8000-000000000001','c0160035-0301-4000-8000-000000000001','c0160035-0601-4000-8000-000000000001','titular','published'),
('c0160035-0802-4000-8000-000000000002','c0160035-0302-4000-8000-000000000002','c0160035-0602-4000-8000-000000000002','titular','published'),
('c0160035-0803-4000-8000-000000000003','c0160035-0302-4000-8000-000000000002','c0160035-0603-4000-8000-000000000003','titular','published'),
('c0160035-0804-4000-8000-000000000004','c0160035-0302-4000-8000-000000000002','c0160035-0604-4000-8000-000000000004','titular','published'),
('c0160035-0805-4000-8000-000000000005','c0160035-0302-4000-8000-000000000002','c0160035-0605-4000-8000-000000000005','titular','published'),
('c0160035-0806-4000-8000-000000000006','c0160035-0303-4000-8000-000000000003','c0160035-0606-4000-8000-000000000006','titular','published'),
('c0160035-0807-4000-8000-000000000007','c0160035-0303-4000-8000-000000000003','c0160035-0607-4000-8000-000000000007','titular','published'),
('c0160035-0808-4000-8000-000000000008','c0160035-0303-4000-8000-000000000003','c0160035-0608-4000-8000-000000000008','titular','published'),
('c0160035-0809-4000-8000-000000000009','c0160035-0304-4000-8000-000000000004','c0160035-0609-4000-8000-000000000009','titular','published'),
('c0160035-0810-4000-8000-000000000010','c0160035-0304-4000-8000-000000000004','c0160035-0610-4000-8000-000000000010','titular','published'),
('c0160035-0811-4000-8000-000000000011','c0160035-0304-4000-8000-000000000004','c0160035-0611-4000-8000-000000000011','titular','published'),
('c0160035-0812-4000-8000-000000000012','c0160035-0304-4000-8000-000000000004','c0160035-0612-4000-8000-000000000012','titular','published'),
('c0160035-0813-4000-8000-000000000013','c0160035-0304-4000-8000-000000000004','c0160035-0613-4000-8000-000000000013','titular','published'),
('c0160035-0814-4000-8000-000000000014','c0160035-0305-4000-8000-000000000005','c0160035-0614-4000-8000-000000000014','titular','published'),
('c0160035-0815-4000-8000-000000000015','c0160035-0305-4000-8000-000000000005','c0160035-0615-4000-8000-000000000015','titular','published'),
('c0160035-0816-4000-8000-000000000016','c0160035-0305-4000-8000-000000000005','c0160035-0616-4000-8000-000000000016','titular','published'),
('c0160035-0817-4000-8000-000000000017','c0160035-0305-4000-8000-000000000005','c0160035-0617-4000-8000-000000000017','titular','published'),
('c0160035-0818-4000-8000-000000000018','c0160035-0306-4000-8000-000000000006','c0160035-0618-4000-8000-000000000018','titular','published'),
('c0160035-0819-4000-8000-000000000019','c0160035-0306-4000-8000-000000000006','c0160035-0619-4000-8000-000000000019','titular','published'),
('c0160035-0820-4000-8000-000000000020','c0160035-0307-4000-8000-000000000007','c0160035-0620-4000-8000-000000000020','titular','published'),
('c0160035-0821-4000-8000-000000000021','c0160035-0307-4000-8000-000000000007','c0160035-0621-4000-8000-000000000021','titular','published'),
('c0160035-0822-4000-8000-000000000022','c0160035-0307-4000-8000-000000000007','c0160035-0622-4000-8000-000000000022','titular','published'),
('c0160035-0823-4000-8000-000000000023','c0160035-0308-4000-8000-000000000008','c0160035-0623-4000-8000-000000000023','titular','published'),
('c0160035-0824-4000-8000-000000000024','c0160035-0308-4000-8000-000000000008','c0160035-0624-4000-8000-000000000024','titular','published'),
('c0160035-0825-4000-8000-000000000025','c0160035-0308-4000-8000-000000000008','c0160035-0625-4000-8000-000000000025','titular','published'),
('c0160035-0826-4000-8000-000000000026','c0160035-0308-4000-8000-000000000008','c0160035-0626-4000-8000-000000000026','titular','published'),
('c0160035-0827-4000-8000-000000000027','c0160035-0309-4000-8000-000000000009','c0160035-0627-4000-8000-000000000027','titular','published'),
('c0160035-0828-4000-8000-000000000028','c0160035-0309-4000-8000-000000000009','c0160035-0628-4000-8000-000000000028','titular','published'),
('c0160035-0829-4000-8000-000000000029','c0160035-0309-4000-8000-000000000009','c0160035-0629-4000-8000-000000000029','titular','published')
on conflict ("id") do update set "brotherhood_entity_id"=excluded."brotherhood_entity_id","image_entity_id"=excluded."image_entity_id","relation_type"=excluded."relation_type","status"=excluded."status";

-- 204–212 · Sedes
insert into public.entity_locations ("id","entity_id","place_id","municipality_id","location_type","is_current","notes","status") values
('c0160035-0831-4000-8000-000000000001','c0160035-0301-4000-8000-000000000001','c0160035-0201-4000-8000-000000000001','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','physical_location',true,'Sede canónica actual documentada en el inventario Carmona HC-016.','published'),
('c0160035-0832-4000-8000-000000000002','c0160035-0302-4000-8000-000000000002','c0160035-0201-4000-8000-000000000001','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','physical_location',true,'Sede canónica actual documentada en el inventario Carmona HC-016.','published'),
('c0160035-0833-4000-8000-000000000003','c0160035-0303-4000-8000-000000000003','c0160035-0202-4000-8000-000000000002','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','physical_location',true,'Sede canónica actual documentada en el inventario Carmona HC-016.','published'),
('c0160035-0834-4000-8000-000000000004','c0160035-0304-4000-8000-000000000004','c0160035-0203-4000-8000-000000000003','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','physical_location',true,'Sede canónica actual documentada en el inventario Carmona HC-016.','published'),
('c0160035-0835-4000-8000-000000000005','c0160035-0305-4000-8000-000000000005','c0160035-0204-4000-8000-000000000004','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','physical_location',true,'Sede canónica actual documentada en el inventario Carmona HC-016.','published'),
('c0160035-0836-4000-8000-000000000006','c0160035-0306-4000-8000-000000000006','c0160035-0205-4000-8000-000000000005','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','physical_location',true,'Sede canónica actual documentada en el inventario Carmona HC-016.','published'),
('c0160035-0837-4000-8000-000000000007','c0160035-0307-4000-8000-000000000007','c0160035-0206-4000-8000-000000000006','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','physical_location',true,'Sede canónica actual documentada en el inventario Carmona HC-016.','published'),
('c0160035-0838-4000-8000-000000000008','c0160035-0308-4000-8000-000000000008','c0160035-0207-4000-8000-000000000007','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','physical_location',true,'Sede canónica actual documentada en el inventario Carmona HC-016.','published'),
('c0160035-0839-4000-8000-000000000009','c0160035-0309-4000-8000-000000000009','c0160035-0206-4000-8000-000000000006','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','physical_location',true,'Sede canónica actual documentada en el inventario Carmona HC-016.','published')
on conflict ("id") do update set "entity_id"=excluded."entity_id","place_id"=excluded."place_id","municipality_id"=excluded."municipality_id","location_type"=excluded."location_type","is_current"=excluded."is_current","notes"=excluded."notes","status"=excluded."status";

-- 213–230 · Pasos
insert into public.steps ("entity_id","step_type","current_condition","description","notes") values
('c0160035-0701-4000-8000-000000000001','Paso procesional','preserved','Paso procesional documentado para la Semana Santa de Carmona 2026.','Primera edición HC-016; no se incorporan fotografías sin licencia verificada.'),
('c0160035-0702-4000-8000-000000000002','Paso procesional','preserved','Paso procesional documentado para la Semana Santa de Carmona 2026.','Primera edición HC-016; no se incorporan fotografías sin licencia verificada.'),
('c0160035-0703-4000-8000-000000000003','Paso procesional','preserved','Paso procesional documentado para la Semana Santa de Carmona 2026.','Primera edición HC-016; no se incorporan fotografías sin licencia verificada.'),
('c0160035-0704-4000-8000-000000000004','Paso procesional','preserved','Paso procesional documentado para la Semana Santa de Carmona 2026.','Primera edición HC-016; no se incorporan fotografías sin licencia verificada.'),
('c0160035-0705-4000-8000-000000000005','Paso procesional','preserved','Paso procesional documentado para la Semana Santa de Carmona 2026.','Primera edición HC-016; no se incorporan fotografías sin licencia verificada.'),
('c0160035-0706-4000-8000-000000000006','Paso procesional','preserved','Paso procesional documentado para la Semana Santa de Carmona 2026.','Primera edición HC-016; no se incorporan fotografías sin licencia verificada.'),
('c0160035-0707-4000-8000-000000000007','Paso procesional','preserved','Paso procesional documentado para la Semana Santa de Carmona 2026.','Primera edición HC-016; no se incorporan fotografías sin licencia verificada.'),
('c0160035-0708-4000-8000-000000000008','Paso procesional','preserved','Paso procesional documentado para la Semana Santa de Carmona 2026.','Primera edición HC-016; no se incorporan fotografías sin licencia verificada.'),
('c0160035-0709-4000-8000-000000000009','Paso procesional','preserved','Paso procesional documentado para la Semana Santa de Carmona 2026.','Primera edición HC-016; no se incorporan fotografías sin licencia verificada.'),
('c0160035-0710-4000-8000-000000000010','Paso procesional','preserved','Paso procesional documentado para la Semana Santa de Carmona 2026.','Primera edición HC-016; no se incorporan fotografías sin licencia verificada.'),
('c0160035-0711-4000-8000-000000000011','Paso procesional','preserved','Paso procesional documentado para la Semana Santa de Carmona 2026.','Primera edición HC-016; no se incorporan fotografías sin licencia verificada.'),
('c0160035-0712-4000-8000-000000000012','Paso procesional','preserved','Paso procesional documentado para la Semana Santa de Carmona 2026.','Primera edición HC-016; no se incorporan fotografías sin licencia verificada.'),
('c0160035-0713-4000-8000-000000000013','Paso procesional','preserved','Paso procesional documentado para la Semana Santa de Carmona 2026.','Primera edición HC-016; no se incorporan fotografías sin licencia verificada.'),
('c0160035-0714-4000-8000-000000000014','Paso procesional','preserved','Paso procesional documentado para la Semana Santa de Carmona 2026.','Primera edición HC-016; no se incorporan fotografías sin licencia verificada.'),
('c0160035-0715-4000-8000-000000000015','Paso procesional','preserved','Paso procesional documentado para la Semana Santa de Carmona 2026.','Primera edición HC-016; no se incorporan fotografías sin licencia verificada.'),
('c0160035-0716-4000-8000-000000000016','Paso procesional','preserved','Paso procesional documentado para la Semana Santa de Carmona 2026.','Primera edición HC-016; no se incorporan fotografías sin licencia verificada.'),
('c0160035-0717-4000-8000-000000000017','Paso procesional','preserved','Paso procesional documentado para la Semana Santa de Carmona 2026.','Primera edición HC-016; no se incorporan fotografías sin licencia verificada.'),
('c0160035-0718-4000-8000-000000000018','Paso procesional','preserved','Paso procesional documentado para la Semana Santa de Carmona 2026.','Primera edición HC-016; no se incorporan fotografías sin licencia verificada.')
on conflict ("entity_id") do update set "step_type"=excluded."step_type","current_condition"=excluded."current_condition","description"=excluded."description","notes"=excluded."notes";

-- 231–248 · Corporación ↔ Paso
insert into public.brotherhood_steps ("id","brotherhood_entity_id","step_entity_id","relation_type","status") values
('c0160035-0841-4000-8000-000000000001','c0160035-0301-4000-8000-000000000001','c0160035-0701-4000-8000-000000000001','processional_step','published'),
('c0160035-0842-4000-8000-000000000002','c0160035-0308-4000-8000-000000000008','c0160035-0702-4000-8000-000000000002','processional_step','published'),
('c0160035-0843-4000-8000-000000000003','c0160035-0302-4000-8000-000000000002','c0160035-0703-4000-8000-000000000003','processional_step','published'),
('c0160035-0844-4000-8000-000000000004','c0160035-0302-4000-8000-000000000002','c0160035-0704-4000-8000-000000000004','processional_step','published'),
('c0160035-0845-4000-8000-000000000005','c0160035-0303-4000-8000-000000000003','c0160035-0705-4000-8000-000000000005','processional_step','published'),
('c0160035-0846-4000-8000-000000000006','c0160035-0303-4000-8000-000000000003','c0160035-0706-4000-8000-000000000006','processional_step','published'),
('c0160035-0847-4000-8000-000000000007','c0160035-0304-4000-8000-000000000004','c0160035-0707-4000-8000-000000000007','processional_step','published'),
('c0160035-0848-4000-8000-000000000008','c0160035-0304-4000-8000-000000000004','c0160035-0708-4000-8000-000000000008','processional_step','published'),
('c0160035-0849-4000-8000-000000000009','c0160035-0305-4000-8000-000000000005','c0160035-0709-4000-8000-000000000009','processional_step','published'),
('c0160035-0850-4000-8000-000000000010','c0160035-0305-4000-8000-000000000005','c0160035-0710-4000-8000-000000000010','processional_step','published'),
('c0160035-0851-4000-8000-000000000011','c0160035-0306-4000-8000-000000000006','c0160035-0711-4000-8000-000000000011','processional_step','published'),
('c0160035-0852-4000-8000-000000000012','c0160035-0306-4000-8000-000000000006','c0160035-0712-4000-8000-000000000012','processional_step','published'),
('c0160035-0853-4000-8000-000000000013','c0160035-0307-4000-8000-000000000007','c0160035-0713-4000-8000-000000000013','processional_step','published'),
('c0160035-0854-4000-8000-000000000014','c0160035-0307-4000-8000-000000000007','c0160035-0714-4000-8000-000000000014','processional_step','published'),
('c0160035-0855-4000-8000-000000000015','c0160035-0302-4000-8000-000000000002','c0160035-0715-4000-8000-000000000015','processional_step','published'),
('c0160035-0856-4000-8000-000000000016','c0160035-0308-4000-8000-000000000008','c0160035-0716-4000-8000-000000000016','processional_step','published'),
('c0160035-0857-4000-8000-000000000017','c0160035-0308-4000-8000-000000000008','c0160035-0717-4000-8000-000000000017','processional_step','published'),
('c0160035-0858-4000-8000-000000000018','c0160035-0309-4000-8000-000000000009','c0160035-0718-4000-8000-000000000018','processional_step','published')
on conflict ("id") do update set "brotherhood_entity_id"=excluded."brotherhood_entity_id","step_entity_id"=excluded."step_entity_id","relation_type"=excluded."relation_type","status"=excluded."status";

-- 249–279 · Imagen ↔ Paso
insert into public.image_steps ("id","image_entity_id","step_entity_id","relation_type","status") values
('c0160035-0861-4000-8000-000000000001','c0160035-0601-4000-8000-000000000001','c0160035-0701-4000-8000-000000000001','processes_on','published'),
('c0160035-0862-4000-8000-000000000002','c0160035-0623-4000-8000-000000000023','c0160035-0702-4000-8000-000000000002','processes_on','published'),
('c0160035-0863-4000-8000-000000000003','c0160035-0602-4000-8000-000000000002','c0160035-0703-4000-8000-000000000003','processes_on','published'),
('c0160035-0864-4000-8000-000000000004','c0160035-0630-4000-8000-000000000030','c0160035-0703-4000-8000-000000000003','processes_on','published'),
('c0160035-0865-4000-8000-000000000005','c0160035-0631-4000-8000-000000000031','c0160035-0703-4000-8000-000000000003','processes_on','published'),
('c0160035-0866-4000-8000-000000000006','c0160035-0632-4000-8000-000000000032','c0160035-0703-4000-8000-000000000003','processes_on','published'),
('c0160035-0867-4000-8000-000000000007','c0160035-0633-4000-8000-000000000033','c0160035-0703-4000-8000-000000000003','processes_on','published'),
('c0160035-0868-4000-8000-000000000008','c0160035-0603-4000-8000-000000000003','c0160035-0704-4000-8000-000000000004','processes_on','published'),
('c0160035-0869-4000-8000-000000000009','c0160035-0606-4000-8000-000000000006','c0160035-0705-4000-8000-000000000005','processes_on','published'),
('c0160035-0870-4000-8000-000000000010','c0160035-0607-4000-8000-000000000007','c0160035-0706-4000-8000-000000000006','processes_on','published'),
('c0160035-0871-4000-8000-000000000011','c0160035-0609-4000-8000-000000000009','c0160035-0707-4000-8000-000000000007','processes_on','published'),
('c0160035-0872-4000-8000-000000000012','c0160035-0634-4000-8000-000000000034','c0160035-0707-4000-8000-000000000007','processes_on','published'),
('c0160035-0873-4000-8000-000000000013','c0160035-0635-4000-8000-000000000035','c0160035-0707-4000-8000-000000000007','processes_on','published'),
('c0160035-0874-4000-8000-000000000014','c0160035-0636-4000-8000-000000000036','c0160035-0707-4000-8000-000000000007','processes_on','published'),
('c0160035-0875-4000-8000-000000000015','c0160035-0610-4000-8000-000000000010','c0160035-0708-4000-8000-000000000008','processes_on','published'),
('c0160035-0876-4000-8000-000000000016','c0160035-0614-4000-8000-000000000014','c0160035-0709-4000-8000-000000000009','processes_on','published'),
('c0160035-0877-4000-8000-000000000017','c0160035-0637-4000-8000-000000000037','c0160035-0709-4000-8000-000000000009','processes_on','published'),
('c0160035-0878-4000-8000-000000000018','c0160035-0615-4000-8000-000000000015','c0160035-0710-4000-8000-000000000010','processes_on','published'),
('c0160035-0879-4000-8000-000000000019','c0160035-0618-4000-8000-000000000018','c0160035-0711-4000-8000-000000000011','processes_on','published'),
('c0160035-0880-4000-8000-000000000020','c0160035-0638-4000-8000-000000000038','c0160035-0711-4000-8000-000000000011','processes_on','published'),
('c0160035-0881-4000-8000-000000000021','c0160035-0639-4000-8000-000000000039','c0160035-0711-4000-8000-000000000011','processes_on','published'),
('c0160035-0882-4000-8000-000000000022','c0160035-0640-4000-8000-000000000040','c0160035-0711-4000-8000-000000000011','processes_on','published'),
('c0160035-0883-4000-8000-000000000023','c0160035-0619-4000-8000-000000000019','c0160035-0712-4000-8000-000000000012','processes_on','published'),
('c0160035-0884-4000-8000-000000000024','c0160035-0620-4000-8000-000000000020','c0160035-0713-4000-8000-000000000013','processes_on','published'),
('c0160035-0885-4000-8000-000000000025','c0160035-0621-4000-8000-000000000021','c0160035-0714-4000-8000-000000000014','processes_on','published'),
('c0160035-0886-4000-8000-000000000026','c0160035-0605-4000-8000-000000000005','c0160035-0715-4000-8000-000000000015','processes_on','published'),
('c0160035-0887-4000-8000-000000000027','c0160035-0624-4000-8000-000000000024','c0160035-0716-4000-8000-000000000016','processes_on','published'),
('c0160035-0888-4000-8000-000000000028','c0160035-0625-4000-8000-000000000025','c0160035-0717-4000-8000-000000000017','processes_on','published'),
('c0160035-0889-4000-8000-000000000029','c0160035-0627-4000-8000-000000000027','c0160035-0718-4000-8000-000000000018','processes_on','published'),
('c0160035-0890-4000-8000-000000000030','c0160035-0641-4000-8000-000000000041','c0160035-0718-4000-8000-000000000018','processes_on','published'),
('c0160035-0891-4000-8000-000000000031','c0160035-0642-4000-8000-000000000042','c0160035-0718-4000-8000-000000000018','processes_on','published')
on conflict ("id") do update set "image_entity_id"=excluded."image_entity_id","step_entity_id"=excluded."step_entity_id","relation_type"=excluded."relation_type","status"=excluded."status";

-- 280–290 · Series
insert into public.outing_series ("id","brotherhood_entity_id","outing_type","character","title","month","date_rule","municipality_id","origin_place_id","destination_place_id","route_summary","status","notes") values
('c0160035-0901-4000-8000-000000000001','c0160035-0301-4000-8000-000000000001','Estación de Penitencia','ordinary','Servitas de Carmona · Viernes de Dolores',3,'Viernes de Dolores','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','c0160035-0201-4000-8000-000000000001','c0160035-0201-4000-8000-000000000001',null,'published','Serie anual. Los horarios e itinerarios concretos de 2026 pertenecen a la ocurrencia histórica y no alimentan agenda futura.'),
('c0160035-0902-4000-8000-000000000002','c0160035-0308-4000-8000-000000000008','Estación de Penitencia','ordinary','La Borriquita de Carmona · Domingo de Ramos',3,'Domingo de Ramos','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','c0160035-0207-4000-8000-000000000007','c0160035-0207-4000-8000-000000000007',null,'published','Serie anual. Los horarios e itinerarios concretos de 2026 pertenecen a la ocurrencia histórica y no alimentan agenda futura.'),
('c0160035-0903-4000-8000-000000000003','c0160035-0302-4000-8000-000000000002','Estación de Penitencia','ordinary','Esperanza de Carmona · Domingo de Ramos',3,'Domingo de Ramos','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','c0160035-0201-4000-8000-000000000001','c0160035-0201-4000-8000-000000000001',null,'published','Serie anual. Los horarios e itinerarios concretos de 2026 pertenecen a la ocurrencia histórica y no alimentan agenda futura.'),
('c0160035-0904-4000-8000-000000000004','c0160035-0303-4000-8000-000000000003','Estación de Penitencia','ordinary','Amargura de Carmona · Lunes Santo',3,'Lunes Santo','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','c0160035-0202-4000-8000-000000000002','c0160035-0202-4000-8000-000000000002',null,'published','Serie anual. Los horarios e itinerarios concretos de 2026 pertenecen a la ocurrencia histórica y no alimentan agenda futura.'),
('c0160035-0905-4000-8000-000000000005','c0160035-0304-4000-8000-000000000004','Estación de Penitencia','ordinary','Expiración de Carmona · Martes Santo',3,'Martes Santo','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','c0160035-0203-4000-8000-000000000003','c0160035-0203-4000-8000-000000000003',null,'published','Serie anual. Los horarios e itinerarios concretos de 2026 pertenecen a la ocurrencia histórica y no alimentan agenda futura.'),
('c0160035-0906-4000-8000-000000000006','c0160035-0305-4000-8000-000000000005','Estación de Penitencia','ordinary','Quinta Angustia de Carmona · Miércoles Santo',4,'Miércoles Santo','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','c0160035-0204-4000-8000-000000000004','c0160035-0204-4000-8000-000000000004',null,'published','Serie anual. Los horarios e itinerarios concretos de 2026 pertenecen a la ocurrencia histórica y no alimentan agenda futura.'),
('c0160035-0907-4000-8000-000000000007','c0160035-0306-4000-8000-000000000006','Estación de Penitencia','ordinary','Santiago de Carmona · Jueves Santo',4,'Jueves Santo','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','c0160035-0205-4000-8000-000000000005','c0160035-0205-4000-8000-000000000005',null,'published','Serie anual. Los horarios e itinerarios concretos de 2026 pertenecen a la ocurrencia histórica y no alimentan agenda futura.'),
('c0160035-0908-4000-8000-000000000008','c0160035-0307-4000-8000-000000000007','Estación de Penitencia','ordinary','Nuestro Padre de Carmona · Viernes Santo',4,'Viernes Santo','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','c0160035-0206-4000-8000-000000000006','c0160035-0206-4000-8000-000000000006',null,'published','Serie anual. Los horarios e itinerarios concretos de 2026 pertenecen a la ocurrencia histórica y no alimentan agenda futura.'),
('c0160035-0909-4000-8000-000000000009','c0160035-0302-4000-8000-000000000002','Estación de Penitencia','ordinary','Cristo de los Desamparados de Carmona · Viernes Santo',4,'Viernes Santo','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','c0160035-0201-4000-8000-000000000001','c0160035-0201-4000-8000-000000000001',null,'published','Serie anual. Los horarios e itinerarios concretos de 2026 pertenecen a la ocurrencia histórica y no alimentan agenda futura.'),
('c0160035-0910-4000-8000-000000000010','c0160035-0308-4000-8000-000000000008','Estación de Penitencia','ordinary','Humildad de Carmona · Viernes Santo',4,'Viernes Santo','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','c0160035-0207-4000-8000-000000000007','c0160035-0207-4000-8000-000000000007',null,'published','Serie anual. Los horarios e itinerarios concretos de 2026 pertenecen a la ocurrencia histórica y no alimentan agenda futura.'),
('c0160035-0911-4000-8000-000000000011','c0160035-0309-4000-8000-000000000009','Estación de Penitencia','ordinary','Santo Entierro de Carmona · Sábado Santo',4,'Sábado Santo','bf024af2-3eda-4989-b1b5-0a723dcf9cb4','c0160035-0206-4000-8000-000000000006','c0160035-0206-4000-8000-000000000006',null,'published','Serie anual. Los horarios e itinerarios concretos de 2026 pertenecen a la ocurrencia histórica y no alimentan agenda futura.')
on conflict ("id") do update set
"brotherhood_entity_id"=excluded."brotherhood_entity_id","outing_type"=excluded."outing_type","character"=excluded."character",
"title"=excluded."title","month"=excluded."month","date_rule"=excluded."date_rule","municipality_id"=excluded."municipality_id",
"origin_place_id"=excluded."origin_place_id","destination_place_id"=excluded."destination_place_id","route_summary"=excluded."route_summary",
"status"=excluded."status","notes"=excluded."notes";

-- 291–302 · Salidas (11 UPSERT + 1 UPDATE/REUSE)
insert into public.outings ("id","brotherhood_entity_id","outing_type","character","title","outing_date","year","municipality_id","origin_place_id","destination_place_id","description","event_status","status","outing_series_id","slug","origin_text","destination_text") values
('c0160035-0921-4000-8000-000000000001','c0160035-0301-4000-8000-000000000001','Estación de Penitencia','ordinary','Servitas de Carmona · Viernes de Dolores 2026','2026-03-27'::date,2026,'bf024af2-3eda-4989-b1b5-0a723dcf9cb4','c0160035-0201-4000-8000-000000000001','c0160035-0201-4000-8000-000000000001','Registro histórico de la Semana Santa 2026; celebración acreditada con evidencia posterior.','held','published','c0160035-0901-4000-8000-000000000001','carmona-semana-santa-2026-servitas','Real Iglesia del Divino Salvador','Real Iglesia del Divino Salvador'),
('c0160035-0922-4000-8000-000000000002','c0160035-0308-4000-8000-000000000008','Estación de Penitencia','ordinary','La Borriquita de Carmona · Domingo de Ramos 2026','2026-03-29'::date,2026,'bf024af2-3eda-4989-b1b5-0a723dcf9cb4','c0160035-0207-4000-8000-000000000007','c0160035-0207-4000-8000-000000000007','Registro histórico de la Semana Santa 2026; celebración acreditada con evidencia posterior.','held','published','c0160035-0902-4000-8000-000000000002','carmona-semana-santa-2026-borriquita','Iglesia de San Pedro','Iglesia de San Pedro'),
('c0160035-0923-4000-8000-000000000003','c0160035-0302-4000-8000-000000000002','Estación de Penitencia','ordinary','Esperanza de Carmona · Domingo de Ramos 2026','2026-03-29'::date,2026,'bf024af2-3eda-4989-b1b5-0a723dcf9cb4','c0160035-0201-4000-8000-000000000001','c0160035-0201-4000-8000-000000000001','Registro histórico de la Semana Santa 2026; celebración acreditada con evidencia posterior.','held','published','c0160035-0903-4000-8000-000000000003','carmona-semana-santa-2026-esperanza','Real Iglesia del Divino Salvador','Real Iglesia del Divino Salvador'),
('c0160035-0924-4000-8000-000000000004','c0160035-0303-4000-8000-000000000003','Estación de Penitencia','ordinary','Amargura de Carmona · Lunes Santo 2026','2026-03-30'::date,2026,'bf024af2-3eda-4989-b1b5-0a723dcf9cb4','c0160035-0202-4000-8000-000000000002','c0160035-0202-4000-8000-000000000002','Registro histórico de la Semana Santa 2026; celebración acreditada con evidencia posterior.','held','published','c0160035-0904-4000-8000-000000000004','carmona-semana-santa-2026-amargura','Iglesia de San Felipe','Iglesia de San Felipe'),
('c0160035-0925-4000-8000-000000000005','c0160035-0304-4000-8000-000000000004','Estación de Penitencia','ordinary','Expiración de Carmona · Martes Santo 2026','2026-03-31'::date,2026,'bf024af2-3eda-4989-b1b5-0a723dcf9cb4','c0160035-0203-4000-8000-000000000003','c0160035-0203-4000-8000-000000000003','Registro histórico de la Semana Santa 2026; celebración acreditada con evidencia posterior.','held','published','c0160035-0905-4000-8000-000000000005','carmona-semana-santa-2026-expiracion','Iglesia de San Blas','Iglesia de San Blas'),
('c0160035-0926-4000-8000-000000000006','c0160035-0305-4000-8000-000000000005','Estación de Penitencia','ordinary','Quinta Angustia de Carmona · Miércoles Santo 2026','2026-04-01'::date,2026,'bf024af2-3eda-4989-b1b5-0a723dcf9cb4','c0160035-0204-4000-8000-000000000004','c0160035-0204-4000-8000-000000000004','Registro histórico de la Semana Santa 2026; celebración acreditada con evidencia posterior.','held','published','c0160035-0906-4000-8000-000000000006','carmona-semana-santa-2026-quinta-angustia','Capilla de San Francisco','Capilla de San Francisco'),
('c0160035-0927-4000-8000-000000000007','c0160035-0306-4000-8000-000000000006','Estación de Penitencia','ordinary','Santiago de Carmona · Jueves Santo 2026','2026-04-02'::date,2026,'bf024af2-3eda-4989-b1b5-0a723dcf9cb4','c0160035-0205-4000-8000-000000000005','c0160035-0205-4000-8000-000000000005','Registro histórico de la Semana Santa 2026; celebración acreditada con evidencia posterior.','held','published','c0160035-0907-4000-8000-000000000007','carmona-semana-santa-2026-santiago','Iglesia de Santiago','Iglesia de Santiago'),
('c0160035-0928-4000-8000-000000000008','c0160035-0307-4000-8000-000000000007','Estación de Penitencia','ordinary','Nuestro Padre de Carmona · Viernes Santo 2026','2026-04-03'::date,2026,'bf024af2-3eda-4989-b1b5-0a723dcf9cb4','c0160035-0206-4000-8000-000000000006','c0160035-0206-4000-8000-000000000006','Registro histórico de la Semana Santa 2026; celebración acreditada con evidencia posterior.','held','published','c0160035-0908-4000-8000-000000000008','carmona-semana-santa-2026-nuestro-padre','Iglesia de San Bartolomé','Iglesia de San Bartolomé'),
('c0160035-0929-4000-8000-000000000009','c0160035-0302-4000-8000-000000000002','Estación de Penitencia','ordinary','Cristo de los Desamparados de Carmona · Viernes Santo 2026','2026-04-03'::date,2026,'bf024af2-3eda-4989-b1b5-0a723dcf9cb4','c0160035-0201-4000-8000-000000000001','c0160035-0201-4000-8000-000000000001','Registro histórico de la Semana Santa 2026; celebración acreditada con evidencia posterior.','held','published','c0160035-0909-4000-8000-000000000009','carmona-semana-santa-2026-desamparados','Real Iglesia del Divino Salvador','Real Iglesia del Divino Salvador'),
('c0160035-0930-4000-8000-000000000010','c0160035-0308-4000-8000-000000000008','Estación de Penitencia','ordinary','Humildad de Carmona · Viernes Santo 2026','2026-04-03'::date,2026,'bf024af2-3eda-4989-b1b5-0a723dcf9cb4','c0160035-0207-4000-8000-000000000007','c0160035-0207-4000-8000-000000000007','Registro histórico de la Semana Santa 2026; celebración acreditada con evidencia posterior.','held','published','c0160035-0910-4000-8000-000000000010','carmona-semana-santa-2026-humildad','Iglesia de San Pedro','Iglesia de San Pedro'),
('c0160035-0931-4000-8000-000000000011','c0160035-0309-4000-8000-000000000009','Estación de Penitencia','ordinary','Santo Entierro de Carmona · Sábado Santo 2026','2026-04-04'::date,2026,'bf024af2-3eda-4989-b1b5-0a723dcf9cb4','c0160035-0206-4000-8000-000000000006','c0160035-0206-4000-8000-000000000006','Registro histórico de la Semana Santa 2026; celebración acreditada con evidencia posterior.','held','published','c0160035-0911-4000-8000-000000000011','carmona-semana-santa-2026-santo-entierro','Iglesia de San Bartolomé','Iglesia de San Bartolomé')
on conflict ("id") do update set
"brotherhood_entity_id"=excluded."brotherhood_entity_id","outing_type"=excluded."outing_type","character"=excluded."character",
"title"=excluded."title","outing_date"=excluded."outing_date","year"=excluded."year","municipality_id"=excluded."municipality_id",
"origin_place_id"=excluded."origin_place_id","destination_place_id"=excluded."destination_place_id","description"=excluded."description",
"event_status"=excluded."event_status","status"=excluded."status","outing_series_id"=excluded."outing_series_id","slug"=excluded."slug",
"origin_text"=excluded."origin_text","destination_text"=excluded."destination_text";

update public.outings
set brotherhood_entity_id='c0160035-0301-4000-8000-000000000001',
    origin_place_id='c0160035-0201-4000-8000-000000000001',
    event_status='held',
    status='published',
    organizer_name='Orden Seglar Servita Carmona'
where id='ea6ab0d1-e6c4-4ea1-8727-92cee4ce3218'
  and slug='carmona-servitas-dolores-santo-escapulario-2026-09-19';

-- 303–352 · Participación efectiva
insert into public.outing_entities ("id","outing_id","entity_id","role","notes") values
('c0160035-0941-4000-8000-000000000001','c0160035-0921-4000-8000-000000000001','c0160035-0601-4000-8000-000000000001','processional_image','Participación documentada para la edición 2026.'),
('c0160035-0942-4000-8000-000000000002','c0160035-0921-4000-8000-000000000001','c0160035-0701-4000-8000-000000000001','processional_step','Participación documentada para la edición 2026.'),
('c0160035-0943-4000-8000-000000000003','c0160035-0922-4000-8000-000000000002','c0160035-0623-4000-8000-000000000023','processional_image','Participación documentada para la edición 2026.'),
('c0160035-0944-4000-8000-000000000004','c0160035-0922-4000-8000-000000000002','c0160035-0702-4000-8000-000000000002','processional_step','Participación documentada para la edición 2026.'),
('c0160035-0945-4000-8000-000000000005','c0160035-0923-4000-8000-000000000003','c0160035-0602-4000-8000-000000000002','processional_image','Participación documentada para la edición 2026.'),
('c0160035-0946-4000-8000-000000000006','c0160035-0923-4000-8000-000000000003','c0160035-0630-4000-8000-000000000030','processional_image','Participación documentada para la edición 2026.'),
('c0160035-0947-4000-8000-000000000007','c0160035-0923-4000-8000-000000000003','c0160035-0631-4000-8000-000000000031','processional_image','Participación documentada para la edición 2026.'),
('c0160035-0948-4000-8000-000000000008','c0160035-0923-4000-8000-000000000003','c0160035-0632-4000-8000-000000000032','processional_image','Participación documentada para la edición 2026.'),
('c0160035-0949-4000-8000-000000000009','c0160035-0923-4000-8000-000000000003','c0160035-0633-4000-8000-000000000033','processional_image','Participación documentada para la edición 2026.'),
('c0160035-0950-4000-8000-000000000010','c0160035-0923-4000-8000-000000000003','c0160035-0703-4000-8000-000000000003','processional_step','Participación documentada para la edición 2026.'),
('c0160035-0951-4000-8000-000000000011','c0160035-0923-4000-8000-000000000003','c0160035-0603-4000-8000-000000000003','processional_image','Participación documentada para la edición 2026.'),
('c0160035-0952-4000-8000-000000000012','c0160035-0923-4000-8000-000000000003','c0160035-0704-4000-8000-000000000004','processional_step','Participación documentada para la edición 2026.'),
('c0160035-0953-4000-8000-000000000013','c0160035-0924-4000-8000-000000000004','c0160035-0606-4000-8000-000000000006','processional_image','Participación documentada para la edición 2026.'),
('c0160035-0954-4000-8000-000000000014','c0160035-0924-4000-8000-000000000004','c0160035-0705-4000-8000-000000000005','processional_step','Participación documentada para la edición 2026.'),
('c0160035-0955-4000-8000-000000000015','c0160035-0924-4000-8000-000000000004','c0160035-0607-4000-8000-000000000007','processional_image','Participación documentada para la edición 2026.'),
('c0160035-0956-4000-8000-000000000016','c0160035-0924-4000-8000-000000000004','c0160035-0706-4000-8000-000000000006','processional_step','Participación documentada para la edición 2026.'),
('c0160035-0957-4000-8000-000000000017','c0160035-0925-4000-8000-000000000005','c0160035-0609-4000-8000-000000000009','processional_image','Participación documentada para la edición 2026.'),
('c0160035-0958-4000-8000-000000000018','c0160035-0925-4000-8000-000000000005','c0160035-0634-4000-8000-000000000034','processional_image','Participación documentada para la edición 2026.'),
('c0160035-0959-4000-8000-000000000019','c0160035-0925-4000-8000-000000000005','c0160035-0635-4000-8000-000000000035','processional_image','Participación documentada para la edición 2026.'),
('c0160035-0960-4000-8000-000000000020','c0160035-0925-4000-8000-000000000005','c0160035-0636-4000-8000-000000000036','processional_image','Participación documentada para la edición 2026.'),
('c0160035-0961-4000-8000-000000000021','c0160035-0925-4000-8000-000000000005','c0160035-0707-4000-8000-000000000007','processional_step','Participación documentada para la edición 2026.'),
('c0160035-0962-4000-8000-000000000022','c0160035-0925-4000-8000-000000000005','c0160035-0610-4000-8000-000000000010','processional_image','Participación documentada para la edición 2026.'),
('c0160035-0963-4000-8000-000000000023','c0160035-0925-4000-8000-000000000005','c0160035-0708-4000-8000-000000000008','processional_step','Participación documentada para la edición 2026.'),
('c0160035-0964-4000-8000-000000000024','c0160035-0926-4000-8000-000000000006','c0160035-0614-4000-8000-000000000014','processional_image','Participación documentada para la edición 2026.'),
('c0160035-0965-4000-8000-000000000025','c0160035-0926-4000-8000-000000000006','c0160035-0637-4000-8000-000000000037','processional_image','Participación documentada para la edición 2026.'),
('c0160035-0966-4000-8000-000000000026','c0160035-0926-4000-8000-000000000006','c0160035-0709-4000-8000-000000000009','processional_step','Participación documentada para la edición 2026.'),
('c0160035-0967-4000-8000-000000000027','c0160035-0926-4000-8000-000000000006','c0160035-0615-4000-8000-000000000015','processional_image','Participación documentada para la edición 2026.'),
('c0160035-0968-4000-8000-000000000028','c0160035-0926-4000-8000-000000000006','c0160035-0710-4000-8000-000000000010','processional_step','Participación documentada para la edición 2026.'),
('c0160035-0969-4000-8000-000000000029','c0160035-0927-4000-8000-000000000007','c0160035-0618-4000-8000-000000000018','processional_image','Participación documentada para la edición 2026.'),
('c0160035-0970-4000-8000-000000000030','c0160035-0927-4000-8000-000000000007','c0160035-0638-4000-8000-000000000038','processional_image','Participación documentada para la edición 2026.'),
('c0160035-0971-4000-8000-000000000031','c0160035-0927-4000-8000-000000000007','c0160035-0639-4000-8000-000000000039','processional_image','Participación documentada para la edición 2026.'),
('c0160035-0972-4000-8000-000000000032','c0160035-0927-4000-8000-000000000007','c0160035-0640-4000-8000-000000000040','processional_image','Participación documentada para la edición 2026.'),
('c0160035-0973-4000-8000-000000000033','c0160035-0927-4000-8000-000000000007','c0160035-0711-4000-8000-000000000011','processional_step','Participación documentada para la edición 2026.'),
('c0160035-0974-4000-8000-000000000034','c0160035-0927-4000-8000-000000000007','c0160035-0619-4000-8000-000000000019','processional_image','Participación documentada para la edición 2026.'),
('c0160035-0975-4000-8000-000000000035','c0160035-0927-4000-8000-000000000007','c0160035-0712-4000-8000-000000000012','processional_step','Participación documentada para la edición 2026.'),
('c0160035-0976-4000-8000-000000000036','c0160035-0928-4000-8000-000000000008','c0160035-0620-4000-8000-000000000020','processional_image','Participación documentada para la edición 2026.'),
('c0160035-0977-4000-8000-000000000037','c0160035-0928-4000-8000-000000000008','c0160035-0713-4000-8000-000000000013','processional_step','Participación documentada para la edición 2026.'),
('c0160035-0978-4000-8000-000000000038','c0160035-0928-4000-8000-000000000008','c0160035-0621-4000-8000-000000000021','processional_image','Participación documentada para la edición 2026.'),
('c0160035-0979-4000-8000-000000000039','c0160035-0928-4000-8000-000000000008','c0160035-0714-4000-8000-000000000014','processional_step','Participación documentada para la edición 2026.'),
('c0160035-0980-4000-8000-000000000040','c0160035-0929-4000-8000-000000000009','c0160035-0605-4000-8000-000000000005','processional_image','Participación documentada para la edición 2026.'),
('c0160035-0981-4000-8000-000000000041','c0160035-0929-4000-8000-000000000009','c0160035-0715-4000-8000-000000000015','processional_step','Participación documentada para la edición 2026.'),
('c0160035-0982-4000-8000-000000000042','c0160035-0930-4000-8000-000000000010','c0160035-0624-4000-8000-000000000024','processional_image','Participación documentada para la edición 2026.'),
('c0160035-0983-4000-8000-000000000043','c0160035-0930-4000-8000-000000000010','c0160035-0716-4000-8000-000000000016','processional_step','Participación documentada para la edición 2026.'),
('c0160035-0984-4000-8000-000000000044','c0160035-0930-4000-8000-000000000010','c0160035-0625-4000-8000-000000000025','processional_image','Participación documentada para la edición 2026.'),
('c0160035-0985-4000-8000-000000000045','c0160035-0930-4000-8000-000000000010','c0160035-0717-4000-8000-000000000017','processional_step','Participación documentada para la edición 2026.'),
('c0160035-0986-4000-8000-000000000046','c0160035-0931-4000-8000-000000000011','c0160035-0627-4000-8000-000000000027','processional_image','Participación documentada para la edición 2026.'),
('c0160035-0987-4000-8000-000000000047','c0160035-0931-4000-8000-000000000011','c0160035-0641-4000-8000-000000000041','processional_image','Participación documentada para la edición 2026.'),
('c0160035-0988-4000-8000-000000000048','c0160035-0931-4000-8000-000000000011','c0160035-0642-4000-8000-000000000042','processional_image','Participación documentada para la edición 2026.'),
('c0160035-0989-4000-8000-000000000049','c0160035-0931-4000-8000-000000000011','c0160035-0718-4000-8000-000000000018','processional_step','Participación documentada para la edición 2026.'),
('c0160035-0990-4000-8000-000000000050','ea6ab0d1-e6c4-4ea1-8727-92cee4ce3218','c0160035-0601-4000-8000-000000000001','processional_image','Participación documentada para la edición 2026.')
on conflict ("id") do update set "outing_id"=excluded."outing_id","entity_id"=excluded."entity_id","role"=excluded."role","notes"=excluded."notes";

-- 353–370 · Posiciones musicales
insert into public.outing_music_positions ("id","outing_id","step_entity_id","position_code","position_label","sequence_no","notes","status") values
('c0160035-1001-4000-8000-000000000001','c0160035-0921-4000-8000-000000000001','c0160035-0701-4000-8000-000000000001','palio','Tras el palio de María Santísima de los Dolores',1,'Acompañamiento documentado para la edición 2026.','published'),
('c0160035-1002-4000-8000-000000000002','c0160035-0922-4000-8000-000000000002','c0160035-0702-4000-8000-000000000002','mystery','Tras el paso de la Sagrada Entrada en Jerusalén',1,'Acompañamiento documentado para la edición 2026.','published'),
('c0160035-1003-4000-8000-000000000003','c0160035-0923-4000-8000-000000000003','c0160035-0703-4000-8000-000000000003','mystery','Tras el misterio de la Coronación de Espinas',1,'Acompañamiento documentado para la edición 2026.','published'),
('c0160035-1004-4000-8000-000000000004','c0160035-0923-4000-8000-000000000003','c0160035-0704-4000-8000-000000000004','palio','Tras el palio de María Santísima de la Esperanza',2,'Acompañamiento documentado para la edición 2026.','published'),
('c0160035-1005-4000-8000-000000000005','c0160035-0924-4000-8000-000000000004','c0160035-0705-4000-8000-000000000005','mystery','Tras el paso del Señor de la Amargura',1,'Acompañamiento documentado para la edición 2026.','published'),
('c0160035-1006-4000-8000-000000000006','c0160035-0924-4000-8000-000000000004','c0160035-0706-4000-8000-000000000006','palio','Tras el palio de María Santísima del Mayor Dolor',2,'Acompañamiento documentado para la edición 2026.','published'),
('c0160035-1007-4000-8000-000000000007','c0160035-0925-4000-8000-000000000005','c0160035-0707-4000-8000-000000000007','mystery','Tras el misterio de la Expiración',1,'Acompañamiento documentado para la edición 2026.','published'),
('c0160035-1008-4000-8000-000000000008','c0160035-0925-4000-8000-000000000005','c0160035-0708-4000-8000-000000000008','palio','Tras el palio de María Santísima de los Dolores',2,'Acompañamiento documentado para la edición 2026.','published'),
('c0160035-1009-4000-8000-000000000009','c0160035-0926-4000-8000-000000000006','c0160035-0709-4000-8000-000000000009','mystery','Tras el misterio del Sagrado Descendimiento',1,'Acompañamiento documentado para la edición 2026.','published'),
('c0160035-1010-4000-8000-000000000010','c0160035-0926-4000-8000-000000000006','c0160035-0710-4000-8000-000000000010','palio','Tras el palio de Nuestra Señora y Madre de las Angustias',2,'Acompañamiento documentado para la edición 2026.','published'),
('c0160035-1011-4000-8000-000000000011','c0160035-0927-4000-8000-000000000007','c0160035-0711-4000-8000-000000000011','mystery','Tras el misterio de la Columna',1,'Acompañamiento documentado para la edición 2026.','published'),
('c0160035-1012-4000-8000-000000000012','c0160035-0927-4000-8000-000000000007','c0160035-0712-4000-8000-000000000012','palio','Tras el palio de María Santísima de la Paciencia',2,'Acompañamiento documentado para la edición 2026.','published'),
('c0160035-1013-4000-8000-000000000013','c0160035-0928-4000-8000-000000000008','c0160035-0713-4000-8000-000000000013','mystery','Tras el paso de Nuestro Padre Jesús Nazareno',1,'Acompañamiento documentado para la edición 2026.','published'),
('c0160035-1014-4000-8000-000000000014','c0160035-0928-4000-8000-000000000008','c0160035-0714-4000-8000-000000000014','palio','Tras el palio de María Santísima de los Dolores',2,'Acompañamiento documentado para la edición 2026.','published'),
('c0160035-1015-4000-8000-000000000015','c0160035-0929-4000-8000-000000000009','c0160035-0715-4000-8000-000000000015','other','Sin acompañamiento musical',1,'Ausencia de acompañamiento musical acreditada; no representa deuda editorial.','published'),
('c0160035-1016-4000-8000-000000000016','c0160035-0930-4000-8000-000000000010','c0160035-0716-4000-8000-000000000016','mystery','Tras el misterio de Nuestro Padre Jesús de la Humildad y Paciencia',1,'Acompañamiento documentado para la edición 2026.','published'),
('c0160035-1017-4000-8000-000000000017','c0160035-0930-4000-8000-000000000010','c0160035-0717-4000-8000-000000000017','palio','Tras el palio de María Santísima de los Dolores',2,'Acompañamiento documentado para la edición 2026.','published'),
('c0160035-1018-4000-8000-000000000018','c0160035-0931-4000-8000-000000000011','c0160035-0718-4000-8000-000000000018','mystery','Tras el misterio del Santo Entierro',1,'Acompañamiento documentado para la edición 2026.','published')
on conflict ("id") do update set
"outing_id"=excluded."outing_id","step_entity_id"=excluded."step_entity_id","position_code"=excluded."position_code",
"position_label"=excluded."position_label","sequence_no"=excluded."sequence_no","notes"=excluded."notes","status"=excluded."status";

-- 371–387 · Asignaciones musicales
insert into public.outing_music_assignments ("id","music_position_id","band_entity_id","band_name_text","participation_mode","sequence_no","notes","status") values
('c0160035-1021-4000-8000-000000000001','c0160035-1001-4000-8000-000000000001','d6852052-92bb-4b54-b551-e52b656dea6d','Banda Municipal de Música de Mairena del Alcor','segment',1,'Acompañamiento documentado para 2026; no presupone continuidad posterior.','published'),
('c0160035-1022-4000-8000-000000000002','c0160035-1002-4000-8000-000000000002','c0160032-0402-4000-8000-000000000002','Agrupación Musical Paz y Caridad de Estepa','full_route',1,'Acompañamiento documentado para 2026; no presupone continuidad posterior.','published'),
('c0160035-1023-4000-8000-000000000003','c0160035-1003-4000-8000-000000000003','4e4d493c-5273-44aa-8066-72dd1faa1ed8','Agrupación Musical Nuestra Señora de Valme de Dos Hermanas','full_route',1,'Acompañamiento documentado para 2026; no presupone continuidad posterior.','published'),
('c0160035-1024-4000-8000-000000000004','c0160035-1004-4000-8000-000000000004','c0160035-0401-4000-8000-000000000001','Banda de Música Nuestra Señora de Guaditoca','full_route',1,'Acompañamiento documentado para 2026; no presupone continuidad posterior.','published'),
('c0160035-1025-4000-8000-000000000005','c0160035-1005-4000-8000-000000000005','97f62582-42f5-4d5f-80e0-376398af98e8','Banda de Cornetas y Tambores Santísimo Cristo de la Victoria de León','full_route',1,'Acompañamiento documentado para 2026; no presupone continuidad posterior.','published'),
('c0160035-1026-4000-8000-000000000006','c0160035-1006-4000-8000-000000000006','c0160035-0402-4000-8000-000000000002','Banda Municipal de Música de Aznalcóllar','full_route',1,'Acompañamiento documentado para 2026; no presupone continuidad posterior.','published'),
('c0160035-1027-4000-8000-000000000007','c0160035-1007-4000-8000-000000000007','c0160035-0403-4000-8000-000000000003','Banda de Cornetas y Tambores Nuestro Padre Jesús Rescatado de La Solana','full_route',1,'Acompañamiento documentado para 2026; no presupone continuidad posterior.','published'),
('c0160035-1028-4000-8000-000000000008','c0160035-1008-4000-8000-000000000008','d6852052-92bb-4b54-b551-e52b656dea6d','Banda Municipal de Música de Mairena del Alcor','full_route',1,'Acompañamiento documentado para 2026; no presupone continuidad posterior.','published'),
('c0160035-1029-4000-8000-000000000009','c0160035-1009-4000-8000-000000000009',null,'Música de capilla','full_route',1,'Acompañamiento documentado para 2026; no presupone continuidad posterior.','published'),
('c0160035-1030-4000-8000-000000000010','c0160035-1010-4000-8000-000000000010','c0160035-0404-4000-8000-000000000004','Banda de Música El Arrabal de Carmona','full_route',1,'Acompañamiento documentado para 2026; no presupone continuidad posterior.','published'),
('c0160035-1031-4000-8000-000000000011','c0160035-1011-4000-8000-000000000011','c0160035-0405-4000-8000-000000000005','Banda de Cornetas y Tambores Nuestra Señora de Gracia de Carmona','full_route',1,'Acompañamiento documentado para 2026; no presupone continuidad posterior.','published'),
('c0160035-1032-4000-8000-000000000012','c0160035-1012-4000-8000-000000000012','c0160035-0404-4000-8000-000000000004','Banda de Música El Arrabal de Carmona','full_route',1,'Acompañamiento documentado para 2026; no presupone continuidad posterior.','published'),
('c0160035-1033-4000-8000-000000000013','c0160035-1013-4000-8000-000000000013',null,'Música de capilla','full_route',1,'Acompañamiento documentado para 2026; no presupone continuidad posterior.','published'),
('c0160035-1034-4000-8000-000000000014','c0160035-1014-4000-8000-000000000014',null,'Música de capilla','full_route',1,'Acompañamiento documentado para 2026; no presupone continuidad posterior.','published'),
('c0160035-1035-4000-8000-000000000015','c0160035-1016-4000-8000-000000000016','c0160033-0404-4000-8000-000000000004','Banda Amor y Sacrificio de Lebrija','full_route',1,'Acompañamiento documentado para 2026; no presupone continuidad posterior.','published'),
('c0160035-1036-4000-8000-000000000016','c0160035-1017-4000-8000-000000000017','c0160035-0401-4000-8000-000000000001','Banda de Música Nuestra Señora de Guaditoca','full_route',1,'Acompañamiento documentado para 2026; no presupone continuidad posterior.','published'),
('c0160035-1037-4000-8000-000000000017','c0160035-1018-4000-8000-000000000018','c0160035-0404-4000-8000-000000000004','Banda de Música El Arrabal de Carmona','full_route',1,'Acompañamiento documentado para 2026; no presupone continuidad posterior.','published')
on conflict ("id") do update set
"music_position_id"=excluded."music_position_id","band_entity_id"=excluded."band_entity_id","band_name_text"=excluded."band_name_text",
"participation_mode"=excluded."participation_mode","sequence_no"=excluded."sequence_no","notes"=excluded."notes","status"=excluded."status";

-- 388–401 · Periodos musicales de Banda
insert into public.music_accompaniment_periods
("id","brotherhood_entity_id","band_entity_id","step_entity_id","position","outing_type","date_from_text","year_from","year_to","is_current","notes","status","public_brotherhood_name","public_step_name","public_brotherhood_slug","public_municipality_name","public_municipality_slug","public_province") values
('c0160035-1101-4000-8000-000000000001','c0160035-0301-4000-8000-000000000001','d6852052-92bb-4b54-b551-e52b656dea6d','c0160035-0701-4000-8000-000000000001','Tras el palio de María Santísima de los Dolores','Viernes de Dolores','Vigente en 2026',2026,2026,false,'Vigencia cerrada a la edición 2026; no presupone continuidad posterior.','published','Servitas','Paso de palio de María Santísima de los Dolores','orden-seglar-servita-carmona','Carmona','carmona','Sevilla'),
('c0160035-1102-4000-8000-000000000002','c0160035-0308-4000-8000-000000000008','c0160032-0402-4000-8000-000000000002','c0160035-0702-4000-8000-000000000002','Tras el paso de la Sagrada Entrada en Jerusalén','Domingo de Ramos','Vigente en 2026',2026,2026,false,'Vigencia cerrada a la edición 2026; no presupone continuidad posterior.','published','Humildad','Paso de la Sagrada Entrada en Jerusalén · La Borriquita','humildad-carmona','Carmona','carmona','Sevilla'),
('c0160035-1103-4000-8000-000000000003','c0160035-0302-4000-8000-000000000002','4e4d493c-5273-44aa-8066-72dd1faa1ed8','c0160035-0703-4000-8000-000000000003','Tras el misterio de la Coronación de Espinas','Domingo de Ramos','Vigente en 2026',2026,2026,false,'Vigencia cerrada a la edición 2026; no presupone continuidad posterior.','published','Esperanza','Misterio de la Coronación de Espinas','esperanza-carmona','Carmona','carmona','Sevilla'),
('c0160035-1104-4000-8000-000000000004','c0160035-0302-4000-8000-000000000002','c0160035-0401-4000-8000-000000000001','c0160035-0704-4000-8000-000000000004','Tras el palio de María Santísima de la Esperanza','Domingo de Ramos','Vigente en 2026',2026,2026,false,'Vigencia cerrada a la edición 2026; no presupone continuidad posterior.','published','Esperanza','Palio de María Santísima de la Esperanza','esperanza-carmona','Carmona','carmona','Sevilla'),
('c0160035-1105-4000-8000-000000000005','c0160035-0303-4000-8000-000000000003','97f62582-42f5-4d5f-80e0-376398af98e8','c0160035-0705-4000-8000-000000000005','Tras el paso del Señor de la Amargura','Lunes Santo','Vigente en 2026',2026,2026,false,'Vigencia cerrada a la edición 2026; no presupone continuidad posterior.','published','Amargura','Paso del Señor de la Amargura','amargura-carmona','Carmona','carmona','Sevilla'),
('c0160035-1106-4000-8000-000000000006','c0160035-0303-4000-8000-000000000003','c0160035-0402-4000-8000-000000000002','c0160035-0706-4000-8000-000000000006','Tras el palio de María Santísima del Mayor Dolor','Lunes Santo','Vigente en 2026',2026,2026,false,'Vigencia cerrada a la edición 2026; no presupone continuidad posterior.','published','Amargura','Palio de María Santísima del Mayor Dolor','amargura-carmona','Carmona','carmona','Sevilla'),
('c0160035-1107-4000-8000-000000000007','c0160035-0304-4000-8000-000000000004','c0160035-0403-4000-8000-000000000003','c0160035-0707-4000-8000-000000000007','Tras el misterio de la Expiración','Martes Santo','Vigente en 2026',2026,2026,false,'Vigencia cerrada a la edición 2026; no presupone continuidad posterior.','published','Expiración','Misterio de la Expiración','expiracion-carmona','Carmona','carmona','Sevilla'),
('c0160035-1108-4000-8000-000000000008','c0160035-0304-4000-8000-000000000004','d6852052-92bb-4b54-b551-e52b656dea6d','c0160035-0708-4000-8000-000000000008','Tras el palio de María Santísima de los Dolores','Martes Santo','Vigente en 2026',2026,2026,false,'Vigencia cerrada a la edición 2026; no presupone continuidad posterior.','published','Expiración','Palio de María Santísima de los Dolores','expiracion-carmona','Carmona','carmona','Sevilla'),
('c0160035-1109-4000-8000-000000000009','c0160035-0305-4000-8000-000000000005','c0160035-0404-4000-8000-000000000004','c0160035-0710-4000-8000-000000000010','Tras el palio de Nuestra Señora y Madre de las Angustias','Miércoles Santo','Vigente en 2026',2026,2026,false,'Vigencia cerrada a la edición 2026; no presupone continuidad posterior.','published','Quinta Angustia','Palio de Nuestra Señora y Madre de las Angustias','quinta-angustia-carmona','Carmona','carmona','Sevilla'),
('c0160035-1110-4000-8000-000000000010','c0160035-0306-4000-8000-000000000006','c0160035-0405-4000-8000-000000000005','c0160035-0711-4000-8000-000000000011','Tras el misterio de la Columna','Jueves Santo','Vigente en 2026',2026,2026,false,'Vigencia cerrada a la edición 2026; no presupone continuidad posterior.','published','Santiago','Misterio de la Columna','santiago-carmona','Carmona','carmona','Sevilla'),
('c0160035-1111-4000-8000-000000000011','c0160035-0306-4000-8000-000000000006','c0160035-0404-4000-8000-000000000004','c0160035-0712-4000-8000-000000000012','Tras el palio de María Santísima de la Paciencia','Jueves Santo','Vigente en 2026',2026,2026,false,'Vigencia cerrada a la edición 2026; no presupone continuidad posterior.','published','Santiago','Palio de María Santísima de la Paciencia','santiago-carmona','Carmona','carmona','Sevilla'),
('c0160035-1112-4000-8000-000000000012','c0160035-0308-4000-8000-000000000008','c0160033-0404-4000-8000-000000000004','c0160035-0716-4000-8000-000000000016','Tras el misterio de Nuestro Padre Jesús de la Humildad y Paciencia','Viernes Santo','Vigente en 2026',2026,2026,false,'Vigencia cerrada a la edición 2026; no presupone continuidad posterior.','published','Humildad','Misterio de Nuestro Padre Jesús de la Humildad y Paciencia','humildad-carmona','Carmona','carmona','Sevilla'),
('c0160035-1113-4000-8000-000000000013','c0160035-0308-4000-8000-000000000008','c0160035-0401-4000-8000-000000000001','c0160035-0717-4000-8000-000000000017','Tras el palio de María Santísima de los Dolores','Viernes Santo','Vigente en 2026',2026,2026,false,'Vigencia cerrada a la edición 2026; no presupone continuidad posterior.','published','Humildad','Palio de María Santísima de los Dolores','humildad-carmona','Carmona','carmona','Sevilla'),
('c0160035-1114-4000-8000-000000000014','c0160035-0309-4000-8000-000000000009','c0160035-0404-4000-8000-000000000004','c0160035-0718-4000-8000-000000000018','Tras el misterio del Santo Entierro','Sábado Santo','Vigente en 2026',2026,2026,false,'Vigencia cerrada a la edición 2026; no presupone continuidad posterior.','published','Santo Entierro','Misterio del Santo Entierro','santo-entierro-carmona','Carmona','carmona','Sevilla')
on conflict ("id") do update set
"brotherhood_entity_id"=excluded."brotherhood_entity_id","band_entity_id"=excluded."band_entity_id","step_entity_id"=excluded."step_entity_id",
"position"=excluded."position","outing_type"=excluded."outing_type","date_from_text"=excluded."date_from_text",
"year_from"=excluded."year_from","year_to"=excluded."year_to","is_current"=excluded."is_current","notes"=excluded."notes",
"status"=excluded."status","public_brotherhood_name"=excluded."public_brotherhood_name","public_step_name"=excluded."public_step_name",
"public_brotherhood_slug"=excluded."public_brotherhood_slug","public_municipality_name"=excluded."public_municipality_name",
"public_municipality_slug"=excluded."public_municipality_slug","public_province"=excluded."public_province";

-- 402–530 · Trazabilidad
insert into public.source_links
("id","source_id","entity_id","outing_id","outing_series_id","outing_music_position_id","outing_music_assignment_id","scope","notes") values
('c0160035-2001-4000-8000-000000000001','c0160035-0123-4000-8000-000000000023','c0160035-0301-4000-8000-000000000001',null,null,null,null,'Identidad, titulares y sede','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2002-4000-8000-000000000002','c0160035-0101-4000-8000-000000000001','c0160035-0302-4000-8000-000000000002',null,null,null,null,'Identidad, titulares y sede','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2003-4000-8000-000000000003','c0160035-0107-4000-8000-000000000007','c0160035-0303-4000-8000-000000000003',null,null,null,null,'Identidad, titulares y sede','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2004-4000-8000-000000000004','c0160035-0103-4000-8000-000000000003','c0160035-0304-4000-8000-000000000004',null,null,null,null,'Identidad, titulares y sede','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2005-4000-8000-000000000005','c0160035-0104-4000-8000-000000000004','c0160035-0305-4000-8000-000000000005',null,null,null,null,'Identidad, titulares y sede','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2006-4000-8000-000000000006','c0160035-0105-4000-8000-000000000005','c0160035-0306-4000-8000-000000000006',null,null,null,null,'Identidad, titulares y sede','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2007-4000-8000-000000000007','c0160035-0102-4000-8000-000000000002','c0160035-0307-4000-8000-000000000007',null,null,null,null,'Identidad, titulares y sede','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2008-4000-8000-000000000008','c0160035-0106-4000-8000-000000000006','c0160035-0308-4000-8000-000000000008',null,null,null,null,'Identidad, titulares y sede','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2009-4000-8000-000000000009','c0160035-0108-4000-8000-000000000008','c0160035-0309-4000-8000-000000000009',null,null,null,null,'Identidad, titulares y sede','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2010-4000-8000-000000000010','c0160035-0132-4000-8000-000000000032','c0160035-0401-4000-8000-000000000001',null,null,null,null,'Identidad de la formación','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2011-4000-8000-000000000011','c0160035-0133-4000-8000-000000000033','c0160035-0402-4000-8000-000000000002',null,null,null,null,'Identidad de la formación','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2012-4000-8000-000000000012','c0160035-0134-4000-8000-000000000034','c0160035-0403-4000-8000-000000000003',null,null,null,null,'Identidad de la formación','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2013-4000-8000-000000000013','c0160035-0135-4000-8000-000000000035','c0160035-0404-4000-8000-000000000004',null,null,null,null,'Identidad de la formación','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2014-4000-8000-000000000014','c0160035-0136-4000-8000-000000000036','c0160035-0405-4000-8000-000000000005',null,null,null,null,'Identidad de la formación','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2015-4000-8000-000000000015','c0160035-0137-4000-8000-000000000037','c0160035-0406-4000-8000-000000000006',null,null,null,null,'Identidad de la formación','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2016-4000-8000-000000000016','c0160035-0123-4000-8000-000000000023','c0160035-0601-4000-8000-000000000001',null,null,null,null,'Titularidad e identidad','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2017-4000-8000-000000000017','c0160035-0101-4000-8000-000000000001','c0160035-0602-4000-8000-000000000002',null,null,null,null,'Titularidad e identidad','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2018-4000-8000-000000000018','c0160035-0101-4000-8000-000000000001','c0160035-0603-4000-8000-000000000003',null,null,null,null,'Titularidad e identidad','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2019-4000-8000-000000000019','c0160035-0101-4000-8000-000000000001','c0160035-0604-4000-8000-000000000004',null,null,null,null,'Titularidad e identidad','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2020-4000-8000-000000000020','c0160035-0101-4000-8000-000000000001','c0160035-0605-4000-8000-000000000005',null,null,null,null,'Titularidad e identidad','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2021-4000-8000-000000000021','c0160035-0107-4000-8000-000000000007','c0160035-0606-4000-8000-000000000006',null,null,null,null,'Titularidad e identidad','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2022-4000-8000-000000000022','c0160035-0107-4000-8000-000000000007','c0160035-0607-4000-8000-000000000007',null,null,null,null,'Titularidad e identidad','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2023-4000-8000-000000000023','c0160035-0107-4000-8000-000000000007','c0160035-0608-4000-8000-000000000008',null,null,null,null,'Titularidad e identidad','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2024-4000-8000-000000000024','c0160035-0103-4000-8000-000000000003','c0160035-0609-4000-8000-000000000009',null,null,null,null,'Titularidad e identidad','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2025-4000-8000-000000000025','c0160035-0103-4000-8000-000000000003','c0160035-0610-4000-8000-000000000010',null,null,null,null,'Titularidad e identidad','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2026-4000-8000-000000000026','c0160035-0103-4000-8000-000000000003','c0160035-0611-4000-8000-000000000011',null,null,null,null,'Titularidad e identidad','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2027-4000-8000-000000000027','c0160035-0103-4000-8000-000000000003','c0160035-0612-4000-8000-000000000012',null,null,null,null,'Titularidad e identidad','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2028-4000-8000-000000000028','c0160035-0103-4000-8000-000000000003','c0160035-0613-4000-8000-000000000013',null,null,null,null,'Titularidad e identidad','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2029-4000-8000-000000000029','c0160035-0104-4000-8000-000000000004','c0160035-0614-4000-8000-000000000014',null,null,null,null,'Titularidad e identidad','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2030-4000-8000-000000000030','c0160035-0104-4000-8000-000000000004','c0160035-0615-4000-8000-000000000015',null,null,null,null,'Titularidad e identidad','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2031-4000-8000-000000000031','c0160035-0104-4000-8000-000000000004','c0160035-0616-4000-8000-000000000016',null,null,null,null,'Titularidad e identidad','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2032-4000-8000-000000000032','c0160035-0104-4000-8000-000000000004','c0160035-0617-4000-8000-000000000017',null,null,null,null,'Titularidad e identidad','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2033-4000-8000-000000000033','c0160035-0105-4000-8000-000000000005','c0160035-0618-4000-8000-000000000018',null,null,null,null,'Titularidad e identidad','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2034-4000-8000-000000000034','c0160035-0105-4000-8000-000000000005','c0160035-0619-4000-8000-000000000019',null,null,null,null,'Titularidad e identidad','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2035-4000-8000-000000000035','c0160035-0102-4000-8000-000000000002','c0160035-0620-4000-8000-000000000020',null,null,null,null,'Titularidad e identidad','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2036-4000-8000-000000000036','c0160035-0102-4000-8000-000000000002','c0160035-0621-4000-8000-000000000021',null,null,null,null,'Titularidad e identidad','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2037-4000-8000-000000000037','c0160035-0102-4000-8000-000000000002','c0160035-0622-4000-8000-000000000022',null,null,null,null,'Titularidad e identidad','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2038-4000-8000-000000000038','c0160035-0110-4000-8000-000000000010','c0160035-0623-4000-8000-000000000023',null,null,null,null,'Titularidad e identidad','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2039-4000-8000-000000000039','c0160035-0106-4000-8000-000000000006','c0160035-0624-4000-8000-000000000024',null,null,null,null,'Titularidad e identidad','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2040-4000-8000-000000000040','c0160035-0106-4000-8000-000000000006','c0160035-0625-4000-8000-000000000025',null,null,null,null,'Titularidad e identidad','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2041-4000-8000-000000000041','c0160035-0106-4000-8000-000000000006','c0160035-0626-4000-8000-000000000026',null,null,null,null,'Titularidad e identidad','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2042-4000-8000-000000000042','c0160035-0108-4000-8000-000000000008','c0160035-0627-4000-8000-000000000027',null,null,null,null,'Titularidad e identidad','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2043-4000-8000-000000000043','c0160035-0108-4000-8000-000000000008','c0160035-0628-4000-8000-000000000028',null,null,null,null,'Titularidad e identidad','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2044-4000-8000-000000000044','c0160035-0108-4000-8000-000000000008','c0160035-0629-4000-8000-000000000029',null,null,null,null,'Titularidad e identidad','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2045-4000-8000-000000000045','c0160035-0110-4000-8000-000000000010','c0160035-0630-4000-8000-000000000030',null,null,null,null,'Composición del paso 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2046-4000-8000-000000000046','c0160035-0110-4000-8000-000000000010','c0160035-0631-4000-8000-000000000031',null,null,null,null,'Composición del paso 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2047-4000-8000-000000000047','c0160035-0110-4000-8000-000000000010','c0160035-0632-4000-8000-000000000032',null,null,null,null,'Composición del paso 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2048-4000-8000-000000000048','c0160035-0110-4000-8000-000000000010','c0160035-0633-4000-8000-000000000033',null,null,null,null,'Composición del paso 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2049-4000-8000-000000000049','c0160035-0110-4000-8000-000000000010','c0160035-0634-4000-8000-000000000034',null,null,null,null,'Composición del paso 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2050-4000-8000-000000000050','c0160035-0110-4000-8000-000000000010','c0160035-0635-4000-8000-000000000035',null,null,null,null,'Composición del paso 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2051-4000-8000-000000000051','c0160035-0110-4000-8000-000000000010','c0160035-0636-4000-8000-000000000036',null,null,null,null,'Composición del paso 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2052-4000-8000-000000000052','c0160035-0110-4000-8000-000000000010','c0160035-0637-4000-8000-000000000037',null,null,null,null,'Composición del paso 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2053-4000-8000-000000000053','c0160035-0110-4000-8000-000000000010','c0160035-0638-4000-8000-000000000038',null,null,null,null,'Composición del paso 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2054-4000-8000-000000000054','c0160035-0110-4000-8000-000000000010','c0160035-0639-4000-8000-000000000039',null,null,null,null,'Composición del paso 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2055-4000-8000-000000000055','c0160035-0110-4000-8000-000000000010','c0160035-0640-4000-8000-000000000040',null,null,null,null,'Composición del paso 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2056-4000-8000-000000000056','c0160035-0110-4000-8000-000000000010','c0160035-0641-4000-8000-000000000041',null,null,null,null,'Composición del paso 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2057-4000-8000-000000000057','c0160035-0110-4000-8000-000000000010','c0160035-0642-4000-8000-000000000042',null,null,null,null,'Composición del paso 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2058-4000-8000-000000000058','c0160035-0110-4000-8000-000000000010','c0160035-0701-4000-8000-000000000001',null,null,null,null,'Paso y composición 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2059-4000-8000-000000000059','c0160035-0110-4000-8000-000000000010','c0160035-0702-4000-8000-000000000002',null,null,null,null,'Paso y composición 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2060-4000-8000-000000000060','c0160035-0110-4000-8000-000000000010','c0160035-0703-4000-8000-000000000003',null,null,null,null,'Paso y composición 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2061-4000-8000-000000000061','c0160035-0110-4000-8000-000000000010','c0160035-0704-4000-8000-000000000004',null,null,null,null,'Paso y composición 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2062-4000-8000-000000000062','c0160035-0110-4000-8000-000000000010','c0160035-0705-4000-8000-000000000005',null,null,null,null,'Paso y composición 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2063-4000-8000-000000000063','c0160035-0110-4000-8000-000000000010','c0160035-0706-4000-8000-000000000006',null,null,null,null,'Paso y composición 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2064-4000-8000-000000000064','c0160035-0110-4000-8000-000000000010','c0160035-0707-4000-8000-000000000007',null,null,null,null,'Paso y composición 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2065-4000-8000-000000000065','c0160035-0110-4000-8000-000000000010','c0160035-0708-4000-8000-000000000008',null,null,null,null,'Paso y composición 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2066-4000-8000-000000000066','c0160035-0110-4000-8000-000000000010','c0160035-0709-4000-8000-000000000009',null,null,null,null,'Paso y composición 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2067-4000-8000-000000000067','c0160035-0110-4000-8000-000000000010','c0160035-0710-4000-8000-000000000010',null,null,null,null,'Paso y composición 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2068-4000-8000-000000000068','c0160035-0110-4000-8000-000000000010','c0160035-0711-4000-8000-000000000011',null,null,null,null,'Paso y composición 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2069-4000-8000-000000000069','c0160035-0110-4000-8000-000000000010','c0160035-0712-4000-8000-000000000012',null,null,null,null,'Paso y composición 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2070-4000-8000-000000000070','c0160035-0110-4000-8000-000000000010','c0160035-0713-4000-8000-000000000013',null,null,null,null,'Paso y composición 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2071-4000-8000-000000000071','c0160035-0110-4000-8000-000000000010','c0160035-0714-4000-8000-000000000014',null,null,null,null,'Paso y composición 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2072-4000-8000-000000000072','c0160035-0110-4000-8000-000000000010','c0160035-0715-4000-8000-000000000015',null,null,null,null,'Paso y composición 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2073-4000-8000-000000000073','c0160035-0110-4000-8000-000000000010','c0160035-0716-4000-8000-000000000016',null,null,null,null,'Paso y composición 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2074-4000-8000-000000000074','c0160035-0110-4000-8000-000000000010','c0160035-0717-4000-8000-000000000017',null,null,null,null,'Paso y composición 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2075-4000-8000-000000000075','c0160035-0110-4000-8000-000000000010','c0160035-0718-4000-8000-000000000018',null,null,null,null,'Paso y composición 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2076-4000-8000-000000000076','c0160035-0110-4000-8000-000000000010',null,null,'c0160035-0901-4000-8000-000000000001',null,null,'Jornada y cortejo anual','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2077-4000-8000-000000000077','c0160035-0110-4000-8000-000000000010',null,null,'c0160035-0902-4000-8000-000000000002',null,null,'Jornada y cortejo anual','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2078-4000-8000-000000000078','c0160035-0110-4000-8000-000000000010',null,null,'c0160035-0903-4000-8000-000000000003',null,null,'Jornada y cortejo anual','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2079-4000-8000-000000000079','c0160035-0110-4000-8000-000000000010',null,null,'c0160035-0904-4000-8000-000000000004',null,null,'Jornada y cortejo anual','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2080-4000-8000-000000000080','c0160035-0110-4000-8000-000000000010',null,null,'c0160035-0905-4000-8000-000000000005',null,null,'Jornada y cortejo anual','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2081-4000-8000-000000000081','c0160035-0110-4000-8000-000000000010',null,null,'c0160035-0906-4000-8000-000000000006',null,null,'Jornada y cortejo anual','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2082-4000-8000-000000000082','c0160035-0110-4000-8000-000000000010',null,null,'c0160035-0907-4000-8000-000000000007',null,null,'Jornada y cortejo anual','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2083-4000-8000-000000000083','c0160035-0110-4000-8000-000000000010',null,null,'c0160035-0908-4000-8000-000000000008',null,null,'Jornada y cortejo anual','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2084-4000-8000-000000000084','c0160035-0110-4000-8000-000000000010',null,null,'c0160035-0909-4000-8000-000000000009',null,null,'Jornada y cortejo anual','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2085-4000-8000-000000000085','c0160035-0110-4000-8000-000000000010',null,null,'c0160035-0910-4000-8000-000000000010',null,null,'Jornada y cortejo anual','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2086-4000-8000-000000000086','c0160035-0110-4000-8000-000000000010',null,null,'c0160035-0911-4000-8000-000000000011',null,null,'Jornada y cortejo anual','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2087-4000-8000-000000000087','c0160035-0110-4000-8000-000000000010',null,'c0160035-0921-4000-8000-000000000001',null,null,null,'Programa, horario e itinerario 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2088-4000-8000-000000000088','c0160035-0113-4000-8000-000000000013',null,'c0160035-0921-4000-8000-000000000001',null,null,null,'Celebración posterior 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2089-4000-8000-000000000089','c0160035-0110-4000-8000-000000000010',null,'c0160035-0922-4000-8000-000000000002',null,null,null,'Programa, horario e itinerario 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2090-4000-8000-000000000090','c0160035-0124-4000-8000-000000000024',null,'c0160035-0922-4000-8000-000000000002',null,null,null,'Celebración posterior 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2091-4000-8000-000000000091','c0160035-0110-4000-8000-000000000010',null,'c0160035-0923-4000-8000-000000000003',null,null,null,'Programa, horario e itinerario 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2092-4000-8000-000000000092','c0160035-0114-4000-8000-000000000014',null,'c0160035-0923-4000-8000-000000000003',null,null,null,'Celebración posterior 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2093-4000-8000-000000000093','c0160035-0110-4000-8000-000000000010',null,'c0160035-0924-4000-8000-000000000004',null,null,null,'Programa, horario e itinerario 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2094-4000-8000-000000000094','c0160035-0115-4000-8000-000000000015',null,'c0160035-0924-4000-8000-000000000004',null,null,null,'Celebración posterior 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2095-4000-8000-000000000095','c0160035-0110-4000-8000-000000000010',null,'c0160035-0925-4000-8000-000000000005',null,null,null,'Programa, horario e itinerario 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2096-4000-8000-000000000096','c0160035-0116-4000-8000-000000000016',null,'c0160035-0925-4000-8000-000000000005',null,null,null,'Celebración posterior 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2097-4000-8000-000000000097','c0160035-0110-4000-8000-000000000010',null,'c0160035-0926-4000-8000-000000000006',null,null,null,'Programa, horario e itinerario 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2098-4000-8000-000000000098','c0160035-0117-4000-8000-000000000017',null,'c0160035-0926-4000-8000-000000000006',null,null,null,'Celebración posterior 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2099-4000-8000-000000000099','c0160035-0110-4000-8000-000000000010',null,'c0160035-0927-4000-8000-000000000007',null,null,null,'Programa, horario e itinerario 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2100-4000-8000-000000000100','c0160035-0118-4000-8000-000000000018',null,'c0160035-0927-4000-8000-000000000007',null,null,null,'Celebración posterior 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2101-4000-8000-000000000101','c0160035-0110-4000-8000-000000000010',null,'c0160035-0928-4000-8000-000000000008',null,null,null,'Programa, horario e itinerario 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2102-4000-8000-000000000102','c0160035-0119-4000-8000-000000000019',null,'c0160035-0928-4000-8000-000000000008',null,null,null,'Celebración posterior 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2103-4000-8000-000000000103','c0160035-0110-4000-8000-000000000010',null,'c0160035-0929-4000-8000-000000000009',null,null,null,'Programa, horario e itinerario 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2104-4000-8000-000000000104','c0160035-0120-4000-8000-000000000020',null,'c0160035-0929-4000-8000-000000000009',null,null,null,'Celebración posterior 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2105-4000-8000-000000000105','c0160035-0110-4000-8000-000000000010',null,'c0160035-0930-4000-8000-000000000010',null,null,null,'Programa, horario e itinerario 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2106-4000-8000-000000000106','c0160035-0121-4000-8000-000000000021',null,'c0160035-0930-4000-8000-000000000010',null,null,null,'Celebración posterior 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2107-4000-8000-000000000107','c0160035-0110-4000-8000-000000000010',null,'c0160035-0931-4000-8000-000000000011',null,null,null,'Programa, horario e itinerario 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2108-4000-8000-000000000108','c0160035-0122-4000-8000-000000000022',null,'c0160035-0931-4000-8000-000000000011',null,null,null,'Celebración posterior 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2109-4000-8000-000000000109','f5c7c0c1-63c8-42b3-b1e8-fac89b01de83',null,'ea6ab0d1-e6c4-4ea1-8727-92cee4ce3218',null,null,null,'Convocatoria, horario, recorrido y MAFERMAN','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2110-4000-8000-000000000110','c0160035-0131-4000-8000-000000000031',null,'ea6ab0d1-e6c4-4ea1-8727-92cee4ce3218',null,null,null,'Celebración posterior; cambio a held','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2111-4000-8000-000000000111','c0160035-0127-4000-8000-000000000027',null,null,null,null,'c0160035-1021-4000-8000-000000000001','Acompañamiento musical 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2112-4000-8000-000000000112','c0160035-0125-4000-8000-000000000025',null,null,null,null,'c0160035-1022-4000-8000-000000000002','Acompañamiento musical 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2113-4000-8000-000000000113','c0160035-0110-4000-8000-000000000010',null,null,null,null,'c0160035-1023-4000-8000-000000000003','Acompañamiento musical 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2114-4000-8000-000000000114','c0160035-0110-4000-8000-000000000010',null,null,null,null,'c0160035-1024-4000-8000-000000000004','Acompañamiento musical 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2115-4000-8000-000000000115','c0160035-0110-4000-8000-000000000010',null,null,null,null,'c0160035-1025-4000-8000-000000000005','Acompañamiento musical 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2116-4000-8000-000000000116','c0160035-0110-4000-8000-000000000010',null,null,null,null,'c0160035-1026-4000-8000-000000000006','Acompañamiento musical 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2117-4000-8000-000000000117','c0160035-0110-4000-8000-000000000010',null,null,null,null,'c0160035-1027-4000-8000-000000000007','Acompañamiento musical 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2118-4000-8000-000000000118','c0160035-0110-4000-8000-000000000010',null,null,null,null,'c0160035-1028-4000-8000-000000000008','Acompañamiento musical 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2119-4000-8000-000000000119','c0160035-0110-4000-8000-000000000010',null,null,null,null,'c0160035-1029-4000-8000-000000000009','Acompañamiento musical 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2120-4000-8000-000000000120','c0160035-0110-4000-8000-000000000010',null,null,null,null,'c0160035-1030-4000-8000-000000000010','Acompañamiento musical 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2121-4000-8000-000000000121','c0160035-0110-4000-8000-000000000010',null,null,null,null,'c0160035-1031-4000-8000-000000000011','Acompañamiento musical 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2122-4000-8000-000000000122','c0160035-0110-4000-8000-000000000010',null,null,null,null,'c0160035-1032-4000-8000-000000000012','Acompañamiento musical 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2123-4000-8000-000000000123','c0160035-0110-4000-8000-000000000010',null,null,null,null,'c0160035-1033-4000-8000-000000000013','Acompañamiento musical 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2124-4000-8000-000000000124','c0160035-0110-4000-8000-000000000010',null,null,null,null,'c0160035-1034-4000-8000-000000000014','Acompañamiento musical 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2125-4000-8000-000000000125','c0160035-0130-4000-8000-000000000030',null,null,null,'c0160035-1015-4000-8000-000000000015',null,'Ausencia documentada de acompañamiento musical','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2126-4000-8000-000000000126','c0160035-0128-4000-8000-000000000028',null,null,null,null,'c0160035-1035-4000-8000-000000000015','Acompañamiento musical 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2127-4000-8000-000000000127','c0160035-0129-4000-8000-000000000029',null,null,null,null,'c0160035-1035-4000-8000-000000000015','Acompañamiento musical 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2128-4000-8000-000000000128','c0160035-0110-4000-8000-000000000010',null,null,null,null,'c0160035-1036-4000-8000-000000000016','Acompañamiento musical 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.'),
('c0160035-2129-4000-8000-000000000129','c0160035-0110-4000-8000-000000000010',null,null,null,null,'c0160035-1037-4000-8000-000000000017','Acompañamiento musical 2026','Fuente del octavo macrolote municipal HC-016 · Carmona.')
on conflict ("id") do update set
"source_id"=excluded."source_id","entity_id"=excluded."entity_id","outing_id"=excluded."outing_id",
"outing_series_id"=excluded."outing_series_id","outing_music_position_id"=excluded."outing_music_position_id",
"outing_music_assignment_id"=excluded."outing_music_assignment_id","scope"=excluded."scope","notes"=excluded."notes";

-- Invariantes del manifiesto.
do $$
begin
  if (select count(*) from public.entities where id::text like 'c0160035-%') <> 75 then raise exception 'carmona_entity_count_mismatch'; end if;
  if (select count(*) from public.brotherhoods where entity_id::text like 'c0160035-%') <> 9 then raise exception 'carmona_brotherhood_count_mismatch'; end if;
  if (select count(*) from public.bands where entity_id::text like 'c0160035-%') <> 6 then raise exception 'carmona_band_count_mismatch'; end if;
  if (select count(*) from public.images where entity_id::text like 'c0160035-%') <> 42 then raise exception 'carmona_image_count_mismatch'; end if;
  if (select count(*) from public.brotherhood_images where id::text like 'c0160035-%') <> 29 then raise exception 'carmona_brotherhood_image_count_mismatch'; end if;
  if (select count(*) from public.entity_locations where id::text like 'c0160035-%') <> 9 then raise exception 'carmona_location_count_mismatch'; end if;
  if (select count(*) from public.steps where entity_id::text like 'c0160035-%') <> 18 then raise exception 'carmona_step_count_mismatch'; end if;
  if (select count(*) from public.brotherhood_steps where id::text like 'c0160035-%') <> 18 then raise exception 'carmona_brotherhood_step_count_mismatch'; end if;
  if (select count(*) from public.image_steps where id::text like 'c0160035-%') <> 31 then raise exception 'carmona_image_step_count_mismatch'; end if;
  if (select count(*) from public.outing_series where id::text like 'c0160035-%') <> 11 then raise exception 'carmona_series_count_mismatch'; end if;
  if (select count(*) from public.outings where id::text like 'c0160035-%') <> 11 then raise exception 'carmona_new_outing_count_mismatch'; end if;
  if (select count(*) from public.outing_entities where id::text like 'c0160035-%') <> 50 then raise exception 'carmona_outing_entity_count_mismatch'; end if;
  if (select count(*) from public.outing_music_positions where id::text like 'c0160035-%') <> 18 then raise exception 'carmona_music_position_count_mismatch'; end if;
  if (select count(*) from public.outing_music_assignments where id::text like 'c0160035-%') <> 17 then raise exception 'carmona_music_assignment_count_mismatch'; end if;
  if (select count(*) from public.music_accompaniment_periods where id::text like 'c0160035-%') <> 14 then raise exception 'carmona_music_period_count_mismatch'; end if;
  if (select count(*) from public.source_links where id::text like 'c0160035-%') <> 129 then raise exception 'carmona_source_link_count_mismatch'; end if;

  if not exists (
    select 1 from public.outings
    where id='ea6ab0d1-e6c4-4ea1-8727-92cee4ce3218'
      and slug='carmona-servitas-dolores-santo-escapulario-2026-09-19'
      and brotherhood_entity_id='c0160035-0301-4000-8000-000000000001'
      and event_status='held'
  ) then raise exception 'carmona_servitas_september_update_mismatch'; end if;

  if exists (
    select 1 from public.outing_entities
    where outing_id='ea6ab0d1-e6c4-4ea1-8727-92cee4ce3218' and role='processional_step'
  ) then raise exception 'carmona_servitas_september_step_must_remain_null'; end if;

  if exists (
    select 1 from public.outing_music_assignments
    where music_position_id='c0160035-1015-4000-8000-000000000015'
  ) then raise exception 'carmona_desamparados_silence_has_assignment'; end if;

  if exists (
    select 1
    from public.entities e join public.brotherhoods b on b.entity_id=e.id
    where e.id::text like 'c0160035-%'
      and (lower(e.name) like '%desamparados%' or lower(e.name) like '%borriquita%')
  ) then raise exception 'carmona_duplicate_corporation_detected'; end if;

  if exists (
    select 1 from public.outing_music_assignments
    where id::text like 'c0160035-%' and band_entity_id='c0160035-0406-4000-8000-000000000006'
  ) then raise exception 'carmona_maferman_execution_not_proven'; end if;
end $$;

select
  'PREFLIGHT_CARMONA_SQL_OK_ROLLED_BACK' as result,
  530 as logical_dml,
  75 as entities,
  11 as new_outings,
  129 as source_links,
  18 as music_positions,
  17 as music_assignments;

rollback;
