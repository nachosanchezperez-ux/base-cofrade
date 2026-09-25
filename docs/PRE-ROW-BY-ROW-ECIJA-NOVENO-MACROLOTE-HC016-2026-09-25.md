# Pre-row-by-row · Écija · noveno macrolote municipal HC-016

**Fecha:** 25 de septiembre de 2026  
**Estado:** CERRADO · PLAN Y MANIFIESTO CONGELADOS · SIN DML EJECUTADO  
**Base viva:** `de420589baa03db98cfda4a11796606592761f50`  
**Namespace:** `c0160036-*`

## Contrato

- **776 operaciones DML lógicas**;
- **15 REUSE externos**;
- **0 DELETE**;
- **0 DDL**;
- **0 RLS**;
- namespace `c0160036-*`: 0 colisiones en 16 familias;
- 107 slugs propuestos: 0 colisiones;
- 2 corporaciones draft reutilizadas;
- 1 Paso draft reutilizado;
- 8 nodos musicales REUSE;
- 18 formaciones nuevas;
- 42 Fuentes materiales distintas: 40 nuevas + 2 REUSE;
- ECI-F41 se colapsa en ECI-F24 por URL idéntica;
- ECI-F26 permanece solo como contraste documental.

## Alcance de primera edición

Se materializan **34 imágenes procesionales primarias** necesarias para representar los 32 Pasos y las 16 Salidas.

No se crean todavía:
- titulares no procesionales sin identidad física individual verificada;
- figuras secundarias de misterios;
- la futura imagen de Jesús de las Tres Caídas de Las Penas;
- multimedia sin licencia.

## REUSE externos congelados

| Tipo | UUID | Nodo |
|---|---|---|
| municipio | `f3fba0c4-fffa-4e8c-8495-3dc1c3bc94bf` | Écija |
| lugar | `ba238706-78ac-4550-91d4-b826508fcb03` | Iglesia Parroquial Mayor de Santa Cruz |
| source | `e9bbf639-dc91-4438-9264-f80c7017f0c2` | ECI-F38 · San Benito |
| source | `e14d91ca-af59-461e-ace1-9f70b5d696b3` | ECI-F44 · Álvarez Quintero |
| corporation | `c6100000-0000-4000-8000-000000000009` | Hermandad de la Expiración de Écija · draft |
| corporation | `e8b83412-786d-44a9-abc1-383b1c3fb82d` | Hermandad del Confalón de Écija · draft |
| step | `52d0bc09-c7a1-43a1-a285-9196257d1567` | Paso de Columna y Azotes · draft |
| band | `98c7b480-9917-439f-aea4-d26e474add78` | Ciudad de Dos Hermanas |
| band | `c6000000-0000-4000-8000-000000000002` | Santa María Magdalena de Arahal |
| band | `9aef3c3e-e9c8-433f-8257-ea10f4c083b1` | Sangre de San Benito |
| band | `7fafdc04-cb94-47d8-814f-5537639660ff` | Asociación Musical Álvarez Quintero |
| band | `c0160033-0401-4000-8000-000000000001` | Afligidos de Puente Genil |
| band | `2f6c0b1b-b3c8-43d7-99ac-8f341a65f2d1` | Ars Sacra |
| band | `045c9781-6a07-40f4-9a27-be97b736e5a9` | AMUECI |
| band | `c0160032-0401-4000-8000-000000000001` | Banda de Música de Estepa |

## Operaciones sobre IDs externos

Solo seis DML del futuro payload tocarán IDs fuera de `c0160036-*`:

- `entities`: Expiración, Confalón y Paso de Columna/Azotes;
- `brotherhoods`: Expiración y Confalón;
- `steps`: Paso de Columna/Azotes.

El duplicado legado Álvarez Quintero `f492d28d-af48-4606-862c-89d5d3560a6b` no se modifica ni se borra.

## Cierre

- [PLAN-ROW-BY-ROW-ECIJA-HC016-2026-09-25.md](./PLAN-ROW-BY-ROW-ECIJA-HC016-2026-09-25.md)
- [ANEXO-SOURCE-LINKS-ECIJA-HC016-2026-09-25.md](./ANEXO-SOURCE-LINKS-ECIJA-HC016-2026-09-25.md)
- [MANIFIESTO-DETERMINISTA-ECIJA-HC016-2026-09-25.md](./MANIFIESTO-DETERMINISTA-ECIJA-HC016-2026-09-25.md)

**Siguiente puerta:** preparar el SQL rollback-only de preflight. Su creación documental no autoriza ejecutarlo.

Siguen en 0: staging · dry-run ejecutado · Apply.
