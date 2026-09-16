# Certificación · Alcalá de Guadaíra · macrolote municipal HC-016

**Fecha:** 16 de septiembre de 2026  
**HEAD inicial:** `8a0fd32d397e8a1fb3fd9f8cc4a84abc50328762`  
**Lote:** `c0160028-0000-4000-8000-000000000001`  
**Esquema:** sin cambios; DML exclusivamente

## Diagnóstico y alcance

El Consejo Local acredita catorce corporaciones únicas: diez penitenciales y cuatro de gloria. Divina Misericordia y Amargura aparecen en más de una dimensión, pero no se duplican. La ficha certificada de Divina Misericordia se preserva; Cautivo y Dulce Nombre se promueven desde sus nodos preexistentes y once corporaciones se crean.

| Familia | Resultado |
|---|---:|
| Hermandades publicadas | 14/14 |
| Bandas locales preservadas | 4/4 |
| Relaciones con titulares | 29 |
| Relaciones con Pasos | 21 |
| Acompañamientos vigentes | 4 |
| Estaciones celebradas en 2026 | 10 |
| Hermandades con Fuente directa | 14/14 |

## Composición HC-016

| Concepto | Total |
|---|---:|
| Operaciones editoriales | 309 |
| Insert / upsert | 307 |
| Update determinista | 2 |
| Reuse canónico | 10 |
| Fuentes | 16 |
| Enlaces de Fuente | 84 |
| Entidades | 57 |
| Imágenes titulares nuevas | 25 |
| Pasos nuevos | 19 |
| Salidas nuevas | 9 |

Divina Misericordia completa el resultado municipal con cuatro titulares, dos Pasos y la décima estación de penitencia de 2026 ya certificada.

## Preflight, Apply y postflight

Secuencia: `CARGA → STAGING → PREFLIGHT GLOBAL → REVISIÓN → APPLY → RESULTADOS`.

- Staging y válidas: 309/309.
- Inválidas, referencias sin resolver, ambigüedades, colisiones y fallos: 0.
- Catorce unidades pasaron en transacción reversible.
- Apply ordenado por dependencias: 15/15 bloques.
- Lote final: `completed`, 309/309.
- 0 relaciones de titulares o Pasos huérfanas.
- 0 relaciones con municipio incoherente.
- 0 Salidas pasadas en `announced`.
- 0 slugs publicados duplicados.

## Fuentes principales

- [Consejo Local de Hermandades y Cofradías](https://www.consejohermandadesalcala.es/)
- [Horarios y recorridos de la Semana Santa de Alcalá de Guadaíra 2026](https://www.lavozdealcala.com/cofradias/140391-horarios-y-recorridos-de-la-semana-santa-de-alcala-de-guadaira-2026/)
- Las catorce fichas oficiales enlazadas desde el directorio del Consejo.

## Actualidad y deuda legítima

Las diez estaciones penitenciales de 2026 se registran como celebradas porque existe evidencia posterior. Los cultos descritos por recurrencia no se convierten en ediciones fechadas. Igualás, conciertos, Crucetas, patrimonio exhaustivo, cargos personales y música no acreditada permanecen como huecos legítimos.

## Buscador y directorios

Hermandades, Bandas y resumen municipal derivan de `municipality_id` y de relaciones canónicas. No se añaden excepciones nominales, de texto o `slug` para Alcalá de Guadaíra.

## Observación de Auditor

El cierre demuestra que una localidad con corporaciones de naturaleza mixta debe medirse por identidades únicas, no sumando categorías. La reutilización de Divina Misericordia, Cautivo, Dulce Nombre y las cuatro bandas locales evita duplicados y conserva la historia del grafo.

## Cierre técnico

La PR, el SHA final, el deployment exacto y los errores posteriores se completan durante el postflight. El programa Dos Hermanas + Alcalá de Guadaíra termina únicamente cuando `main` y producción coincidan y GitHub vuelva a 0 PR abiertas.

