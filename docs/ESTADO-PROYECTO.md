# Hilo Cofrade · Estado canónico

**Corte validado:** 3 de septiembre de 2026 · ciclo editorial de mañana  
**Régimen:** `FIRST EDITION FREEZE` activo  
**Fase activa:** editorial / documental sobre el modelo vigente

## Estado general

**PRIMERA EDICIÓN → 🟢 CERRADA, CERTIFICADA Y CONGELADA**

- `main` verificado al iniciar este ciclo: `56eff7a865b4d1498bfed434e3d4c30eeae7ed44`.
- Producción Vercel verificada al iniciar el ciclo: `READY` sobre el mismo SHA.
- Check Vercel del HEAD: `success`.
- Runtime de producción: 0 `error/fatal` detectados en las 12 horas auditadas.
- PR abiertas al iniciar el ciclo: **0**.
- Amparo: **cerrada y certificada**.
- San Esteban: **cerrada y certificada**.
- #529: **cerrada**.
- #492: **abierta y aislada** a Supabase Preview Branches.
- Aportaciones públicas: **desactivadas**; `/colabora` continúa informando que el formulario y su endpoint no están abiertos.
- Cola UX abierta: **0**.
- Cola estructural abierta: **0**.
- Nuevo DDL / nuevas tablas / cambios RLS / nueva arquitectura: **⛔ bloqueados durante el freeze y mientras #492 siga abierta**.

## Supabase

**PRODUCCIÓN → 🟢 `ACTIVE_HEALTHY`**

- Proyecto: `Hilocofrade`.
- PostgreSQL: **17.6.1**.
- Región: **eu-west-1**.
- Historial de migraciones remoto: **48** versiones.
- Últimas migraciones canónicas:
  - `20260902121927_completa_amparo_sevilla`;
  - `20260902125718_aplica_paleta_amparo_sevilla`.
- El cierre de La Sed se ha ejecutado exclusivamente mediante **DML editorial sobre tablas y relaciones existentes**.
- Cada bloque de escritura fue prevalidado mediante `BEGIN … ROLLBACK` antes de su aplicación canónica.
- No se ha ejecutado DDL, no se ha creado una nueva tabla, no se ha alterado RLS y no se ha abierto nueva arquitectura.
- `list_branches` devuelve únicamente `main`.
- #492 conserva la deuda histórica de reproducibilidad de Preview Branches y no se reinterpreta como fallo de producción.

## Lotes cerrados

### Amparo

**AMPARO → 🟢 CERTIFICADA**

Documento completo: `docs/CERTIFICACION-AMPARO-2026-09-02.md`.

Se mantiene cerrado. No se ha reabierto ni modificado en este ciclo.

### San Esteban

**SAN ESTEBAN → 🟢 CERTIFICADA**

Documento completo: `docs/CERTIFICACION-SAN-ESTEBAN-2026-09-02.md`.

Se mantiene cerrado. No se ha reabierto ni modificado en este ciclo.

### Hermandad de la Sed

**LA SED → 🟢 CERTIFICADA · SIN BLOQUEOS DE GRAFO**

Documento completo: `docs/CERTIFICACION-LA-SED-2026-09-03.md`.

La Sed fue la única Hermandad abierta después de la auditoría comparativa de candidatas.

Top 3 inicial:

1. La Sed · prioridad aproximada 27/31 · completitud técnica 29 %.
2. Aguas Santas de Villaverde del Río · prioridad aproximada 23/31 · completitud 29 %.
3. Virgen del Castillo de Lebrija · prioridad aproximada 22/31 · completitud 21 %.

La Sed destacó por deuda documental, actualidad, potencial relacional y disponibilidad de Fuentes oficiales.

## Cierre documental · La Sed

### Identidad y Sede

- Nombre canónico completo normalizado.
- Nombre popular: **La Sed**.
- Penitencia + Sacramental.
- Fundación: **8 de septiembre de 1969**.
- Fusión sacramental: **28 de octubre de 1972**.
- Sede canónica: **Parroquia de la Concepción Inmaculada**.
- Dirección: **Calle Cristo de la Sed, 41, 41005 Sevilla**.
- Horarios de apertura y misas: documentados desde la Guía de Hermandades Sacramentales 2026 y verificados el **3/09/2026**.
- Hábito reglamentario estructurado.
- Colores documentados: negro y blanco, sin HEX inventado.

