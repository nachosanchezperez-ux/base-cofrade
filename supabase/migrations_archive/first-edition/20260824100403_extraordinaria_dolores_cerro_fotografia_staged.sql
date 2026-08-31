-- Mantiene producción sin una URL local rota mientras el recurso vive solo en la rama.
-- El crédito y la autorización quedan documentados; la activación se hará tras integrar el archivo en main.

update public.outings
set hero_image_path = null,
    hero_image_alt = 'Nuestra Señora de los Dolores del Cerro del Águila',
    hero_image_credit = 'Fotografía · David Arias',
    public_notes = $$La jornada comenzará con el tradicional Rosario de la Aurora, que en 2026 tendrá carácter extraordinario por su recorrido hasta la Parroquia de San Lucas Evangelista. La llegada está prevista a las 10:00 y la Misa mayor dominical se celebrará a las 11:00. Tras la misa, la Virgen permanecerá en veneración en San Lucas hasta el inicio del regreso a las 17:30. Durante la tarde visitará las parroquias de La Blanca Paloma y Nuestra Señora de la Candelaria antes de regresar a su sede canónica. Los hermanos podrán inscribirse para acompañar a la Virgen con cirio en el trayecto de ida, en el regreso o en ambos. Fotografía principal: David Arias, distribuida por la Hermandad para anunciar este acto y autorizada para su publicación en Hilo Cofrade. La publicación de la imagen queda preparada para activarse cuando el recurso esté disponible en la rama integrada.$$,
    updated_at = now()
where reference_code = 'SEVILLA-DOLORES-DEL-CERRO-2026';
