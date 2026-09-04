# Hilo Cofrade · Estado canónico

**Corte validado:** 4 de septiembre de 2026 · cierre documental de Mercedes de Mairena del Aljarafe  
**Régimen:** `FIRST EDITION FREEZE` activo  
**Fase activa:** editorial / documental sobre el modelo vigente

## Estado general

**PRIMERA EDICIÓN → 🟢 CERRADA, CERTIFICADA Y CONGELADA**

El frente documental seleccionado en la auditoría global del 4 de septiembre queda completado:

- Estrella de Coria → **certificada**.
- La Trinidad → **certificada**.
- Consolación de Carrión de los Céspedes → **certificada al 93 %**, indexable y con grafo limpio.
- Mercedes de Mairena del Aljarafe → **certificada al 93 %**, indexable y con grafo limpio.
- No queda una segunda Hermandad autorizada dentro de este lote.

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

La regresión temporal detectada durante aquel cierre quedó corregida con lógica común para impedir que los cambios musicales de 2027 se presenten como actuales en 2026.

### Consolación de Carrión de los Céspedes

**CONSOLACIÓN DE CARRIÓN → 🟢 CERTIFICADA · 93 % · INDEXABLE · GRAFO CLEAN**

Documento: `docs/CERTIFICACION-CONSOLACION-CARRION-2026-09-04.md`.

La ficha pasó de un 0 % técnico a un cierre documental profundo con identidad, sede, tres titulares, tres pasos, cinco cultos, tres salidas de 2026, música vigente e histórica, patrimonio, marcha dedicada, Fuentes y relaciones. El procedimiento canónico de 2024 sobre el patronazgo queda documentado con las posiciones públicas de ambas corporaciones y sin presentarlo como cierre jurídico definitivo.

El 7 % restante corresponde a la señal de escudo y otros huecos legítimos que no deben completarse mediante inferencia.

### Mercedes de Mairena del Aljarafe

**MERCEDES DE MAIRENA → 🟢 CERTIFICADA · 93 % · INDEXABLE · GRAFO CLEAN**

Documento: `docs/CERTIFICACION-MERCEDES-MAIRENA-2026-09-04.md`.

La ficha partía de un 14 % técnico. El cierre incorpora y relaciona:

- identidad completa y sede en la Iglesia Parroquial de San Ildefonso;
- doble carácter Gloria y Sacramental;
- fundación documentada de la corporación mercedaria en el siglo XVII;
- antigua Sacramental fundada en 1864, fusión acordada en 1975 y aprobación canónica de 03/01/1977;
- Nuestra Señora de las Mercedes como titular, con núcleo gótico documentado en el siglo XIV y conservación de 2013;
- tres configuraciones procesionales: paso glorioso de septiembre, templete argénteo del Corpus y paso de la Custodia;
- seis cultos recurrentes;
- tres ocurrencias exactas de septiembre de 2026 procedentes del calendario parroquial vigente;
- dos salidas de 2026: Corpus del 07/06 y procesión gloriosa anunciada para el 27/09;
- Banda de Música María Santísima de la Victoria como acompañamiento vigente documentado únicamente para el Corpus 2026;
- acompañamiento de septiembre de 2025 conservado como histórico, sin extrapolarlo a septiembre de 2026;
- tres piezas patrimoniales: manto de Esperanza Elena Caro, custodia sacramental y saya de Manuel Solano de 2018;
- acontecimiento histórico de la aprobación canónica de la fusión sacramental;
- Fuentes institucionales, parroquiales, corporativas, locales y cofrades enlazadas por contexto.

Durante el QA se detectó que el acontecimiento de 1977 existía en `events` pero no aparecía en Historia porque faltaba su relación explícita `involves` con la Hermandad. Se clasificó como deuda editorial de relación y se corrigió el grafo. El lector común no necesitó cambios.

El 7 % restante corresponde a la señal de escudo. También permanecen como deuda legítima fotografías no autorizadas, datos técnicos de pasos no publicados y el acompañamiento de la procesión gloriosa del 27/09/2026 mientras no exista una confirmación específica fiable.

## Efecto de #589 sobre Fuentes

#589 continúa siendo la regla vigente para Fuentes heredadas de entidades relacionadas.

Mercedes mantiene Fuentes acotadas por contexto: Hermandad, titular, culto, ocurrencia anual, salida, acompañamiento, patrimonio, acontecimiento o relación de autoría. La Fuente parroquial de septiembre de 2026 se enlaza tanto a las ocurrencias anuales como a los cultos correspondientes para asegurar trazabilidad en el lector actual sin modificar UX.

No se detectó contaminación de segundo grado.

## Actualidad de main durante el cierre de Mercedes

El frente comenzó sobre `main = 5b1bacf`. Durante su ejecución, `main` avanzó hasta `292daa7` mediante dos commits dedicados exclusivamente al tratamiento CSS responsive de las fotografías de Salidas.

Se auditó el delta completo y se confirmó que no modifica:

- Supabase;
- datos o consultas de Hermandades;
- relaciones;
- Fuentes;
- criterios de completitud;
- temporalidad;
- SEO.

La ficha pública de Mercedes fue revalidada sobre el deployment asociado a `292daa7`, incluyendo el tratamiento responsive de la fotografía de su salida del 27 de septiembre de 2026. La rama de certificación se creó desde ese `main`.

## Estado técnico

- Supabase producción: **ACTIVE_HEALTHY** en el último control del cierre.
- Completitud de Mercedes de Mairena: **93 %**.
- Señales positivas: identidad, sede, salida, titular, pasos, cultos, salidas, música y Fuentes.
- Señal negativa: escudo, clasificado como deuda legítima.
- Slugs duplicados: **0**.
- Hermandad→Imagen huérfanas: **0**.
- Hermandad→Paso huérfanas: **0**.
- Imagen→Paso huérfanas: **0**.
- Periodos musicales huérfanos: **0**.
- Futuros musicales marcados como actuales en Mercedes: **0**.
- Ruta pública de Mercedes: **HTTP 200 · index, follow · canonical correcta**.
- Historia de 1977: **visible tras completar la relación `involves`**.
- Crédito de la fotografía de salida: **normalizado a `Fotografía · Hermandad`**.
- Cambios estructurales en este cierre: **0**.
- DDL nuevo: **0**.
- Tablas nuevas: **0**.
- Migraciones estructurales: **0**.
- Cambios RLS: **0**.
- Nueva arquitectura: **0**.
- UX general nueva dentro del frente editorial de Mercedes: **0**.

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
- Mercedes de Mairena → 🟢 certificada.

## Siguiente movimiento autorizado

Tras fusionar la documentación de este cierre y confirmar de nuevo **0 PR abiertas**, el siguiente movimiento permitido es refrescar la auditoría global y recalcular la deuda real sobre el `main` vigente.

No queda autorizada la ejecución de una segunda Hermandad dentro de este cierre. Antes de abrir otro frente debe volver a prevalecer el `main` vigente y confirmarse que no haya deuda operativa previa.