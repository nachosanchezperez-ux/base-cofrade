# HC-018 · Aportaciones públicas seguras

**Estado:** IMPLEMENTADO EN CÓDIGO · ACTIVACIÓN BLOQUEADA
**Ámbito:** Front público, Panel, Supabase, Storage, seguridad, privacidad y flujo editorial  
**Ruta prevista:** `/colabora`  
**Módulo previsto:** `/panel/aportaciones`

## 1. Decisión

Hilo Cofrade abrirá un único canal público para que cualquier visitante pueda:

- corregir una ficha existente;
- proponer información para una ficha nueva;
- aportar fotografías;
- aportar documentos mediante una URL verificable;
- enviar una sugerencia general sobre la web.

Ninguna aportación modificará directamente el grafo, creará entidades, publicará media ni
alterará una ficha. Todo envío quedará aislado en una cola editorial hasta su revisión humana.

La regla canónica es:

```text
VISITANTE
→ validación y control antiabuso
→ cola privada
→ revisión editorial
→ contraste y documentación
→ aplicación manual al grafo
→ auditoría
```

## 2. Condición de apertura

La implementación se ha iniciado por decisión expresa de Dirección después del cierre de la
primera edición. La ruta puede mostrarse como vista previa, pero la Server Action permanece
bloqueada hasta superar todas las puertas de este documento.

Antes de comenzar la implementación funcional deben estar resueltos:

1. la aprobación visual pendiente de `#394`;
2. el carril de migraciones ocupado por `#432` y su reproducibilidad en ramas Supabase;
3. el cierre de cualquier privilegio anónimo heredado sobre la tabla de aportaciones;
4. la actualización y publicación de la Política de privacidad;
5. la elección y verificación de una protección anti-bot sin coste adicional.

## 3. Alcance funcional

### 3.1 Tipos canónicos

| Código | Presentación | Uso |
|---|---|---|
| `correction` | Corregir una ficha | Señalar un dato incorrecto y aportar la corrección y su Fuente. |
| `new_record` | Proponer nueva información | Preparar una futura ficha o bloque documental. |
| `media` | Aportar una fotografía o documento | Entregar fotografía propia/autorizada o enlazar un documento verificable. |
| `suggestion` | Sugerencia general | Comunicar una mejora o incidencia no ligada a una ficha concreta. |

### 3.2 Campos comunes

- tipo de aportación;
- título breve;
- descripción en texto plano;
- entidad relacionada, cuando exista;
- URL pública exacta de la página relacionada, cuando proceda;
- una o varias Fuentes HTTP/HTTPS;
- nombre o entidad remitente, opcional;
- correo de contacto, opcional y no reutilizable para comunicaciones comerciales;
- aceptación de la Política de privacidad;
- declaración específica de derechos cuando exista una fotografía.

No se solicitan teléfono, dirección, documento de identidad, fecha de nacimiento ni datos de
suscripción. Hilo Cofrade no crea cuentas públicas para este canal.

### 3.3 Campos condicionales

#### Corrección

- ficha afectada;
- apartado o dato actual;
- corrección propuesta;
- Fuente que acredita la corrección.

#### Nueva información

- tipo de entidad o contenido;
- nombre oficial;
- localidad;
- información disponible;
- Fuentes y enlaces oficiales.

#### Media

- entidad o acontecimiento representado;
- autoría;
- titular de derechos;
- fecha aproximada;
- pie de foto;
- estado de derechos;
- permiso expreso de publicación;
- crédito solicitado.

#### Sugerencia

- área de la web;
- URL relacionada;
- explicación y resultado esperado.

## 4. Modelo de datos

Se evoluciona la tabla canónica `public.contributions`; no se crea una tabla duplicada con la
misma responsabilidad.

### 4.1 Aportaciones

La tabla debe cubrir, como mínimo:

- identidad UUID;
- tipo canónico;
- estado editorial;
- entidad relacionada nullable;
- URL pública relacionada nullable;
- título y descripción normalizados;
- Fuentes como estructura validada;
- datos de contacto mínimos;
- versión y fecha del consentimiento;
- huella antiabuso no reversible;
- fechas de creación, revisión, resolución y caducidad;
- editor responsable nullable;
- motivo de rechazo o petición de aclaración nullable;
- resumen de aplicación al grafo nullable.

Estados previstos:

```text
pending → in_review → needs_info → accepted → applied
                    ↘ rejected
pending/in_review   → expired
```

`accepted` significa que la aportación es válida; `applied` acredita que un editor incorporó
manualmente la información correspondiente. Aceptar nunca ejecuta cambios automáticos en las
tablas canónicas.

### 4.2 Adjuntos

Los archivos se registran en una tabla relacional separada. Cada registro conserva:

- aportación de origen;
- ruta aleatoria en cuarentena;
- nombre original solo como metadato;
- tipo MIME declarado y tipo real verificado;
- tamaño;
- hash criptográfico del contenido;
- estado de comprobación;
- autoría, derechos, Fuente y crédito;
- fecha de eliminación o promoción editorial.

