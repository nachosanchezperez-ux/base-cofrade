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

La ficha de Hermandad sigue respondiendo 200, pero la última muestra del bloque Pasos conserva HTML previo sin sus enlaces internos a Imágenes. No se declara actualizado ese bloque. La invalidación nativa por public-brotherhood-detail devolvió 404 «CDN Cache Namespace not found»; no se fuerza purga global ni redeploy. El TTL de la ruta es 900 segundos y se mantiene la renovación natural.

La corrección de los datos y la navegación entre las seis fichas queda verificada. #1122 continúa en draft: no se levanta el pendiente de QA responsive/interacción de las tres Hermandades ni se certifica el bloque todavía cacheado de La Paz. No hay merge, cambio de main ni nuevo despliegue productivo. PR ajenas y HC-AUTO-03 intactos.
