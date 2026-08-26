# Primera edición · checklist de lanzamiento

Fecha de corte: 26 de agosto de 2026

Objetivo: cerrar lo existente sin ampliar funcionalidad.

## Estado

**PRIMERA EDICIÓN → 🟡 NO CERRADA TÉCNICAMENTE**

Producción y las barreras funcionales están estables. La única puerta técnica pendiente es la matriz responsive exacta en `390`, `768`, `1024` y `1440` px. Auth y Legal son dependencias externas y no se falsean como resueltas.

## Checklist simple

| Puerta | Estado | Evidencia resumida |
|---|---:|---|
| Código | 🟢 | #371 fusionada; cambio mínimo y regresiones añadidas. |
| Build | 🟢 | Next.js 16.3/Turbopack completado. |
| Producción | 🟢 | Deployment funcional `dpl_6B8ZJCi9sQvZB1itDufXf6BBqZbU` READY en `dub1`; sin 5xx ni fatal tras el smoke. |
| QA responsive | 🔴 | Revisión completa a 1363 px superada, pero falta evidencia exacta a 390/768/1024/1440. |
| Arquitectura pública | 🟢 | Familias públicas, relaciones, fallbacks y navegación verificadas. |
| Panel | 🟢 | Protección, login/sesión/logout, navegación y superficies editoriales verificadas; contratos de carga/guardado/feedback cubiertos sin crear datos de prueba. |
| Migraciones | 🟢 | Git ↔ Supabase `176/176`. |
| RLS | 🟢 | `74/74` tablas públicas con RLS activa. |
| SEO | 🟢 | Robots, canonical, OG, Twitter Cards, indexabilidad y noindex validados. |
| Sitemap | 🟢 | 188 URLs y 188 respuestas 200 en el barrido. |
| Search Console | 🟣 | Última evidencia canónica del 26/08/2026: dominio verificado, sitemap correcto y Home indexada; falta refresco independiente de la consola. |
| Seguridad pública | 🟢 | Panel protegido, APIs excluidas, diagnósticos 404, sin claves/trazas/drafts expuestos. |
| Importador sin IA | 🟢 | #49 cerrada sin fusionar; HC-016 sigue como vía canónica determinista. |
| Rutas de diagnóstico retiradas | 🟢 | `/prueba-next` y `/prueba-supabase` responden 404. |
| Auth · contraseñas filtradas | 🟣 | Bloqueada por el plan Free de Supabase; requiere Pro o superior. |
| Legal / privacidad / contacto | 🟣 | Pendiente de datos confirmados por Dirección; Colabora cerrada y sin formularios públicos de datos personales. |

## Validación realizada

- `npm test`: **347/347**.
- `npm run build`: **correcto**.
- Preview QA: Extraordinarias y Panel Multimedia sin overflow ni imágenes rotas.
- Smoke público: Home, Directorio, Hermandad, Imagen, Paso, Banda, Extraordinaria, Gloria y Tira del hilo.
- Smoke autenticado: Panel y Multimedia.
- Runtime: 0 respuestas 5xx y 0 eventos fatal. Un cierre anticipado de stream con HTTP 200 no se reprodujo; la ruta afectada pasó una nueva carga completa.
- Salud del grafo: 0 extremos rotos en relaciones nucleares y 0 entidades publicadas sin fila especializada.

## Dependencias externas

- **Auth 🟣:** elevar el plan de Supabase si Dirección requiere protección canónica contra contraseñas filtradas. La medida afecta a altas y cambios de contraseña, no revalida automáticamente las contraseñas existentes.
- **Legal 🟣:** Dirección debe aportar identidad responsable, contacto público, email y tratamiento/política aplicable antes de publicar textos o abrir formularios.

## Regla de congelación

No iniciar otra Home, Tira del hilo 3, nuevas entidades, directorios, automatizaciones, más Glorias ni nuevas funciones del Panel. Tras la matriz exacta, Dirección decide por separado el cierre técnico y el lanzamiento/comunicación pública.

## Única acción siguiente

Ejecutar y documentar la matriz pública y del Panel en `390`, `768`, `1024` y `1440` px. Si no hay bloqueos rojos o naranjas, declarar la primera edición técnicamente cerrada sin confundirlo con su anuncio público.
