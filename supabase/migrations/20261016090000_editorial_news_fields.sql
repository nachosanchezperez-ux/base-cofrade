-- Noticias de «El Hilo se mueve» gestionables desde el Panel.
--
-- Hasta ahora las noticias se escribían en código (lib/hilo-movements-data.js),
-- así que cada noticia exigía una PR y un despliegue. Ya existe la tabla
-- public.editorial_content con content_type = 'news', sus vínculos con fichas
-- (editorial_content_links) y sus fuentes (source_links.editorial_content_id).
-- Se reutilizan; no se crea ninguna tabla paralela.
--
-- Se añaden solo los datos propios de una noticia que esa tabla no tenía:
--   * slug: identificador público y ancla (#slug) en /el-hilo-se-mueve;
--   * news_topic: tema del hub (musica, agenda, patrimonio, hermandad);
--   * news_kind: etiqueta corta (Cambio, Renovación, Nombramiento…);
--   * municipality_id: localidad de la noticia;
--   * announced_on: fecha del anuncio (publish_date sigue siendo la fecha en que
--     se documenta; la política pública ya oculta lo programado a futuro);
--   * effective_label: desde cuándo tiene efecto («Martes Santo de 2027»);
--   * discover_label / discover_href: enlace interno «Descubre…».
--
-- Sin cambios de RLS: las políticas vigentes de editorial_content,
-- editorial_content_links, sources y source_links ya cubren lectura pública de
-- lo publicado y escritura de editores.
--
-- Cambio aditivo: columnas opcionales, no modifica ni borra filas existentes.

alter table public.editorial_content
  add column if not exists slug text,
  add column if not exists news_topic text,
  add column if not exists news_kind text,
  add column if not exists municipality_id uuid references public.municipalities(id) on delete set null,
  add column if not exists announced_on date,
  add column if not exists effective_label text,
  add column if not exists discover_label text,
  add column if not exists discover_href text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'editorial_content_news_topic_check') then
    alter table public.editorial_content
      add constraint editorial_content_news_topic_check
      check (news_topic is null or news_topic in ('musica', 'agenda', 'patrimonio', 'hermandad'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'editorial_content_slug_format_check') then
    alter table public.editorial_content
      add constraint editorial_content_slug_format_check
      check (slug is null or slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$');
  end if;
  if not exists (select 1 from pg_constraint where conname = 'editorial_content_discover_href_check') then
    alter table public.editorial_content
      add constraint editorial_content_discover_href_check
      check (discover_href is null or discover_href ~ '^/[^/\s]');
  end if;
  if not exists (select 1 from pg_constraint where conname = 'editorial_content_announced_before_publish_check') then
    alter table public.editorial_content
      add constraint editorial_content_announced_before_publish_check
      check (announced_on is null or publish_date is null or announced_on <= publish_date);
  end if;
end $$;

create unique index if not exists editorial_content_slug_key
  on public.editorial_content (slug)
  where slug is not null;

create index if not exists editorial_content_news_feed_idx
  on public.editorial_content (content_type, status, publish_date desc);

create index if not exists editorial_content_municipality_idx
  on public.editorial_content (municipality_id)
  where municipality_id is not null;

comment on column public.editorial_content.slug is 'Identificador público de la noticia; ancla en /el-hilo-se-mueve.';
comment on column public.editorial_content.news_topic is 'Tema de El Hilo se mueve: musica, agenda, patrimonio o hermandad.';
comment on column public.editorial_content.news_kind is 'Etiqueta corta de la noticia (Cambio, Renovación, Nombramiento…).';
comment on column public.editorial_content.municipality_id is 'Localidad de la noticia.';
comment on column public.editorial_content.announced_on is 'Fecha del anuncio original; publish_date es la fecha en que se documenta.';
comment on column public.editorial_content.effective_label is 'Desde cuándo tiene efecto la noticia.';
comment on column public.editorial_content.discover_label is 'Texto del enlace interno «Descubre…».';
comment on column public.editorial_content.discover_href is 'Ruta interna del enlace «Descubre…».';
