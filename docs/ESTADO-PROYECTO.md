# Estado operativo de Hilo Cofrade

> Fuente canónica para Hilo Orquestador. GitHub, Vercel y Supabase prevalecen siempre sobre este documento. Antes de cualquier acción significativa deben refrescarse las herramientas.

## Último estado conocido

- Revisión: **24 de agosto de 2026 · noche (CEST)**.
- Repositorio: `nachosanchezperez-ux/base-cofrade`.
- Rama principal: `main`.
- `main` actual: `fb27fa7527fd2b1f89d65ce89b11b2949b5bbae2` — **Panel móvil · operación real (#323)**.
- Producción: `dpl_Ga9jTkpNWNaKXeU7ombt8PFEyE5c` → **READY**, asociada a `hilocofrade.es` y `www.hilocofrade.es`.
- Supabase: `Hilocofrade` (`kcevwkucqzcyrqaimyhl`) → **ACTIVE_HEALTHY**.
- Última migración aplicada en remoto: `20260824104227_extraordinaria_dolores_cerro_fotografia_fuente_oficial`.
- La migración remota `20260824104227` todavía **no está recuperada en `main`**. Es una divergencia conocida y debe reconciliarse en un carril independiente antes de iniciar nuevo trabajo de esquema o migraciones.
- PR #323 → **FUSIONADA Y DESPLEGADA**.
- PR #337 → **ABIERTA / frente activo** · Portada editorial + Hero V2 para las fichas de Imágenes.
- PR #332 → **ABIERTA / piloto visual aislado** · Hero V2 de Hermandad con El Baratillo.
- PR #49 → **APARCADA** · no usar como base ni aplicar sus migraciones.

El estado real de las herramientas prevalece sobre cualquier SHA o deployment registrado aquí si `main`, Vercel o Supabase avanzan después de esta revisión.

## Última validación

### Panel móvil · operación real

El primer corte funcional de Experiencia móvil quedó integrado mediante la PR #323.

Arquitectura validada:

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
REDIRECCIÓN
```

El archivo no atraviesa una Vercel Function. El navegador envía los bytes directamente a `hilo-media`; los Server Actions reciben y validan únicamente metadatos y contexto editorial.

Validación técnica definitiva:

```text
Head validado                         e795802f190eda95659910dd308bb1615cc74ad7
Commit integrado en main              fb27fa7527fd2b1f89d65ce89b11b2949b5bbae2
CI #823                               PASS
npm test                              PASS
npm run build                         PASS
Preview exacta                        dpl_Gm9GGsfMtqdBFdn5NovvauFvk4SV · READY
Producción                            dpl_Ga9jTkpNWNaKXeU7ombt8PFEyE5c · READY
Runtime error/fatal                   0
Migraciones de la PR                  0
Archivos modificados                  9
```

### Smoke físico

El smoke se realizó desde iPhone y sesión editorial real:

| Caso | Resultado |
|---|---|
| Pastora de Cantillana | Subida contextual a Culto, relación `cult_media` y auditoría `upload_mode = signed_direct`. |
| El Baratillo | Selección y vinculación contextual verificadas sobre Paso y patrimonio. |
| San Benito | Subida directa de JPG de 7.851.726 bytes, sustitución de portada, navegación final y repetición tras corregir `NEXT_REDIRECT`. |

Confirmación final del editor:

```text
SAN BENITO REDIRECCIÓN OK
```

Quedó demostrado:

- archivo superior a 4,5 MB sin `413`;
- subida mediante URL firmada;
- estados `Preparando…`, `Subiendo…` y `Vinculando…`;
- conservación del archivo y campos ante errores esperados;
- creación de `media_assets` y `entity_media` / `cult_media`;
- redirección correcta después del guardado;
- ausencia de interfaz móvil paralela;
- ausencia de excepciones por Hermandad.

### Limpieza posterior al smoke

San Benito quedó restaurado al estado editorial correcto:

```text
objetos temporales en Storage         0
media_assets temporales               0
relaciones temporales                 0
portadas activas del Paso             1
fotografía real restaurada             Juan Valladares
entradas de auditoría conservadas      3
```

También se retiraron la política de borrado efímera, la extensión HTTP temporal y el secreto temporal de Vault utilizados exclusivamente para la limpieza. No permanece ningún permiso ni recurso auxiliar del smoke.

Las fotografías reales incorporadas en Pastora y El Baratillo se conservan como contenido editorial documentado.

## Estado de fases

```text
Arquitectura pública                  🟢 CERRADA
Fase de consolidación                 🟢 CERRADA
Media abierta                         🟢 GOBERNADA
Importación masiva base               🟢 DISPONIBLE
Experiencia móvil · corte 1           🟢 CERRADO
Panel móvil · operación real          🟢 PRODUCCIÓN
Producción                            🟢 READY
Divergencia migración 20260824104227  🟠 PENDIENTE DE RECONCILIACIÓN LOCAL
```

## Frentes abiertos

### #337 · Portada editorial + Hero V2 de Imágenes

- Es el frente funcional activo.
- Parte de `main` anterior a la integración de #323.
- No comparte los nueve archivos del Panel móvil.
- Debe reconciliarse con `main` `fb27fa75` antes de integrarse.
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

No existen bloqueos para el Panel móvil ya integrado.

Antes de cualquier trabajo nuevo que toque Supabase, esquema o migraciones:

1. recuperar en el repositorio la migración remota `20260824104227` con su contenido exacto;
2. comprobar nuevamente el historial remoto y local;
3. no reutilizar números o timestamps ya aplicados;
4. evitar que una nueva rama nazca desde un historial incompleto.

La divergencia `20260824104227` no bloquea cambios puramente visuales o de frontend que no añadan migraciones, pero debe quedar visible en toda decisión de integración.

## Siguiente acción

**Reconciliar la PR #337 con `main` `fb27fa75` y ejecutar su validación completa antes de decidir la integración.**

El carril de reconciliación de la migración `20260824104227` debe resolverse antes del próximo cambio de Supabase o esquema.

## Regla para «¿Qué toca?»

1. Refrescar GitHub, Vercel y Supabase.
2. Comprobar `main`, PR abiertas, previews y migraciones.
3. Detectar solapes antes de modificar archivos.
4. Localizar el primer punto pendiente de la secuencia vigente.
5. Marcar como cerrados los anteriores cuando el estado real lo confirme.
6. Devolver una sola acción ejecutable.

**ESTADO-PROYECTO → 🟢 ACTUALIZADO CON EL CIERRE DEL PANEL MÓVIL**
