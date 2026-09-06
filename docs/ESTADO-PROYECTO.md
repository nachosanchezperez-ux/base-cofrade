# Hilo Cofrade · Estado canónico

**Corte validado:** 6 de septiembre de 2026 · cierre avanzado de la Purísima de La Algaba
**HEAD funcional previo a esta sincronización:** `main = e3afcd9c0d1206c5dfd91c0627407dd214f5ff49`
**Régimen:** `FIRST EDITION FREEZE` activo  
**Fase:** editorial / documental sobre el modelo vigente  
**Frente editorial activo:** ninguno

> La PR que sincronice este documento pasa a ser el nuevo HEAD canónico sin alterar el estado funcional descrito aquí. GitHub, Supabase y Vercel prevalecen siempre sobre cualquier SHA transitorio escrito en documentación.

## Última actualización cerrada · Purísima de La Algaba · 2026-09-06

- Alcance: cierre avanzado de identidad, sede, titular, paso, cultos, Romería, acontecimientos, intervención histórica, memoria musical y Fuentes.
- Punto de partida: **36 % técnico**.
- Resultado: **93 % técnico · 1 titular · 1 paso · 3 cultos · 4 salidas · 3 acontecimientos · 1 intervención · 2 evidencias musicales históricas · indexable · grafo nuclear limpio**.
- La sede canónica queda correctamente separada de la residencia devocional habitual de la imagen en El Aral.
- La música de 2026 permanece **sin confirmar**: los acompañamientos documentados de 2011 y 2017 son históricos y no se proyectan como vigentes.
- PR funcional: [#657](https://github.com/nachosanchezperez-ux/base-cofrade/pull/657).
- Certificación: `docs/CERTIFICACION-PURISIMA-LA-ALGABA-2026-09-06.md`.
- Límites: solo DML editorial y documentación; sin DDL, RLS, arquitectura ni cambios de UX.

## Dónde estamos ahora

La Primera Edición permanece cerrada, certificada y congelada. La Purísima de La Algaba se abrió como único frente tras el recálculo global de deuda, se completó únicamente con información verificable y vuelve a quedar cerrada; no existe un frente editorial activo.

Estado validado antes de esta sincronización final:

- GitHub: `main = e3afcd9c0d1206c5dfd91c0627407dd214f5ff49` · PR #657 integrada;
- PR funcionales abiertas al congelar la rama: **0**;
- Supabase producción: operativa · **69 migraciones alineadas** · última versión `20260906072100`;
- Purísima de La Algaba: **93 % técnico · 1 titular · 1 paso · 3 cultos · 4 salidas · 3 acontecimientos · 0 acompañamientos actuales · indexable · grafo nuclear limpio**;
- San Bernardo: **100 % técnico · 4 pasos · 3 convocatorias nuevas · indexable · grafo limpio**;
- Las Aguas: **cerrada · indexable · grafo nuclear limpio**;
- Jesús Despojado: **100 % técnico · 4 titulares · 9 cultos · 2 salidas · 3 asignaciones musicales · 14 fuentes relevantes · 0 duplicados**;
- producción: `dpl_Ei6R9Qd7xKctE24sKcTAfho7DNMd`, `READY`, sobre el mismo SHA de `main`;
- producción: ficha de la Purísima en HTTP 200, canonical correcta, `index, follow`, OG/Twitter válidas y 0 errores `error/fatal` localizados en la ruta durante la ventana auditada;
- #492: abierta y aislada;
- FIRST EDITION FREEZE: activo;
- frente editorial activo: ninguno.

## Cierres documentales vigentes

Estas fichas no deben reabrirse por deuda legítima, mejoras cosméticas o por perseguir porcentajes. Solo procede reabrirlas ante una regresión real o nueva información verificable que cambie materialmente su estado.

- Amparo;
- Las Aguas;
- San Esteban;
- La Sed;
- Virgen del Castillo de Lebrija · actualidad de septiembre de 2026;
- Estrella de Coria;
- La Trinidad;
- Consolación de Carrión de los Céspedes;
- Mercedes de Mairena del Aljarafe;
- Dulce Nombre de Bellavista;
- Pino Montano;
- Vera Cruz y Encarnación de Aznalcázar;
- Hermandad Sacramental de Tomares;
- Nuestra Señora de los Reyes · Sastres;
- Hermandad Mayor de Nuestra Señora de Setefilla;
- Hermandad Sacramental de Camas;
- Nuestra Señora de la Luz de San Esteban;
- El Cerro del Águila;
- Pontificia, Real e Ilustre Hermandad de Nuestra Señora de Consolación Coronada de Utrera;
- Hermandad de Nuestra Señora del Valle Coronada de Écija;
- **Hermandad de San Bernardo**;
- **Jesús Despojado · ficha avanzada**;
- **Purísima de La Algaba · 93 % técnico · música 2026 pendiente de confirmación**.

## Último cierre certificado · Purísima de La Algaba

Documento: `docs/CERTIFICACION-PURISIMA-LA-ALGABA-2026-09-06.md`.

**PURÍSIMA DE LA ALGABA → CERRADA Y CERTIFICADA · 93 % TÉCNICO · INDEXABLE · GRAFO NUCLEAR LIMPIO.**

El 7 % mecánico restante corresponde exclusivamente a la ausencia de acompañamiento musical vigente confirmado. No constituye deuda A ni justifica inventar continuidad desde evidencias históricas.

El cierre incorpora o revalida:

- identidad oficial y nombre popular;
- reglas documentadas de 1870 y contexto devocional anterior;
- sede canónica en la Iglesia Parroquial de Nuestra Señora de las Nieves;
- residencia devocional habitual de la titular en la Ermita de San Salvador e Inmaculada Concepción, en El Aral;
- Purísima Concepción de María Coronada como titular publicada, talla anónima del siglo XVIII;
- paso de Gloria relacionado con la titular y documentado como paso de plata;
- 3 cultos recurrentes;
- 4 salidas publicadas, incluida la Romería de 2026;
- 3 acontecimientos históricos relacionados mediante `involves`;
- intervención de Antonio Castillo Lastrucci en 1929;
- Asociación Musical de La Algaba documentada puntualmente en 2011 y 2017, con `is_current = false`;
- Fuentes institucionales, de Hermandad y de prensa especializada enlazadas en los niveles específicos disponibles.

### Actualidad estricta

- sede canónica y residencia devocional no se confunden;
- un traslado temporal de la imagen no modifica la sede canónica;
- la autoría original de la titular permanece anónima;
- la intervención de Castillo Lastrucci en 1929 no se convierte en una sustitución de imagen;
- no se inventan autoría, fecha completa ni número actual de costaleros del paso;
- la Romería 2026 conserva `event_status = announced` al no haberse usado una crónica posterior para elevarla a celebrada;
- 2011 y 2017 se modelan como evidencias musicales puntuales, no como un intervalo continuo;
- no existe acompañamiento musical de 2026 publicado sin una fuente contemporánea suficiente.

### QA

Conteos finales:

- completitud técnica: 93 %;
- titulares: 1;
- pasos: 1;
- cultos: 3;
- salidas: 4;
- acontecimientos: 3;
- intervenciones: 1;
- evidencias musicales históricas: 2;
- acompañamientos actuales: 0;
- enlaces de fuente relevantes comprobados: 14.

Controles a cero:

- duplicados Hermandad→Imagen;
- duplicados Hermandad→Paso;
- cultos duplicados;
- slugs de salidas duplicados;
- música histórica marcada falsamente como actual;
- acontecimientos sin `involves` hacia la Hermandad.

## Cierre certificado anterior · San Bernardo

Documento: `docs/CERTIFICACION-SAN-BERNARDO-2026-09-05.md`.

**SAN BERNARDO → CERRADA Y CERTIFICADA · 100 % TÉCNICO · INDEXABLE · GRAFO CLEAN.**

La ficha partía de un 93 % técnico pero mantenía deuda real de profundidad y coherencia. El cierre incorpora o revalida:

- identidad completa, sede canónica y paleta morado oscuro / negro / blanco;
- escudo canónico en Storage con fuente oficial de heráldica;
- 6 titulares/imágenes devocionales;
- 4 pasos/configuraciones y 9 fases históricas documentadas;
- capataces vigentes de Cristo, palio y custodia;
- 10 restauraciones de imágenes estructuradas;
- 16 cultos recurrentes y 10 ocurrencias concretas de 2026;
- 3 salidas, incluida la estación de penitencia de 2026 y el Vía Crucis de las Cofradías de 1989 como salida histórica estructurada;
- 3 acompañamientos vigentes y 3 asignaciones exactas para el Miércoles Santo de 2026;
- 27 obras del patrimonio musical relacionadas y con fuente;
- 7 piezas patrimoniales principales;
- 12 acontecimientos históricos jerarquizados;
- 12 fuentes directas de Hermandad más Fuentes contextuales en cultos, restauraciones, fases, música, patrimonio, salidas y acontecimientos.

### Actualización verificable posterior · 6 de septiembre de 2026

- Se incorpora el paso del Niño Jesús de la procesión eucarística como cuarto paso relacionado.
- Se publica una única cita mixta de igualá y primer ensayo para el 3 de septiembre, a las 19:00, en la Casa de Hermandad.
- Se publican los ensayos del 8 y 10 de septiembre sin inventar hora ni lugar.
- No se atribuye capataz porque las fuentes no lo identifican.
- La posible mudá del 12 de septiembre por la tarde se conserva solo como aviso provisional.
- La salida eucarística ya existente del 14 de septiembre permanece intacta.
- Las tres fichas quedan vinculadas al canal oficial de la Hermandad y a un contraste contemporáneo de Arte Sacro.

### Correcciones relevantes

- **Nuestro Padre Jesús de la Humildad no pertenece a la titularidad de San Bernardo** y no se ha creado ni relacionado.
- El primer paso actual es el **Paso del Santísimo Cristo de la Salud**, no un misterio. Se corrigió una etiqueta histórica que aún lo denominaba «paso de misterio».
- `Refúgiame` queda como marcha de **Banda de Música**, de 1994, no como cornetas y tambores.
- El **Guión Sacramental** queda como pieza anónima del siglo XIX, restaurada en 1991 por José Ramón Paleteiro y Talleres de Villarreal; se elimina la anterior atribución/fecha no coincidente con el catálogo oficial vigente.
- El paño mortuorio de Ánimas queda correctamente atribuido a Lucas Ortega (1744), con cenefa de Bernardo Barbosa (1764), y marcado **en restauración** en el IAPH desde febrero de 2026.
- El manto de vistas de María Santísima del Refugio se conserva como **proyecto en ejecución en 2026** por Jesús Rosado Borja, sin fecha de finalización inventada.

### Actualidad estricta

- el estado del Santísimo Cristo de la Salud no convierte el anuncio de traslado al IAPH en una restauración concluida;
- los cinco cultos recurrentes añadidos de marzo/octubre/noviembre/diciembre no reciben una ocurrencia concreta de 2026 sin convocatoria específica;
- las bandas actuales se separan de los periodos históricos;
- no se proyectan contratos o situaciones musicales futuras como actuales;
- no se fuerza una autoría definitiva del Cristo mientras permanezca discutida;
- `Salud y Refugio` permanece sin autor/año canónicos ante fuentes no unívocas.

### QA

Conteos finales:

- titulares/imágenes: 6;
- pasos: 4;
- fases de paso: 9;
- cultos: 16;
- ocurrencias 2026: 10;
- salidas: 3;
- periodos musicales actuales: 3;
- asignaciones exactas 2026: 3;
- patrimonio: 7;
- restauraciones estructuradas: 10;
- acontecimientos: 12;
- obras musicales: 27.

Controles a cero:

- duplicados Hermandad→Imagen / Hermandad→Paso / Imagen→Paso;
- cultos, salidas, patrimonio y acontecimientos duplicados;
- posiciones o asignaciones musicales duplicadas;
- dedicatorias musicales duplicadas;
- relaciones musicales sin fuente;
- fases de paso sin fuente;
- acontecimientos sin `involves`;
- música futura marcada como actual;
- endpoints no publicados en relaciones nucleares;
- relación con una Humildad inexistente en esta corporación;
- etiqueta vigente de «misterio» para el paso del Cristo.

## Primera prueba de habilidad · Las Aguas

Documento: `docs/CERTIFICACION-LAS-AGUAS-2026-09-05.md`.

**LAS AGUAS → CERRADA Y REVALIDADA · INDEXABLE · GRAFO NUCLEAR LIMPIO.**

La habilidad de proyecto `.codex/skills/cerrar-ficha-hermandad` ha completado su primera prueba sobre una ficha ya certificada. Detectó correctamente que no procedía crear DML: revalidó el estado productivo, las fuentes, las relaciones y la representación pública sin reabrir la Hermandad por deuda legítima.

Resultado observado sobre `main = 8cb5bf54609a328d23745ed592f006ccc89b62fd`:

- 4 titulares y 3 pasos publicados;
- 5 imágenes en el misterio y Nuestra Señora del Rosario en su paso de gloria;
- 5 acompañamientos actuales: 3 del Lunes Santo y 2 de la Procesión de Gloria;
- morado y blanco publicados;
- duplicados nucleares a cero;
- canonical correcta, `index, follow`, OG válida y 0 errores runtime en la ruta durante las 24 horas auditadas;
- Vercel producción `READY` en `dpl_CRWGXSoX5mPcFQL6fAhxwvtGYzPr`, sincronizado con el mismo SHA de `main`.

No se ha tocado Supabase, arquitectura, UX, DDL ni RLS.

### Deuda legítima

No bloquea la certificación:

- fotografías de cabecera, titulares y pasos con procedencia/derechos trazables;
- autoría histórica definitiva del Santísimo Cristo de la Salud mientras siga discutida;
- autor/año de `Salud y Refugio` hasta disponer de fuente unívoca;
- piezas menores no suficientemente documentadas.

## Reglas y mejoras transversales vigentes

- huecos secundarios transparentes no fuerzan `noindex`;
- histórico musical estructurado visible donde corresponde;
- fotografías de Salidas desde Panel hacia ficha pública;
- Fuentes heredadas acotadas al contexto real;
- Vía Crucis de las Cofradías como relación reutilizable;
- contraste común estable;
- directorios de Hermandades ordenados por territorio/naturaleza/jornada o mes;
- directorio de bandas agrupado por tipología musical, con territorio/localidad como filtros;
- nombre oficial completo visible también en móvil;
- contratos futuros excluidos de la actualidad hasta su fecha efectiva;
- búsqueda de Hermandades por nombre corto, popular, oficial y localidad;
- `Vestidor actual` como relación `agent → dresser_of → image`, editable desde Panel, con histórico y lectura pública;
- sitemap alineado con el mínimo editorial público (#637).

No se admiten excepciones por slug para ocultar problemas comunes.

## Vestidores estructurados

Relaciones actuales cargadas sobre el modelo vigente:

- Francisco Carrera Iglesias «Paquili» → Nuestra Señora de los Dolores del Cerro;
- José Antonio Grande de León → Nuestra Señora de la Piedad y María Santísima de la Caridad en su Soledad del Baratillo;
- José Antonio Grande de León → María Santísima de los Dolores y Misericordia de Jesús Despojado;
- José Antonio Grande de León → María Santísima del Amor de Pino Montano;
- Leandro González Ruiz → Nuestra Señora de la Encarnación Coronada de San Benito;
- Antonio Sanabria Vázquez → María Santísima de Guadalupe y Nuestra Madre y Señora del Mayor Dolor de Las Aguas.

La relación Leandro González Ruiz → María Santísima de la Estrella de Sevilla permanece `draft`, igual que la Imagen y su Hermandad. No constituye frente abierto ni contenido publicado.

## #492

**#492 · Reconciliar Supabase Preview Branches → ABIERTA Y AISLADA.**

No bloquea contenido/DML editorial, Hermandades, titulares, pasos, música, patrimonio, cultos, acontecimientos, salidas, Fuentes, imágenes/media soportada, relaciones existentes, agentes ni SEO editorial.

Sí bloquea:

- nuevo DDL;
- nuevas tablas;
- migraciones estructurales;
- cambios RLS relacionados.

No debe resolverse reescribiendo migraciones históricas ya aplicadas ni alterando producción por un problema exclusivo de preview.

## Bloqueos y criterio editorial

Los límites reales son FIRST EDITION FREEZE, #492 para estructura/RLS, actualidad estricta 2026/2027, trazabilidad de Fuentes/media y la obligación de no inventar datos para elevar completitud.

Cada ausencia debe clasificarse como:

- A · deuda real;
- B · no aplicable;
- C · dato todavía no publicado;
- D · pendiente de verificar;
- E · hueco legítimo.

## Siguiente movimiento autorizado

No existe frente editorial abierto.

Tras fusionar esta sincronización documental, comprobar producción exacta sobre el SHA de merge y confirmar **0 PR abiertas**. Después, cualquier nuevo frente requiere un nuevo recálculo, nueva información verificable o una orden editorial expresa; no se abre automáticamente otra Hermandad desde el cierre de la Purísima de La Algaba.
