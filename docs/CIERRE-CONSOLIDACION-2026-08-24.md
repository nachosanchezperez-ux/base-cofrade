# Cierre de la fase de consolidación

> Acta operativa definitiva de Dirección.

- Fecha de cierre: **24 de agosto de 2026**.
- Estado: **CERRADA Y VALIDADA EN PRODUCCIÓN**.
- Baseline funcional: `cd5cc70d1e0b85c80c69f4cd5bf41359bf954672` — PR #321.
- Producción auditada: `dpl_2hZCHYuFtz6WVuEU4meGVa7AohQr` → **READY**.
- Supabase: **ACTIVE_HEALTHY**; última migración `20260824003235_cult_media`.

## Resolución de los frentes documentales

### #314 · Media abierta

La rama proponía un segundo protocolo vigente sobre un contrato que #311 ya había implantado y protegido.

No se fusionó. Su delta útil quedó consolidado en:

`docs/MEDIA-ABIERTA.md`

Incluye:

- licencias admitidas y excluidas;
- autoría y titular de derechos;
- licencia exacta y versión;
- URL original o canónica;
- Fuente y nota de permiso;
- crédito público y atribución;
- verificación exacta del sujeto;
- portada frente a galería;
- reutilización y deduplicación;
- revisión humana;
- controles de Salud del grafo.

Resultado:

**#314 → 🟢 CERRADA POR SUPERADA**  
**MEDIA ABIERTA → 🟢 UNA ÚNICA FUENTE CANÓNICA**

### #315 · Decisiones HC

La rama partía de una fotografía antigua y no recogía el registro documental completo.

Se reconstruyó sobre el producto real mediante:

- `docs/DECISIONES-HC.md`;
- HC-014 · media abierta;
- HC-015 · frontera Front público ↔ Panel;
- HC-016 · importación masiva gobernada;
- HC-017 · Salud del grafo como cola editorial.

No se crearon decisiones duplicadas para Extraordinarias, tarjetas, directorios, logotipos, prioridad visual o patrimonio musical.

HC-008.1 quedó correctamente clasificada como extensión implementada de HC-008. HC-018 permanece disponible, no asignada ni reservada.

Resultado:

**#315 → 🟢 CERRADA POR SUPERADA**  
**DECISIONES HC → 🟢 SINCRONIZADAS CON EL PRODUCTO REAL**

### #316 · Cierre y siguiente fase

La rama se creó antes de completar los cortes de Pastora, SEO y reconciliación final de `cult_media`; no podía actuar como fotografía definitiva.

La comparación se rehizo sobre el `main` real. La PR se cerró sin fusionar y el cierre quedó incorporado al acta canónica.

Resultado:

**#316 → 🟢 CERRADA POR SUPERADA**

## Estado consolidado

La fase deja fijado el siguiente baseline:

- Arquitectura pública / Front ↔ Panel → cerrada.
- Personas / agentes → cerradas.
- Smoke transversal → cerrado.
- Primer ciclo de Salud del grafo → cerrado.
- Relaciones nucleares incoherentes → `0`.
- Media abierta → gobernada en Panel, Supabase y Front.
- Decisiones HC → sincronizadas hasta HC-017.
- Piloto de Pastora → funcional y publicado.
- SEO técnico → ampliado y corregido.
- `cult_media` → reconciliada.
- #49 → aparcada.
- Producción → estable y READY.
- Documentación operativa → canónica.

## Smoke final de producción

### Home

- Home 2.8 → 200.
- Hoy → presente.
- Tira del hilo → presente y ruta pública 200.
- Extraordinarias → presente y directorio 200.
- Marcha del día → presente.
- Explorar → presente.
- Últimos hilos → presente.
- viewport y menú móvil → presentes.

### Directorios

- Hermandades → 200.
- Imágenes → 200.
- Pasos → 200.
- Bandas → 200.

### Fichas

- Pastora de Cantillana → 200.
- Nuestro Padre Jesús del Gran Poder → 200.
- Paso de Nuestro Padre Jesús del Gran Poder → 200.
- Banda del Sol → 200.

