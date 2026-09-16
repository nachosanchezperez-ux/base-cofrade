# Certificación · Dos Hermanas · macrolote municipal HC-016

**Fecha:** 16 de septiembre de 2026  
**HEAD inicial:** `4588879d38e02bf00ba4f98ab22595438012fe02`  
**Lote:** `c0160027-0000-4000-8000-000000000001`  
**Esquema:** sin cambios; DML exclusivamente

## Alcance

El universo verificable queda fijado en veinte corporaciones canónicas: catorce con salida penitencial, una sacramental, cuatro de gloria y la agrupación parroquial del Dulce Nombre. Las asociaciones y grupos de fieles no se promocionan a Hermandad. Santa Ana y Santo Entierro se preservan como contextos certificados.

| Familia | Resultado |
|---|---:|
| Hermandades publicadas | 20/20 |
| Bandas locales publicadas | 7/7 |
| Relaciones con titulares | 34 |
| Relaciones con Pasos | 29 |
| Acompañamientos vigentes | 26 |
| Salidas de 2026 | 17 |
| Fuentes directas de Hermandad | 45 |

La agenda procesional de Semana Santa de 2026 se incorpora como hecho celebrado. Cultos, igualás, conciertos, Crucetas, autorías y multimedia sin evidencia suficiente permanecen como huecos legítimos.

## Composición HC-016

| Concepto | Total |
|---|---:|
| Operaciones editoriales | 467 |
| Insert / upsert | 461 |
| Update | 6 |
| Reuse canónico | 20 |
| Fuentes | 8 |
| Enlaces de Fuente | 141 |
| Entidades | 84 |
| Imágenes titulares | 30 |
| Pasos | 26 |
| Salidas nuevas | 13 |

## Preflight y Apply

Secuencia: `CARGA → STAGING → PREFLIGHT GLOBAL → REVISIÓN → APPLY → RESULTADOS`.

- Staging y válidas: 467/467.
- Inválidas, referencias sin resolver, ambigüedades, colisiones y fallos: 0.
- Diecinueve unidades editoriales y el bloque compartido pasaron en transacción reversible.
- Apply por veinte unidades transaccionales: 20/20.
- Lote final: `completed`, 467/467.

La única colisión detectada antes del Apply afectaba a Santa Cruz: un Paso de San Benito de Sevilla, de nombre parecido, había quedado referenciado por un periodo musical antiguo. Se conservó intacto el nodo sevillano, se creó el Paso propio de Dos Hermanas y se corrigió el periodo existente. El preflight posterior quedó limpio.

## QA relacional

- 0 slugs duplicados en el ámbito municipal.
- 0 titulares, Pasos o acompañamientos huérfanos.
- 0 Pasos procesionales compartidos por corporaciones distintas.
- 0 relaciones con municipio incoherente.
- 0 Salidas pasadas en `announced`.
- El buscador municipal deriva de `municipality_id` y de relaciones canónicas; no incorpora excepciones por nombre o `slug`.

## Fuentes principales

- [Directorio de Hermandades de Dos Hermanas](https://doshermanascofrade.com/hermandad/)
- [Semana Santa de Dos Hermanas 2026](https://www.doshermanasaldia.com/semanasanta)
- [Vera-Cruz de Dos Hermanas](https://www.veracruzdoshermanas.org/)
- [Romería de Valme · Ayuntamiento de Dos Hermanas](https://www.doshermanas.es/Ayuntamiento/servicios-a-la-ciudadania/guia-de-dos-hermanas/la-romeria-de-valme/)
- [Hermandad del Rocío de Dos Hermanas](https://rociodoshermanas.es/)

## Deuda legítima

No se infieren calendarios de Cultos, convocatorias futuras, cargos personales, continuidad musical de 2027, repertorios, conciertos o recursos visuales. Una recurrencia no equivale a una edición de 2026 y un anuncio no equivale a un hecho celebrado.

## Cierre técnico

La PR, el SHA final, el deployment exacto y los errores posteriores se completan durante el postflight. Dos Hermanas no se considera cerrado hasta que `main` y producción coincidan y GitHub vuelva a 0 PR abiertas. Solo después puede activarse Alcalá de Guadaíra.

## Observación de Auditor

Dos Hermanas confirma que un municipio no se cierra multiplicando fichas aisladas. El valor está en preservar contextos certificados, promover solo entidades canónicas y resolver conjuntamente identidad, titulares, Pasos, música, salidas, fuentes y búsqueda territorial.
