# P0 · Agenda: aislamiento de build y fallos de lectura

## Evidencia y alcance

Base: `b71b945a9115f8dc4cb4d8f68f4495b00a267128` (#929).

- Build de producción: `dpl_AUJ8BeK25RDGFfEA6ijFbRh7bZF7`, ERROR.
- Preview #931: `dpl_Fxndgnh1Ziufuu9H3nkw8Zu3PsXQ`, ERROR.
- Ambos logs señalan lecturas públicas agotadas (~30 s) y `Failed to build /agenda-cofrade/page: /agenda-cofrade after 3 attempts`.
- El dominio mantiene #927: `218bcabfa3a8e6f4a1a2413f310a1a8a06173a67`, deployment `dpl_GDismn8A8HXrr9Ki1H4Jq4QZZTDv`, READY. No equivale a runtime certificado.
- Supabase devuelve `ACTIVE_HEALTHY` en la ficha, pero dos operaciones independientes (diagnóstico de conexiones y listado de migraciones) agotan la conexión. La consulta de logs PostgreSQL del 24/09 entre 16:30 y 17:30 UTC no devuelve filas; no demuestra ausencia de incidencias.

No hay evidencia suficiente para atribuir la causa a RLS, índices, límites de conexiones o recursos. No se cambia SQL, esquema, RLS, credenciales, límites, datos ni histórico. No se reinicia ni escala Supabase. #930 permanece descartada, sin incorporar su cambio de Autores.

## Corrección de contención

1. `connection()` antes de las consultas: `/agenda-cofrade` se renderiza en servidor al recibir una petición y deja de depender de Supabase durante el prerender del build.
2. Caché de fuentes completas con `unstable_cache`, TTL 300 s; conserva el patrón de caché ya usado por el proyecto, sin habilitar Cache Components globalmente. Solo entran resultados correctos; los lectores se invocan con `throwOnError: true`.
3. Opciones estrictas aditivas en cuatro lectores. Glorias ya soportaba esa opción y no necesita cambios. Los demás consumidores conservan su comportamiento previo por defecto.
4. Clave diaria `Europe/Madrid`: no reutilizar flags calculados el día anterior. El estado horario de las procesiones se recalcula fuera de la caché. Un cambio de día es caché fría; si la base falla, se muestra error, no datos de ayer presentados como actuales.
5. Error específico de ruta con reintento (`retry`, API verificada en Next 16.3.0 instalado); no expone mensajes internos ni afirma que no existan actos. Sin cambiar canonical, URL o JSON-LD de resultados válidos.
6. Elimina la lectura del calendario completo de cuadrillas usada solo para un contador; conserva enlace y calendario especializado.

La caché de datos reemplaza la caché HTML ISR de esta ruta; el coste de render SSR pasa a cada petición, sin repetir las consultas durante la vigencia de los datos. `revalidatePath('/agenda-cofrade')` existente invalida los datos consumidos por la ruta. No se promete disponibilidad con caché fría si Supabase sigue inaccesible ni se oculta el incidente tras este cambio.

## Verificaciones locales

- `npm test`: 1.141/1.141 pruebas correctas.
- `npm run build`: correcto sin variables de producción, igual que CI; hay advertencias esperadas por configuración pública ausente. No es una prueba de datos reales.
- Build acotado de Agenda con URL inaccesible: correcto, ruta dinámica.
- `node scripts/verify-agenda-build-resilience.mjs`: prueba de integración Next build/start contra servidor HTTP local controlado, sin claves reales:
  - backend 503 durante build; **cero consultas** y build correcto;
  - primera petición en frío con backend 503: **HTTP 500**, sin filtrar el error interno;
  - backend recuperado: **HTTP 200**, evento de prueba en HTML SSR y canonical original;
  - nueva caída durante TTL: **HTTP 200**, mismo evento cacheado y cero consultas adicionales.
- `git diff --check`: correcto.

El script de integración se ejecuta aparte de `npm test` y reemplaza el build local por uno acotado. Reconstruir con `npm run build` antes de desplegar un artefacto local. No se publica ningún evento de prueba.

## Integración y pendientes

En el preflight #931 modifica, entre otros, `glory-directory.js`, `crew-events.js` y revalidación del Panel. Este candidato no modifica esos archivos ni mezcla el trabajo de rendimiento; al integrar cualquiera, reconciliar ambas ramas y repetir pruebas.

No se ha fusionado ni desplegado a producción este candidato. Puertas pendientes: CI y preview remotas, QA con datos reales y móvil, recuperación/diagnóstico de la conectividad de Supabase, relectura de migraciones y ventana runtime limpia. Un build verde por sí solo no libera Carmona ni la ampliación relacional de Agenda.
