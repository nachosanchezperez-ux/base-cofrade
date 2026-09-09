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
5. exigir `Supabase Preview` verde antes de fusionar.