Un archivo aceptado no se convierte automáticamente en `media_assets`. La promoción al archivo
multimedia exige la revisión y el contrato de `docs/MEDIA-ABIERTA.md`.

## 5. Frontera de seguridad

### 5.1 Acceso a datos

- `anon` no tiene `SELECT`, `INSERT`, `UPDATE` ni `DELETE` sobre la cola pública.
- `authenticated` no tiene `INSERT` ni `DELETE`; solo los miembros activos del Panel pueden
  consultar y solo editor/admin pueden actualizar mediante RLS.
- RLS permanece activa como segunda barrera.
- El navegador nunca recibe una clave secreta ni una URL permanente de cuarentena.
- La escritura se realiza únicamente desde una Server Action de Next.js validada en servidor.
- La clave privilegiada vive solo en variables de entorno del servidor y nunca usa prefijo
  `NEXT_PUBLIC_`.
- El Panel consulta y modifica la cola con el usuario autenticado y los roles editoriales
  existentes.
- Los colaboradores del Panel pueden consultar si Dirección lo decide; solo editor y admin
  pueden resolver; solo admin puede borrar definitivamente.

### 5.2 Control antiabuso

Cada envío debe superar todas estas capas:

1. verificación anti-bot siempre activa;
2. campo trampa invisible;
3. tiempo mínimo razonable de cumplimentación;
4. comprobación de origen de la petición;
5. límite por huella HMAC de IP y ventana temporal;
6. límite global de emergencia;
7. detección de duplicados recientes por hash de contenido;
8. tamaños máximos por campo y por petición;
9. validación estricta en servidor;
10. respuesta genérica que no revele reglas internas.

La IP en claro no se almacena. Se usa una huella HMAC con secreto rotatorio y caducidad. Los
registros antiabuso no forman parte del contenido editorial y se purgan automáticamente.

Límites iniciales de salida:

- máximo 5 intentos por 15 minutos por huella;
- máximo 20 intentos por 24 horas por huella;
- máximo 2 archivos por aportación;
- máximo 10 MB acumulados por aportación;
- título: 140 caracteres;
- descripción: 6.000 caracteres;
- cada URL: 2.048 caracteres;
- máximo 8 Fuentes.

Los límites se conservan como configuración centralizada y cubierta por pruebas.

### 5.3 Validación de texto y enlaces

- normalización Unicode y recorte de espacios;
- contenido guardado y renderizado siempre como texto plano;
- prohibición de HTML, scripts y URLs con protocolos distintos de HTTP/HTTPS;
- correo validado y normalizado sin utilizarlo como identificador;
- UUID y tipos comprobados contra listas cerradas;
- la entidad relacionada debe existir, pero nunca se revela información draft al visitante;
- enlaces del Panel con `noopener`, `noreferrer` y sin previsualización automática.

## 6. Archivos y cuarentena

### 6.1 Primera salida pública

La primera salida admite únicamente:

- JPEG;
- PNG;
- WebP.

Cada archivo tendrá un máximo de 5 MB. SVG, GIF, AVIF, HTML, ZIP, ejecutables, Office y PDF no
se aceptan como archivo en esta primera fase.

Los documentos se aportan mediante una URL pública verificable. El PDF directo queda bloqueado
hasta disponer de análisis antimalware real y probado, sin introducir un coste no autorizado.

### 6.2 Flujo de fotografía

1. La Server Action valida formulario, anti-bot y límites.
2. La petición admite como máximo 10 MB de fotografías dentro del límite propio de Server Actions.
3. El servidor comprueba tamaño, MIME y firma real antes de tocar Storage.
4. Sharp decodifica y recodifica la imagen, limita píxeles y elimina EXIF y metadatos no necesarios.
5. Se calcula el hash y se bloquean duplicados o archivos incompatibles.
6. Se crea una aportación `pending` y rutas UUID en un bucket privado de cuarentena.
7. El servidor sube los bytes saneados con una clave secreta que nunca llega al navegador.
8. Si cualquier operación falla, se eliminan tanto la fila incompleta como los objetos subidos.

El bucket de cuarentena:

- es privado;
- no permite listados ni descargas a `anon` ni a usuarios autenticados ajenos al Panel;
- limita tipos MIME y tamaño en el propio bucket;
- no permite `upsert`;
- usa rutas aleatorias no derivadas del nombre del archivo;
- conserva una fecha de caducidad para aplicar la política de mantenimiento aprobada.

## 7. Panel editorial

El módulo `/panel/aportaciones` ofrece:

- contador de pendientes;
- filtros por tipo y estado;
- búsqueda por título;
- detalle de texto escapado;
- Fuentes enlazadas de forma segura;
- información de autoría y derechos;
- auditoría de cada cambio de estado;
- autoasignación a editor;
- aceptación, rechazo, caducidad y marcado como aplicado;
- registro de cada acción en `audit_log`.

El Panel no interpreta HTML, no carga recursos remotos automáticamente y no presenta archivos de
cuarentena como si fueran media publicada.

## 8. Experiencia pública

La página `/colabora` comienza con cuatro decisiones claras y muestra solo los campos necesarios
para la opción elegida. La confirmación final explica:

- que el envío fue recibido;
- que no se publicará automáticamente;
- que puede ser descartado si no resulta verificable;
- que el correo, cuando exista, solo se usa para esa aportación.

Las fichas podrán incorporar después el enlace contextual:

> ¿Has detectado un error o puedes completar esta información?

Ese acceso preselecciona `correction` y la entidad pública, sin aceptar identificadores arbitrarios
ni exponer contenido interno.

La entrada del footer puede mostrar la vista previa con un aviso inequívoco. Mientras esté cerrado,
`/colabora` mantiene `noindex, follow`; sus campos son utilizables para revisión visual, pero el
botón de envío permanece deshabilitado y el servidor rechaza cualquier petición forzada.

## 9. Privacidad y conservación

Antes de abrir el formulario se publica una versión nueva de la Política de privacidad que indique:

- responsable y correo único de contacto;
- finalidades del tratamiento;
- base jurídica;
- datos recogidos;
- destinatarios y encargados técnicos;
- plazos de conservación;
- derechos y forma de ejercerlos;
- tratamiento de fotografías y autorizaciones;
- ausencia de newsletter y comunicaciones comerciales.

Política inicial de retención técnica:

- cargas incompletas: 24 horas;
- spam y archivos rechazados: 30 días;
- aportaciones rechazadas: 90 días;
- huellas antiabuso: 48 horas en la implementación inicial;
- contacto de aportaciones resueltas: supresión o anonimización al cumplir el plazo legal/editorial;
- evidencia aceptada: se conserva solo lo necesario para documentar la información y sus derechos.

Los plazos definitivos requieren revisión legal antes del lanzamiento.

## 10. Coste y dependencias

- No se contrata ningún servicio de pago para abrir el formulario.
- Se reutilizan el plan Supabase Pro y el despliegue Vercel existentes.
- La protección anti-bot elegida es Cloudflare Turnstile Free; sus condiciones deben verificarse
  de nuevo antes de cada lanzamiento relevante.
- No se envían correos automáticos en la primera salida.
- No se usa IA para moderación, clasificación ni decisión editorial.
- Si un control imprescindible introduce coste, la funcionalidad afectada permanece cerrada hasta
  autorización expresa de Dirección.

## 11. Pruebas obligatorias

### Seguridad

- inserción directa como `anon`: denegada;
- lectura directa como `anon`: denegada;
- actualización y borrado como `anon`: denegados;
- CAPTCHA ausente, inválido o reutilizado: denegado;
- honeypot cumplimentado: descartado;
- rate limit concurrente: efectivo;
- origen no permitido: denegado;
- HTML/XSS almacenado: neutralizado como texto;
- URL no HTTP/HTTPS: denegada;
- manipulación de UUID o estado: denegada;
- clave secreta ausente del bundle y del navegador;
- archivos con extensión falsa: denegados;
- archivo sobredimensionado: denegado en aplicación y bucket;
- acceso público a cuarentena: denegado;
- archivo que no puede decodificarse y recodificarse: denegado.

### Funcional

- los cuatro flujos completan un envío válido;
- campos condicionales y errores son accesibles;
- funciona en 390, 768, 1024 y 1440 px;
- el Panel filtra y resuelve sin alterar el grafo;
- aceptar no publica ni crea entidades;
- el audit log registra cada transición;
- la caducidad elimina archivos sin borrar evidencia necesaria;
- metadata, canonical, sitemap y robots son coherentes con el estado abierto/cerrado.

### Regresión

- pruebas Node existentes en verde;
- build y TypeScript correctos;
- `git diff --check` correcto;
- asesores Supabase sin hallazgos nuevos;
- RLS y grants verificados mediante consultas reales;
- preview Vercel y smoke público/panel correctos.

## 12. Orden de ejecución y activación

1. Parche aislado de permisos heredados y prueba negativa anónima.
2. Migración del modelo, índices, constraints, RLS, grants y bucket privado.
3. Server Action, validación, anti-bot, rate limiting y pruebas de dominio.
4. Flujo de fotografías en cuarentena.
5. Página pública responsive y accesible.
6. Bandeja del Panel y auditoría.
7. Política de privacidad revisada y publicada.
8. QA de seguridad, funcional, responsive y producción.
9. Apertura de `/colabora`, enlace en footer y accesos contextuales.

No se fusionan estas fases si el control de seguridad correspondiente no ha sido demostrado.

## 13. Definición de hecho

La funcionalidad solo está terminada cuando:

- el canal público está protegido contra acceso directo y abuso;
- ninguna aportación puede alterar el grafo automáticamente;
- los archivos permanecen privados hasta revisión;
- los derechos y la privacidad están documentados;
- el Panel puede revisar, resolver y auditar;
- los cuatro flujos tienen cobertura funcional;
- las pruebas negativas de seguridad están en verde;
- no existe coste nuevo no autorizado;
- Git, Supabase, Vercel y el estado canónico están reconciliados.

**APORTACIONES PÚBLICAS → INTERFAZ LISTA · ENVÍOS CERRADOS HASTA SUPERAR TODAS LAS PUERTAS**
