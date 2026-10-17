# Cadena ejecutable de Supabase

Este directorio contiene únicamente migraciones de esquema reproducibles sobre
una base vacía. Supabase ejecuta esta cadena antes de `../seed.sql` al crear una
Preview Branch, por lo que ninguna migración activa puede depender de filas de
producción ni de datos del seed.

El contenido editorial se carga por el circuito gobernado HC-016 o por el
Panel. Las migraciones DML históricas se conservan, sin modificar, en
`../migrations_archive/` como evidencia auditable, pero no forman parte de la
cadena ejecutable.

Reglas para un cambio futuro:

1. crear la migración con `supabase migration new`;
2. limitarla al cambio de esquema necesario;
3. probar la cadena completa sobre una base vacía y después el seed;
4. actualizar la lista cerrada de `test/migration-history.test.mjs`;
5. exigir `Supabase Preview` verde antes de fusionar;
6. separar la migración y el código que la usa en dos PR (ver abajo).

## Migraciones en dos fases · 17/10/2026

Fusionar en `main` dispara a la vez dos procesos independientes: Vercel despliega
el código y la integración de Supabase aplica las migraciones. No hay orden
garantizado. Si una misma PR añade una columna y el código que la lee, el código
puede publicarse antes que la columna: el 12/10/2026 la portada registró
`column outings.home_featured_starts_on does not exist` tras #1144.

Por eso, todo cambio de esquema que el código vaya a usar se hace en dos PR:

1. **Fase 1 · solo esquema.** La migración (aditiva y compatible con el código
   publicado) y la actualización de `test/migration-history.test.mjs`. Tras
   fusionarla, comprobar que consta aplicada en producción
   (`supabase_migrations.schema_migrations` o la lista de migraciones del proyecto).
2. **Fase 2 · código.** La PR que lee o escribe los elementos nuevos.

El job `migration-split` de CI (`scripts/check-migration-code-split.mjs`) falla si
una PR crea columnas, tablas, vistas o funciones y su código de `app/`,
`components/`, `lib/` o `proxy.js` ya las nombra. Los nombres que ya existían en
el código antes de la PR (por ejemplo, `slug`) no se vigilan.

Excepción: si el código de la PR funciona aunque la migración aún no esté
aplicada (la lectura degrada sin error o la escritura comprueba la columna), la
migración puede incluir la línea `-- hc-despliegue: tolerante` y la PR debe
explicar por qué. Es una decisión de revisión, no un atajo.

Para retirar una columna se sigue el orden inverso: primero la PR que deja de
usarla y, después, la migración que la elimina (con autorización expresa).

## Reconciliación de historial · 18/09/2026

La versión de cada migración estructural activa debe coincidir con la registrada en
`supabase_migrations.schema_migrations`. Si producción conserva una migración
estructural válida cuya definición puede recuperarse exactamente desde ese historial,
Git debe restaurar esa misma versión y SQL; no se crea DDL nuevo ni se usa
`migration repair` para ocultar la deriva.
