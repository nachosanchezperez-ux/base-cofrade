# Historial editorial posterior al baseline de Primera Edición

Este directorio conserva, sin reescribir su SQL, las 90 migraciones editoriales
o de reconciliación creadas entre `20260831074355` y `20260909162000`.

Hasta #492 estos archivos permanecían en `supabase/migrations/`. Una Preview
Branch sin datos intentaba ejecutarlos antes del seed y fallaba en
`20260831135520_publica_centuria_y_corrige_logo_tres_caidas.sql`, porque la
inserción de `source_links` presuponía un nodo que solo existía en producción.
El mismo supuesto se repite en operaciones posteriores, así que añadir un
fixture puntual no habría hecho reproducible la cadena completa.

Los archivos se archivan para conservar la trazabilidad editorial y las
regresiones que inspeccionan su contenido. No forman parte de la cadena que
Supabase ejecuta sobre una base vacía. Desde este corte, el contenido se escribe
mediante HC-016 o el Panel y las migraciones quedan reservadas al esquema.
