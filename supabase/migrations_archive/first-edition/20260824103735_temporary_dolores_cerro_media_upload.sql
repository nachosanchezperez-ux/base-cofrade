-- Política temporal y estrictamente limitada a la fotografía de los Dolores del Cerro.
drop policy if exists "Temporary Dolores Cerro media upload" on storage.objects;
create policy "Temporary Dolores Cerro media upload"
on storage.objects
for insert
to anon
with check (
  bucket_id = 'hilo-media'
  and name = 'extraordinarias/dolores-cerro-2026.webp'
);
