# Cierre pre-row-by-row · Écija · HC-016

**Fecha:** 25 de septiembre de 2026  
**Estado:** CERRADO · PLAN Y MANIFIESTO CONGELADOS · SIN DML EJECUTADO

## Resultado

- namespace `c0160036-*` = 0 colisiones en 16 familias revisadas;
- 96 slugs de entidades nuevas = 0 colisiones;
- 11 slugs de Lugar = 0 colisiones;
- 16 slugs de outing = 0 colisiones;
- 18 nombres exactos de Bandas nuevas = 0 colisiones;
- 44 Fuentes = 42 nuevas + 2 REUSE por URL;
- 3 nodos draft detectados y preservados como UPDATE/REUSE.

Contrato final:

**730 DML · 724 UPSERT · 6 UPDATE/REUSE · 12 REUSE externos puros · 0 DELETE · 0 DDL · 0 RLS**

Los seis UPDATE/REUSE DML corresponden a tres nodos ya existentes:

- Expiración de Écija: `entities` + `brotherhoods`;
- Confalón de Écija: `entities` + `brotherhoods`;
- Paso del Santísimo Cristo de la Columna y Azotes: `entities` + `steps`.

No se cambia ninguno de sus UUID.

## Primera edición congelada

- 15 sujetos corporativos;
- 16 Salidas históricas 2026;
- 32 Pasos;
- 34 Imágenes procesionales primarias;
- 34 relaciones Imagen–Paso;
- 66 participaciones efectivas;
- 32 posiciones musicales;
- 28 assignments;
- 27 periodos musicales cerrados a 2026;
- 179 source_links.

No se incorporan figuras secundarias de misterio ni titulares no procesionales sin evidencia individual.

## Próxima puerta

Preparar el SQL de preflight transaccional rollback-only a partir del plan congelado.

Su preparación documental no autoriza su ejecución.

Siguen en 0:

- staging;
- dry-run ejecutado;
- Apply;
- DDL;
- RLS.

HC-AUTO-03 permanece bloqueado.
