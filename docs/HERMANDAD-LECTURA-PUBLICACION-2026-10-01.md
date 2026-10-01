# Publicación controlada de lectura de Hermandades · 1/10/2026

## Autorización y alcance

Nacho autoriza continuar tras la entrega de preview y QA del piloto. Se publica
solo El Baratillo. No se extiende automáticamente a otras Hermandades.

Preflight: main `4da1794a9673c3ee7a3b7e42f6c482cc0ecb1605`, producción
`dpl_3uFZWKyiJabTvGiyjzTnTnTE8f9f` READY; Supabase ACTIVE_HEALTHY.
#1057 se reconcilia conservando el cierre y la evidencia de Autores. #1019
permanece aparcada; #1020 es independiente.

## Activación

`lib/brotherhood-reading-rollout.js` contiene la cohorte aprobada por ID de
entidad. El único ID es `10000000-0000-0000-0000-000000000001`, contrastado
mediante SELECT en entities: El Baratillo, publicado. El componente público
resuelve la variante tras obtener la entidad; no hay comparación por slug.
El laboratorio sigue forzando la variante y devolviendo 404 en producción.

La caché de ficha pasa de v8 a v9 para no reutilizar objetos serializados sin
las fechas normalizadas de Salidas/Cultos. Mantiene revalidate 900 y sus tags;
no se cambia la política de actualidad ni la base de datos.

Para revertir solo la activación basta vaciar la cohorte, sin alterar datos,
URLs o la implementación compartida. Cualquier ampliación requiere QA y
autorización de publicación. Sin DML, DDL, cambios RLS ni dependencias nuevas.

## Verificación de preparación

1438/1438 tests PASS, incluidos dos nuevos contratos de la cohorte y del
override del laboratorio. Build PASS. La certificación visual previa se
conserva como evidencia del diseño; la ruta pública necesita comprobación
propia de canonical, robots, SSR y activación.

Preview pública verificada sobre `bf728f89` en
`dpl_9YjEX6t87MisMpgvD5jHf6xGgDgh`, READY. Matriz 390/430/768/1024/1366/1600
PASS: HTTP 200, lectura activada, seis opciones, cero overflow/IDs duplicados,
un H1, canonical pública y `index, follow`; JSON-LD parseable, 15 hitos,
39 composiciones y 18 fuentes. Clics de Historia, enlace al archivo de Salidas
y teclado en Fuentes comprobados. San Esteban mantiene la variante anterior
y metadata propia. Cero pageerror y sin error/fatal en logs de esta preview
durante la ventana consultada. [Evidencia](./qa/hermandad-lectura-2026-10-01/public-preview.json).

Se utiliza Chromium con las respuestas HTTPS entregadas mediante fetch Node
con TLS verificado, preservando cuerpos e hidratación. No es ensayo en
dispositivo físico. El script reproducible es
`scripts/qa-brotherhood-reading.cjs`; Playwright pertenece al runner de QA,
no a las dependencias de producto. Postflight productivo pendiente de merge.
