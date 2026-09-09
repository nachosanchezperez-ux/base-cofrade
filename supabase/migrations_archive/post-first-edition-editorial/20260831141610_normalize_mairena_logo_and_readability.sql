-- Mairena del Alcor: usa el PNG transparente oficial de la formación.
-- La paleta documental sigue estando en band_colors (azul, blanco y dorado).
-- secondary_color se reserva aquí como tinta/superficie pública legible y usa
-- el azul oficial para evitar blanco sobre blanco en la ficha.
update public.bands as b
set logo_path = 'https://municipaldemairena.com/wp-content/uploads/2020/10/ColorSinFondo-e1602318863442.png',
    logo_background_color = '#EEF1F3',
    secondary_color = '#183B5B'
from public.entities as e
where e.id = b.entity_id
  and e.slug = 'banda-municipal-musica-mairena-del-alcor';
