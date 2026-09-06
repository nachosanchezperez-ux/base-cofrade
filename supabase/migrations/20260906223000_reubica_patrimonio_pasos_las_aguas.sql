-- Reubica las piezas procesionales de Las Aguas en la entidad Paso a la que pertenecen.
-- Las insignias, textiles personales y enseres corporativos permanecen en la Hermandad.

update public.heritage_assets
set parent_entity_id = 'c5008d70-a6aa-46df-8314-693ecaa541bb'::uuid
where entity_id in (
  'b1174b02-2b59-4057-859c-1b48e2318c2c'::uuid,
  'e86c9e0c-341f-4ef4-b4a8-942d95bea24a'::uuid
);

update public.heritage_assets
set parent_entity_id = '7190b0b3-d263-48cc-8472-7141aa7742c2'::uuid
where entity_id in (
  '1424784e-2e71-444c-92bc-388b089c58ae'::uuid,
  '68091854-b747-4c0c-b1cf-2c80d0394a05'::uuid,
  'b0f671c0-4385-4f7e-a856-84d418f3405c'::uuid,
  '66fe1c42-ad42-4f10-b7d7-cb1c34c2b428'::uuid,
  '1d3f2e4b-5247-4501-8d11-4c1ca40b102b'::uuid,
  'b86e502f-5872-4af2-9ebf-0d0e965e7045'::uuid,
  'e0b8dd3a-1259-40bc-abdf-9cd51611978f'::uuid,
  'ba4ff11e-7af0-4d54-b711-5cf7dffed304'::uuid,
  '1847acce-8490-44ec-81e1-cc8b8700a4ae'::uuid,
  '09a3473d-07ac-4c47-bfa8-37696bd2e0d2'::uuid,
  '3d0469f9-22f9-4a8c-97ec-a7b274745302'::uuid
);

update public.heritage_assets
set parent_entity_id = '426c55bf-1173-485f-9f43-e83eca9e8b5e'::uuid
where entity_id in (
  '86282e50-e82e-40ff-aa8d-800218a7eefd'::uuid,
  'faa4b930-595a-4166-a57a-e281e72eeddd'::uuid,
  '43d9299e-a269-46c0-a80e-86004e7b896a'::uuid
);
