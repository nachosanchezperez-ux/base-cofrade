# Estado operativo de Hilo Cofrade

> Fuente canónica para Hilo Orquestador. GitHub, Vercel y Supabase prevalecen siempre sobre este documento. Antes de cualquier acción significativa deben refrescarse las herramientas.

## Último estado conocido

- Revisión: **25 de agosto de 2026 · mañana (CEST)**.
- Repositorio: `nachosanchezperez-ux/base-cofrade`.
- Rama principal: `main`.
- `main` funcional publicado: `05c4cf04d5495a236dbdc10298aa2e0fa48bb8c0` — **Panel V2 · edición contextual del escudo de Hermandad (#344)**.
- Producción funcional: `dpl_6imb6ZN1Y5FNSC3NKTPiBS6wPuR6` → **READY**, asociada a `hilocofrade.es` y `www.hilocofrade.es`.
- Supabase: `Hilocofrade` (`kcevwkucqzcyrqaimyhl`) → **ACTIVE_HEALTHY**.
- Última migración aplicada en remoto: `20260824104227_extraordinaria_dolores_cerro_fotografia_fuente_oficial`.
- La migración remota `20260824104227` todavía **no está recuperada en el repositorio**. Sigue siendo una divergencia conocida y debe reconciliarse en un carril independiente antes de iniciar nuevo trabajo de esquema o migraciones.
- PR #344 → **FUSIONADA Y DESPLEGADA** · edición contextual del escudo en el Panel.
- PR #343 → **FUSIONADA Y DESPLEGADA** · enlaces Hermandades/Bandas → Extraordinarias.
- PR #339 → **FUSIONADA Y DESPLEGADA** · Panel V2 móvil + fotografía contextual.
- PR #342 → **ABIERTA / borrador activo** · portada programa de mano y resumen unificado de Hermandades.
- PR #337 → **ABIERTA / frente activo** · Portada editorial + Hero V2 para las fichas de Imágenes.
- PR #332 → **ABIERTA / piloto visual aislado** · Hero V2 de Hermandad con El Baratillo.
- PR #49 → **APARCADA** · no usar como base ni aplicar sus migraciones.

El estado real de las herramientas prevalece sobre cualquier SHA o deployment registrado aquí si `main`, Vercel o Supabase avanzan después de esta revisión.

## Última validación

### Panel V2 · edición contextual del escudo de Hermandad

La PR #344 extiende el principio operativo del Panel V2: **todo recurso que aparece en la ficha debe poder añadirse o editarse desde la propia ficha**, sin obligar al editor a introducir rutas técnicas ni navegar a otro módulo.

Queda disponible en la ficha de edición de cada Hermandad, tanto en móvil como en PC:

- vista previa del escudo actual;
- subir escudo cuando no existe;
- sustituir el escudo publicado;
- retirar el escudo;
- formato recomendado visible: **SVG**;
- formatos raster alternativos: **PNG / WEBP**;
- tamaño recomendado raster: **1600 × 1600 px**;
- mínimo recomendado raster: **1000 × 1000 px**;
- recomendación de **fondo transparente**;
- peso máximo: **10 MB**;
- lectura previa de dimensiones para PNG/WEBP con aviso editorial;
- actualización sin abandonar la pantalla ni perder otros cambios pendientes de la ficha.

Flujo del escudo:

```text
PANEL · HERMANDAD
   ↓
ELEGIR ESCUDO
   ↓
URL FIRMADA
   ↓
NAVEGADOR → SUPABASE STORAGE
   ↓
VERIFICACIÓN DE ARCHIVO
   ↓
VALIDACIÓN SVG SI PROCEDE
   ↓
BROTHERHOODS.CREST_PATH
   ↓
REVALIDACIÓN PANEL + FICHA PÚBLICA
```

Los bytes del archivo no atraviesan una Vercel Function. La Server Action prepara y valida metadatos; el navegador sube directamente a `hilo-media`.

Los SVG se validan antes de publicarse y se bloquean scripts, `foreignObject`, iframes/objetos embebidos, eventos inline, `javascript:`, DOCTYPE/ENTITY y referencias externas o `data:` no permitidas.

Al sustituir o retirar un escudo, Hilo solo elimina automáticamente del Storage un archivo anterior si fue creado por este editor dentro de la carpeta gobernada `hermandades/{id}/escudo/`. Los escudos históricos servidos desde `/public/escudos` no se borran.

Validación técnica definitiva de #344:

```text
Head final reconciliado                f3d65dbb089d92a8cfa2a326667b1d17bba01359
Commit integrado en main               05c4cf04d5495a236dbdc10298aa2e0fa48bb8c0
CI #854                                PASS
npm test                               PASS
npm run build                          PASS
Preview exacta                         dpl_2V1vTMgkrAKipSFke45fFdUTVszW · READY
Producción funcional                   dpl_6imb6ZN1Y5FNSC3NKTPiBS6wPuR6 · READY
Runtime error/fatal                    0
Migraciones de la PR                   0
Cambios de esquema / RLS               0
Archivos funcionales/prueba            5
```

Comprobación posterior al despliegue:

- `https://hilocofrade.es/panel` responde `200` desde `dpl_6imb6ZN1Y5FNSC3NKTPiBS6wPuR6`;
- el acceso no autenticado conduce correctamente al login privado;
- el deployment está asociado a `hilocofrade.es` y `www.hilocofrade.es`;
- no se detectan logs `error`/`fatal` en la ventana posterior al despliegue;
- las políticas existentes de `hilo-media` ya permiten a editores autorizados INSERT/UPDATE/DELETE, por lo que no se ha abierto ninguna política nueva.

### Panel V2 · base móvil y fotografía contextual

La PR #339 continúa siendo la base de operación móvil:

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
- `Multimedia` conservado como biblioteca y gestor avanzado.

### Base física heredada

El smoke físico de la PR #323 sigue siendo la referencia validada para la arquitectura de subida directa:

| Caso | Resultado |
|---|---|
| Pastora de Cantillana | Subida contextual a Culto, relación `cult_media` y auditoría `upload_mode = signed_direct`. |
| El Baratillo | Selección y vinculación contextual verificadas sobre Paso y patrimonio. |
| San Benito | Subida directa de JPG de 7.851.726 bytes, sustitución de portada y redirección final correcta. |

## Estado de fases

```text
Arquitectura pública                  🟢 CERRADA
Fase de consolidación                 🟢 CERRADA
Media abierta                         🟢 GOBERNADA
Importación masiva base               🟢 DISPONIBLE
Experiencia móvil · corte 1           🟢 CERRADO
Panel móvil · operación real          🟢 PRODUCCIÓN
Panel V2 · móvil + foto contextual    🟢 PRODUCCIÓN
Panel V2 · escudo contextual          🟢 PRODUCCIÓN
Producción                            🟢 READY
Divergencia migración 20260824104227  🟠 PENDIENTE DE RECONCILIACIÓN LOCAL
```

## Frentes abiertos

### #342 · Portada programa de mano + resumen unificado de Hermandades

- Continúa como borrador activo.
- Trabaja la cabecera y resumen de la ficha pública de Hermandad.
- No compartió archivos con #344 durante su integración.
- Debe reconciliarse con el `main` vigente después de #343/#344 antes de cualquier integración.
- Requiere CI, build, preview y revisión visual móvil/PC tras esa reconciliación.

### #337 · Portada editorial + Hero V2 de Imágenes

- Continúa como frente funcional abierto.
- Debe reconciliarse con el `main` vigente antes de integrarse.
- No debe perder la separación `hero` frente a retrato principal (`is_cover`).
- Requiere CI, build, preview exacta y revisión visual en escritorio y móvil.

### #332 · Hero V2 de Hermandad con El Baratillo

- Continúa como piloto visual aislado.
- No debe convertirse en patrón global mediante excepciones por `slug`.
- Su integración definitiva deberá usar media gobernada y un componente genérico.

### #49 · Importador documental asistido

- Continúa aparcada.
- No utilizar como base.
- No aplicar sus migraciones 049 y 050 sin reabrir formalmente el carril y reconciliar primero el historial remoto/local.

## Bloqueos y precauciones

No existen bloqueos conocidos para los cambios puramente frontend/Panel que no requieran esquema.

Antes de cualquier trabajo nuevo que toque Supabase, esquema o migraciones:

1. recuperar en el repositorio la migración remota `20260824104227` con su contenido exacto;
2. comprobar nuevamente el historial remoto y local;
3. no reutilizar números o timestamps ya aplicados;
4. evitar que una nueva rama nazca desde un historial incompleto.

La divergencia `20260824104227` no bloquea cambios puramente visuales o de frontend que no añadan migraciones, pero debe quedar visible en toda decisión de integración.

## Siguiente acción

**Continuar la revisión del Panel V2 bajo el principio de edición contextual y, en paralelo, reconciliar #342/#337 con el `main` vigente antes de decidir sus integraciones.**

El carril de reconciliación de la migración `20260824104227` debe resolverse antes del próximo cambio de Supabase o esquema.

## Regla para «¿Qué toca?»

1. Refrescar GitHub, Vercel y Supabase.
2. Comprobar `main`, PR abiertas, previews y migraciones.
3. Detectar solapes antes de modificar archivos.
4. Localizar el primer punto pendiente de la secuencia vigente.
5. Marcar como cerrados los anteriores cuando el estado real lo confirme.
6. Devolver una sola acción ejecutable.

**ESTADO-PROYECTO → 🟢 ACTUALIZADO CON EL EDITOR CONTEXTUAL DE ESCUDO EN PRODUCCIÓN**
