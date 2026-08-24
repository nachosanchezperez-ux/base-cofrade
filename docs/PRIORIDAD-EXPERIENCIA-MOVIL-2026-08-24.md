# Siguiente gran frente · Experiencia móvil

> Decisión de Dirección posterior al cierre de la fase de consolidación de Hilo Cofrade.

- Fecha: **24 de agosto de 2026**.
- Estado: **prioridad seleccionada; implementación todavía no iniciada**.
- Regla: una sola prioridad principal, sin reabrir la Arquitectura pública ni añadir entidades durante su arranque.

## 1 · Punto de partida

Antes de elegir esta prioridad se han cerrado:

- sincronización de `ESTADO-PROYECTO`;
- Personas / agentes;
- Arquitectura pública completa;
- smoke transversal post-arquitectura;
- primera fotografía de Salud del grafo;
- un patrón sistémico completo de Salud;
- protocolo editorial de Wikimedia y media abierta;
- revisión de decisiones HC;
- verificación de #49 como implementación histórica aparcada.

La base técnica está estable. La siguiente mejora debe aumentar el valor percibido y la capacidad de trabajo cotidiano sin volver a abrir el modelo.

## 2 · Criterio de selección

Fórmula aplicada:

```text
VALOR PARA USUARIO
× VALOR RELACIONAL
× IMPACTO ESTRATÉGICO
÷ COMPLEJIDAD
÷ RIESGO
```

Escala cualitativa: 1–5.

| Candidato | Usuario | Relacional | Estratégico | Complejidad | Riesgo | Índice |
|---|---:|---:|---:|---:|---:|---:|
| **Experiencia móvil** | 5 | 4 | 5 | 3 | 2 | **16,67** |
| Enriquecimiento masivo | 4 | 5 | 5 | 3 | 3 | 11,11 |
| SEO | 4 | 3 | 5 | 2 | 3 | 10,00 |
| Tira del hilo | 5 | 5 | 5 | 4 | 4 | 7,81 |
| Analítica | 3 | 3 | 5 | 3 | 2 | 7,50 |
| Automatización editorial | 4 | 5 | 5 | 4 | 4 | 6,25 |
| Expansión territorial | 4 | 4 | 4 | 5 | 4 | 3,20 |
| Importación documental asistida | 4 | 5 | 4 | 5 | 5 | 3,20 |
| Nuevas entidades | 3 | 5 | 4 | 5 | 5 | 2,40 |

## 3 · Por qué gana Experiencia móvil

### Valor para el usuario

Hilo Cofrade se consulta y se alimenta con frecuencia desde el móvil. Ya se han observado problemas concretos:

- navegación extensa;
- tipografías o densidades que dificultan escanear la información;
- directorios demasiado largos;
- formularios del Panel con mucho desplazamiento;
- dificultad para localizar el lugar exacto donde subir una fotografía, cartel o recurso concreto;
- necesidad de mensajes de guardado y actualización más visibles.

### Valor relacional

Una experiencia móvil mejor no añade relaciones, pero facilita descubrirlas y mantenerlas:

- acceso más claro a Tira del hilo;
- navegación entre Hermandad, Imagen, Paso y Banda;
- filtros más utilizables;
- carga editorial desde el contexto correcto de la entidad;
- menor probabilidad de asociar contenido al registro equivocado.

### Impacto estratégico

Mejora simultáneamente:

- producto público;
- operación editorial;
- velocidad de carga de contenido;
- percepción de calidad;
- uso cotidiano de Hilo Cofrade.

Y puede ejecutarse sin migraciones ni reapertura de la frontera Front/Panel.

## 4 · Alcance inicial

El frente debe comenzar con una auditoría real en móvil y dividirse después en cortes pequeños.

### Público

- cabecera y menú;
- Home y orden de módulos;
- Tira del hilo;
- directorios y segmentación;
- búsqueda y filtros;
- fichas y navegación interna;
- lectura de Fuentes, créditos y relaciones;
- botones, áreas táctiles, tipografía y espaciado.

### Panel

- navegación principal;
- retorno al contexto de la entidad;
- formularios largos segmentados;
- subida de media desde la ficha exacta;
- selección clara de portada, galería, cartel, paso, hábito u otra función;
- progreso de subida;
- confirmación de guardado en el centro de la pantalla;
- errores accionables;
- prevención de pérdida de cambios.

## 5 · Primer corte recomendado

**Panel móvil · navegación contextual y subida de contenido**.

Motivo: es el punto donde la fricción móvil bloquea de manera más directa el crecimiento del proyecto.

Caso de referencia:

> Desde la ficha de una Hermandad, localizar y subir sin ambigüedad una fotografía del paso o el cartel de un año concreto, conservando función, crédito, derechos y relación correcta.

El primer corte debe diseñarse como patrón reutilizable para todas las Hermandades, no como excepción para una sola ficha.

## 6 · Condiciones de éxito

- tarea principal localizable en un máximo razonable de pasos;
- acciones táctiles con tamaño y separación suficientes;
- tipografía legible sin zoom;
- formularios divididos por objetivo, no por estructura interna de tablas;
- feedback visible de guardado, error y progreso;
- subida ligada al contexto y función correctos;
- no perder campos al volver atrás;
- no introducir slugs, IDs o casos especiales hardcodeados;
- mantener Front público stateless y Panel autenticado;
- conservar derechos, crédito, alt y Fuente de cada recurso;
- validar en dispositivos y anchos móviles reales antes de fusionar.

## 7 · Fuera de alcance inicial

- nuevas entidades;
- cambios de RLS;
- rediseño total de marca;
- migraciones por conveniencia visual;
- reescritura del importador;
- recuperación de la PR #49;
- expansión territorial;
- optimización SEO general;
- refactor transversal no necesario para el caso móvil auditado.

## 8 · Orden de ejecución

```text
AUDITORÍA MÓVIL REAL
→ mapa de tareas y fricciones
→ seleccionar un único flujo
→ prototipo responsive
→ implementación pequeña
→ QA táctil y visual
→ preview
→ smoke móvil
→ producción
→ medir reducción de fricción
```

**SIGUIENTE GRAN FRENTE → EXPERIENCIA MÓVIL**

**PRIMER CORTE PROPUESTO → PANEL MÓVIL · NAVEGACIÓN CONTEXTUAL Y SUBIDA DE CONTENIDO**
