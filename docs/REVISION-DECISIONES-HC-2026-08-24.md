# Revisión y sincronización de decisiones HC

> Acta de Dirección y Documentación. No sustituye el registro canónico de decisiones ni asigna identificadores nuevos.

- Fecha: **24 de agosto de 2026**.
- Estado: **revisión operativa cerrada**.
- Regla aplicada: no crear un nuevo número `HC-###` sin consultar y actualizar primero el registro canónico.

## 1 · Decisiones existentes

La numeración vigente recuperada del proyecto llega hasta `HC-008`:

| ID | Decisión | Lectura operativa actual |
|---|---|---|
| HC-001 | Enciclopedia relacional | El modelo relacional es ya el núcleo efectivo del producto. Continúa abierto a nuevas entidades y relaciones, pero su principio arquitectónico está consolidado. |
| HC-002 | Identidad de Hilo Cofrade | Identidad aplicada y estable en el producto público. |
| HC-003 | Stack tecnológico | Next.js, Vercel, Supabase y GitHub continúan como stack canónico. |
| HC-004 | Datos estructurados | Modelo estructurado y relacional plenamente vigente; los contenidos no deben convertirse en excepciones hardcodeadas. |
| HC-005 | Históricos | La temporalidad y los periodos históricos forman parte del modelo canónico. |
| HC-006 | Acompañamientos musicales | Modelo vigente para acompañamientos actuales e históricos, con relaciones hacia bandas, pasos y Hermandades. |
| HC-007 | Enlaces externos | Enlaces oficiales y Fuentes externas permanecen como información estructurada y verificable. La media externa licenciada amplía este ámbito, pero añade requisitos específicos de derechos y atribución. |
| HC-008 | Organización de Hermandades | La organización pública y editorial de Hermandades tiene un baseline funcional; su UX puede evolucionar sin alterar el principio de información estructurada. |

Esta tabla actualiza la **lectura operativa** de las decisiones, no reescribe su formulación original.

## 2 · Arquitectura real ya consolidada

Desde la creación de HC-001…HC-008, Hilo Cofrade ha incorporado capacidades que ya forman parte del baseline técnico:

- separación estricta entre Front público y Panel;
- lecturas públicas stateless bajo rol `anon`;
- sesión editorial autenticada únicamente en el Panel;
- arquitectura vigente de importación masiva;
- Salud del grafo como cola editorial continua;
- soporte de media externa licenciada con atribución;
- arquitectura pública de Extraordinarias;
- protocolo visual y responsive de los directorios.

Estas capacidades deben reflejarse en el registro de decisiones, pero no todas necesitan necesariamente un ID independiente.

## 3 · Candidatas a formalización futura

### A · Frontera Front público ↔ Panel

**Recomendación:** formalización prioritaria como una única decisión arquitectónica.

Debe incluir en la misma decisión:

```text
FRONT PÚBLICO
→ lectura stateless / rol anon

PANEL
→ sesión editorial autenticada
```

La «autoridad pública stateless» no necesita otra decisión separada: es la consecuencia técnica principal de esta frontera.

### B · Importación masiva gobernada

**Recomendación:** formalización propia.

Elementos esenciales:

- analizar antes de preparar;
- revisar antes de aplicar;
- detectar duplicados y colisiones internas;
- preservar trazabilidad y recuperación de cargas;
- no publicar por defecto;
- mantener revisión humana.

La antigua PR #49 no representa esta decisión y no debe citarse como implementación vigente.

### C · Salud del grafo como cola editorial

**Recomendación:** formalización propia como decisión de gobierno del dato.

Principio:

```text
INCIDENCIA
→ PATRÓN
→ SOLUCIÓN SISTÉMICA
→ VALIDACIÓN
```

No busca «cero incidencias», sino una mejora continua medible y transversal.

### D · Media externa licenciada

**Recomendación:** Dirección debe decidir si se formula como ampliación de HC-007 o como decisión nueva.

No debe numerarse hasta resolver esa relación con HC-007. El protocolo operativo vigente queda documentado en:

`docs/PROTOCOLO-MEDIA-ABIERTA-WIKIMEDIA.md`

### E · Arquitectura de Extraordinarias

**Recomendación:** no crear automáticamente una decisión nueva.

Su diseño actual puede entenderse como aplicación de HC-001 y HC-004: acontecimientos estructurados, Fuentes, música, horarios, recorridos y relaciones. Solo requerirá una decisión propia si Dirección define una regla de producto o de modelo que no pueda derivarse de esas decisiones.

### F · Protocolo visual de directorios

**Recomendación:** mantenerlo como norma de diseño, no como decisión arquitectónica HC, salvo que el registro canónico incluya expresamente decisiones de UX.

Debe seguir documentándose mediante patrones de componente, responsive y accesibilidad.

## 4 · Lo que no debe hacerse

- No asignar `HC-009`, `HC-010` o posteriores por orden de aparición en una conversación.
- No convertir cada implementación o PR en una decisión arquitectónica.
- No duplicar la frontera Front/Panel y la lectura stateless en dos decisiones distintas.
- No presentar #49 como fundamento de la importación vigente.
- No tratar el protocolo Wikimedia como una simple ampliación técnica sin resolver su relación con HC-007.
- No cambiar la formulación original de HC-001…HC-008 sin consultar su registro canónico.

## 5 · Resultado de la sincronización

La arquitectura real y el registro de decisiones quedan reconciliados mediante esta clasificación:

| Tema reciente | Tratamiento acordado |
|---|---|
| Front público ↔ Panel + autoridad stateless | Una futura decisión arquitectónica prioritaria |
| Importación masiva | Futura decisión propia |
| Salud del grafo | Futura decisión propia |
| Media externa y derechos | Resolver primero si amplía HC-007 |
| Extraordinarias | Aplicación de HC-001 y HC-004, salvo nueva regla no derivable |
| Directorios | Norma de diseño, no ID automático |

No se ha reservado ni asignado ningún número nuevo.

**DECISIONES HC → 🟢 SINCRONIZADAS SIN ALTERAR LA NUMERACIÓN VIGENTE**
