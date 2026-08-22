# Auditoría previa · Caché pública de Hilo Cofrade

Fecha: 2026-08-22
Estado: **INVENTARIO / NO IMPLEMENTAR TODAVÍA**

## Objetivo

Preparar una futura capa de caché pública sin introducir datos obsoletos después de una edición desde el Panel.

Regla de seguridad:

> Ningún loader público puede entrar en caché persistente hasta conocer todas sus dependencias de datos y todas las mutaciones capaces de modificarlas.

La unidad de análisis es:

`loader público → tablas/vistas/relaciones → superficies públicas → mutaciones → invalidación`.

## Hallazgo principal

El antiguo PR #56 no puede reutilizar su mapa de invalidación. El `main` actual contiene loaders y superficies que no existían o no estaban cubiertos entonces, entre ellos `home-v2`, patrimonio musical relacional, media de entidades, búsqueda viva/Tira del hilo 2.1 y nuevas relaciones públicas.

Activar la caché del PR antiguo podría dejar contenido público desactualizado aunque la escritura en Supabase fuese correcta.

## Familias públicas detectadas

### 1. Hermandades

Loaders principales:
- `lib/supabase/brotherhood-directory.js`
- `lib/supabase/brotherhoods.js`
- `components/BrotherhoodRelationalExtras.js`
- `lib/supabase/brotherhood-musical-heritage.js`
- `lib/supabase/entity-media.js`

Superficies:
- `/hermandades`
- directorios temáticos de Semana Santa, Gloria y Sacramentales
- `/hermandades/[slug]`
- Home y buscador cuando consumen relaciones de Hermandad

Mutaciones conocidas que deben invalidar esta familia o una subfamilia:
- edición/creación de Hermandad;
- geografía y sede;
- titulares;
- pasos de Hermandad;
- acompañamientos y vínculos institucionales con Bandas;
- patrimonio musical y dedicatorias;
- fuentes asociadas;
- media/portada cuando se publique para Hermandades;
- cambios de estado `draft/published` y slug.

### 2. Imágenes

Loaders principales:
- `lib/supabase/directories.js`
- `lib/supabase/public-entity-pages.js`
- `lib/supabase/entity-media.js`
- relaciones consumidas desde Hermandades y Pasos

Superficies:
- `/imagenes`
- `/imagenes/[slug]`
- fichas de Hermandad y Paso relacionadas
- Home/buscador cuando corresponda

Mutaciones:
- edición/creación de Imagen;
- autorías;
- intervenciones/restauraciones;
- titularidad;
- relación Imagen ↔ Paso;
- fuentes;
- portada/media;
- estado y slug.

### 3. Pasos

Loaders principales:
- `lib/supabase/directories.js`
- `lib/supabase/public-entity-pages.js`
- `lib/supabase/entity-media.js`
- patrimonio/fases y personal actual consumidos por fichas relacionadas

Superficies:
- `/pasos`
- `/pasos/[slug]`
- `/hermandades/[slug]`
- fichas de Imágenes relacionadas

Mutaciones:
- edición/creación de Paso;
- relación Hermandad ↔ Paso;
- relación Imagen ↔ Paso;
- fases patrimoniales;
- personal/capataces actuales;
- intervenciones;
- fuentes;
- portada/media;
- estado y slug.

### 4. Bandas

Loaders principales:
- `lib/supabase/bands.js`
- `lib/supabase/bandColors.js`
- `lib/supabase/bandDiscography.js`
- relaciones musicales/institucionales consumidas desde otras fichas

Superficies:
- `/bandas`
- `/bandas/[slug]`
- Hermandades relacionadas
- Home/buscador

Mutaciones:
- edición de Banda;
- colores/logos/identidad;
- acompañamientos;
- vínculos institucionales;
- discografía, lanzamientos y pistas;
- marchas/grabaciones relacionadas;
- fuentes;
- estado y slug.

### 5. Home

Loaders actuales:
- `lib/supabase/home-v2.js`
- `lib/supabase/home.js` donde siga existiendo consumo legado
- `lib/supabase/outing-briefing.js`

Dependencias observadas en Home V2:
- entidades publicadas;
- acontecimientos/efemérides y `entity_relations`;
- contenido editorial y sus enlaces;
- marchas, autores, dedicatorias, grabaciones y pistas;
- extraordinarias y briefing asociado;
- vistas/consultas de descubrimiento relacional.

Conclusión: **Home no debe usar una única tag `HOME` aislada**. Necesita invalidación derivada de las familias que alimentan cada bloque, además de una tag editorial propia.

### 6. Búsqueda y Tira del hilo

Loaders actuales relevantes:
- `lib/supabase/search.js`
- `lib/supabase/search-live.js`
- `lib/supabase/tira-del-hilo-v2.js`

