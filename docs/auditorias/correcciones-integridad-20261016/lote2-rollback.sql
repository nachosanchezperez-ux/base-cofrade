-- Reversión exacta del lote 2 (17/10/2026). Restaura los estados previos.
-- Nota: los disparadores pueden haber actualizado `updated_at`; ese sello no se restaura.

do $$
begin
  update entities set status = 'published'
   where id in ('3d77cf1c-9adb-4389-8def-bb034892dfd3', 'b148db62-a504-4600-9a52-2def66e5497a');
  update outings set status = 'published' where id = 'b2300000-0000-0000-0000-000000000001';
  update brotherhood_images set status = 'review' where id = 'ad945631-daab-48fa-a953-85d97eecb2d8';

  update brotherhood_images set status = 'review'
   where id in ('9230b6eb-cf1d-404f-a8ba-902d40bf7611', 'c6f69335-84c1-4b3f-83c8-a621ea122848',
                'cc5943f8-39b7-4a86-935f-6c5689f460e1', '578e9990-74a5-4548-a16f-39746912fd80');
  update brotherhood_images set status = 'draft' where id = 'c9e93a12-1e91-487d-9d18-dfaeb246ff15';
  update brotherhood_steps set status = 'draft'
   where id in ('b4221000-0000-0000-0000-000000000002', 'bb41d993-0179-4b05-9dc1-7bc55ca8509f');
  update image_steps set status = 'review'
   where id in ('ae95bec8-91e2-4524-a35c-b2857c064fd2', '9235cb9b-bf38-4143-8012-497e2810fb35');
end $$;
