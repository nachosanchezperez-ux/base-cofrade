-- Reversión de owner-fixes-2.sql. Valores anteriores consultados el 12/10/2026.
begin;

update public.music_accompaniment_periods set public_band_name = null
where id in ('9ecc91fb-efcb-407c-a68e-605f98336270','4c23f0c2-0a77-4208-bfd6-d4a112d7fab8','4d0ade55-b3ca-464f-a166-70e8661c06c2',
             'ca0dca7a-b4f6-4e6d-8900-3087c5cfb474','5202b2a7-205b-4c81-b99b-f604aec8764b','cdfa19d9-5cad-452c-b00b-9cc7ce6d5b83',
             '4219ad30-605b-41d7-a5fd-52f07413601b','1e9b6dda-9642-4810-b13c-c20426b38c94','fe3da9a1-b98f-4899-8a1c-2bd556b5aac9',
             '61b54b59-7aa1-4f7f-92cc-478dc296d564','1aec8c3d-6a3d-4e35-8d6e-74e480b1ff25','c2aa26f3-95dc-4070-ae57-7fbbb140f65d');

update public.outing_music_assignments
set band_entity_id = '9f3636a3-6b3e-4a63-9cd2-2f08383158f3', band_name_text = null, notes = 'Acompañamiento de ida.'
where id = '81d25750-4f5f-4924-bdf0-bbbb3e33df51';

update public.music_accompaniment_periods set date_from_text = null
where id = '6c3dc58d-c9cd-46fc-9074-44d24a0cd227';

delete from public.source_links where source_id in ('7a5c0e05-2026-4012-8000-00000000ca03', '7a5c0e05-2026-4012-8000-00000000ca04');
delete from public.sources where id in ('7a5c0e05-2026-4012-8000-00000000ca03', '7a5c0e05-2026-4012-8000-00000000ca04');

commit;
