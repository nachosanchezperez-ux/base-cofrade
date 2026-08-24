# Protocolo editorial de media abierta y Wikimedia Commons

> Norma operativa de Hilo Cofrade para incorporar fotografías y otros recursos externos con licencia abierta. El soporte técnico de licencia, atribución y render directo no sustituye esta revisión editorial.

- Estado: **vigente**.
- Revisión inicial: **24 de agosto de 2026**.
- Alcance: Front público, Panel, importación masiva y cualquier carga manual o automatizada de media externa.
- Principio rector: **que un archivo esté alojado en Wikimedia Commons no significa automáticamente que Hilo Cofrade pueda publicarlo**. Manda la licencia concreta del archivo y la trazabilidad completa de su procedencia.

## 1 · Objetivo

Garantizar que cada recurso externo publicado en Hilo Cofrade pueda responder, sin ambigüedad, a estas preguntas:

1. ¿Qué archivo es exactamente?
2. ¿Quién creó la fotografía o el recurso?
3. ¿Con qué licencia concreta se publica?
4. ¿Dónde está la página original que acredita esos datos?
5. ¿Qué crédito debe mostrarse públicamente?
6. ¿Para qué entidad y para qué función visual se utiliza?
7. ¿Se ha verificado que el sujeto representado corresponde realmente con la entidad enlazada?

Una respuesta incompleta impide la publicación automática.

## 2 · Fuentes admitidas

### Wikimedia Commons

Puede utilizarse cuando la página individual del archivo permite verificar autoría, licencia y procedencia. Debe conservarse la URL de la página `File:` de Commons, no solo la URL directa de `upload.wikimedia.org`.

### Otros repositorios abiertos

Solo son admisibles cuando ofrecen una ficha individual estable con:

- autor o creador;
- licencia exacta;
- enlace al texto de la licencia;
- URL original del recurso;
- condiciones de atribución y reutilización.

Una galería, buscador, red social, nota de prensa o página que muestre una imagen sin explicar sus derechos no constituye por sí sola una licencia de uso.

### Material autorizado o propio

Las fotografías propias, cedidas por una Hermandad, institución, autor o medio deben conservar la evidencia del permiso, el crédito acordado y cualquier restricción de uso. La fórmula «Fotografía · Hermandad» solo se empleará cuando la procedencia institucional esté documentada.

## 3 · Licencias

### Admisión ordinaria

Pueden aprobarse, tras verificar la versión exacta y sus condiciones:

- dominio público o dedicación equivalente debidamente acreditada;
- CC0;
- Creative Commons Reconocimiento —CC BY—;
- Creative Commons Reconocimiento-CompartirIgual —CC BY-SA—.

La versión concreta de la licencia debe almacenarse y mostrarse; no basta con guardar «Creative Commons».

### Revisión manual obligatoria

Requieren decisión editorial específica antes de publicar:

- archivos con licencia múltiple;
- GNU FDL u otras licencias menos habituales;
- recursos con condiciones especiales en la ficha;
- reproducciones de obras cuya fotografía y objeto representado puedan tener capas de derechos distintas;
- archivos modificados, restaurados, coloreados, recortados de forma sustancial o derivados de otros recursos;
- cualquier caso en el que la información de la página original resulte contradictoria o insuficiente.

### No admisibles para carga automática

- licencia desconocida o ausente;
- «todos los derechos reservados» sin permiso expreso;
- restricciones NC o ND fuera de una autorización específica y documentada;
- uso legítimo, *fair use* o equivalentes;
- capturas de pantalla, redes sociales o resultados de buscadores sin permiso;
- archivos cuya autoría o procedencia no pueda comprobarse;
- enlaces directos sin página original de atribución;
- recursos que hayan cambiado de licencia sin poder acreditar la versión revisada.

Ante la duda, el estado correcto es **pendiente de revisión**, no publicado.

## 4 · Datos obligatorios por recurso

Antes de publicar media externa deben estar documentados, como mínimo:

- título o descripción inequívoca del recurso;
- autor, creador o titular del crédito tal como aparece en la fuente;
- código y nombre completo de la licencia;
- URL oficial de la licencia;
- URL de la página original del archivo;
- URL técnica del recurso que se renderiza, cuando sea distinta;
- plataforma o repositorio de procedencia;
- línea de crédito pública;
- fecha de revisión editorial;
- entidad o entidades exactas a las que se vincula;
- función visual: portada, galería, detalle, cartel, escudo, hábito, paso u otra categoría vigente;
- texto alternativo descriptivo;
- constancia de modificaciones o recortes relevantes;
- notas de derechos o permiso cuando proceda.

Los nombres concretos de columnas pueden evolucionar, pero estos conceptos no pueden perderse. Si el esquema no dispone todavía de un campo dedicado, la información debe conservarse de forma estructurada en la metadata o en las notas editoriales hasta que Dirección apruebe una migración específica.

## 5 · Verificación del sujeto

La licencia correcta no demuestra que la fotografía represente la entidad correcta.

Antes de enlazarla debe confirmarse:

- coincidencia exacta del titular, paso, Hermandad, banda, cartel u objeto;
- ausencia de homónimos o advocaciones confundibles;
- fecha o contexto suficiente cuando la identificación dependa de una versión histórica;
- que una fotografía genérica de una Hermandad no se utilice como fotografía de una Imagen o Paso concreto;
- que un mismo recurso no se replique en entidades distintas salvo que la propia escena represente realmente a todas ellas y la relación sea deliberada.

No se permiten asignaciones por parecido visual ni coincidencias parciales de nombre.

## 6 · Portada y galería

### Portada

Una portada exige el nivel más alto de certeza:

- sujeto principal inequívoco;
- resolución y encuadre suficientes;
- licencia apta para el uso previsto;
- crédito visible y enlace de atribución;
- punto focal y recorte revisados en escritorio y móvil;
- ausencia de elementos que induzcan a identificar erróneamente la entidad.

### Galería

Una imagen válida para galería puede aportar contexto histórico, patrimonial o procesional aunque no funcione como portada. Debe conservar las mismas garantías de licencia, autoría y enlace original.

La decisión portada/galería pertenece a la relación editorial del recurso con la entidad y no debe deducirse únicamente de que sea la primera fotografía disponible.

## 7 · Crédito público

La presentación pública mínima será equivalente a:

`Fotografía · Autor · Licencia`

El crédito debe enlazar a la página original del archivo cuando la fuente sea externa. La licencia debe ser reconocible y, cuando el diseño lo permita, enlazar también a su texto oficial.

No deben mostrarse como crédito final:

- nombres técnicos de archivo;
- URLs directas de CDN;
- «Wikimedia» sin autor ni licencia;
- «Internet»;
- «Redes sociales»;
- «Autor desconocido» cuando la página original sí identifica al creador.

## 8 · Flujo editorial

```text
CANDIDATO
→ abrir la página original
→ comprobar autoría
→ comprobar licencia exacta y versión
→ comprobar enlace oficial de licencia
→ verificar el sujeto
→ decidir portada o galería
→ registrar metadata y Fuente
→ enlazar a la entidad correcta
→ revisar crédito, alt y recorte en preview
→ publicar
→ incluir en Salud del grafo
```

La importación masiva puede preparar propuestas, pero debe bloquear la publicación cuando falte cualquiera de los datos obligatorios. La revisión humana no puede omitirse por el hecho de que el proveedor sea Wikimedia Commons.

## 9 · Duplicados y reutilización

- Reutilizar un `media_asset` existente antes de crear otro registro para el mismo archivo.
- Normalizar y comparar la página original, no solo la URL de descarga, porque una misma imagen puede servirse con tamaños distintos.
- Conservar una sola identidad canónica del recurso y varias relaciones editoriales cuando su reutilización sea legítima.
- No copiar el archivo a otro alojamiento para ocultar o perder la procedencia.
- Un cambio de URL técnica no debe romper la URL original de atribución.

## 10 · Controles de Salud del grafo

La cola editorial debe poder detectar al menos:

- media externa sin autor o creador;
- licencia ausente, genérica o no admitida;
- licencia sin URL oficial;
- ausencia de página original;
- crédito público incompleto;
- enlace directo de Wikimedia sin página `File:`;
- recurso sin función editorial definida;
- portada sin texto alternativo;
- media enlazada a una entidad no publicable;
- duplicados del mismo archivo original;
- recursos externos pendientes de revisión que hayan quedado publicados;
- atribución pública distinta de la metadata almacenada.

Estos controles no convierten una licencia dudosa en válida: solo ayudan a localizar la deuda.

## 11 · Ejemplo validado

La ficha pública de **Nuestro Padre Jesús del Gran Poder** constituye el patrón de render esperado:

- recurso servido directamente desde Wikimedia;
- autor identificado como `Tiberioclaudio99`;
- licencia `CC BY-SA 4.0` visible;
- crédito enlazado a la página original de Commons;
- texto alternativo descriptivo;
- relación inequívoca con la Imagen publicada.

El ejemplo valida la presentación, no autoriza a replicar automáticamente cualquier otro archivo de Commons.

## 12 · Responsabilidades

- **Dirección** define la política y resuelve excepciones.
- **Contenido** identifica el recurso, el sujeto y su contexto.
- **Media** verifica autoría, licencia, enlace, crédito, calidad y rol visual.
- **Tech / Datos** garantizan que los campos se conservan y que Front y Panel no pierden atribución.
- **Auditor** bloquea fotografías sin licencia verificable, asignaciones dudosas y cargas que omitan la revisión humana.

## 13 · Regla de cierre

No se considera incorporado un recurso externo hasta que se cumpla simultáneamente:

```text
IDENTIDAD DEL ARCHIVO
+ AUTORÍA
+ LICENCIA EXACTA
+ URL ORIGINAL
+ CRÉDITO PÚBLICO
+ SUJETO VERIFICADO
+ ROL EDITORIAL
+ REVISIÓN HUMANA
```

**WIKIMEDIA / MEDIA ABIERTA · PROTOCOLO EDITORIAL → 🟢 DEFINIDO**