### Titulares

Tres titulares publicados y relacionados:

- Santísimo Cristo de la Sed · Luis Álvarez Duarte · 1969–1970.
- Santa María de Consolación Madre de la Iglesia · Antonio Joaquín Dubé de Luque · 1969.
- San Juan Evangelista · Antonio Joaquín Dubé de Luque · 1986.

Intervenciones estructuradas: **8**.

Se registra la evaluación conservativa de Pedro Manzano del 11 de marzo de 2026 tras el leve incidente sufrido por el Cristo; no se declara ejecutada una intervención posterior no publicada.

### Pasos y capataces

Dos pasos publicados:

1. Paso del Santísimo Cristo de la Sed.
2. Paso de palio de Santa María de Consolación Madre de la Iglesia.

- Fases estructuradas: **7**.
- Agentes/autores en fases: **15**.
- Capataz del Cristo vigente en 2026: **Fernando Adriaensens Lázaro**.
- Capataz del palio vigente en 2026: **Manuel Vizcaya López**.

Los periodos de capataz no se proyectan más allá de la ratificación documentada.

### Música

Acompañamientos vigentes:

- Rosario de Cádiz → Cristo → desde 2017.
- Banda Municipal de Música de Mairena del Alcor → palio → vinculación desde 2001; 25 años en Nervión en 2026.
- Banda de Música La Oliva de Salteras → palio → desde 2002.

La procesión de Santa María de Consolación del **3 de octubre de 2026** queda relacionada con la Virgen y su paso, pero sin banda asignada porque la Fuente específica disponible no documenta acompañamiento musical.

### Patrimonio material

Cuatro bienes representativos estructurados en profundidad:

- Custodia Sacramental · 1997–1998 · Hermanos Caballero González.
- Cruz de Guía · 1981–1983 · Manuel de los Ríos.
- Potencias del Cristo · diseño de Fernando Marmolejo Camargo (1998) y ejecución de Fernando Marmolejo (2009).
- Manto de salida de Consolación · proyecto 2017–2025 · Fernando Prini + taller de Charo Bernardino.

Relaciones de diseño/ejecución: **6**, todas con Fuente.

El proyecto de nuevo techo de palio aprobado el **13 de mayo de 2026** queda como acontecimiento/proyecto patrimonial, no como bien ya ejecutado.

### Patrimonio musical

Se certifican **6 marchas** con autoría y dedicatoria suficientemente resueltas:

- `Cristo de la Sed` · Pedro Gámez Laserna / Juan Antonio Cuevas Muñoz · 1973.
- `Consolación de Nervión` · Abel Moreno Gómez · 1987.
- `Consolación` · Pedro Morales Muñoz · enero de 2002.
- `Madre de Consolación` · José Juan Gámez Varo · 2007.
- `Camino vas del Calvario` · Manuel Alejandro González Cruz «Quini» · 2013.
- `A mi Cristo de la Sed` · Francisco Javier Alonso Jiménez · 2026.

No se amplía el catálogo por homonimia o dedicatorias inferidas.

### Cultos

- Cultos ordinarios estructurados: **14**.
- Ocurrencias concretas de 2026 con Fuente específica: **7**.
- Las fechas futuras del Mes de la Virgen no se crean por recurrencia si todavía no existe convocatoria específica.

Conflicto documental resuelto con trazabilidad: el besamanos de la Virgen queda como **último domingo de septiembre y sábado anterior**, siguiendo la modificación del artículo 50.K aprobada por el Arzobispado en 2007. La página de Reglas conserva una redacción anterior de octubre; la discrepancia permanece documentada en notas.

### Salidas y acontecimientos