La búsqueda viva y el motor conversacional dependen del grafo publicado. Una caché demasiado larga puede hacer que una entidad recién publicada o una relación recién creada no sea descubrible.

Criterio preliminar:
- autocompletado/búsqueda viva: caché corta o ninguna hasta medir coste;
- respuestas multirrelacionales: cachear solo consultas deterministas y con invalidación amplia del grafo, si demuestra beneficio real;
- no compartir automáticamente la misma política de 1 hora que directorios estables.

### 7. Sitemap

`app/sitemap.js` ya tiene `revalidate = 3600`, pero su consulta y política de fallback deben auditarse por separado.

Debe invalidarse o regenerarse ante:
- publicación/despublicación de entidad;
- cambio de slug;
- incorporación/eliminación de una ruta temática indexable.

No debe depender de una caché de contenido que pueda conservar URLs antiguas tras cambiar un slug.

## Taxonomía de tags propuesta

No implementar aún; sirve como contrato de diseño.

Familias:
- `public:brotherhoods`
- `public:images`
- `public:steps`
- `public:bands`
- `public:agents`
- `public:marches`
- `public:outings`
- `public:sources`
- `public:editorial`
- `public:media`
- `public:search`
- `public:sitemap`

Entidades concretas:
- `public:brotherhood:<slug-or-id>`
- `public:image:<slug-or-id>`
- `public:step:<slug-or-id>`
- `public:band:<slug-or-id>`
- `public:march:<slug-or-id>`
- `public:outing:<id>`

Las tags por entidad complementan a las familiares; no las sustituyen cuando una mutación altera directorios o relaciones inversas.

## Regla para relaciones

Una mutación relacional debe invalidar **ambos extremos y los directorios/superficies agregadas afectadas**.

Ejemplos:
- Hermandad ↔ Paso → `brotherhoods` + `steps` + ambas entidades;
- Imagen ↔ Paso → `images` + `steps` + ambas entidades;
- Hermandad ↔ Banda → `brotherhoods` + `bands` + ambas entidades;
- Marcha dedicada a Hermandad → `marches` + `brotherhoods` + Home/búsqueda si consumen patrimonio musical.

## Orden recomendado de implantación

### Fase A · Cliente público anónimo
Separar lecturas públicas de `createClient()` autenticado/cookie-aware. Sin activar todavía `unstable_cache`.

Objetivo: eliminar dependencia de cookies en loaders públicos y preparar renderizado cacheable.

### Fase B · Directorios estables
Introducir caché primero en:
- Hermandades;
- Imágenes;
- Pasos;
- Bandas.

Son superficies con comportamiento sencillo y validación visual/funcional fácil.

### Fase C · Fichas individuales
Cachear por familia + entidad, verificando relaciones inversas y media.

### Fase D · Home y extraordinarias
Solo después de mapear completamente editorial, acontecimientos, marchas y briefing.

### Fase E · Búsqueda / Tira del hilo
Decidir con métricas. No asumir que cachear siempre mejora la experiencia.

## Criterios de aceptación antes de activar caché

1. Cada loader público tiene inventario de tablas/vistas dependientes.
2. Cada mutación del Panel está asignada a las tags que invalida.
3. Crear, editar, publicar, despublicar y cambiar slug tienen prueba explícita.
4. Relaciones invalidan ambos extremos.
5. Media/portadas invalidan la ficha que las muestra.
6. Home refleja una edición relevante sin esperar al TTL.
7. Sitemap elimina URLs antiguas después de un cambio de slug/despublicación.
8. Fallos de Supabase no se convierten silenciosamente en directorios vacíos cacheados.
9. Se mide TTFB/consultas antes y después.
10. Existe rollback sencillo: desactivar caché sin cambiar el modelo de datos.

## Riesgos

### CRÍTICO
Cachear resultados vacíos o incompletos producidos por un fallo temporal de Supabase.

### ALTO
Invalidación incompleta tras una relación o cambio de slug.

### ALTO
Home desactualizada respecto a extraordinarias, contenido editorial o patrimonio musical.

### MEDIO
Sobreinvalidar familias completas y perder parte del beneficio de caché.

### MEDIO
Cachear búsqueda conversacional sin beneficio medido y empeorar frescura.

## Decisión operativa

**NO ACTIVAR CACHÉ PERSISTENTE TODAVÍA.**

El siguiente PR técnico debe implementar únicamente la **Fase A: cliente público anónimo**, migrando loaders públicos de forma incremental y sin cambiar todavía `dynamic`, TTL, ISR ni comportamiento de invalidación.

Una vez validada esa separación, se abrirá un PR independiente para la Fase B de directorios estables.
