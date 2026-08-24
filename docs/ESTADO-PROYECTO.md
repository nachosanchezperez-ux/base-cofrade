# Estado operativo de Hilo Cofrade

> Fuente canónica para Hilo Orquestador. GitHub, Vercel y Supabase prevalecen siempre sobre este documento. Antes de cualquier acción significativa deben refrescarse las herramientas.

## Último estado conocido

- Revisión: **24 de agosto de 2026 · mañana (CEST)**.
- Repositorio: `nachosanchezperez-ux/base-cofrade`.
- Rama principal: `main`.
- Baseline funcional validado: `cd5cc70d1e0b85c80c69f4cd5bf41359bf954672` — **Cierra la gobernanza documental de consolidación (#321)**.
- Producción funcional auditada: `dpl_2hZCHYuFtz6WVuEU4meGVa7AohQr` → **READY**, alineada con `cd5cc70`.
- Supabase: `Hilocofrade` (`kcevwkucqzcyrqaimyhl`) → **ACTIVE_HEALTHY**.
- Última migración reconciliada: `20260824003235_cult_media`.
- PR documentales #314, #315 y #316 → **CERRADAS POR SUPERADAS**.
- Única PR abierta: **#49 · Importador documental asistido** → **⚪ APARCADA**; no usar como base ni aplicar sus migraciones.

Los commits posteriores limitados a esta acta documental no alteran el baseline funcional ya validado. El SHA real de `main` debe refrescarse siempre antes de ejecutar un cambio nuevo.

## Última validación

### Integración

- PR #321 fusionada.
- CI del head definitivo: **240/240 pruebas superadas**.
- Build completo de Next.js: **correcto**.
- Preview exacta del head: **READY**.
- Producción del baseline funcional: **READY**.

### Smoke público de cierre

Rutas canónicas comprobadas con **HTTP 200** sobre el deployment exacto:

| Superficie | Ruta de control | Resultado |
|---|---|---|
| Home 2.8 | `/` | 200 |
| Hermandades | `/hermandades` | 200 |
| Imágenes | `/imagenes` | 200 |
| Pasos | `/pasos` | 200 |
| Bandas | `/bandas` | 200 |
| Extraordinarias | `/extraordinarias` | 200 |
| Tira del hilo | `/pregunta` | 200 |
| Ficha de Hermandad | `/hermandades/pastora-de-cantillana` | 200 |
| Ficha de Imagen | `/imagenes/nuestro-padre-jesus-del-gran-poder-sevilla` | 200 |
| Ficha de Paso | `/pasos/paso-nuestro-padre-jesus-gran-poder` | 200 |
| Ficha de Banda | `/bandas/banda-del-sol` | 200 |

La Home conservó:

- Hoy en Hilo Cofrade;
- Tira del hilo;
- Extraordinarias;
- Marcha del día;
- Explorar;
- Últimos hilos.

La navegación pública funcionó sin sesión editorial. Las páginas mantuvieron `<main>` único, canonical, metadatos, menú móvil estructural y rutas públicas stateless.

Se realizó además una petición deliberada al slug incompleto `/imagenes/nuestro-padre-jesus-del-gran-poder`; devolvió el **404 esperado**. Supabase confirmó el slug canónico con sufijo `-sevilla`, cuya ficha respondió correctamente con 200. No constituye una regresión.

### Media y grafo

Auditoría en Supabase:

```text
media_assets                         34
entity_media                         34
recursos Wikimedia                    5
media abierta inválida                0
relaciones nucleares incoherentes     0
```

La ficha de Nuestro Padre Jesús del Gran Poder verificó el patrón público completo:

- recurso servido desde Wikimedia;
- autor y titular `Tiberioclaudio99`;
- licencia `CC BY-SA 4.0`;
- texto alternativo;
- crédito visible;
- enlace a la página canónica `File:` de Commons.

### Runtime de Vercel

Ventana posterior al smoke sobre `dpl_2hZCHYuFtz6WVuEU4meGVa7AohQr`:

```text
HTTP 200            22
HTTP 404             1 · petición deliberada al slug incompleto
HTTP 5xx             0
logs error/fatal     0
```

### Alcance móvil de esta validación

La validación de cierre es **estructural responsive**: viewport, menú móvil, navegación, componentes adaptativos y contratos automáticos presentes. No sustituye una revisión visual pixel-perfect en dispositivo físico, que será criterio del siguiente corte funcional.

## Fase de consolidación

```text
Arquitectura pública                  🟢 CERRADA
Personas / agentes                    🟢 CERRADO
Smoke transversal                    🟢 CERRADO
Salud del grafo · ciclo 1             🟢 CERRADO
Media abierta                         🟢 GOBERNADA
Decisiones HC                         🟢 SINCRONIZADAS HASTA HC-017
#314 / #315 / #316                    🟢 RESUELTAS
Producción                            🟢 ESTABLE / READY
Documentación operativa               🟢 ALINEADA
FASE DE CONSOLIDACIÓN                 🟢 CERRADA
```

## Decisiones canónicas

- Registro: `docs/DECISIONES-HC.md`.
- Media abierta: `docs/MEDIA-ABIERTA.md` → HC-014.
- Frontera Front público ↔ Panel: HC-015.
- Importación masiva gobernada: HC-016.
- Salud del grafo como cola editorial: HC-017.
- HC-018 queda disponible, **no asignada ni reservada**.
- #49 continúa aparcada.

## Frente activo

**EXPERIENCIA MÓVIL → 🟢 APROBADA COMO SIGUIENTE GRAN FASE**

No se ha iniciado un rediseño global ni una interfaz móvil separada.

Primer corte aprobado:

**PANEL MÓVIL · OPERACIÓN REAL**

Casos de validación:

- Pastora de Cantillana;
- San Benito;
- El Baratillo.

## Bloqueos reales

No existen bloqueos de consolidación abiertos.

La revisión visual en dispositivo físico no bloquea el cierre de la fase anterior; forma parte de los criterios de aceptación del primer corte móvil.

## Siguiente acción

**Abrir el primer corte `Panel móvil · operación real`.**

## Regla para «¿Qué toca?»

1. Refrescar GitHub, Vercel y Supabase.
2. Localizar el primer punto pendiente de la secuencia vigente.
3. Marcar como cerrados los anteriores cuando el estado real lo confirme.
4. Devolver una sola acción ejecutable.

**ESTADO-PROYECTO → 🟢 CANÓNICO Y ACTUAL**
