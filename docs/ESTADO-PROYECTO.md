# Hilo Cofrade · Estado canónico

**Corte validado:** 2 de septiembre de 2026 · cierre nocturno  
**Régimen:** `FIRST EDITION FREEZE` activo  
**Fase activa:** editorial / documental sobre el modelo vigente

## Estado general

**PRIMERA EDICIÓN → 🟢 CERRADA, CERTIFICADA Y CONGELADA**

- Baseline funcional y estructural: cerrado.
- `main` de partida para esta sincronización documental: `ba95e39af32f0ed94b15957dd84f6e405a769637`.
- PR abiertas al iniciar esta sincronización: **0**.
- #529: **cerrada**.
- #492: **abierta y aislada** a Supabase Preview Branches.
- Aportaciones públicas: **desactivadas**.
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
- Amparo y San Esteban se han cerrado posteriormente mediante **DML editorial sobre tablas y relaciones existentes**.
- No se ha ejecutado DDL, no se ha creado una nueva tabla, no se ha alterado RLS y no se ha abierto nueva arquitectura.
- #492 conserva la deuda histórica de reproducibilidad de Preview Branches y no se reinterpreta como fallo de producción.

## GitHub y Vercel

**ESTADO PREVIO A ESTA SINCRONIZACIÓN → 🟢 ESTABLE**

- `main`: `ba95e39af32f0ed94b15957dd84f6e405a769637`.
- PR abiertas: **0**.
- Producción Vercel: **READY** sobre el mismo SHA.
- Runtime de producción: **0 errores detectados** en la ventana de 6 horas auditada.
- Runtime Node.js: 3 funciones observadas en el deployment actual.
- Bundler: Turbopack.

Esta actualización y las certificaciones asociadas son exclusivamente documentales; no cambian aplicación, UX, esquema ni arquitectura.

## Lotes de Hermandades cerrados en este corte

### 1 · Amparo

**AMPARO → 🟢 CERTIFICADA**

Documento completo: `docs/CERTIFICACION-AMPARO-2026-09-02.md`.

Cierre certificado:

- identidad y Sede;
- titular y atribuciones;
- restauraciones;
- paso y fases;
- capataz 2026;
- Simpecado, manto y coronas históricas;
- seis marchas procesionales;
- siete composiciones para cultos separadas del catálogo procesional;
- cultos extraordinarios de 2026;
- Coronación Canónica como acontecimiento propio;
- procesión anual del 8/11 correctamente separada del acontecimiento extraordinario;
- Carmen de Salteras vinculada al paso y salida exactos;
- media y Fuentes certificadas;
- salud del grafo sin deuda crítica.

### 2 · San Esteban

**SAN ESTEBAN → 🟢 CERTIFICADA**

Documento completo: `docs/CERTIFICACION-SAN-ESTEBAN-2026-09-02.md`.

San Esteban fue la **única Hermandad** abierta después de Amparo, al combinar actualidad, extraordinaria próxima y deuda documental real.

Cierre certificado:

- Sede canónica normalizada y horarios verificados el 2/09/2026;
- dos titulares, manteniendo autor desconocido en el Señor sin atribuciones inventadas;
- cinco intervenciones conservativas/restauraciones incorporadas sobre los titulares;
- dos pasos ya previamente estructurados, con 14 fases y 19 agentes/autores conservados;
- dos capataces vigentes con Fuente;
- diez bienes de patrimonio material y 16 autorías/componentes;
- 38 marchas procesionales dedicadas: 19 al Señor y 19 a la Virgen;
- `Refugio de Desamparados` separada como salutación musical, no como marcha;
- entrada musical ambigua `Virgen de los Desamparados-1961 (Fortunati. Megías Rosado)` excluida hasta disponer de identificación inequívoca;
- 15 cultos canónicos y 13 ocurrencias fechadas de 2026;
- I Centenario Fundacional creado como acontecimiento propio;
- exposición `Salud y Buen Viaje: la devoción que construye una historia. San Esteban 1926–2026` registrada como acontecimiento en curso del 1 al 15 de septiembre;
- traslado extraordinario del 21/11 y procesión extraordinaria del 22/11 mantenidos como hechos procesionales concretos;
- Agrupación Musical Virgen de los Reyes normalizada contra el paso exacto y posición `tras el paso` para el 22/11;
- una cabecera autorizada y trazable, con autor real no identificado declarado expresamente sin inventar firma;
- 25 Fuentes relevantes;
- salud del grafo sin deuda crítica automática.

