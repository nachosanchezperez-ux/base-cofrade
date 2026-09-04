# Hilo Cofrade · Estado canónico

**Corte validado:** 4 de septiembre de 2026 · cierre documental de Consolación de Carrión de los Céspedes  
**Régimen:** `FIRST EDITION FREEZE` activo  
**Fase activa:** editorial / documental sobre el modelo vigente

## Estado general

**PRIMERA EDICIÓN → 🟢 CERRADA, CERTIFICADA Y CONGELADA**

El frente documental seleccionado en la auditoría global del 4 de septiembre queda completado:

- #581 · Estrella de Coria → **MERGED y certificada**.
- #582 · La Trinidad → **MERGED y certificada**.
- Consolación de Carrión de los Céspedes → **certificada al 93 %**, indexable y con grafo limpio.
- #590 · paleta de Las Cigarreras → **MERGED** durante el cierre de Carrión; revalidado sin incidencia sobre este frente documental.
- No queda ninguna de estas Hermandades como frente activo.

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

La única regresión material detectada durante aquel cierre fue temporal: un acompañamiento publicado como futuro podía entrar en el bloque vigente antes de su año/fecha de inicio. #582 añadió un filtro común y test de regresión para impedir que los cambios musicales de 2027 se presenten como actuales en 2026.

### Consolación de Carrión de los Céspedes

**CONSOLACIÓN DE CARRIÓN → 🟢 CERTIFICADA · 93 % · INDEXABLE · GRAFO CLEAN**

Documento: `docs/CERTIFICACION-CONSOLACION-CARRION-2026-09-04.md`.

La ficha partía de un 0 % técnico. El cierre incorpora y relaciona:

- identidad completa, sede canónica e historia fundacional;
- tres titulares: Nuestra Señora de Consolación, Santísimo Cristo de la Vera Cruz y María Santísima de la Soledad;
- tres pasos: Virgen, Corpus Christi y Stabat Mater;
- cinco cultos recurrentes documentados sin extrapolar fechas anuales no publicadas;
- tres salidas de 2026: Stabat Mater, Día del Romero y Corpus Christi;
- Maestro Tejera como acompañamiento vigente documentado en 2026;
- Presentación al Pueblo y La Redención como acompañamientos históricos/eventuales de salidas concretas de 2026;
- marcha `A Ti, Consolación` vinculada directamente a la imagen titular;
- dos piezas patrimoniales;
- confirmación del patronazgo de 2024 como acontecimiento histórico;
- Fuentes corporativas, institucionales, patrimoniales y periodísticas directamente pertinentes.

El 7 % restante corresponde a la señal de escudo. Se conserva como deuda legítima mientras no exista un recurso con derechos suficientemente trazables. Tampoco se fuerzan autorías, capataces, cronologías técnicas o fechas de septiembre de 2026 que las Fuentes actuales no permiten afirmar con suficiente seguridad.

## Efecto de #589 sobre Fuentes

#589 continúa siendo la regla vigente para Fuentes heredadas de agentes relacionados.

La auditoría reforzada de La Trinidad confirmó que Fuentes de segundo grado pertenecientes a otros contextos no deben aparecer solo por compartir autor/capataz.

La certificación de Consolación de Carrión mantiene el mismo criterio: las Fuentes visibles son corporativas o de primer grado respecto de identidad, titulares, pasos, cultos, salidas, música, patrimonio y patronazgo. No se detectó contaminación de segundo grado.

## Actualidad de main durante el cierre

El frente de Carrión comenzó con `main = 6358762`. Durante su ejecución se fusionó `#590 · Aplica la paleta de Las Cigarreras`, por lo que el cierre se revalidó contra el nuevo `main = f7a762b` antes de abrir su PR documental.

#590 solo incorpora DML de colores de Las Cigarreras y no modifica lector público, Hermandades de Carrión, relaciones, Fuentes, criterios de completitud ni indexabilidad.

## Estado técnico

- Supabase producción: **ACTIVE_HEALTHY** en el último control del cierre.
- Completitud de Consolación de Carrión: **93 %**.
- Slugs duplicados: **0**.
- Hermandad→Imagen huérfanas: **0**.
- Hermandad→Paso huérfanas: **0**.
- Imagen→Paso huérfanas: **0**.
- Periodos musicales huérfanos: **0**.
- Futuros musicales marcados como actuales en Carrión: **0**.
- Ruta pública de Carrión: **HTTP 200 · index, follow · canonical correcta**.
- Runtime errors detectados en la ruta durante el control: **0**.
- Cambios estructurales en este cierre: **0**.
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
- Consolación de Carrión → 🟢 certificada.

## Siguiente movimiento autorizado

Tras fusionar la documentación de este cierre y confirmar de nuevo **0 PR abiertas**, el siguiente movimiento permitido es refrescar la auditoría global y recalcular la deuda real sobre el nuevo estado.

No queda autorizada la ejecución de una segunda Hermandad dentro de este cierre. Antes de abrir otro frente debe volver a prevalecer el `main` vigente y confirmarse que no haya deuda operativa previa.