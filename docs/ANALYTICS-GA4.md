# Google Analytics 4, Consent Mode y medición de producto

## Objetivo

Hilo Cofrade usa una capa centralizada de analítica para medir navegación, Agenda, buscador y relaciones entre entidades sin dispersar llamadas a proveedores por los componentes.

La integración utiliza Google Analytics 4 mediante `gtag.js`, Vercel Web Analytics y Speed Insights. Las tres capas quedan sometidas al consentimiento de analítica.

No se usa Google Tag Manager, Google Ads, Meta Pixel ni ninguna otra herramienta de tracking.

## Variable de entorno

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

El Measurement ID de GA4 es un identificador público del flujo web, no un secreto. Aun así se gestiona por configuración para no hardcodear propiedades.

Configurar el valor real en Vercel para:

- Preview
- Production

Si la variable está vacía o no tiene formato `G-...`, Hilo Cofrade no carga `gtag.js`. La capa continúa disponible en modo de validación local mediante `window.__hiloAnalyticsDebug`.

## Consentimiento

La implementación aplica Consent Mode v2 con estos valores por defecto:

- `analytics_storage = denied`
- `ad_storage = denied`
- `ad_user_data = denied`
- `ad_personalization = denied`

Hilo Cofrade usa Consent Mode básico: no se carga la etiqueta de Google, Vercel Web Analytics ni Speed Insights antes de que el usuario acepte analítica.

La preferencia se conserva en almacenamiento local bajo `hc_analytics_consent_v1`.

El usuario puede:

- Aceptar analítica.
- Rechazar analítica.
- Abrir Preferencias y activar/desactivar analítica.
- Reabrir Preferencias desde el pie de página.

Aceptar y rechazar usan el mismo tratamiento visual. La publicidad permanece siempre denegada.

Al revocar analítica se envía el cambio de consentimiento, se detienen nuevos eventos y se eliminan las cookies propias habituales de GA (`_ga`, `_ga_*`, `_gid`, `_gat`) que existan para el dominio.

## Pageviews y App Router

GA4 se configura con:

```js
send_page_view: false
```

Los `page_view` se emiten manualmente desde la capa central cuando cambia el `pathname` del App Router. La capa recuerda la última ubicación enviada para no repetirla.

**Configuración necesaria en la propiedad GA4:** en el flujo web, Medición mejorada > Vistas de página > configuración avanzada, desactivar “Cambios de página basados en eventos del historial”. Google puede generar esos pageviews por su cuenta aunque `send_page_view` sea `false`; desactivar esa opción evita una segunda fuente de pageviews SPA.

`session_start` y `user_engagement` permanecen como eventos estándar gestionados por GA4.

## Eventos de producto

| Evento | Acción medida | Parámetros principales |
| --- | --- | --- |
| `site_search` | búsqueda realizada | `search_term`, `results_count` |
| `search_result_click` | clic/entrada desde resultado | `search_term`, `entity_type`, `entity_name`, `position` |
| `agenda_filter` | uso de filtro de Agenda | `filter_type`, `filter_value`, `agenda_type` |
| `agenda_period_select` | Hoy/Mañana/Fin de semana/Próximos | `period`, `agenda_type` |
| `agenda_event_open` | apertura de evento | `event_name`, `event_type`, `municipality`, `event_date`, `agenda_type` |
| `entity_click` | navegación entre entidades | `source_entity_type`, `source_entity_name`, `destination_entity_type`, `destination_entity_name`, `link_context` |
| `related_content_click` | contenido relacionado | `source_type`, `destination_type`, `destination_name`, `section_name` |
| `external_link_click` | salida a un dominio externo | `destination_domain`, `link_text`, `source_page_type` |

### Valores de `agenda_type`

- `agenda_cofrade`
- `glorias`
- `extraordinarias`
- `igualas_ensayos`

### Tipos de entidad

La capa usa, según el contenido, valores estables como:

- `hermandad`
- `banda`
- `marcha`
- `evento`
- `culto`
- `acontecimiento`
- `municipio`
- `imagen`
- `paso`
- `autor`

No se envían correos, teléfonos, identificadores de cuenta ni URLs completas con query strings a los eventos personalizados.

## Dimensiones personalizadas recomendadas en GA4

La aplicación ya envía los parámetros. Para explotarlos como dimensiones en informes de GA4 hay que registrar, cuando exista la propiedad:

- `entity_type`
- `municipality`
- `agenda_type`
- `event_type`
- `source_entity_type`
- `destination_entity_type`
- `section_name`

No hace falta crear una dimensión para cada parámetro si solo se va a usar en exploraciones puntuales.

## Cómo añadir un evento

Importar el helper desde un componente cliente:

```js
import { trackEvent } from '@/lib/analytics/client'

trackEvent('nombre_evento', {
  parametro: 'valor',
})
```

Reglas:

1. Usar `snake_case`.
2. Mantener nombres estables.
3. No enviar datos personales.
4. No enviar URLs con query strings.
5. Reutilizar parámetros existentes antes de crear variantes equivalentes.
6. Dejar que `trackEvent()` decida si existe consentimiento y proveedor disponible.

Para enlaces relacionales normales no es necesario añadir llamadas en cada componente: `HiloAnalytics` detecta navegación interna entre fichas. Los atributos `data-analytics-*` solo se usan cuando hace falta precisar origen, destino o sección.

## Validación sin Measurement ID

Tras aceptar analítica, abrir la consola del navegador y consultar:

```js
window.__hiloAnalyticsDebug
```

Debe mostrar:

- `consent: "granted"`
- `measurementConfigured: false` mientras no exista un ID real
- una cola `events` con los eventos y parámetros saneados.

Tras rechazar, `consent` debe ser `denied` y no deben añadirse nuevos eventos.

También debe comprobarse en Network que, antes de aceptar, no se solicita:

- `googletagmanager.com/gtag/js`
- `/_vercel/insights/script.js`
- scripts de Speed Insights.

## Validación con Measurement ID real

1. Confirmar que `NEXT_PUBLIC_GA_MEASUREMENT_ID` existe en Preview y Production.
2. Desactivar en GA4 el pageview por cambios de historial de la medición mejorada, porque Hilo Cofrade gestiona los cambios SPA manualmente.
3. Abrir una Preview limpia y rechazar analítica: no debe cargarse `gtag.js`.
4. Borrar la preferencia o abrir Preferencias y aceptar.
5. Verificar en Network una única carga de `gtag.js?id=G-...`.
6. Navegar por varias rutas App Router y comprobar un único `page_view` por `pathname`.
7. Probar buscador, filtros de las cuatro agendas, eventos, relaciones y enlaces externos.
8. Verificar los eventos y parámetros en GA4 DebugView.
9. Repetir en móvil.
10. Revocar analítica y confirmar que dejan de emitirse eventos.

## Archivos principales

- `lib/analytics/client.js`: consentimiento, carga GA4, `trackEvent()`, pageviews y modo debug.
- `components/analytics/HiloAnalytics.js`: integración global, navegación relacional, enlaces externos, Vercel Analytics y pageviews.
- `components/analytics/CookieConsentBanner.js`: interfaz de consentimiento.
- `components/analytics/CookieConsentBanner.module.css`: estilos del banner.
- Componentes de Agenda y buscador: solo aportan el contexto de producto necesario.

## Rendimiento y SEO

La integración no añade dependencias. `gtag.js`, Vercel Analytics y Speed Insights solo se solicitan después de consentimiento. El banner es un componente cliente pequeño y no modifica metadata, canonical, JSON-LD, sitemap, robots ni SSR del contenido editorial.