## Salud documental · San Esteban

**RESULTADO → 🟢 LIMPIO**

- Titulares: **2**.
- Autorías de titulares: **2**.
- Intervenciones de titulares: **5**.
- Pasos: **2**.
- Fases de paso: **14**.
- Agentes/autores de fases: **19**.
- Capataces vigentes: **2**.
- Patrimonio material: **10 bienes**.
- Patrimonio musical no-marcha: **1 salutación**.
- Marchas al Señor: **19**.
- Marchas a la Virgen: **19**.
- Cultos: **15**.
- Ocurrencias 2026: **13**.
- Salidas extraordinarias del lote: **2**.
- Acontecimientos: **2**.
- Acompañamientos ordinarios vigentes: **2**.
- Media de cabecera: **1**, autorizada y trazable.
- Fuentes relevantes: **25**.

Deuda crítica auditada:

- media sin `alt` / Fuente / estado de derechos / campo de autoría: **0**;
- autorías de titulares sin Fuente: **0**;
- intervenciones sin Fuente: **0**;
- fases de paso sin Fuente: **0**;
- capataces vigentes sin Fuente: **0**;
- patrimonio sin Fuente: **0**;
- cultos sin Fuente: **0**;
- ocurrencias sin Fuente: **0**;
- salidas sin Fuente: **0**;
- acontecimientos sin Fuente: **0**;
- acompañamientos vigentes sin Fuente: **0**;
- marchas dedicadas sin Fuente: **0**;
- marchas dedicadas sin autor: **0**;
- URLs de Fuente duplicadas en el ámbito auditado: **0**.

## Actualidad estricta

A fecha de corte, **2 de septiembre de 2026**:

- la exposición del Centenario de San Esteban está en curso hasta el **15 de septiembre**;
- el traslado extraordinario del Señor está anunciado para el **21 de noviembre**;
- la procesión extraordinaria de regreso está anunciada para el **22 de noviembre**;
- la Misa Solemne de Cristo Rey del 22/11 está documentada a las **11:00** en la Catedral;
- no se completa itinerario u horario no publicado oficialmente;
- no se canoniza una autoría musical ambigua;
- las fechas pasadas de cultos 2026 se registran como celebradas y las futuras como anunciadas.

## Primera Edición y #492

**#492 → 🟣 AISLADA · NO BLOQUEA EL FRENTE EDITORIAL**

Continúa bloqueando:

- nuevo DDL;
- nuevas tablas;
- nuevas migraciones estructurales;
- cambios RLS;
- ampliaciones de arquitectura.

No bloquea:

- contenido;
- Fuentes;
- media trazable;
- relaciones sobre tablas existentes;
- patrimonio;
- cultos;
- música;
- acompañamientos;
- acontecimientos y salidas soportados por el modelo actual.

## Aportaciones públicas

**APORTACIONES → ⚪ INFRAESTRUCTURA PREPARADA · 🔒 DESACTIVADAS**

- `PUBLIC_CONTRIBUTIONS_ENABLED=false` permanece como estado canónico.
- No se activa `/colabora` ni escritura pública.
- No se modifica RLS, Auth, Storage ni secretos.

## Estado del frente

**AMPARO → 🟢 CERRADA Y CERTIFICADA**  
**SAN ESTEBAN → 🟢 CERRADA Y CERTIFICADA**

No queda otro lote abierto por esta orden.

Cualquier siguiente Hermandad requerirá una nueva selección explícita y deberá respetar el mismo orden de prioridad: actualidad → extraordinaria próxima → deuda documental → potencial relacional.
