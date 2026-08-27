# Primera edición · checklist de lanzamiento

Fecha de corte: 27 de agosto de 2026

Objetivo: cerrar lo existente sin ampliar frentes de forma automática.

## Estado

**PRIMERA EDICIÓN → 🟡 NO CERRADA TÉCNICAMENTE**

Producción y las barreras funcionales están estables. La única puerta técnica pendiente continúa siendo la matriz responsive exacta en `390`, `768`, `1024` y `1440` px. Auth y Legal son dependencias externas y no se falsean como resueltas.

Tras la congelación inicial, Dirección autorizó expresamente recuperar **#385**. Esa PR se reconcilió con el `main` de cierre, pasó QA completo y fue fusionada. **#383 permanece cerrada sin fusionar.**

## Checklist simple

| Puerta | Estado | Evidencia resumida |
|---|---:|---|
| Código | 🟢 | `main` funcional `913dd614`; #385 integrada por decisión expresa de Dirección; #383 y #49 permanecen cerradas sin fusionar. |
| Build | 🟢 | Next.js 16.3/Turbopack completado sobre el head reconciliado de #385. |
| Tests | 🟢 | **369/369** en la integración de #385. |
| Producción | 🟢 | Deployment `dpl_6ZgEQuhTiRxcVs9KFhmeEzhbENbk` READY en `dub1`, asociado exactamente a `913dd614`; alias `hilocofrade.es` y `www.hilocofrade.es` verificados. |
| Runtime | 🟢 | 0 eventos `error/fatal` en la comprobación posterior al despliegue de #385. |
| QA responsive | 🔴 | Sigue faltando evidencia exacta a 390/768/1024/1440. |
| Arquitectura pública | 🟢 | Familias públicas, relaciones, fallbacks y navegación conservan el baseline de cierre. |
| Panel | 🟢 | #385 unifica Salidas, conecta Curiosidades editoriales y normaliza multimedia firmada de Bandas/Salidas. |
| Migraciones | 🟢 | Git ↔ Supabase `178/178`; #385 añade 0 migraciones. |
| RLS | 🟢 | `75/75` tablas públicas con RLS activa según la última auditoría; #385 añade 0 cambios RLS. |
| SEO | 🟢 | Robots, canonical, OG, Twitter Cards e indexabilidad conservan el baseline validado. |
| Seguridad pública | 🟢 | Panel protegido, APIs excluidas y diagnósticos retirados; #385 no cambia Auth. |
| Importador sin IA | 🟢 | #49 cerrada sin fusionar; HC-016 sigue como vía canónica determinista. |
| Auth · contraseñas filtradas | 🟣 | Bloqueada por el plan Free de Supabase; requiere Pro o superior. |
| Legal / privacidad / contacto | 🟣 | Borrador privado editable; pendiente de responsable, emails/contacto, bases, plazos y aprobación. Sin rutas legales públicas ni apertura de Colabora. |

## Integración autorizada de #385

La recuperación de #385 se ejecutó después del cierre inicial y no supone reabrir el desarrollo general de la Primera edición.

### Salidas

El Panel expone un único módulo **Salidas**. Dentro se distinguen:

- **Salidas habituales**: estación de penitencia, Procesión de Gloria, Vía Crucis, Rosario público, Traslado, Romería, Subida, Bajada, Procesión sacramental, extraordinarias y otras salidas recurrentes.
- **Salidas registradas**: ediciones concretas con fecha, horarios, recorrido, titulares, música, fotografía y fuentes.

El término técnico `Series` permanece únicamente en el modelo interno.

### Curiosidades

Las Curiosidades relacionadas con una Hermandad proceden del Banco editorial canónico (`editorial_content` + `editorial_content_links`) y respetan publicación/RLS.

### Multimedia

Bandas y fotografías principales de Salidas usan subida firmada directa:

**navegador → Supabase Storage → verificación → vinculación**.

Los bytes no pasan por las Server Actions de Vercel.

## Validación realizada para #385

- rama reconciliada con el `main` de cierre: **0 commits por detrás** antes del merge;
- `npm test`: **369/369**;
- `npm run build`: **correcto**;
- preview exacta del head: **READY** en `dub1`;
- runtime preview: 0 `error/fatal`;
- merge con head esperado;
- producción: `dpl_6ZgEQuhTiRxcVs9KFhmeEzhbENbk` **READY**;
- alias de producción: `hilocofrade.es`, `www.hilocofrade.es` y alias Vercel correctos;
- runtime de producción: 0 `error/fatal` en la ventana posterior al despliegue;
- 0 migraciones, 0 cambios de esquema y 0 cambios RLS.

## Dependencias externas

- **Auth 🟣:** elevar el plan de Supabase si Dirección requiere protección canónica contra contraseñas filtradas.
- **Legal 🟣:** completar identidad responsable, contacto público, email y tratamiento/política aplicable antes de publicar textos o abrir formularios.

## Regla de congelación actualizada

La recuperación de #385 fue una decisión expresa y puntual de Dirección. No implica iniciar otra Home, una nueva Tira del hilo, nuevas entidades, directorios, automatizaciones ni más funciones del Panel.

`#383` permanece cerrada sin fusionar y requiere una decisión independiente si alguna vez se quiere recuperar.

## Única acción siguiente

Ejecutar y documentar la matriz pública y del Panel en `390`, `768`, `1024` y `1440` px. Si no hay bloqueos rojos o naranjas, declarar la Primera edición técnicamente cerrada sin confundirlo con su anuncio público.