- Procesión ordinaria de Santa María de Consolación: **3 de octubre de 2026 · 18:00**; Virgen y paso relacionados; música no documentada en la Fuente específica.
- Extraordinaria histórica: **17 de septiembre de 1994**, por el XXV aniversario fundacional, con visita al Hospital de San Juan de Dios y a la Prisión Provincial.
- Acontecimiento separado: XXV aniversario fundacional de 1994.
- Acontecimiento 2026: aprobación del nuevo techo de palio.

### Multimedia

**HUECO LEGÍTIMO → 🟣 0 RECURSOS AUTORIZADOS**

No se incorporan cabecera, titulares, pasos ni patrimonio con imágenes web sin trazabilidad de derechos.

**SIN FOTO > FOTO SIN DERECHOS.**

### Fuentes

- Fuentes relevantes dentro del ámbito certificado: **31**.
- URLs duplicadas en el ámbito La Sed: **0**.
- No quedan relaciones críticas del lote sin Fuente.

## Salud del grafo · La Sed

**RESULTADO → 🟢 CLEAN**

- Titulares publicados: 3.
- Pasos publicados: 2.
- Fases de paso: 7.
- Agentes de fase: 15.
- Capataces vigentes: 2.
- Acompañamientos vigentes: 3.
- Patrimonio material: 4 bienes.
- Marchas dedicadas: 6.
- Cultos: 14.
- Ocurrencias 2026: 7.
- Acontecimientos: 2.
- Salidas: 2.
- Enlaces Imagen/Paso de la salida del 3/10: 2.
- Imágenes publicadas sin autoría: 0.
- Relaciones de titular sin Fuente: 0.
- Pasos/fases/capataces/música vigente sin Fuente: 0.
- Patrimonio sin padre o Fuente: 0.
- Marchas sin autor: 0.
- Dedicatorias musicales sin Fuente: 0.
- Cultos/ocurrencias/salidas/acontecimientos sin Fuente: 0.
- Media incompleta: 0.
- Slugs duplicados: 0.
- URLs de Fuente duplicadas dentro del lote: 0.

## Completitud · La Sed

- Inicial: **29 %**.
- Final: **86 %** en la misma señal técnica.

Aproximación editorial:

- Identidad → 95 %.
- Sede → 100 %.
- Titulares → 95 %.
- Pasos → 95 %.
- Música → 90 %.
- Patrimonio → 90 %.
- Cultos → 92 %.
- Extraordinarias / acontecimientos → 85 %.
- Multimedia → 15 %.
- Fuentes → 100 %.

La baja puntuación de Multimedia es deliberada: refleja ausencia de recursos autorizados, no una relación rota.

## Actualidad urgente detectada fuera del lote

Durante la selección se detectó una discrepancia actual en **Virgen del Castillo de Lebrija**: la información reciente sobre las obras de Santa María de la Oliva modifica la sede/traslado y el programa municipal sitúa la procesión del 12 de septiembre a las 19:00 mientras Hilo conserva un dato anterior. No se ha abierto ni modificado esa Hermandad en este ciclo para respetar la regla de un único lote. Queda como alerta para una decisión posterior de Dirección.

## Primera Edición y #492

**#492 → 🟣 AISLADA · NO BLOQUEA EL FRENTE EDITORIAL**

Continúa bloqueando:

- nuevo DDL;
- nuevas tablas;
- nuevas migraciones estructurales;
- cambios RLS;
- ampliaciones de arquitectura.

No bloquea DML editorial sobre el modelo vigente.

## Aportaciones públicas

**APORTACIONES → ⚪ INFRAESTRUCTURA PREPARADA · 🔒 DESACTIVADAS**

- `/colabora` continúa mostrando el servicio cerrado.
- No se ha activado el formulario ni su endpoint.
- No se modifica RLS, Auth, Storage ni secretos.

## Estado del frente

**AMPARO → 🟢 CERRADA Y CERTIFICADA**  
**SAN ESTEBAN → 🟢 CERRADA Y CERTIFICADA**  
**LA SED → 🟢 CERRADA Y CERTIFICADA**

No queda otra Hermandad abierta por esta orden.

**SIGUIENTE MOVIMIENTO → ESPERAR DIRECCIÓN.**

No se encadena automáticamente otra ficha.