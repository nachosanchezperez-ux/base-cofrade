# Hilo Cofrade · Revalidación de La Trinidad

**Corte:** 5 de septiembre de 2026  
**Rama:** `fix/trinidad-musica-futura-relacional`  
**Base:** `main = 75a0ae4619aa000cbf348b8fda2c8511a7f8795a` · #605  
**Régimen:** `FIRST EDITION FREEZE` activo

## Incidencia

La certificación #582 había corregido la vigencia temporal de los acompañamientos futuros en el lector principal de Hermandades, pero el componente relacional `BrotherhoodOwnBands` mantenía una segunda consulta directa a `music_accompaniment_periods` filtrando únicamente por `is_current = true` y `status = published`.

En La Trinidad existen dos contratos confirmados para 2027:

- A.M. Juvenil Virgen de los Reyes → Cruz de Guía → desde 2027.
- A.M. Virgen de los Reyes → Sagrado Decreto → desde 2027.

Ambos deben permanecer documentados como futuros y no mostrarse como acompañamientos vigentes en 2026.

## Corrección

`components/BrotherhoodRelationalExtras.js` reutiliza ahora `futureMusicAccompanimentPeriodIds`, el mismo criterio temporal ya empleado por el lector principal.

La consulta relacional incorpora `date_from` y conserva `year_from`; antes de resolver bandas y construir `Tira del hilo`, elimina los periodos cuyo inicio todavía no ha llegado.

Efecto esperado en 2026:

- Sagrada Columna y Azotes → Cruz de Guía → vigente hasta 2026.
- Las Cigarreras → Sagrado Decreto → vigente hasta 2026.
- Tres Caídas de Triana → Cristo de las Cinco Llagas → vigente.
- Oliva de Salteras → Esperanza → vigente.
- A.M. Juvenil Virgen de los Reyes → no aparece como actual hasta 2027.
- A.M. Virgen de los Reyes → no aparece como actual hasta 2027.

Los contratos futuros no se modifican en base de datos, no se convierten en históricos y conservan sus Fuentes.

## Alcance

- DDL: 0.
- Tablas nuevas: 0.
- Migraciones estructurales: 0.
- RLS: 0.
- UX nueva: 0.
- Cambios editoriales en otras Hermandades: 0.
- #492: permanece aislada.

## Criterio de cierre

La regresión queda cerrada cuando CI/build sea correcto y la ruta pública de La Trinidad deje de proyectar los contratos de 2027 como `Acompañamiento actual` en el bloque relacional, manteniendo intacta la documentación futura.
