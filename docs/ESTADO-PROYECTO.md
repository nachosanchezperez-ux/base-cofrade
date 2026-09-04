# Hilo Cofrade · Estado canónico

**Corte validado:** 4 de septiembre de 2026 · cierre documental de Dulce Nombre de Bellavista  
**Régimen:** `FIRST EDITION FREEZE` activo  
**Fase activa:** editorial / documental sobre el modelo vigente

## Estado general

**PRIMERA EDICIÓN → 🟢 CERRADA, CERTIFICADA Y CONGELADA**

Los últimos frentes documentales cerrados permanecen certificados:

- Estrella de Coria → **certificada**.
- La Trinidad → **certificada**.
- Consolación de Carrión de los Céspedes → **certificada al 93 %**.
- Mercedes de Mairena del Aljarafe → **certificada al 93 %**.
- Dulce Nombre de Bellavista → **certificada al 93 %**, indexable y con grafo limpio.

No queda una segunda Hermandad abierta dentro de este lote.

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

La ficha partía de un 14 % técnico. El cierre incorpora identidad, sede, carácter Gloria/Sacramental, titular, tres configuraciones procesionales, seis cultos, calendario 2026, dos salidas de 2026, música vigente e histórica correctamente separada, tres piezas patrimoniales, el acontecimiento de la fusión sacramental y Fuentes enlazadas por contexto.

Durante el QA se detectó que el acontecimiento de 1977 existía en `events` pero no aparecía en Historia porque faltaba su relación explícita `involves`. Se clasificó como deuda editorial de relación y se corrigió el grafo sin modificar el lector común.

### Dulce Nombre de Bellavista

**DULCE NOMBRE DE BELLAVISTA → 🟢 CERTIFICADA · 93 % · INDEXABLE · GRAFO CLEAN**

Documento: `docs/CERTIFICACION-DULCE-NOMBRE-BELLAVISTA-2026-09-04.md`.

La ficha partía de un 79 % técnico. El cierre incorpora y revalida:

- identidad e historia de la corporación actual sin confundirla con el antecedente sacramental de 1968–1975;
- sede histórica en la Parroquia del Dulce Nombre de María y sede vigente desde 15/06/2019 en el Sagrado Corazón de Jesús;
- dos titulares con autoría, cronología e iconografía documentadas;
- restauración del Señor por Darío Ojeda, finalizada en marzo de 2025;
- dos pasos y sus capataces vigentes;
- corrección del nodo compartido del capataz del misterio a **Jesús Varela Peral**;
- tallado de la trasera del misterio estrenado en 2026 y relacionado con José Manuel Rodríguez Melo;
- proyecto del nuevo palio con actualidad estricta: primeros estrenos aplazados a **2027**, sin presentarlos como realidad de 2026;
- siete cultos recurrentes y siete ocurrencias exactas de 2026;
- primer Vía Crucis del Señor en 1993;
- estación de penitencia del Viernes de Dolores de 2026, primera desde el interior del Sagrado Corazón tras la nueva puerta;
- Rosario público del 12/09/2026;
- La Redención y Santa Ana de Dos Hermanas como acompañamientos vigentes de la estación de penitencia 2026;
- Presentación al Pueblo 1997–1999 conservada como histórico;
- toca de sobremanto de 2026 con diseño de Álvaro Abril Vela, bordado de Oro Bordado de Dolores Fernández y joyería de El Oribe;
- tres acontecimientos históricos relacionados mediante `involves`;
- recuperación documental del escudo corporativo original con las Reglas de 2026;
- Fuentes directas y contextuales reforzadas, retirando del Rosario la antigua agenda genérica al disponer de convocatoria específica de septiembre de 2026.

El 7 % restante corresponde exclusivamente a la señal técnica de escudo. El diseño recuperado está documentado, pero `crest_path` permanece vacío hasta disponer de un archivo reutilizable con derechos trazables.

También se conserva como deuda legítima la normalización de la Agrupación Musical María Santísima del Rocío como Banda independiente, las fotografías no autorizadas y la comprobación posterior de la hora real de entrada de la estación de penitencia de 2026 frente al horario anunciado.

## Efecto de #589 sobre Fuentes

#589 continúa siendo la regla vigente para Fuentes heredadas de entidades relacionadas.

Las certificaciones de Mercedes y Bellavista mantienen las Fuentes acotadas por contexto: Hermandad, titular, culto, ocurrencia anual, salida, acompañamiento, patrimonio, acontecimiento, intervención o relación de autoría.

En Bellavista, la convocatoria específica de septiembre de 2026 sustituye a la antigua agenda genérica como fuente del Rosario. No se detectó contaminación de segundo grado en el QA público.

## Actualidad de main durante el cierre de Bellavista

Bellavista se abrió después del cierre de Mercedes. Antes del trabajo editorial se refrescó el repositorio y se encontró `main = f0cda70`, con 0 PR abiertas.

El delta posterior a Mercedes incluye cambios de lector y presentación —entre ellos Vía Crucis institucional, Fuentes, sede, música y directorios—. Por ello Bellavista se revalidó expresamente contra el lector vigente de `f0cda70` antes de certificar.

El nuevo módulo institucional de Vía Crucis no se activa para el Vía Crucis propio de Bellavista de 1993, que permanece correctamente en Salidas.

## Estado técnico

- Supabase producción: **operativa durante el cierre**.
- Completitud de Dulce Nombre de Bellavista: **93 %**.
- Señales positivas: identidad, sede, día, titulares, pasos, cultos, salidas, música y Fuentes.
- Señal negativa: escudo, clasificada como deuda legítima.
- Slugs duplicados: **0**.
- Hermandad→Imagen huérfanas: **0**.
- Hermandad→Paso huérfanas: **0**.
- Imagen→Paso huérfanas: **0**.
- Periodos musicales huérfanos: **0**.
- Futuros musicales marcados como actuales: **0**.
- Titulares: **2**.
- Pasos: **2**.
- Cultos: **7**.
- Ocurrencias de cultos 2026: **7**.
- Salidas: **3**.
- Acompañamientos normalizados de la estación de penitencia 2026: **2**.
- Periodos musicales: **3**.
- Patrimonio: **1 pieza + 1 intervención de restauración**.
- Acontecimientos históricos: **3**.
- Fases de pasos publicadas: **4**.
- Sedes documentadas: **2**.
- Ruta pública: **HTTP 200 · index, follow · canonical correcta**.
- Runtime errors detectados en la ruta durante el control: **0**.
- Cambios estructurales en este cierre: **0**.
- DDL nuevo: **0**.
- Tablas nuevas: **0**.
- Migraciones estructurales: **0**.
- Cambios RLS: **0**.
- Nueva arquitectura: **0**.
- Cambios del lector dentro del frente Bellavista: **0**.
- Nueva UX dentro del frente Bellavista: **0**.

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
- Dulce Nombre de Bellavista → 🟢 certificada.

## Siguiente movimiento autorizado

Tras fusionar la documentación de Bellavista y volver a confirmar **0 PR abiertas**, el siguiente frente editorial acordado es **Pino Montaño**.

Antes de modificar Pino Montaño debe refrescarse de nuevo `main`, comprobar merges concurrentes y diagnosticar su deuda real sobre el estado vigente. No se abre Pino Montaño dentro del mismo cierre de Bellavista.