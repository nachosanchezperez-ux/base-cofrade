# Estado operativo de Hilo Cofrade

> Fuente canónica para Hilo Orquestador. GitHub, Vercel y Supabase prevalecen siempre sobre este documento. Antes de cualquier acción significativa deben refrescarse las herramientas.

## Último estado conocido

- Revisión: **25 de agosto de 2026 · madrugada (CEST)**.
- Repositorio: `nachosanchezperez-ux/base-cofrade`.
- Rama principal: `main`.
- `main` funcional publicado: `8fd1e6fbbb2c61a82dcf4a1366e463d509d75dea` — **Panel V2 · fotografía contextual y operación móvil optimizada (#339)**.
- Producción funcional: `dpl_Efi89aViKJ2uiyvFY5LScgSgFJny` → **READY**, asociada a `hilocofrade.es` y `www.hilocofrade.es`.
- Supabase: `Hilocofrade` (`kcevwkucqzcyrqaimyhl`) → **ACTIVE_HEALTHY**.
- Última migración aplicada en remoto: `20260824104227_extraordinaria_dolores_cerro_fotografia_fuente_oficial`.
- La migración remota `20260824104227` todavía **no está recuperada en el repositorio**. Sigue siendo una divergencia conocida y debe reconciliarse en un carril independiente antes de iniciar nuevo trabajo de esquema o migraciones.
- PR #339 → **FUSIONADA Y DESPLEGADA** · Panel V2.
- PR #341 → **FUSIONADA Y DESPLEGADA** · SEO temporal de Extraordinarias.
- PR #337 → **ABIERTA / frente activo** · Portada editorial + Hero V2 para las fichas de Imágenes.
- PR #332 → **ABIERTA / piloto visual aislado** · Hero V2 de Hermandad con El Baratillo.
- PR #49 → **APARCADA** · no usar como base ni aplicar sus migraciones.

El estado real de las herramientas prevalece sobre cualquier SHA o deployment registrado aquí si `main`, Vercel o Supabase avanzan después de esta revisión.

## Última validación

### Panel V2 · fotografía contextual y operación móvil optimizada

La PR #339 convierte la experiencia móvil en criterio base del Panel y evita que Multimedia sea un paso obligatorio para las operaciones editoriales habituales.

Flujo multimedia conservado:

```text
TELÉFONO
   ↓
URL FIRMADA
   ↓
SUPABASE STORAGE
   ↓
VERIFICACIÓN
   ↓
MEDIA_ASSET
   ↓
RELACIÓN
   ↓
MISMA SECCIÓN DE EDICIÓN
```

El archivo no atraviesa una Vercel Function. El navegador envía los bytes directamente a `hilo-media`; los Server Actions reciben y validan únicamente metadatos y contexto editorial.

Validación técnica definitiva de #339:

```text
Head final reconciliado                fa54d13bdf639464aac8c624d4654996b2e0123c
Commit integrado en main               8fd1e6fbbb2c61a82dcf4a1366e463d509d75dea
CI #845                                PASS
npm test                               PASS
npm run build                          PASS
Preview exacta                         dpl_AqwDzi1dLy2FcAXBx2PjtMDPQ4r8 · READY
Producción funcional                   dpl_Efi89aViKJ2uiyvFY5LScgSgFJny · READY
Runtime errors                         0
Migraciones de la PR                   0
Archivos funcionales modificados       14
```

Comprobación pública posterior al despliegue:

- `https://hilocofrade.es/panel` responde `200` desde `dpl_Efi89aViKJ2uiyvFY5LScgSgFJny`;
- acceso no autenticado conduce correctamente al login privado;
- Vercel no registra errores de runtime en la ventana posterior al despliegue.

### Operación móvil V2

Queda integrado:

- modo móvil completo desde `860px`;
- formularios a una columna en móvil/tablet estrecha;
- inputs, selects y textareas a `16px` para evitar zoom automático de iOS;
- objetivos táctiles de 44–48px;
- guardado principal a ancho completo;
- breadcrumbs y pestañas con desplazamiento horizontal táctil;
- navegación inferior `Inicio · Buscar · Recientes · Nuevo · Menú`;
- safe areas de iPhone;
- guardado rápido por encima de la navegación inferior;
- subida de fotografía principal en contexto dentro de Titulares, Pasos, Cultos y Patrimonio;
- retorno a la misma sección tras subir la imagen;
- `Multimedia` conservado como biblioteca y gestor avanzado.

### Base física heredada del corte anterior

El smoke físico de la PR #323 sigue siendo la referencia validada para la arquitectura de subida directa:

| Caso | Resultado |
|---|---|
| Pastora de Cantillana | Subida contextual a Culto, relación `cult_media` y auditoría `upload_mode = signed_direct`. |
| El Baratillo | Selección y vinculación contextual verificadas sobre Paso y patrimonio. |
| San Benito | Subida directa de JPG de 7.851.726 bytes, sustitución de portada y redirección final correcta. |

La PR #339 reutiliza esa arquitectura y añade barreras automáticas específicas para la fotografía contextual y el comportamiento móvil.

## Estado de fases

```text
Arquitectura pública                  🟢 CERRADA
Fase de consolidación                 🟢 CERRADA
Media abierta                         🟢 GOBERNADA
Importación masiva base               🟢 DISPONIBLE
Experiencia móvil · corte 1           🟢 CERRADO
Panel móvil · operación real          🟢 PRODUCCIÓN
Panel V2 · móvil + foto contextual    🟢 PRODUCCIÓN
Producción                            🟢 READY
Divergencia migración 20260824104227  🟠 PENDIENTE DE RECONCILIACIÓN LOCAL
```

## Frentes abiertos

### #337 · Portada editorial + Hero V2 de Imágenes

- Continúa como frente funcional abierto.
- Debe reconciliarse de nuevo con el `main` vigente después de #339 y #341 antes de integrarse.
- No debe perder la separación `hero` frente a retrato principal (`is_cover`).
- Requiere CI, build, preview exacta y revisión visual en escritorio y móvil tras la reconciliación.

### #332 · Hero V2 de Hermandad con El Baratillo

- Continúa como piloto visual aislado.
- No debe convertirse en patrón global mediante excepciones por `slug`.
- Su integración definitiva deberá usar media gobernada y un componente genérico.
- También deberá reconciliarse con el `main` vigente antes de cualquier integración.

### #49 · Importador documental asistido

- Continúa aparcada.
- No utilizar como base.
- No aplicar sus migraciones 049 y 050 sin reabrir formalmente el carril y reconciliar primero el historial remoto/local.

## Bloqueos y precauciones

No existen bloqueos conocidos para el Panel V2 ya publicado.

Antes de cualquier trabajo nuevo que toque Supabase, esquema o migraciones:

1. recuperar en el repositorio la migración remota `20260824104227` con su contenido exacto;
2. comprobar nuevamente el historial remoto y local;
3. no reutilizar números o timestamps ya aplicados;
4. evitar que una nueva rama nazca desde un historial incompleto.

La divergencia `20260824104227` no bloquea cambios puramente visuales o de frontend que no añadan migraciones, pero debe quedar visible en toda decisión de integración.

## Siguiente acción

**Reconciliar la PR #337 con el `main` vigente después de #339/#341 y ejecutar su validación completa antes de decidir la integración.**

El carril de reconciliación de la migración `20260824104227` debe resolverse antes del próximo cambio de Supabase o esquema.

## Regla para «¿Qué toca?»

1. Refrescar GitHub, Vercel y Supabase.
2. Comprobar `main`, PR abiertas, previews y migraciones.
3. Detectar solapes antes de modificar archivos.
4. Localizar el primer punto pendiente de la secuencia vigente.
5. Marcar como cerrados los anteriores cuando el estado real lo confirme.
6. Devolver una sola acción ejecutable.

**ESTADO-PROYECTO → 🟢 ACTUALIZADO CON PANEL V2 EN PRODUCCIÓN**
