-- Reversión exacta de apply.sql (16/10/2026). Restaura estados y enlaces de fuente.
-- Nota: los disparadores pueden haber actualizado `updated_at`; ese sello no se restaura.

do $$
begin
  update source_links set outing_id = 'ec8adb13-766f-43bb-9d65-f9273d8679fa'
   where id in ('378e6785-9769-4b42-b87b-ba749e7b2798', '5741a20d-c368-43fb-9cd8-9601a5232944');
  update outings set status = 'published' where id = 'ec8adb13-766f-43bb-9d65-f9273d8679fa';
  update outing_music_positions set status = 'published'
   where id in ('74cc02a9-8aa9-bdae-b640-23c38e94ae97', '1452b95e-80dd-b326-709d-cf621ce842e6');
  update outing_music_assignments set status = 'published'
   where id in ('57b3e622-e91e-d751-f594-ef42e2844a18', '63e46c8e-aea8-5bfa-9958-aabead81fb86');

  update image_steps set status = 'published'
   where id in ('ec160000-0000-4000-8000-000000000009', 'ec160000-0000-4000-8000-000000000010');

  update music_accompaniment_periods set status = 'published'
   where id in ('a9562180-be62-4a83-bf1e-b7651795cbc3', '8f1650c1-b57c-44ce-b893-acdc87460738', 'c0160036-1313-4000-8000-000000000013');
  update source_links set music_accompaniment_period_id = '8f1650c1-b57c-44ce-b893-acdc87460738'
   where id = '2a54ba3b-dedc-43f4-8c9c-97b7c86e08b2';

  update brotherhood_images set status = 'draft' where id = '4b8fd019-ae5f-4c11-9735-fc2a1554b759';
  update brotherhood_steps set status = 'draft' where id = '3fef1b12-b050-40f4-9495-3c9b997db59a';
end $$;
