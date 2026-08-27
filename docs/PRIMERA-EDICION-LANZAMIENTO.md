# Primera edición · checklist de lanzamiento

Fecha de corte: 27 de agosto de 2026

Objetivo: cerrar lo existente sin ampliar funcionalidad.

## Estado

**PRIMERA EDICIÓN → 🟡 NO CERRADA TÉCNICAMENTE**

Producción y las barreras funcionales están estables. La única puerta técnica pendiente es la matriz responsive exacta en `390`, `768`, `1024` y `1440` px. Auth y Legal son dependencias externas y no se falsean como resueltas.

## Checklist simple

| Puerta | Estado | Evidencia resumida |
|---|---:|---|
| Código | 🟢 | `main` funcional `73d45a8`; #383 y #385 cerradas sin fusionar y aplazadas, con sus ramas conservadas fuera del cierre. |
| Build | 🟢 | Next.js 16.3/Turbopack completado. |
| Producción | 🟢 | Deployment `dpl_Hi4A81sbRh115ATZsNnFRvyce88A` READY en `dub1`, asociado exactamente a `73d45a8`; 0 errores/fatales y 0 respuestas 5xx tras la auditoría. |
| QA responsive | 🔴 | Revisión completa a 1363 px superada, pero falta evidencia exacta a 390/768/1024/1440. |
| Arquitectura pública | 🟢 | Familias públicas, relaciones, fallbacks y navegación verificadas. |
| Panel | 🟢 | Protección, login/sesión/logout, navegación y superficies editoriales verificadas; Legal ofrece cuatro borradores privados editables sin publicación automática. |
| Migraciones | 🟢 | Git ↔ Supabase `178/178`. |
| RLS | 🟢 | `75/75` tablas públicas con RLS activa; `legal_drafts` no concede acceso a `anon`. |
| SEO | 🟢 | Robots, canonical, OG, Twitter Cards, indexabilidad y noindex validados. |
| Sitemap | 🟢 | 193 URLs; endpoint 200 y muestra viva de doce superficies públicas con respuesta 200, sin 5xx en el deployment. |
| Search Console | 🟣 | Evidencia autenticada del 26/08/2026: dominio verificado, sitemap correcto y Home indexada. Baseline público refrescado el 27/08; la sesión interna de la consola no pudo estabilizarse. |
| Seguridad pública | 🟢 | Panel protegido, APIs excluidas, diagnósticos 404, sin claves/trazas/drafts expuestos. |
| Importador sin IA | 🟢 | #49 cerrada sin fusionar; HC-016 sigue como vía canónica determinista. |
| Rutas de diagnóstico retiradas | 🟢 | `/prueba-next` y `/prueba-supabase` responden 404. |
| Auth · contraseñas filtradas | 🟣 | Bloqueada por el plan Free de Supabase; requiere Pro o superior. |
| Legal / privacidad / contacto | 🟣 | Borrador privado editable en Panel; pendiente de completar responsable, emails, contacto, bases, plazos y aprobación. Sin rutas públicas; Colabora sigue cerrada. |

## Validación realizada

- `npm test`: **360/360**.
- `npm run build`: **correcto**.
- `npm audit`: **0 vulnerabilidades**; barrido de secretos sin credenciales reales versionadas.
- Preview QA: Extraordinarias y Panel Multimedia sin overflow ni imágenes rotas.
- Smoke público: Home, Directorio, Hermandad, Imagen, Paso, Banda, Extraordinaria, Gloria y Tira del hilo.
- Smoke autenticado: Panel y Multimedia.
- Runtime: 0 respuestas 5xx y 0 eventos fatal. Un cierre anticipado de stream con HTTP 200 no se reprodujo; la ruta afectada pasó una nueva carga completa.
- Salud del grafo: 0 extremos rotos en relaciones nucleares y 0 entidades publicadas sin fila especializada.
- Accesibilidad semántica: muestra de doce superficies sin fallos en idioma, títulos, landmarks, alternativas de imagen, nombres de controles, etiquetas o identificadores duplicados. La comprobación visual permanece dentro de la matriz responsive pendiente.

## Dependencias externas

- **Auth 🟣:** elevar el plan de Supabase si Dirección requiere protección canónica contra contraseñas filtradas. La medida afecta a altas y cambios de contraseña, no revalida automáticamente las contraseñas existentes.
- **Legal 🟣:** Dirección debe aportar identidad responsable, contacto público, email y tratamiento/política aplicable antes de publicar textos o abrir formularios.

## Regla de congelación

No iniciar otra Home, Tira del hilo 3, nuevas entidades, directorios, automatizaciones, más Glorias ni nuevas funciones del Panel. Tras la matriz exacta, Dirección decide por separado el cierre técnico y el lanzamiento/comunicación pública.

`#383` y `#385` permanecen cerradas sin fusionar. Sus ramas se conservan, pero no deben reabrirse durante este cierre.

## Única acción siguiente

Ejecutar y documentar la matriz pública y del Panel en `390`, `768`, `1024` y `1440` px. Si no hay bloqueos rojos o naranjas, declarar la primera edición técnicamente cerrada sin confundirlo con su anuncio público.
