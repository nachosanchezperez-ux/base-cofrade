-- Retira inmediatamente la política temporal de subida de la fotografía del Cerro.
drop policy if exists "Temporary Dolores Cerro media upload" on storage.objects;
