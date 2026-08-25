-- Historial remoto recuperado literalmente.
-- Esta política temporal quedó retirada en la migración inmediatamente posterior.

drop policy if exists "Temporary La Cena step media upload" on storage.objects;

create policy "Temporary La Cena step media upload"
on storage.objects
for insert
to anon
with check (
  bucket_id = 'hilo-media'
  and name in (
    'pasos/la-cena/paso-misterio-sagrada-cena.jpg',
    'pasos/la-cena/paso-cristo-humildad-paciencia-luis-selvatico.jpg'
  )
);
