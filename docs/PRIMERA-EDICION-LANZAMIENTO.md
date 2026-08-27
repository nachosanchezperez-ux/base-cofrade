# Primera edición · checklist de lanzamiento

Fecha de corte: 27 de agosto de 2026

Objetivo: cerrar lo existente sin ampliar frentes ni declarar automáticamente el lanzamiento.

## Estado

**PRIMERA EDICIÓN → 🟡 NO CERRADA TÉCNICAMENTE**

Producción, SEO, sitemap y seguridad pública están aprobados. Siguen pendientes la matriz responsive exacta en `390`, `768`, `1024` y `1440` px y la resolución de la PR visual #394. Auth y Legal son dependencias externas y no se falsean como resueltas.

## Checklist simple

| Puerta | Estado | Evidencia resumida |
|---|---:|---|
| Código | 🟢 | `main` funcional `c6a15a9`; #393 y #395 fusionadas; #394 abierta y aún fuera de producción. |
| Build | 🟢 | Next.js 16.3/Turbopack completado tras #395. |
| Tests | 🟢 | **372/372** en `main`. |
| Producción | 🟢 | `dpl_9b7yQaUfdLcLvdrLDBP3ZZYUPJMq` READY en `dub1`, commit exacto `c6a15a9`; alias correctos. |
| Runtime | 🟢 | 6 peticiones finales con HTTP 200 y 0 eventos `error/fatal`. |
| QA responsive | 🔴 | Falta evidencia exacta a 390/768/1024/1440, incluida la preview de #394. |
| Arquitectura pública | 🟢 | Directorios, sitemap, Bandas y buscadores ya no enlazan entidades sin ficha especializada. |
| Panel | 🟢 | Protegido y operativo; Salidas, Curiosidades, multimedia y borradores legales conservan el baseline validado. |
| Migraciones | 🟢 | Git ↔ Supabase `178/178`; #393 y #395 añaden 0 migraciones. |
| RLS | 🟢 | `75/75` tablas públicas con RLS activa según la última auditoría. |
| SEO | 🟢 | Canonical, OG, Twitter Cards, indexabilidad y exclusiones mantienen el baseline aprobado. |
| Sitemap | 🟢 | Producción sirve **195 URL**; auditoría **195/195** con HTTP 200, canonical y sin `noindex` ni duplicados. |
| Search Console | 🟢 | Dominio verificado; Home en Google y HTTPS correcto; sitemap correcto y leído el 27/08. |
| Seguridad pública | 🟢 | Panel protegido, APIs excluidas, sin claves, SQL, drafts ni trazas técnicas expuestas. |
| Rutas de diagnóstico | 🟢 | Rutas de prueba retiradas; `robots.txt` excluye `/api/` y `/panel/`. |
| Importador sin IA | 🟢 | #49 cerrada sin fusionar; HC-016 sigue como vía canónica determinista. |
| Auth · contraseñas filtradas | 🟣 | Bloqueada por el plan Free de Supabase; requiere Pro o superior. |
| Legal / privacidad / contacto | 🟣 | Borradores privados editables; faltan valores concretos y aprobación. Colabora continúa cerrada. |

## Search Console · corte actual

- Home: **indexada** y servida por HTTPS.
- Sitemap: **Correcto**, enviado el 13 de agosto y leído el 27 de agosto.
- Instantánea de Google: `188` páginas descubiertas, `12` indexadas y `31` no indexadas.
- Exclusiones: `1` página con redirección y `30` descubiertas actualmente sin indexar; `0` rastreadas actualmente sin indexar.
- Rendimiento visible: `5` clics. Vídeo: `1` sin indexar.

Search Console procesa una instantánea anterior de `188` URL; el sitemap de producción actual contiene `195` URL válidas. No se trata como error crítico.

## Salud pública y editorial

- **Pública 🟢:** sitemap, directorios, enlaces de Bandas y buscadores no conducen a las cinco hermandades relacionales sin ficha.
- **Editorial 🟡:** esos cinco nodos permanecen como referencias no navegables hasta completarlos o reclasificarlos con datos reales.
- Las carencias de cobertura visual y autoría ya registradas siguen en backlog y no rompen la UI.

## Dependencias externas

- **Auth 🟣:** elevar el plan de Supabase si Dirección requiere la protección canónica contra contraseñas filtradas.
- **Legal 🟣:** completar responsable, contacto público, email y tratamiento/política aplicable; aprobarlos antes de publicar textos o abrir formularios.

## Regla de congelación

No iniciar otra Home, una nueva Tira del hilo, nuevas entidades, directorios, automatizaciones ni más funciones del Panel. No declarar lanzamiento ni comunicación pública como consecuencia automática del cierre técnico.

## Única acción siguiente

Ejecutar y documentar la matriz `390 / 768 / 1024 / 1440` sobre producción y sobre la preview de #394. Después, resolver esa PR y decidir el cierre técnico por separado del lanzamiento público.
