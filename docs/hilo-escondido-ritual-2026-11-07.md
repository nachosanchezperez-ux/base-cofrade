# El hilo escondido: ritual diario

## Preflight y diagnóstico

- Base revisada: `d84b1bc3306ed93e9228a3b203702cd1d7e694d9`. Producción Vercel READY, deployment `dpl_3QBD6BsazmgncpPUHanNLAR57rkn`. Supabase Hilocofrade ACTIVE_HEALTHY. Solo lecturas.
- PR abiertas revisadas: #1407, #1405, #1364, #1308, #1307, #1297 y #1171; ninguna modifica este juego. Se mantienen intactas.
- Ya existían racha, estadísticas básicas, archivo, compartir nativo y fichas relacionadas (#1286, #1349, #1351, #1353). Se amplían, no se duplican.
- #1281 corrigió el HTML antiguo servido por ISR mediante `force-dynamic`. Esa protección continúa. Faltaba actualizar una pestaña que siguiera abierta a medianoche y renovar las fichas relacionadas.
- El contador anterior calculaba minutos de reloj, no duración real en los días de cambio horario.
- No existe una ruta de glosario en el código revisado. Las definiciones proceden del banco editorial existente. Las fichas relacionadas se eligen entre directorios publicados; si faltan candidatos, se mantiene únicamente el enlace real a la sección, sin inventar una ficha.

## Propuesta implementada

1. Conservar las claves locales existentes, sin migración ni registro. Partidas terminadas, porcentaje de **palabras** acertadas, racha diaria actual/máxima y distribución de palabras acertadas en 1/2/3 intentos por modalidad. El archivo cuenta en las estadísticas, no en la racha. En experto, acertar el reto completo exige las tres palabras; GA4 conserva también el detalle parcial.
2. Texto breve con número estable desde el 12/10/2026 (#1), modalidad, fecha, 🧵 acierto/🪢 fallo, intentos por palabra, pistas, racha diaria y URL. Menú nativo primero; WhatsApp y copiar sin menú nativo; alternativas plegadas. Cancelar el menú no cuenta como compartir.
3. Definición y una ficha real relacionada tras resolver, tanto con acierto como con fallo. Cuando hay ficha, se evita repetir además el enlace al directorio.
4. «Nuevo hilo en …» y actualización automática en Europe/Madrid: temporizador hasta el límite de fecha, foco, visibilidad y restauración de página. Antes de aceptar una respuesta se comprueba que el día siga vigente. Se cancelan respuestas pendientes al cambiar de reto.
5. Paleta azul/blanca, sin subrayados y acciones secundarias menos prominentes. Tarjeta de imagen compartible también azul.
6. Cofradle: se propusieron enlace discreto o retirada; el usuario eligió **enlace discreto**. Se retira la tarjeta y se conserva una línea al pie.

## Medición

Todos los eventos pasan por `trackEvent`, respetando el consentimiento existente. No se envían respuestas ni identificadores personales.

| Evento | Disparador / datos |
| --- | --- |
| `juego_iniciado` | Primera respuesta válida o primera pista; marcador local `started` evita repetir al continuar. |
| `juego_completado` | Última palabra resuelta; `resultado` acierto/fallo, `intentos` totales, `pistas`, modalidad, día y origen hoy/archivo. |
| `juego_compartido` | Compartir nativo aceptado, copia conseguida o acción hacia un destino; `share_method`. Un enlace de WhatsApp mide apertura, no envío efectivo. |
| `juego_ficha_abierta` | Clic en ficha relacionada o sección alternativa; `ficha_url` y contexto de partida. |

Los eventos anteriores `game_complete`, `game_open`, `game_hint` y `content_share` se mantienen para no romper informes existentes; no sumar las dos familias como si fueran partidas distintas.

## Validación

- 2.476 pruebas de la suite pasan; 59 específicas del juego.
- Casos nuevos: tres días consecutivos, recarga sin duplicar racha, día omitido, derrota, máximo conservado, acierto/fallo en las dos modalidades, distribución separada, texto sin soluciones y medianoche Madrid en verano/invierno y jornadas de 23/25 horas.
- `git diff --check`: correcto.
- Build local: compilación y TypeScript correctos. El prerender completo se detiene en `/semana-santa-sevilla-2027` por falta de configuración pública de Supabase en el entorno local. No es un build completo aprobado.
- Preview local: el lanzador añade `--host`/`--strictPort`, que Next.js no admite. No se cambia la aplicación para eludir este límite del entorno.
- Vercel: build completo READY del código `13b95f81b57fe9636e9319259b639660c5ccf645`, deployment `dpl_D75VJjTaSYsrzgHqDUeu5eChQmVX`. El estado de GitHub/Vercel es success. Este añadido documental posterior no cambia el código probado.
- GitHub confirma la PR #1410 sin conflictos con main `36f33e2b`; su primera respuesta de mergeability era provisional.
- Pendiente de certificación: interacción real en móvil, menú nativo del sistema, cambio de día con navegador abierto, inspección visual final y llegada de eventos a GA4. Las pruebas de lógica no equivalen a estos ensayos de navegador.
- Acceso visual bloqueado: el navegador privado llega al login de Vercel. La revisión automática rechazó crear el enlace temporal de acceso porque permitiría a cualquiera con el enlace ver la preview protegida. No se desactiva la protección ni se usa otra herramienta para crear el mismo enlace. Para continuar con esa vía hace falta autorización del usuario.

Sin dependencias nuevas, cambios de datos, migraciones, merge ni despliegue de producción. PR en borrador para revisión.
