# Correcciones de integridad · 16/10/2026 · APLICADO Y VERIFICADO

**Autorización:** propietario, 16/10/2026 («Vamos a corregir»).
**Origen:** errores confirmados del control de integridad (Tarea 07, `docs/auditorias/integridad-tarea07-20261012`).
**Alcance:** solo cambios de `status` y del destino de 4 enlaces de fuente. Nada se borra. Sin DDL, RLS, migraciones ni código.

## Qué se corrigió

| # | Caso | Se conserva | Se archiva | Motivo |
|---|---|---|---|---|
| 1 | Cigarreras · Jueves Santo 2026 duplicada | `195e7c51` · salida desde Los Terceros (obras de la sede), fuente oficial de la Hermandad, serie anual y tramo de la Banda de CCTT Sagrada Columna y Azotes | `ec8adb13` y sus 2 posiciones y 2 asignaciones musicales | El registro archivado tenía el templo de salida equivocado (la capilla habitual) e incluía al Cristo de la Púrpura, titular que no procesiona (no tiene paso). Sus 2 fuentes (Consejo y Cadena SER) pasan a la salida conservada. Su slug no se usaba en ninguna URL |
| 2 | El Cachorro · Expiración → su paso, repetida | `6978634d` (con nota canónica) | `ec160000-…-0009` | Misma relación dos veces, sin nota ni fuente |
| 3 | El Cachorro · Patrocinio → su palio, repetida | `a4895ec2` | `ec160000-…-0010` | Ídem |
| 4 | San Esteban · Cigarreras tras el palio | `18ca9f4a` · 2009–2026, dos fuentes | `a9562180` · 2009–2020 | Fin contradictorio. El propietario confirma el cambio de banda para 2027, coherente con 2026 como último año |
| 5 | Valvanera · Las Nieves de Olivares | `6f5a60f6` · desde 2014, vigente | `8f1650c1` · solo 2026 | Duplicaba el periodo vigente. Su fuente (aportación 2026) pasa al periodo conservado |
| 6 | Confalón de Écija · Sangre de San Benito | `a5cdcae8` · 2020–2026 | `c0160036-1313-…` · solo 2026, sin fuente | Contenido en el periodo largo |
| 7 | Montserrat | — | — | Se **publican** dos relaciones que estaban en borrador entre fichas ya publicadas: titular Cristo de la Conversión del Buen Ladrón (`4b8fd019`) y paso de palio (`3fef1b12`) |

## Procedimiento

1. Relectura en vivo de cada caso y de todo lo que apunta a cada fila (fuentes, música, series, URLs).
2. Copia de las filas afectadas, tomada a las 13:23 UTC.
3. `apply.sql`: un único bloque idempotente que valida el estado final y aborta si algo no cuadra.
4. **Ensayo** con error forzado al final: todas las validaciones pasan y no se guarda nada (comprobado).
5. **Aplicación** del mismo bloque: sin errores.
6. **Comprobación posterior**.

## Comprobación posterior (SQL)

| Comprobación | Antes | Después |
|---|---|---|
| Salidas duplicadas con imagen común | 1 | **0** |
| Relaciones vigentes duplicadas | 2 | **0** |
| Periodos solapados de la misma banda en el mismo paso | 3 | **0** |
| Relaciones en borrador de Montserrat | 2 | **0** |
| Referencias rotas | 0 | 0 |

Vista de un visitante anónimo (rol `anon`, RLS real):

- 1 salida de Cigarreras el 02/04/2026, con sus tres bandas: Las Cigarreras, la Banda de CCTT Sagrada Columna y Azotes y la Banda de Música de la Victoria.
- 0 posiciones musicales visibles de la salida archivada.
- Montserrat muestra sus 2 titulares y sus 2 pasos.
- San Esteban muestra solo el periodo 2009–2026.
- El Cachorro tiene 2 relaciones imagen↔paso, una por pareja.

**Pendiente de comprobación:** la vista en la web. Las fichas usan una caché de unos 5 minutos, así que los cambios deben aparecer solos sin desplegar.

## Reversión

`rollback.sql` restaura exactamente los estados y los enlaces de fuente anteriores. No restaura el sello `updated_at` que los disparadores actualizan.

## No incluido en este lote

- Las 10 relaciones en borrador restantes entre fichas publicadas (Divino Perdón, Desamparados del Santo Ángel, titulares de Los Rosales, Aznalcázar, Paradas…), que necesitan revisión editorial caso a caso.
- El archivado de las fichas de Moriles, que necesita autorización aparte.
- La tabla heredada `accompaniments`: sus 2 filas de la salida archivada se conservan como evidencia, como establece #1139.

---

# Lote 2 · 17/10/2026 · APLICADO Y VERIFICADO

**Autorización:** propietario, 17/10/2026: publicar 9 relaciones y archivar Moriles. Ficheros `lote2-apply.sql` y `lote2-rollback.sql`.

## A · 9 relaciones publicadas

Las 9 se retuvieron en septiembre con la nota «hasta el cierre editorial de la Imagen». Todas las imágenes y pasos implicados ya están publicados, así que la web los mostraba sin su Hermandad.

| Relación | Detalle |
|---|---|
| Titulares | Fátima → Los Rosales · Angustias → Aznalcázar · Dolores → El Castillo de las Guardas · Cristo de la Misericordia → Santo Entierro de Paradas · Piedad → Vera Cruz de Sanlúcar la Mayor |
| Pasos | Divino Perdón y Desamparados del Santo Ángel. En los dos, el paso ya lleva al titular de la misma Hermandad |
| Imagen ↔ Paso | Santa Elena y Santa Cruz de Abajo → paso de la Cruz de Abajo de Aznalcóllar, de la misma Hermandad |

## B · Moriles archivado

Moriles es de Córdoba y queda fuera del ámbito del proyecto, por decisión del propietario del 12/10. Se archivan:

- la Hermandad de Jesús Preso (`jesus-preso-moriles`);
- su imagen titular;
- la salida del 19/09/2026;
- su relación de titular, que estaba en revisión.

La URL `/hermandades/jesus-preso-moriles` deja de servirse y sale del sitemap. La URL de la extraordinaria ya se retiró del manifiesto con #1158, fusionada (`9df9f39`).

## Verificación

- Ensayo con error forzado al final: todas las validaciones pasan y no se guarda nada.
- Aplicación sin errores.
- Comprobación final: 0 Hermandades y 0 salidas publicadas fuera de la provincia de Sevilla.
- Vista anónima (RLS real): Moriles no aparece, y los 5 titulares, los 2 pasos y las 2 relaciones imagen↔paso son visibles.
