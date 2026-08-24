# HC-015 · Frontera entre Front público y Panel editorial

**Estado:** CERRADA  
**Fecha de cierre:** 24/08/2026  
**Ámbito:** arquitectura pública, autenticación, RLS, loaders y autoridad editorial

## Decisión

Hilo Cofrade mantiene dos superficies con responsabilidades distintas:

```text
FRONT PÚBLICO
→ lectura stateless
→ rol anon
→ solo datos y relaciones publicables

PANEL
→ sesión autenticada
→ edición, borradores y publicación
→ autoridad editorial
```

La frontera no es una preferencia de implementación. Es un contrato permanente de arquitectura y seguridad.

## Reglas

1. Una página pública no depende de cookies, sesión editorial, `next/headers`, `cookies()` ni del cliente SSR autenticado.
2. El Front utiliza clientes y loaders públicos stateless.
3. RLS continúa siendo la garantía final de qué puede leer `anon`.
4. Una relación pública solo expone extremos publicables o una proyección pública deliberada y documentada.
5. El Panel conserva autenticación, permisos y capacidades de escritura.
6. Un borrador puede existir en el Panel sin convertirse en autoridad pública.
7. Los datos no se duplican entre Front y Panel: ambos consumen el mismo modelo, con permisos y contratos distintos.
8. Una excepción requiere justificación, evidencia y regresión automática.

## Autoridad editorial del Panel

El Panel es la superficie autorizada para:

- crear y editar entidades;
- gestionar borradores;
- relacionar contenido;
- incorporar Fuentes;
- subir media y gobernar derechos;
- publicar o retirar información;
- auditar cambios.

El Panel no puede eludir constraints, RLS ni invariantes de base. La sesión autenticada habilita una operación editorial; no sustituye la integridad del modelo.

## Evidencia de implementación

La frontera ha sido aplicada y auditada en:

- Home;
- Hermandades;
- Imágenes;
- Pasos;
- Bandas;
- Extraordinarias;
- Marchas;
- Personas / agentes;
- Tira del hilo.

Existen barreras automáticas específicas de autoridad pública y el smoke transversal post-arquitectura validó navegación pública sin sesión.

## Consecuencias

- El contenido público puede cachearse y servirse sin heredar estado editorial.
- La navegación pública no se rompe cuando no existe sesión.
- El Panel puede trabajar con borradores sin filtrarlos al Front.
- Las nuevas superficies deben elegir desde el inicio su lado de la frontera.

## Regla de no regresión

No se incorporará una lectura pública mediante el cliente autenticado por comodidad. Si una nueva ficha necesita datos adicionales, se diseñará su contrato público y se protegerá con RLS y pruebas.

**FRONT PÚBLICO ↔ PANEL → 🟢 FRONTERA CANÓNICA**
