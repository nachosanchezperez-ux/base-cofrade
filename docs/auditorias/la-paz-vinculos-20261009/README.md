# La Paz · corrección Imagen–Paso · 9/10/2026

## Autorización y alcance

Orden posterior del usuario: «Continúa y soluciona la vinculación de los pasos con las imágenes de la paz». Autoriza este correctivo nuevo y acotado; no reaplica los lotes históricos de La Paz, Pino Montano ni La Misión.

Tres relaciones `processes_on`, publicadas y sin fechas iniciales inventadas:

| Imagen | Paso | Fuente existente |
|---|---|---|
| Nuestro Padre Jesús de la Victoria | Paso de Nuestro Padre Jesús de la Victoria | https://www.hermandaddelapaz.org/paso-de-misterio/ |
| María Santísima de la Paz | Paso de palio de María Santísima de la Paz | https://www.hermandaddelapaz.org/paso-de-palio/ |
| Nuestra Señora del Prado | Paso de Nuestra Señora del Prado | https://www.hermandaddelapaz.org/nuestra-senora-del-prado/ |

Se insertaron tres `image_steps` y tres `source_links` hacia Fuentes ya existentes; siete marcas de frescura en las seis entidades y la Hermandad y un registro de auditoría. Sin nuevas Imágenes, Pasos ni Fuentes; sin modificación de contenido, cultos, salidas, música, esquema, RLS ni staging.

## Preflight y transacción

Main/producción `59edee119b5c81b470897c4899ffc8ecc5a4c25b`; producción READY. PR #1122 abierta/draft sobre `ed2bae5335cc3be5e4e38449547b0dfea2298fb3`, sin drift de base. Se confirmó que las seis entidades y sus vínculos con La Paz eran publicados y del tipo esperado, y que no existía ninguna de las tres parejas.

Guard HC-016 generado con el universo explícito de La Paz e incluido en la transacción, más comprobación de conservación exacta de Penitencia/Sacramental. Dry-run PASS con tres relaciones; ROLLBACK verificado: cero relaciones, enlaces de fuente y auditorías residuales. Mismo candidato COMMIT PASS. Postflight: tres relaciones, tres parejas únicas, cero huérfanos y una fuente por relación. Hashes de cultos, salidas y música coinciden con el preflight, registrados en preserved.json.

`applied.sql` conserva el SQL histórico del correctivo terminado en ROLLBACK por seguridad; NO REEJECUTAR. El COMMIT real se realizó una sola vez tras el dry-run. Los históricos del 8/10 se mantienen intactos.

## QA público

Tras renovación natural, las tres fichas de Imagen enlazan con su Paso y las tres fichas de Paso enlazan con su Imagen: **6/6 enlaces recíprocos PASS**, HTTP 200, canonical e index/follow conservados. Evidencia en public-qa.json.

En el corte posterior del 9/10/2026, la ficha pública de La Paz ya sirve los tres enlaces dentro de las tarjetas de Pasos: Jesús de la Victoria → su Imagen, palio → María Santísima de la Paz y paso de Gloria → Nuestra Señora del Prado. En cada ficha de Imagen aparece también «Procesiona en» con el Paso correspondiente. Navegación recíproca **6/6 PASS**, HTTP 200; la respuesta pertenece al deployment de producción `dpl_2jCDeirE6miwQohgXrpj9L7PJg4X`.

La revisión visual de escritorio confirmó nombres y enlaces en el bloque de tres tarjetas. Las fotografías de los pasos siguen sin recurso asociado y la página muestra sus marcadores de imagen; queda como necesidad de recurso gráfico, fuera de este correctivo relacional. No se modificó código ni se reabrió trabajo de UX/arquitectura. QA móvil/interacción no se certifica en esta corrección de datos. El aviso anterior sobre caché y la invalidación 404 se conserva como evidencia histórica.
