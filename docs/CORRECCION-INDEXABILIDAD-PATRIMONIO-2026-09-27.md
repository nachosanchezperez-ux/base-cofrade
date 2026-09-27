# Indexabilidad: patrimonio e incertidumbre documental

Corrección general en rama independiente sobre main
`15710dd5bcde2a4bd6dc87dc5d8c8846e213e406`. Pendiente de integración y
verificación productiva. No modifica datos, migraciones ni el candidato #1009.

## Causas y comportamiento

El selector del sitemap construía Hermandades con patrimonio vacío aunque la
ficha aceptase esa relación. Ahora reconoce bienes publicados y sus Fuentes;
la metadata también reconoce simpecados, que el lector separa del patrimonio
general. Carteles y obras musicales conservan su clasificación aparte. La
comprobación de publicación se comparte con piezas de Pasos y patrimonio de
Bandas, sin consultas por entidad ni excepciones por nombre, slug o UUID.

El filtro de placeholders rechazaba cualquier texto que contuviese «no
documentada» o «no determinada». Ahora distingue un valor desconocido aislado
de un relato con contexto documental. «Autoría no documentada» e «Imagen de
autoría no documentada.» solos siguen sin servir como resumen. Los pendientes
editoriales, la ausencia de contexto, relaciones o Fuentes siguen bloqueando.
No se altera ninguna atribución ni se elimina incertidumbre de los datos.

## Validación

Suite completa: **1.320/1.320 PASS**. Build de producción y `git diff --check`:
PASS. La rama parte de main; su contador no incluye las pruebas propias de la
PR de Utrera que todavía no está fusionada.

Pruebas de regresión del selector real y de generateMetadata de Hermandades:
simpecado y carreta publicados, Fuentes heredadas, patrimonio ajeno/en review,
ausencia de Fuente, carteles, música y resumen pendiente. Pruebas de texto con
incertidumbre y de placeholders aislados; regresión de Fuentes de Pasos.

La auditoría de #1009 se ejecutó en un worktree aislado del candidato
`8d26487` (árbol idéntico al remoto `8fb50edf1667d6fcc6811b02500edf104279af8c`),
superponiendo los dos módulos públicos corregidos y el helper de tipos.
Se inyectó el helper real en el contexto VM de su script de auditoría.
Resultado: **PASS, 85 fichas, cero bloqueos**: 16 corporaciones, 45 imágenes y
24 Pasos. I44/I45/S25/H17 permanecen review y fuera del perfil público.
Evidencia: `evidence/indexabilidad-patrimonio-2026-09-27/utrera-static-audit.json`.

Es una proyección estática sobre snapshots, no QA HTTP ni conciliación contra
Supabase vivo. El manifiesto y sus 1.173 operaciones no se regeneran ni modifican
en #1009 desde este frente. Sin staging, Apply, dry-run ni escrituras SQL.
Morón y HC-AUTO-03 permanecen fuera del alcance.

Después de integrar y verificar esta corrección, #1009 debe reconciliar el
main resultante y repetir su auditoría, preflight vivo y dry-run transaccional.
Este informe no emite GO para staging.
