create policy "Temporary Encarnacion media upload"
on storage.objects
for insert
to anon
with check (
  bucket_id = 'hilo-media'
  and name in (
    'bandas/encarnacion/formacion-oficial.jpg',
    'bandas/encarnacion/banderin-oficial.png'
  )
);
