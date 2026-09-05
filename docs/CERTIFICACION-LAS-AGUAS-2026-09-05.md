# Hilo Cofrade · Revalidación documental · Las Aguas

**Fecha de corte:** 5 de septiembre de 2026  
**Entidad:** Hermandad de Las Aguas  
**Slug:** `las-aguas-sevilla`  
**Entidad Supabase:** `dc7f2757-ed02-4cd6-a0e0-ef112d5b6515`  
**Base GitHub de la revalidación:** `main = 8cb5bf54609a328d23745ed592f006ccc89b62fd`  
**Régimen:** `FIRST EDITION FREEZE` activo  
**Resultado:** **cerrada · indexable · grafo nuclear limpio**

## Decisión

**LAS AGUAS → CERRADA Y REVALIDADA SIN NUEVO DML.**

Esta es la primera prueba completa de la habilidad `cerrar-ficha-hermandad`. La prueba detectó que la ficha ya había sido certificada y corregida en las PR #511, #513 y #515, por lo que no reejecutó ni sustituyó migraciones históricas.

No se ha introducido DDL, RLS, arquitectura, código de producto, UX ni cambios en Supabase. La actuación se limita a auditar el estado vivo, verificar producción y dejar una certificación reproducible.

## Identidad y sede

Queda validado:

- una sola entidad canónica y publicada;
- nombre popular **Las Aguas** y nombre oficial completo;
- naturaleza **Penitencia + Gloria** y estación de penitencia el **Lunes Santo**;
- sede en la **Capilla de Nuestra Señora del Rosario**, C/ Dos de Mayo, 1, Sevilla;
- barrio del Arenal y web oficial `https://lasaguas.es/`;
- horarios de apertura verificados el 4 de septiembre de 2026;
- colores publicados: morado `#5B2C83` y blanco `#FFFFFF`.

## Grafo vigente

Conteos derivados del estado productivo:

- 4 titulares publicados;
- 3 pasos publicados: misterio, palio y paso de gloria del Rosario;
- 5 imágenes relacionadas con el misterio;
- 1 titular relacionada con el paso de gloria;
- 5 acompañamientos actuales: 3 para el Lunes Santo y 2 para la Procesión de Gloria;
- 2 capataces actuales relacionados con los 3 pasos;
- 12 cultos publicados;
- 3 salidas publicadas;
- 10 acontecimientos publicados;
- 25 dedicatorias musicales publicadas vinculadas a la Hermandad o sus titulares.

Se conservan expresamente:

- María Santísima de Guadalupe, ejecutada en **1965–1966** y bendecida en 1967;
- Nuestra Señora del Rosario como obra anónima del **siglo XVIII**;
- Rosario de Cádiz en Cruz de Guía y la Banda Municipal de Música de Mairena del Alcor tras el paso en la Procesión de Gloria;
- Centuria Romana Macarena, Rosario de Cádiz y Mairena del Alcor en las posiciones vigentes del Lunes Santo;
- Gonzalo Carrión Fernández y Gonzalo Carrión García como dirección actual de los tres pasos.

## Integridad y Fuentes

QA nuclear:

- entidad canónica duplicada: 0;
- Hermandad→Imagen activa duplicada: 0;
- Hermandad→Paso activo duplicado: 0;
- Imagen→Paso activa duplicada: 0;
- acompañamiento actual duplicado: 0;
- acompañamientos actuales sin Fuente: 0;
- personal actual de los pasos sin Fuente: 0;
- hábito publicado sin Fuente: 0.

Existen enlaces históricos de Fuente a nivel de entidad y contexto que no se duplican artificialmente como enlaces específicos de cada relación. La trazabilidad material es suficiente y no se crea DML para elevar una métrica mecánica.

## Producción

- GitHub: `main = 8cb5bf54609a328d23745ed592f006ccc89b62fd` y 0 PR abiertas al iniciar la prueba;
- Vercel: deployment `dpl_CRWGXSoX5mPcFQL6fAhxwvtGYzPr`, `READY`, producción y mismo SHA de `main`;
- ficha pública: HTTP 200;
- título: `Las Aguas (Sevilla): titulares, pasos e historia · Hilo Cofrade`;
- canonical exacta: `https://hilocofrade.es/hermandades/las-aguas-sevilla`;
- robots: `index, follow`;
- OG: HTTP 200, `image/png`;
- ruta `/hermandades/[slug]`: 0 errores runtime en las 24 horas auditadas.

## Deuda legítima

No bloquea el cierre:

- completar media adicional únicamente cuando tenga procedencia y derechos trazables;
- ampliar intervenciones patrimoniales cuando las fuentes permitan estructurarlas;
- trasladar enlaces contextuales históricos a relaciones más específicas solo si aporta valor editorial real y sin duplicación.

No queda deuda A detectada. La ficha no debe reabrirse por perseguir completitud porcentual.

