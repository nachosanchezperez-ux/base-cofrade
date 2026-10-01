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
propia de canonical, robots, SSR y activación. Preview y postflight en curso.
