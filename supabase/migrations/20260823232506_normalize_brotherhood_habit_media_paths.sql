-- Keep Hilo Media references independent from the Supabase project URL.
update public.brotherhood_habits
set image_path = regexp_replace(
  image_path,
  '^https?://[^/]+/storage/v1/object/public/hilo-media/',
  '',
  'i'
)
where image_path ~* '^https?://[^/]+/storage/v1/object/public/hilo-media/';

alter table public.brotherhood_habits
  drop constraint if exists brotherhood_habits_image_path_internal_reference;

alter table public.brotherhood_habits
  add constraint brotherhood_habits_image_path_internal_reference
  check (
    image_path is null
    or image_path !~* '^https?://[^/]+/storage/v1/object/public/hilo-media/'
  );

comment on constraint brotherhood_habits_image_path_internal_reference
  on public.brotherhood_habits
  is 'Las imágenes del bucket hilo-media se guardan como rutas internas; las rutas locales y las URL externas siguen permitidas.';
