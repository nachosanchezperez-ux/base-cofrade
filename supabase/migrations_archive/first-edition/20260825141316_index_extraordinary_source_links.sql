create index if not exists source_links_outing_idx
on public.source_links (outing_id, source_id)
where outing_id is not null;
