-- Hilo Cofrade · Fuentes públicas agrupadas de Las Cigarreras

-- Conserva las fuentes específicas de cada dato para el trabajo editorial,
-- pero permite mostrar en la ficha pública únicamente los canales oficiales
-- de la formación.
alter table public.bands
  add column if not exists youtube_url text;

update public.bands
set youtube_url = 'https://www.youtube.com/lascigarreras'
where entity_id = 'b1000000-0000-0000-0000-000000000001';
