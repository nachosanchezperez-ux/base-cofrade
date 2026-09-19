# Certificación · preflight SQL de Estepa · quinto macrolote municipal HC-016

**Fecha:** 19 de septiembre de 2026  
**Fase:** PRE-LOTE · payload SQL exacto  
**Namespace:** `c0160032-*`  
**Bulk import reservado:** `c0160032-0000-4000-8000-000000000001`  
**Staging:** **0**  
**Apply:** **0**  
**DDL / RLS:** **0 / 0**

## Veredicto

**PREFLIGHT SQL · CERRADO Y EN VERDE**

El payload exacto del futuro macrolote municipal de Estepa ejecuta correctamente sobre el esquema y los datos vigentes cuando se somete a una única transacción con `ROLLBACK`.

Resultado exacto:

`PREFLIGHT_ESTEPA_SQL_OK_ROLLED_BACK`

| Clase | Total |
|---|---:|
| INSERT / UPSERT | 490 |
| UPDATE | 4 |
| DELETE controlado | 1 |
| **TOTAL DML** | **495** |
| REUSE | 21 |

## Archivo reproducible

El SQL probado queda archivado en:

`supabase/migrations_archive/post-first-edition-editorial/20260919120000_preflight_estepa_quinto_macrolote_hc016.sql`

Características verificadas del archivo:

- 145.295 caracteres;
- contiene `BEGIN`;
- contiene `ROLLBACK`;
- **no contiene `COMMIT`**;
- **no contiene escrituras sobre `bulk_imports` ni `bulk_import_items`**;
- contiene las 495 operaciones previstas;
- termina con la señal de preflight correcta.

## Doble ejecución de preflight

### Ejecución 1
El payload generado desde el manifiesto se ejecutó íntegramente contra Supabase dentro de transacción.

Primera incidencia detectada:
- `public.steps` no dispone de columna `updated_at`.

La transacción se abortó sin escrituras persistentes.

Corrección:
- se eliminó únicamente `updated_at=now()` del UPDATE del Paso existente del Nazareno.

### Ejecución 2
Payload corregido:

- 495/495 operaciones parseadas y ejecutadas;
- guardas globales superadas;
- `ROLLBACK` correcto;
- señal `PREFLIGHT_ESTEPA_SQL_OK_ROLLED_BACK`.

### Reejecución desde GitHub
Después de archivar el SQL, se volvió a leer el archivo desde GitHub y se ejecutó **ese archivo exacto** contra Supabase.

Resultado:
- `PREFLIGHT_ESTEPA_SQL_OK_ROLLED_BACK`;
- 495 DML;
- 490 INSERT/UPSERT;
- 4 UPDATE;
- 1 DELETE;
- 21 REUSE.

Por tanto, el archivo del repositorio y el payload validado son equivalentes.

## Guardas superadas

Dentro de la transacción se verificó:

- 13 Hermandades públicas de Estepa;
- 12 nuevas + Jesús Nazareno reutilizado;
- 7 Bandas nuevas;
- 4 Bandas locales de Estepa;
- 28 Imágenes físicas;
- 18 Pasos;
- 13 series;
- 13 nuevas Salidas;
- 11 Salidas `held`;
- 2 Salidas `announced`;
- 16 posiciones musicales;
- 16 asignaciones musicales;
- exactamente 2 asignaciones textuales;
- 14 periodos musicales;
- 8 Cultos;
- 8 ediciones cultuales;
- 23 Fuentes nuevas;
- 143 `source_links`;
- conferencia del 25 de septiembre presente y `announced`;
- Paso del Nazareno y sus dos relaciones promocionados desde `review` a `published`;
- 0 música inventada en Los Estudiantes;
- 0 música inventada en Santa Ana;
- 0 slugs duplicados dentro del lote.

## DELETE controlado

Fuente candidata:

`dc375c1f-9318-4de9-ae1f-d1f10a7d050f`

El payload:
1. recorre dinámicamente todas las FK hacia `sources`;
2. aborta si encuentra una referencia;
3. exige que siga existiendo la Fuente canónica `72ac1537-8940-4455-8e8d-c17169baa0aa`;
4. solo entonces ejecuta el DELETE.

En producción, antes y después del preflight, la candidata sigue con 0 relaciones porque el DELETE fue revertido por `ROLLBACK`.

## Sin residuos

Después del preflight:

- namespace `c0160032-*` en `entities`: 0;
- namespace en `sources`: 0;
- namespace en `places`: 0;
- bulk import reservado: 0 filas;
- imports Estepa: 0;
- Hermandades Estepa: 1;
- Bandas Estepa: 0;
- Salidas Estepa: 2.

El preflight no ha materializado contenido editorial.

## Puerta siguiente

La fase PRE-LOTE queda técnicamente preparada para **staging gobernado**, pero esta certificación **no lo crea**.

El siguiente movimiento requiere una orden posterior y debe comenzar con:

1. refrescar main / PR / Vercel / Supabase;
2. comprobar que `c0160032-*` continúa libre;
3. comprobar 21/21 REUSE;
4. comprobar URLs/slugs sin nuevas colisiones;
5. crear staging con el mismo payload archivado;
6. no ejecutar Apply hasta un nuevo preflight global del staging.

