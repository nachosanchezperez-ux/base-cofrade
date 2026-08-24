# HC-014 · Wikimedia Commons y media abierta con procedencia verificable

**Estado:** CERRADA  
**Fecha de cierre:** 24/08/2026  
**Ámbito:** Front público, Panel, importación masiva y cualquier carga manual o automatizada de recursos externos

> Este documento es la **única fuente canónica** de Hilo Cofrade para la incorporación de media abierta. No debe coexistir con un segundo protocolo vigente sobre Wikimedia, licencias o atribución.

## Decisión

Hilo Cofrade solo puede guardar y publicar una pieza de media externa cuando su reutilización está jurídicamente documentada, su procedencia es verificable y el recurso representa de forma inequívoca a la entidad con la que se relaciona.

Que una fotografía aparezca en Wikimedia Commons, una red social, un buscador o una web pública no demuestra por sí solo que pueda reutilizarse.

La regla canónica es:

```text
IDENTIDAD DEL RECURSO
+ SUJETO VERIFICADO
+ AUTORÍA
+ TITULAR DE DERECHOS
+ LICENCIA EXACTA
+ PROCEDENCIA CANÓNICA
+ CRÉDITO PÚBLICO
+ ROL EDITORIAL
+ REVISIÓN HUMANA
```

Si falta uno de estos elementos, el recurso no se publica como media abierta.

## Derechos y licencias

### Estados admitidos

La media abierta utiliza únicamente:

- `licensed`, cuando existe una licencia abierta compatible y verificable;
- `public_domain`, cuando el dominio público o una dedicación equivalente están expresamente acreditados.

El material propio o cedido mediante autorización sigue su vía correspondiente —por ejemplo `owned` o `authorized`— y no debe etiquetarse artificialmente como licencia abierta.

### Licencias admitidas

- CC BY 1.0, 2.0, 2.5, 3.0 o 4.0.
- CC BY-SA 1.0, 2.0, 2.5, 3.0 o 4.0.
- CC0 1.0.
- Public Domain Mark 1.0 / PDM 1.0.
- Declaración expresa de dominio público, acompañada de una nota editorial que explique su fundamento.

La versión exacta debe conservarse. `Creative Commons` sin modalidad ni versión no es una licencia suficiente.

### Situaciones excluidas

No se incorporan automáticamente:

- licencias NC o «No comercial»;
- licencias ND o «Sin obras derivadas»;
- `All rights reserved`;
- `fair use` o «uso justo»;
- licencia desconocida, genérica o contradictoria;
- capturas de redes sociales, resultados de buscadores o galerías sin ficha individual;
- archivos con autoría discutida, aviso de borrado o revisión de licencia pendiente;
- recursos cuyo único argumento sea que están publicados en internet.

Un caso excluido solo puede entrar por otra base jurídica expresamente documentada y con el estado de derechos correcto.

## Metadatos obligatorios

Toda pieza `licensed` o `public_domain` debe conservar:

| Campo | Contrato |
|---|---|
| `alt_text` | Descripción accesible y específica. |
| `author_name` | Autor, fotógrafo o creador tal como consta en la procedencia. |
| `rights_holder` | Titular de los derechos o responsable de la cesión. |
| `rights_status` | Estado jurídico real del recurso. |
| `license` | Nombre normalizado y versión exacta. |
| `source_name` | Repositorio y título identificable de la pieza. |
| `source_url` | Página original HTTPS donde se verifican autoría, licencia y contexto. |
| `permission_notes` | Base de reutilización, obligaciones y cualquier condición relevante. |

Además, la relación editorial debe conservar:

- entidad o entidades exactas vinculadas;
- rol visual —portada, galería, detalle, cartel, escudo, hábito, paso u otro rol vigente—;
- prioridad y orden cuando proceda;
- encuadre o punto focal si el diseño lo necesita;
- modificaciones relevantes realizadas sobre el original.

La URL técnica que renderiza el archivo y la página canónica de procedencia cumplen funciones distintas. Una URL de CDN o descarga nunca sustituye a `source_url`.

## Wikimedia Commons

Para un archivo de Wikimedia Commons:

1. abrir la ficha individual del archivo;
2. comprobar autor, titular, licencia, versión y avisos activos;
3. confirmar que la licencia está admitida;
4. registrar como `source_url` la página canónica `File:` o `Archivo:`;
5. usar la URL de `upload.wikimedia.org` únicamente como recurso técnico cuando corresponda;
6. identificar la Fuente como `Wikimedia Commons · …`;
7. redactar `alt_text`, crédito y nota de permiso sin inventar información;
8. revisar el resultado en el contexto donde se publicará.

No son procedencia válida una categoría, una búsqueda, una miniatura, una URL directa de imagen o una web que haya reproducido el archivo.

## Verificación del sujeto

Una licencia correcta no demuestra que la fotografía represente la entidad correcta.

Antes de relacionarla debe comprobarse:

