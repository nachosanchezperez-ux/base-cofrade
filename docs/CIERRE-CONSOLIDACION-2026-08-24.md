# Cierre de la fase de consolidación

> Acta operativa de Dirección. La fase solo se declarará cerrada después del smoke final de producción y de la actualización definitiva de `ESTADO-PROYECTO.md`.

- Fecha: **24 de agosto de 2026**.
- Estado del documento: **EN CIERRE · pendiente de smoke final de producción**.
- Baseline funcional auditado al abrir el corte: `main` en `0a38643ccb50c9e2b8a3f53097b4c12d44bb467c`.
- Producción auditada al abrir el corte: `dpl_5dnhHspdGvsJu32fvU5tG28GHZXK` → `READY`.
- Supabase: `ACTIVE_HEALTHY`; última migración `20260824003235_cult_media`.

## Resolución de los frentes documentales

### #314 · Media abierta

La PR proponía un segundo protocolo vigente. No debe fusionarse como documento paralelo.

Su delta útil —verificación del sujeto, portada frente a galería, reutilización canónica, revisión humana y controles editoriales— queda consolidado en una sola fuente:

`docs/MEDIA-ABIERTA.md`

Resultado previsto:

**#314 → CERRADA POR SUPERADA**  
**MEDIA ABIERTA → UNA ÚNICA FUENTE CANÓNICA**

### #315 · Decisiones HC

La rama partía de una fotografía antigua y no recogía todo el registro existente.

El cierre canónico:

- inventaría las decisiones reales hasta HC-013;
- fija HC-014 para media abierta;
- formaliza HC-015, HC-016 y HC-017 con evidencia ya implantada;
- no duplica Extraordinarias, tarjetas, directorios, logotipos ni patrimonio musical;
- no reserva HC-018.

Resultado previsto:

**#315 → CERRADA POR SUPERADA**  
**DECISIONES HC → SINCRONIZADAS**

### #316 · Cierre y siguiente fase

La prioridad se reevalúa sobre el producto real, incluyendo:

- arquitectura pública cerrada;
- primer ciclo de Salud cerrado;
- media abierta gobernada;
- piloto de la Pastora integrado;
- SEO técnico ampliado mediante #317 y corregido mediante #319;
- `cult_media` reconciliada mediante #320;
- #49 aparcada.

La rama antigua no debe fusionarse como fotografía definitiva.

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

## Única prioridad recomendada

**SIGUIENTE GRAN FASE → EXPERIENCIA MÓVIL**

La decisión no implica un rediseño global ni una interfaz móvil separada.

El primer corte será:

**PANEL MÓVIL · OPERACIÓN REAL**

Objetivo: completar desde un teléfono, sin perder contexto, el flujo:

```text
abrir Hermandad
→ localizar la sección correcta
→ subir fotografía o cartel
→ indicar función, crédito, derechos y Fuente
→ guardar
→ recibir confirmación clara
→ recuperar un error sin perder el trabajo
```

Casos de validación:

- Pastora de Cantillana;
- San Benito;
- El Baratillo.

## Límites del primer corte

- no crear nuevas entidades;
- no modificar RLS por conveniencia visual;
- no reabrir la arquitectura pública;
- no recuperar #49;
- no introducir excepciones por `slug`;
- no construir un Panel móvil separado;
- no iniciar SEO, Tira del hilo o automatización en paralelo.

## Condiciones para declarar la fase cerrada

- [x] Media abierta consolidada en una fuente.
- [x] Decisiones HC reconstruidas contra el producto real.
- [x] Siguiente fase evaluada y reducida a una prioridad.
- [ ] PR antiguas #314, #315 y #316 cerradas.
- [ ] `ESTADO-PROYECTO.md` actualizado sobre el `main` definitivo.
- [ ] Smoke corto de producción superado.
- [ ] Runtime de Vercel sin errores estructurales.
- [ ] Consolidación declarada cerrada.

**NO INICIAR EL PRIMER CORTE MÓVIL HASTA COMPLETAR LOS PUNTOS PENDIENTES.**