### Media

- media de Supabase → renderizada.
- media Wikimedia → renderizada directamente.
- créditos → visibles.
- licencia y autoría → visibles.
- atribución → enlazada a la página canónica de Commons.
- `alt_text` → presente en el caso de control.

### Arquitectura pública

- navegación sin sesión editorial → correcta.
- lecturas públicas stateless → conservadas.
- un único `<main>` → conservado.
- canonical y metadatos → presentes.

### Supabase

```text
media_assets                         34
entity_media                         34
recursos Wikimedia                    5
media abierta inválida                0
relaciones nucleares incoherentes     0
```

### Vercel

```text
Estado deployment       READY
HTTP 200                 22
HTTP 404                  1 · prueba deliberada de ruta inexistente
HTTP 5xx                  0
logs error/fatal          0
```

La petición 404 correspondió deliberadamente a un slug incompleto. La ruta canónica corregida respondió 200.

### Alcance responsive

La validación móvil de cierre es estructural: viewport, navegación, menú móvil, componentes adaptativos y contratos automatizados. La revisión pixel-perfect en dispositivo físico queda incorporada al siguiente corte funcional, no como deuda oculta del cierre.

## Comparación de siguientes grandes frentes

Fórmula:

```text
VALOR DE USUARIO
× VALOR RELACIONAL
× IMPACTO ESTRATÉGICO
÷ COMPLEJIDAD
÷ RIESGO
```

Escala cualitativa de 1 a 5.

| Frente | Usuario | Relacional | Estratégico | Complejidad | Riesgo | Índice |
|---|---:|---:|---:|---:|---:|---:|
| **Experiencia móvil** | 5 | 4 | 5 | 3 | 2 | **16,67** |
| Enriquecimiento masivo | 4 | 5 | 5 | 3 | 3 | 11,11 |
| SEO | 3 | 3 | 4 | 2 | 2 | 9,00 |
| Tira del hilo | 5 | 5 | 5 | 4 | 4 | 7,81 |
| Analítica | 3 | 3 | 5 | 3 | 2 | 7,50 |
| Automatización editorial | 4 | 5 | 5 | 4 | 4 | 6,25 |
| Crecimiento territorial | 4 | 4 | 4 | 5 | 4 | 3,20 |
| Importación documental asistida | 4 | 5 | 4 | 5 | 5 | 3,20 |

## Siguiente gran fase aprobada

**EXPERIENCIA MÓVIL**

La fase no comienza con un rediseño global ni con una interfaz móvil separada.

Primer corte:

**PANEL MÓVIL · OPERACIÓN REAL**

Flujo de aceptación:

```text
abrir Hermandad
→ conservar contexto
→ localizar multimedia
→ subir fotografía o cartel
→ indicar función, crédito, derechos y Fuente
→ guardar
→ recibir feedback claro
→ recuperar errores sin perder el trabajo
```

Casos reales:

- Pastora de Cantillana;
- San Benito;
- El Baratillo.

## Límites del primer corte

- no crear nuevas entidades;
- no reabrir la arquitectura pública;
- no modificar RLS por comodidad visual;
- no recuperar #49;
- no introducir excepciones por `slug`;
- no construir un Panel móvil separado;
- no iniciar SEO, Tira del hilo, analítica o automatización en paralelo.

## Condiciones de cierre

- [x] Media abierta consolidada en una fuente.
- [x] Decisiones HC reconstruidas contra el producto real.
- [x] #314, #315 y #316 cerradas.
- [x] `ESTADO-PROYECTO.md` sincronizado.
- [x] Smoke corto de producción superado.
- [x] Runtime de Vercel sin errores estructurales.
- [x] Supabase saludable y sin deriva de migraciones.
- [x] Siguiente fase evaluada y reducida a una única prioridad.
- [x] Consolidación declarada cerrada.

**FASE DE CONSOLIDACIÓN → 🟢 VALIDADA EN PRODUCCIÓN**

**SIGUIENTE ACCIÓN ÚNICA → ABRIR `PANEL MÓVIL · OPERACIÓN REAL`**
