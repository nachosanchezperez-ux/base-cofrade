# Hilo Cofrade · Estado canónico

**Corte validado:** 4 de septiembre de 2026 · cierre de #581 Estrella de Coria y #582 La Trinidad  
**Régimen:** `FIRST EDITION FREEZE` activo  
**Fase activa:** editorial / documental sobre el modelo vigente

## Estado general

**PRIMERA EDICIÓN → 🟢 CERRADA, CERTIFICADA Y CONGELADA**

El frente operativo de cierre de Hermandades abierto el 4 de septiembre queda completado:

- #581 · Estrella de Coria → **MERGED y certificada**.
- #582 · La Trinidad → **MERGED y certificada**.
- PR abiertas tras ambos cierres → **0**.
- No queda ninguna de estas dos Hermandades como frente activo.
- No se ha abierto una Hermandad nueva dentro de esta tarea.

## Cierres documentales vigentes

### Estrella de Coria del Río

**ESTRELLA DE CORIA → 🟢 CERTIFICADA · 86 % · INDEXABLE · GRAFO CLEAN**

Documento: `docs/CERTIFICACION-ESTRELLA-CORIA-2026-09-04.md`.

Reconciliada expresamente contra el `main` posterior a #589. Se mantienen como deuda legítima únicamente huecos que no deben resolverse por inferencia: cabecera/escudo con derechos trazables, multimedia autorizada, colores institucionales verificados, autoría superior del paso, capataz actual y datos de hora/acompañamiento patronal 2026 todavía no publicados.

### La Trinidad

**LA TRINIDAD → 🟢 CERTIFICADA · 100 % · INDEXABLE · GRAFO CLEAN**

Documento: `docs/CERTIFICACION-LA-TRINIDAD-REVALIDADA-2026-09-04.md`.

La revalidación posterior a #589 confirma:

- Archicofradía de María Auxiliadora Coronada independiente;
- María Auxiliadora y San Juan Bosco vinculados procesionalmente a dicha corporación, no absorbidos por La Trinidad;
- tres pasos penitenciales correctamente relacionados;
- capataces de 2026 separados del relevo confirmado para 2027;
- música 2026 separada de histórico y cambios futuros confirmados;
- Rosario Vespertino del 13/12/2025 y extraordinaria del V Centenario de 2008 conservados;
- patrimonio, marchas, cultos, salidas, Fuentes e indexabilidad revalidados.

La única regresión material detectada durante el cierre fue temporal: un acompañamiento publicado como futuro podía entrar en el bloque vigente antes de su año/fecha de inicio. #582 añade un filtro común y test de regresión para impedir que los cambios musicales de 2027 se presenten como actuales en 2026.

## Efecto de #589 sobre Fuentes

#589 continúa siendo la regla vigente para Fuentes heredadas de agentes relacionados.

La auditoría reforzada de La Trinidad confirmó que Fuentes de segundo grado pertenecientes a otros contextos —por ejemplo Buen Fin/Sagrada Lanzada, Dulce Nombre de Bellavista o capataces de El Baratillo— no deben aparecer como Fuentes de La Trinidad solo por compartir autor/capataz.

El filtro de #589 evita esa contaminación sin eliminar Fuentes necesarias para las relaciones internas certificadas.

## Estado técnico

- Supabase producción: **ACTIVE_HEALTHY** en el último control de este cierre.
- Cambios estructurales en #581/#582: **0**.
- DDL nuevo: **0**.
- Tablas nuevas: **0**.
- Migraciones estructurales: **0**.
- Cambios RLS: **0**.
- Nueva arquitectura: **0**.
- UX general nueva: **0**.

## #492

**#492 · Reconciliar Supabase Preview Branches → 🟣 ABIERTA Y AISLADA.**

#492 sigue bloqueando únicamente:

- nuevo DDL;
- nuevas tablas;
- migraciones estructurales;
- cambios RLS.

No bloquea contenido, Fuentes, fotografías, patrimonio, música, históricos, cultos, salidas ni relaciones soportadas por el modelo actual.

## Frentes certificados anteriores que permanecen cerrados

- Amparo → 🟢 certificada.
- San Esteban → 🟢 certificada.
- La Sed → 🟢 certificada.
- Virgen del Castillo de Lebrija → 🟢 deuda de actualidad de septiembre de 2026 cerrada y verificada.
- Estrella de Coria → 🟢 certificada.
- La Trinidad → 🟢 certificada.

## Siguiente movimiento autorizado

Con el frente #581/#582 cerrado, el siguiente movimiento es **refrescar la auditoría global de Hermandades, recalcular la deuda documental real, devolver un TOP 3 y seleccionar una única Hermandad como próximo frente**.

La ejecución de esa nueva Hermandad no forma parte de este cierre y no debe iniciarse hasta una orden posterior.
