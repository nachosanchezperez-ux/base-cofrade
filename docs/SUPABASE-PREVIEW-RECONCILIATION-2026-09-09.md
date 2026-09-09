# Reconciliación de Supabase Preview Branches · #492

## Alcance

La reconciliación parte de `main = 4816a985bc5cc5316a5562a690f7e5e173b3ec0b` y no modifica
contenido editorial de producción. Su objetivo es que una Preview Branch sin copia de datos
pueda ejecutar la cadena completa, cargar el seed mínimo y quedar operativa
antes de cualquier nuevo cambio de esquema.

## Diagnóstico reproducido

La rama de preview de #661 aplicaba únicamente cuatro migraciones y se detenía
en `20260831135520_publica_centuria_y_corrige_logo_tres_caidas.sql` con
`source_links_one_target` (`SQLSTATE 23514`). El `entity_id` quedaba a `NULL`
porque el slug de Tres Caídas existía en producción, pero no en el baseline.

El fallo no era local a esa Fuente. La cadena activa acumulaba 90 archivos de
contenido que presuponían Hermandades, imágenes, Pasos, agentes y relaciones de
producción. Supabase crea las previews sin datos, ejecuta las migraciones en
orden y solo después carga `seed.sql`; por ello un fixture de Tres Caídas habría
desplazado el fallo a una migración posterior.

El inventario adicional detectó:

- 94 migraciones SQL activas en Git frente a 87 registradas en producción;
- 12 versiones remotas sin versión homónima local;
- 19 versiones locales no registradas en remoto;
- 11 DML aplicados con un timestamp remoto distinto del archivo incorporado a
  Git y una aplicación remota duplicada de
  `reubica_patrimonio_pasos_las_aguas`;
- la evolución estructural `20260908083000_add_brotherhood_membership_stats`
  presente en Git y materializada en el esquema productivo, pero sin registro
  en `supabase_migrations.schema_migrations`.

## Decisión

Se restaura el contrato establecido por el baseline de Primera Edición:

- cadena activa: baseline y evoluciones estructurales reproducibles;
- seed: datos mínimos, públicos e idempotentes de QA;
- contenido: HC-016 o Panel;
- histórico DML: archivo auditable, no ejecutable.

Los 90 SQL editoriales se mueven intactos a
`supabase/migrations_archive/post-first-edition-editorial/`. No se corrige su
SQL, no se replica producción y no se añade una excepción por slug. La cadena
activa queda formada por:

1. `20260831070000_first_edition_baseline.sql`;
2. `20260831071000_secure_public_contributions_reconciled.sql`;
3. `20260831072000_add_band_logo_background_color.sql`;
4. `20260908083000_add_brotherhood_membership_stats.sql`.

La cuarta migración es idempotente: usa `ADD COLUMN IF NOT EXISTS` y guarda la
creación de constraints por nombre. En una preview completa el esquema; en
producción permitirá que la integración registre una evolución que ya está
materializada sin repetirla de forma destructiva.

## Deriva histórica observada

| Registro remoto | Archivo histórico local |
|---|---|
| `20260906215717_reubica_patrimonio_pasos_las_aguas` | aplicación adicional; también existe el registro/archivo `20260906223000` |
| `20260906220012_cierra_la_carreteria` | `20260906230000_cierra_la_carreteria` |
| `20260906223020_cierra_la_mision` | `20260907002000_cierra_la_mision` |
| `20260906225216_cierra_el_juncal` | `20260907013000_cierra_el_juncal` |
| `20260906230442_aplica_paleta_el_juncal` | `20260907020000_aplica_paleta_el_juncal` |
| `20260906234140_cierra_los_negritos` | `20260907030000_cierra_los_negritos` |
| `20260906234526_ajusta_paso_palio_negritos` | `20260907031000_ajusta_paso_palio_negritos` |
| `20260906234803_cierra_pasion_y_muerte` | `20260907032000_cierra_pasion_y_muerte` |
| `20260907002622_corrige_presentacion_salidas_negritos` | `20260907033000_corrige_presentacion_salidas_negritos` |
| `20260907213046_completa_caratulas_discografia_bandas` | `20260907212500_completa_caratulas_discografia_bandas` |
| `20260908161913_incorpora_pasion_linares_y_esencia` | `20260908160553_incorpora_pasion_linares_y_esencia` |
| `20260908165514_incorpora_cinco_bandas_semana_santa_sevilla` | `20260908163610_incorpora_cinco_bandas_semana_santa_sevilla` |

Esta tabla documenta el historial real; no autoriza a renombrar registros
remotos ni a reejecutar DML.

## Puertas de cierre

- suite completa y build verdes;
- cuatro migraciones activas, 90 SQL editoriales archivados;
- Preview Branch nueva con migraciones y seed completados;
- esquema de estadísticas presente en preview;
- producción sin mutación editorial y con la evolución estructural registrada;
- `main`, producción y tablero reconciliados;
- #492 cerrada y 0 PR abiertas.

## Certificación funcional

La PR [#730](https://github.com/nachosanchezperez-ux/base-cofrade/pull/730)
quedó fusionada en `c48096ebfdbe907cb8efde30d285d9b77f6c0ac1`, después de
incorporar los HEAD concurrentes de #729 y #731. Antes del merge se verificó:

- 90/90 SQL editoriales archivados idénticos byte a byte a sus archivos de
  origen;
- regresión específica: 66/66;
- suite completa vigente: 667/667;
- `next build` correcto;
- `git diff --check` limpio;
- CI y preview de Vercel verdes.

La Supabase Preview Branch de #730 (`tsindhyuxinpysbpvdhb`) nació sin copia de
producción y terminó en `FUNCTIONS_DEPLOYED`. Aplicó exactamente las cuatro
migraciones activas y después cargó el seed: 1 municipio, 2 entidades y 2
Bandas de QA. Conservó 0 aportaciones y 0 `source_links`, expuso las tres
columnas y los dos constraints de estadísticas de hermanos y no añadió avisos
de seguridad distintos de los ya presentes en producción.

## Reconciliación productiva

Antes de reparar el registro, producción contenía 87 marcas: las tres primeras
migraciones estructurales y 84 aplicaciones editoriales posteriores. El corte
se validó con el digest `fbb4767625778d7160740f1999c84cab` antes de modificar
la tabla de seguimiento.

Siguiendo el contrato de `migration repair`, la operación se limitó a
`supabase_migrations.schema_migrations`: retiró las 84 marcas que ya no forman
parte de la cadena ejecutable y marcó como aplicada
`20260908083000_add_brotherhood_membership_stats`, cuyo esquema ya estaba
materializado. No aplicó ni revirtió SQL editorial o estructural.

El postflight remoto confirma:

- historial exacto de 4/4 versiones activas;
- 3 columnas y 2 constraints de estadísticas de hermanos;
- 2.258 entidades, 1.694 Fuentes, 4.810 `source_links`, 75 Bandas, 132
  Hermandades y 21 filas de estadísticas procesionales;
- 0 `source_links` huérfanos;
- eliminación de la preview fallida obsoleta de #661; la rama no contenía
  datos únicos y puede recrearse desde Git si fuese necesario.

La producción web de `c48096eb…` quedó `READY` en
`dpl_DZNDHudTpvmCoqc1DCAmkpxEmC4L`: `hilocofrade.es` respondió HTTP 200 con
canonical, `index, follow`, Open Graph, Twitter y JSON-LD, sin errores de
runtime en el corte. Con esta certificación, el tablero vuelve a reflejar a
GitHub y #492 deja de bloquear los cambios estructurales futuros, que seguirán
obligados a pasar por una preview limpia.
