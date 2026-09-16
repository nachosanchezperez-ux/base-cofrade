-- Las fichas públicas resuelven el ámbito de una fuente a partir de source_id.
-- PostgreSQL no crea índices automáticamente para la columna que referencia
-- una clave foránea, por lo que esta consulta estaba recorriendo toda la tabla.
create index if not exists source_links_source_id_idx
  on public.source_links using btree (source_id);
