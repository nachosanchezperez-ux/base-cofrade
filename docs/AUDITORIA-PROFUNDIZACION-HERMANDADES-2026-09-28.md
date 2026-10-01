# Auditoría de profundización de Hermandades públicas · 28/09/2026

## Corte inicial

- main: `41c8fbb12d1eda29e714d9aff0ecb946aac31ed1`
- producción: READY en el mismo SHA
- PR abiertas al comenzar: 0
- Supabase: ACTIVE_HEALTHY
- migraciones estructurales: 17
- runtime 6 h: 0 errores/fatal
- Hermandades públicas auditadas: 279
- HC-AUTO-03: ready 55/55 · 0 applied

La auditoría no usa el porcentaje histórico como ranking. P0/P1/P2 se derivan del grafo vivo, tipología, vigencia temporal, relaciones y trazabilidad.

## Deuda inicial

- P0 · error/regresión: **9 Hermandades**
- P1 · deuda nuclear demostrable: **45 Hermandades**
- P2 · profundidad: **270 Hermandades**

P0 se concentra en diez periodos musicales caducados que seguían marcados `is_current=true`, repartidos entre nueve Hermandades.

## TOP 10 inicial

| # | Hermandad | Municipio | Nivel útil aprox. | Prioridad | Deuda principal | Fuentes | Volumen | Riesgo |
|---|---|---|---:|---|---|---|---|---|
| 1 | Virgen de la Sangre de Huévar | Huévar del Aljarafe | 41 % | P0 + P1 | Vigencia musical caducada; sede, titulares y Pasos | Media | Alto | Alto |
| 2 | Divina Pastora de Marchena | Marchena | 62 % | P0 + P1 | Vigencia musical, sede y titular; relaciones de Salida | Alta tras contraste | Medio | Medio |
| 3 | Las Maravillas de San Diego | Sevilla | 80 % | P0 | Vigencia musical; autorías/fases, patrimonio y acontecimientos | Alta | Bajo-Medio | Bajo |
| 4 | Vera Cruz de Tocina | Tocina | 89 % | P0 | Vigencia musical puntual; profundidad de Paso | Alta | Bajo | Bajo |
| 5 | Santa Genoveva | Sevilla | 89 % | P0 | Conflicto entre `date_to` de la edición y continuidad contractual | Alta | Bajo | Medio |
| 6 | Divina Pastora de Santa Marina | Sevilla | 86 % | P0 | Dos actuaciones puntuales aún marcadas vigentes | Alta | Bajo | Bajo |
| 7 | Valvanera | Sevilla | 83 % | P0 | Actuación 2026 aún vigente; autorías/fases/colores | Alta | Medio | Bajo |
| 8 | Guadalupe de San Buenaventura | Sevilla | 89 % | P0 | Actuación puntual 2026 aún marcada vigente | Alta | Bajo | Bajo |
| 9 | Pastora de Triana | Sevilla | 89 % | P0 | Actuación puntual 2026 aún marcada vigente | Alta | Bajo | Bajo |
| 10 | Soledad de La Algaba | La Algaba | 64 % | P1 | Pasos, Salida y relaciones musicales; autorías parciales | Alta | Medio | Medio |

## TOP 3

1. Virgen de la Sangre de Huévar.
2. Divina Pastora de Marchena.
3. Las Maravillas de San Diego.

## Ficha elegida

**Divina Pastora de Marchena.**

La primera candidata bruta, Virgen de la Sangre de Huévar, mezcla alcance penitencial y glorioso, con menos trazabilidad directa y más riesgo de dispersión. Marchena mantiene P0 y P1 reales, pero tiene un alcance acotado, Salida/Banda ya modeladas, fuentes 2026 disponibles y cierre viable exclusivamente con DML editorial.

El puesto 3 y los siguientes quedan congelados. Tras la certificación y vuelta a 0 PR, el ranking debe recalcularse desde cero.