- coincidencia exacta de Imagen, Paso, Hermandad, Banda, cartel u objeto;
- ausencia de homónimos o advocaciones confundibles;
- contexto temporal suficiente cuando existan versiones históricas;
- que una imagen genérica de una Hermandad no se utilice como portada de un titular concreto;
- que una escena compartida solo se relacione con varias entidades cuando realmente las represente.

No se permiten asignaciones por parecido visual ni coincidencias parciales de nombre.

## Portada y galería

### Portada

Una portada exige el nivel más alto de certeza:

- sujeto principal inequívoco;
- calidad y resolución suficientes;
- licencia apta;
- crédito y atribución disponibles;
- `alt_text` específico;
- encuadre revisado en escritorio y móvil;
- ausencia de elementos que induzcan a identificar otra entidad.

### Galería

Una pieza válida para galería puede aportar contexto histórico, patrimonial o procesional aunque no funcione como portada. Mantiene las mismas obligaciones de derechos, autoría y procedencia.

La elección de portada o galería pertenece a la **relación editorial**, no se deduce de que sea el primer recurso disponible.

## Reutilización y duplicados

- Reutilizar un `media_asset` existente antes de crear otro para el mismo archivo.
- Comparar la página original normalizada, no solo la URL de descarga o el tamaño servido.
- Mantener una identidad canónica del recurso y varias relaciones editoriales cuando su reutilización sea legítima.
- No copiar el archivo a otro alojamiento para ocultar o perder su procedencia.
- Un cambio de URL técnica no puede romper la atribución canónica.
- Una misma pieza no debe repetirse en varias entidades salvo que la relación sea deliberada y semánticamente correcta.

## Crédito público

El Front muestra, como mínimo, una fórmula equivalente a:

```text
Fotografía · Autor · Licencia
```

Cuando existe `source_url`, el crédito enlaza a la página original. El enlace no sustituye al texto visible ni a la licencia almacenada.

No se consideran créditos finales válidos:

- `Internet`;
- `Redes sociales`;
- `Wikimedia` sin autor ni licencia;
- una URL técnica;
- un nombre de archivo;
- `Autor desconocido` cuando la fuente sí identifica al creador.

La fórmula `Fotografía · Hermandad` solo se usa cuando la procedencia institucional está documentada.

## Flujo editorial

```text
CANDIDATO
→ abrir la procedencia canónica
→ comprobar derechos y licencia
→ verificar autor y titular
→ verificar el sujeto
→ decidir rol editorial
→ comprobar duplicados
→ registrar metadata y Fuente
→ revisar crédito, alt y encuadre
→ revisión humana
→ publicar
→ incluir en Salud del grafo
```

La importación masiva puede preparar propuestas, pero no puede omitir la revisión humana ni publicar media abierta incompleta.

## Protección sistémica

La garantía opera en tres niveles:

1. **Panel:** informa del contrato y bloquea formularios abiertos incompletos o licencias no admitidas.
2. **Supabase:** `open_media_provenance_is_valid(...)`, la restricción `media_assets_open_provenance_check` y RLS impiden guardar o exponer media abierta inválida.
3. **Front:** solo presenta recursos que superan el contrato y conserva crédito, licencia y enlace de atribución.

No se corrige automáticamente una licencia, no se inventa un autor y no se degrada silenciosamente un recurso a otro estado de derechos.

## Salud del grafo

La cola editorial debe poder localizar, al menos:

- media externa sin autor o titular;
- licencia ausente, genérica o excluida;
- ausencia de página original;
- URL directa de Wikimedia usada como procedencia;
- crédito público incompleto;
- portada sin `alt_text`;
- recurso sin rol editorial;
- media relacionada con una entidad no publicable;
- duplicados de la misma página original;
- atribución pública distinta de la metadata;
- piezas pendientes de revisión que hayan quedado publicadas.

Estos controles detectan deuda; no convierten una licencia dudosa en válida.

## Auditoría de cierre

Auditoría canónica del 24 de agosto de 2026:

- `public.media_assets`: **34** registros.
- `public.entity_media`: **34** relaciones.
- recursos Wikimedia detectados: **5**;
- Wikimedia con autoría, titular, licencia, Fuente, URL canónica, permiso y `alt_text` completos: **5/5**;
- media `licensed` o `public_domain` inválida: **0**;
- recursos visibles para `anon`: **34**, incluidos los cinco de Wikimedia.

La migración de gobierno es:

`20260824000215_guard_open_media_provenance`

## Responsabilidades

- **Dirección:** aprueba la política y resuelve excepciones.
- **Contenido / Datos:** identifica el sujeto y su contexto.
- **Media:** verifica calidad, derechos, licencia, crédito y rol.
- **Tech / Supabase:** preserva el contrato en Panel, base y Front.
- **Auditor:** bloquea procedencias ambiguas, relaciones dudosas y cargas sin revisión.

## Regla de no regresión

No se crea otro protocolo paralelo. Cualquier ampliación futura debe modificar este documento y mantener alineados Panel, Supabase, Front y Salud del grafo.

**MEDIA ABIERTA · DOCUMENTACIÓN → 🟢 UNA ÚNICA FUENTE CANÓNICA**
