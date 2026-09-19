# Inventario canónico y matriz de Fuentes · Lebrija · sexto macrolote municipal HC-016

**Fecha:** 19 de septiembre de 2026  
**Fase:** PRE-LOTE RESUELTO / ROW-BY-ROW CERRADO  
**Municipio:** Lebrija · `07281b21-d892-4e5d-aa63-24ec0e9bf4d2`  
**Namespace candidato:** `c0160033-*` · libre y no materializado  
**DML exactas:** **473** · **32 REUSE**  
**Staging:** 0 · **Apply:** 0

La estimación preliminar queda sustituida por el preflight específico y el plan row-by-row.

## 1. Corporaciones

12 canónicas:
- Entrada Triunfal.
- Oración.
- Humildad.
- Ecce-Homo.
- Castillo · REUSE.
- Dolores.
- Vera-Cruz.
- Santo Sepulcro.
- Soledad.
- Rocío.
- San Benito.
- Sacramental.

Aurora pertenece a Humildad. Castillo Gloria pertenece a la misma Hermandad del Castillo. Dolores y Sacramental son corporaciones distintas.

## 2. Imágenes

**24 físicas · 23 nuevas + Virgen del Castillo REUSE.**

Entrada Triunfal:
- Jesús en su Entrada Triunfal;
- Nuestra Señora de la Estrella;
- San Juan Evangelista.

Oración:
- Jesús Orando en el Huerto;
- Cristo de la Buena Muerte;
- Santa María de Jesús.

Humildad:
- Jesús de la Humildad;
- Virgen de la Victoria;
- Virgen de la Aurora;
- San Juan Evangelista.

Ecce-Homo:
- Jesús del Ecce-Homo;
- Virgen del Mayor Dolor.

Castillo:
- Jesús Atado a la Columna;
- Virgen del Castillo Coronada · REUSE;
- San Pedro Apóstol.

Dolores:
- Jesús Nazareno;
- María Santísima de los Dolores;
- Santa Mujer Verónica;
- San Juan Evangelista.

Vera-Cruz:
- Cristo de la Vera-Cruz;
- Virgen de Consolación.

Santo Sepulcro:
- Cristo de las Cinco Llagas / Yacente.

Soledad:
- Virgen de la Soledad.

San Benito:
- San Benito Abad.

Rocío no fuerza el Simpecado a `image`. Sacramental reutiliza la advocación global del Santísimo Sacramento mediante `entity_relations`.

## 3. Pasos

**23 nuevos.**

- Entrada: 2.
- Oración: 3.
- Humildad: 3.
- Ecce-Homo: 2.
- Castillo: 3.
- Dolores: 5.
- Vera-Cruz: 2.
- Santo Sepulcro: 1.
- Soledad: 1.
- San Benito: 1.

San Juan de Humildad no posee Paso actual. El Corpus de San Francisco usa un Paso de S.D.M. sin crear una imagen artificial.

## 4. Lugares

REUSE:
- Parroquia de la Oliva.
- Ermita del Castillo.
- Convento de la Purísima Concepción.

Nuevos:
1. Parroquia de Santa María de Jesús.
2. Capilla de la Aurora.
3. Iglesia de Belén.
4. Iglesia de San Francisco.
5. Capilla de la Vera-Cruz.
6. Ermita de San Benito.

## 5. Música

REUSE:
- Banda de Música Virgen del Castillo.

Nuevas:
- AM Afligidos de Puente Genil.
- BM Maestro Agripino Lozano de San Fernando.
- BM Nuestra Señora del Rosario de El Cuervo.
- Banda Amor y Sacrificio de Lebrija.

Relaciones 2026 estructuradas: **11**. No se publica música por tradición sin evidencia.

## 6. Salidas

**13 nuevas**:
- 9 estaciones de penitencia · held;
- Rocío 19/05 · held;
- Corpus de San Francisco 14/06 · held;
- San Benito 10/07 · announced;
- Rosario de la Aurora 15/08 · announced.

REUSE:
- Castillo patronal 12/09 · held.

Series nuevas: **16**, incluyendo serie patronal Castillo, San Pedro anual y Corpus Sacramental. San Pedro incorpora occurrence 2026 `announced`; el Corpus Sacramental no fabrica occurrence 2026.

## 7. Cultos

Nuevos:
- Aurora · Besamano.
- Aurora · Triduo.
- Aurora · Función.
- San Benito · Quinario.
- Sacramental · culto mensual.

Occurrences nuevas: **3**, únicamente Aurora 2026.

Los 3 Cultos + 3 occurrences 2026 del Castillo permanecen REUSE sin alterar sus estados.

## 8. Autores

REUSE:
- Juan Manuel Miñarro.
- Juan Abascal.
- Pedro Roldán.

Nuevos:
- Juan Herrera Cala.
- Juan Antonio González García «Ventura».
- Diego Roldán y Serrallonga.

Autorías estructuradas: **6**.

## 9. Fuentes

Planificadas: 31 URL.
- 30 nuevas;
- 1 REUSE por URL exacta: Congregación Nazarena · Hermandades.

Además se reutilizan 8 Fuentes existentes del universo Castillo.

Trazabilidad nueva: **123 source_links**.

## 10. Recuento DML

| Familia | Filas |
|---|---:|
| municipalities | 2 |
| sources | 31 |
| places | 6 |
| entities | 64 |
| brotherhoods INSERT | 11 |
| bands | 4 |
| agents + names + disciplines | 9 |
| images | 23 |
| brotherhood_images | 23 |
| image_authorships | 6 |
| steps | 23 |
| brotherhood_steps | 23 |
| image_steps | 23 |
| entity_relations | 2 |
| outing_series | 16 |
| outings INSERT | 14 |
| outing_entities | 24 |
| music positions | 12 |
| music assignments | 12 |
| music periods | 12 |
| cults | 5 |
| cult_occurrences | 3 |
| source_links | 123 |
| UPDATE Castillo | 1 |
| UPDATE salida patronal Castillo | 1 |
| **TOTAL** | **473** |

Contrato final del preflight:
- **471 INSERT/UPSERT**;
- **2 UPDATE**;
- **0 DELETE**;
- **32 REUSE**.

## 11. Autoridad

La autoridad detallada pasa a:
- [Preflight específico](./PREFLIGHT-LEBRIJA-SEXTO-MACROLOTE-MUNICIPAL-HC016-2026-09-19.md)
- [Plan row-by-row](./PLAN-ROW-BY-ROW-LEBRIJA-HC016-2026-09-19.md)

Siguiente puerta:
**IDs deterministas → manifiesto 473/473 → SQL completo → ROLLBACK**.

No crear staging ni ejecutar Apply.
