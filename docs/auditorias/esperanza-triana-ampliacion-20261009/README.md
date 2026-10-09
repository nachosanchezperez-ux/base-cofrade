# Esperanza de Triana · ampliación documental · 9/10/2026

## Estado
APLICADA EN PRODUCCIÓN Y VERIFICADA EN WEB PÚBLICA. Este expediente es documental: no debe ejecutar nuevamente el SQL. No incluye cambios de aplicación, esquema, RLS, migraciones ni despliegues.

## Alcance
Cinco actualizaciones sobre registros existentes: dos pasos, dos imágenes y la nota de una atribución existente. Se amplían cronología y materiales del misterio y palio; descripción e iconografía de los titulares; altura y tipología de la Virgen. La atribución histórica del Cristo a Marcos Cabrera se conserva expresamente como discutida y no documentada, sin convertirla en autoría probada. No se crean autores, restauraciones, imágenes o pasos nuevos.

## Fuentes oficiales ya vinculadas
- Cristo: https://esperanzadetriana.es/stmo-cristo-de-las-tres-caidas/
- Virgen: https://esperanzadetriana.es/ntra-sra-de-la-esperanza/
- Misterio: https://esperanzadetriana.es/paso-stmo-cristo-de-las-tres-caidas/
- Palio: https://esperanzadetriana.es/7624-2/

## Verificación
- Base main: 59edee119b5c81b470897c4899ffc8ecc5a4c25b; producción READY dpl_2jCDeirE6miwQohgXrpj9L7PJg4X sobre esa base.
- Universo explícito del guard oficial HC016: f3f06e37-23cd-4ab4-8129-21c9f8acadd3. Tipos Penitencia y Sacramental preservados.
- Transacción ensayada con ROLLBACK: ESPERANZA_TRIANA_OK; cinco valores anteriores comprobados, sin residuos.
- Misma transacción aplicada con COMMIT: ESPERANZA_TRIANA_OK; cinco comprobaciones postflight correctas.
- Hashes de acompañamientos, salidas y relaciones imagen-paso idénticos antes y después (manifest.json).
- Se refrescaron cinco entidades y se añadió una entrada de auditoría.
- Página pública HTTP 200: https://hilocofrade.es/hermandades/hermandad-esperanza-de-triana-sevilla
- Primera lectura SSR aún antigua; segunda lectura ordinaria confirma en texto visible, excluidos scripts y estilos: “respiraderos en 1970”, “noventa piezas”, “autoría no documentada”, “sustituyó el candelero”. Sin purga ni despliegue.

## Límites y coordinación
No equivale a incorporar toda la web ni acredita un censo completo. Música, salidas y vínculos existentes permanecen intactos. PR #1122 (La Paz/Pino Montano/Misión), reparación de vínculos de La Paz y demás frentes abiertos son independientes. Este expediente se prepara en data/esperanza-triana-20261009 y no se fusiona automáticamente.
