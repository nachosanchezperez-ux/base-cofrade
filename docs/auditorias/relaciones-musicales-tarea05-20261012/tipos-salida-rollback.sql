-- Reversión de tipos-salida.sql.
update public.music_accompaniment_periods m set outing_type = v.code
from (values
  ('11b34575-c17b-408f-8d05-6f04a8618f9a'::uuid, 'station_of_penance', 'Estación de penitencia'),
  ('8f1a8141-a334-4dcb-b5cc-ab409b1ab409'::uuid, 'procesion_gloria', 'Procesión de Gloria'),
  ('031533f0-1f83-409f-b4cd-d7765999efa8'::uuid, 'procesion_gloria', 'Procesión de Gloria'),
  ('411ee9f4-c7ef-4d0a-beab-2b473ab59ae5'::uuid, 'procesion_gloria', 'Procesión de Gloria'),
  ('d8f3f91f-cbac-4a6f-b230-8a510d6eb52b'::uuid, 'station_of_penance', 'Estación de penitencia'),
  ('25d55289-39a0-4a50-9a4c-e6235549d7a7'::uuid, 'procesion_gloria', 'Procesión de Gloria'),
  ('f9baa087-1917-4e70-8780-7c3518b5fee7'::uuid, 'procesion_gloria', 'Procesión de Gloria'),
  ('1afb4dd9-b122-4432-9bba-6bb4ba4bba68'::uuid, 'station_of_penance', 'Estación de penitencia'),
  ('6ecae90c-effb-46c3-a3d3-69571760ded7'::uuid, 'procesion_penitencial', 'Procesión penitencial'),
  ('7cf8ea43-97b3-4900-be6d-e8ec785b4e86'::uuid, 'romeria', 'Romería'),
  ('75358059-ee89-4865-9594-f44994ad9ef5'::uuid, 'procesion_gloria', 'Procesión de Gloria'),
  ('d76b2aba-d77f-48cf-89dd-3c128bb14969'::uuid, 'procesion_gloria', 'Procesión de Gloria'),
  ('dd0ae1ea-597d-4703-9263-b0631f053207'::uuid, 'station_of_penance', 'Estación de penitencia'),
  ('0de5a136-c5b3-4377-9ecc-a22ae9a44c35'::uuid, 'station_of_penance', 'Estación de penitencia'),
  ('b218dd81-bb7e-4a38-b094-7ba9d365f700'::uuid, 'station_of_penance', 'Estación de penitencia'),
  ('6f5a60f6-6b7d-45a5-b1cf-96ca46b09ff1'::uuid, 'procesion_gloria', 'Procesión de Gloria')
) v(id, code, label)
where m.id = v.id and m.outing_type = v.label;
