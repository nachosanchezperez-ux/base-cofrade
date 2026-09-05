# Hilo Cofrade · Certificación documental · San Bernardo

**Fecha de corte:** 5 de septiembre de 2026  
**Entidad:** Hermandad de San Bernardo  
**Slug:** `hermandad-de-san-bernardo`  
**Entidad Supabase:** `e1000000-0000-0000-0000-000000000001`  
**Base GitHub del cierre:** `main = 5206696574fc54cfde74547b8d6a87fc9d00d302`  
**Régimen:** `FIRST EDITION FREEZE` activo  
**Resultado:** **100 % técnico · indexable · grafo limpio**

## Decisión

**SAN BERNARDO → CERRADA Y CERTIFICADA.**

El frente partía de un 93 % técnico, pero esa cifra ocultaba deuda documental real en restauraciones, evolución de pasos, cultos recurrentes, posiciones musicales de 2026, patrimonio histórico y musical, acontecimientos y trazabilidad de Fuentes. El cierre no se ha limitado a elevar señales de completitud: se ha auditado la ficha completa y se han corregido datos imprecisos o desactualizados.

No se ha introducido nuevo DDL, tablas, migraciones estructurales, RLS, arquitectura, componentes, lector ni UX general.

## Identidad y sede

Queda validado:

- nombre público: **Hermandad de San Bernardo**;
- nombre oficial completo de la corporación;
- carácter **Penitencia + Sacramental**;
- estación de penitencia el **Miércoles Santo**;
- sede canónica en la **Iglesia Parroquial de San Bernardo**, C/ Santo Rey, 34, Sevilla;
- barrio de San Bernardo;
- identidad cromática: morado oscuro `#3A1F4D`, negro `#111111` y blanco `#FFFFFF`;
- escudo canónico disponible en Storage y relacionado con la fuente oficial de heráldica.

La historia oficial sitúa a la corporación en la parroquia de San Bernardo desde sus orígenes. No se ha creado una sede histórica artificial para la antigua capilla sacramental del mismo templo.

## Corrección de premisas

Dos puntos de la orden inicial se clasifican como **no aplicables**, no como deuda:

1. **Nuestro Padre Jesús de la Humildad no es titular de la Hermandad de San Bernardo.** No aparece en la titularidad oficial actual y no se ha creado ni relacionado.
2. El primer paso actual **no es un misterio**. Procesiona el Santísimo Cristo de la Salud; una etiqueta histórica de acompañamiento que decía «paso de misterio» ha sido corregida a «Paso del Santísimo Cristo de la Salud».

QA final:

- `humildad_linked = 0`;
- `current_mystery_label = 0`.

## Titulares

Quedan publicados y relacionados **6 titulares / imágenes devocionales**:

- Santísimo Cristo de la Salud;
- María Santísima del Refugio;
- Nuestra Señora del Patrocinio;
- Pura y Limpia Concepción;
- Santa Bárbara;
- San Bernardo.

Se mantiene prudencia con la autoría histórica del Santísimo Cristo de la Salud: no se convierte una atribución discutida en autoría concluyente.

### Restauraciones modeladas

Se han estructurado en el modelo canónico de `heritage_updates` las principales intervenciones documentadas:

**Santísimo Cristo de la Salud**

- 1938 · intervención de Sebastián Santos Rojas;
- 1967 · intervención de Sebastián Santos Rojas;
- 1975 · intervención de Jesús Santos Calero;
- 1999 · restauración integral en el IAPH, bajo la dirección de Enrique Gutiérrez Carrasquilla.

**María Santísima del Refugio**

- 1967 · nuevo candelero;
- 1972 · restauración de Sebastián Santos Rojas;
- 1999 · restauración integral de Enrique Gutiérrez Carrasquilla;
- 2020 · mantenimiento de Enrique Gutiérrez Carrasquilla.

**Nuestra Señora del Patrocinio**

- 1972 · restauración de Antonio Dubé de Luque.

El estado 2026 del Cristo se formula de manera prudente: se conserva el examen anual satisfactorio de marzo y el posterior anuncio de traslado al IAPH para estudio/conservación, sin inventar un resultado final no publicado.

## Pasos

Quedan relacionados **3 pasos/configuraciones**:

- Paso del Santísimo Cristo de la Salud;
- Paso de palio de María Santísima del Refugio;
- paso/custodia sacramental.

Los capataces vigentes ya existentes han sido revalidados:

- Cristo: **Carlos Villanueva Granado**, desde 2025;
- palio: **Manuel Villanueva Granado**, desde 2025;
- custodia: Carlos y Manuel Villanueva en 2026.

### Evolución del paso del Cristo

Queda representada mediante fases documentadas:

- configuración histórica del paso actual desde 1925;
- restauración, nuevo dorado y nueva parihuela en 1972;
- cartelas laterales de la Pasión de Fernando Aguado Hernández en 2006.

### Evolución del palio

Queda representada sin convertir la descripción del paso en un inventario patrimonial:

- conjunto de palio de 1929;
- reposición de bambalinas en 1939 tras las pérdidas de 1936;
- paso del techo de palio a nuevo terciopelo en 1981;
- candelabros de cola actuales de 1992;
- respiraderos actuales de 1995;
- restauración de los bordados entre 1996 y 1998.

Las fases relevantes están vinculadas a sus autores/restauradores y a la fuente oficial de Pasos. QA final: `step_phases_without_source = 0`.

## Música vigente

La situación de 2026 queda diferenciada de los periodos históricos:

- **Cruz de Guía:** BCT Sagrado Corazón de Jesús de Marchena · vigente desde 2026;
- **tras el Cristo:** BCT Presentación al Pueblo de Dos Hermanas · vigente desde 2007;
- **tras el palio:** Banda de Música de la Cruz Roja de Sevilla · vigente desde 1998.

Para la estación de penitencia del **1 de abril de 2026** se han creado las tres posiciones musicales exactas y sus tres asignaciones, ligadas a la salida concreta.

Se conservan separadas las etapas históricas ya documentadas, entre ellas Arahal y Las Cigarreras. La etapa de Las Cigarreras ha sido corregida para no denominar «misterio» al paso del Cristo.

No se han creado fichas incompletas de bandas históricas únicamente para rellenar huecos antiguos.

## Patrimonio musical

El catálogo oficial de la Hermandad ha pasado de una representación parcial de **8 relaciones** a **27 obras musicales relacionadas**, todas con fuente.

Regla aplicada: cuando la web oficial agrupa una composición «para el paso del Cristo» o «para el paso de palio» pero no identifica de forma expresa un destinatario individual, la relación se establece con la **Hermandad** y se conserva el contexto del paso. No se inventa una dedicatoria personal al Cristo o a la Virgen.

Entre las obras incorporadas o completadas están:

- *Pasa la Virgen del Refugio* · Manuel Rodríguez Ruiz · 1981;
- *Pan Eucarístico* · Julio Vera;
- *Salud* · Enrique Garfia Moreno;
- *De San Bernardo al Cielo* · Abraham Padilla;
- *Ángeles de San Bernardo* · Francisco Javier Torres Simón;
- *El Cristo de la Salud* · Manuel López Farfán · 1939;
- *El Refugio* · Manuel Ruiz Vidriet / Rafael Carretero · 1925;
- *Refugio de San Bernardo* · José Albero Francés · 1976;
- *Refugio Eres Tú* · Juan Santos Sánchez · 1986;
- *Madre del Refugio* · Juan Velázquez Sánchez · 1997;
- *Refugium Peccatorum* · Andrés Martos Calles · 1999;
- *Virgen del Refugio* · Pedro Morales · 1981;
- *San Bernardo* · Manuel Marvizón · 2009;
- *Refugio de Pecadores y Reina de San Bernardo* · Enrique Cisma · 2013;
- *Refugio de mi Salud* · Joaquín Caballero / Luis Farfán · 2019;
- *Madre de nuestro Refugio* · José León Alapont · 2019.

Además se han relacionado correctamente *Refúgiame* y *Salus Christi*.

### Corrección de Refúgiame

`Refúgiame` estaba clasificada como cornetas y tambores. Se corrige a:

- año: **1994**;
- tipo: **Banda de Música**;
- autor: Francisco Javier González Ríos;
- contraste mediante la discografía oficial de la Banda de Música de la Cruz Roja.

### Incertidumbre legítima

`Salud y Refugio` permanece sin autor/año canónicos porque el catálogo oficial consultado incluye la obra pero no aporta esos campos y las fuentes secundarias disponibles no son unívocas. No bloquea el cierre.

QA musical final:

- obras relacionadas: **27**;
- relaciones musicales sin fuente: **0**;
- duplicados de dedicatoria: **0**;
- música futura marcada como actual: **0**.

## Cultos

Quedan modelados **16 cultos recurrentes** y **10 ocurrencias concretas de 2026**.

Se han añadido, como cultos recurrentes y sin inventar ocurrencia 2026:

- Jubileo Circular de las Cuarenta Horas de marzo;
- Misa del Espíritu Santo de apertura de curso;
- Función a las Ánimas Benditas del Purgatorio;
- Función de Nuestra Señora del Patrocinio;
- Función de Santa Bárbara.

Se mantiene la separación estricta entre patrón recurrente y convocatoria anual. QA: `new_cults_with_fake_2026_occurrence = 0`.

## Salidas

Quedan estructuradas **3 salidas**:

- estación de penitencia del Miércoles Santo de 2026;
- procesión eucarística del 14 de septiembre de 2026;
- Vía Crucis de las Cofradías presidido por el Santísimo Cristo de la Salud el **13 de febrero de 1989**.

El Vía Crucis de 1989 ya existía como hito histórico y ahora también está representado como salida extraordinaria. No se han inventado horario ni recorrido no verificados.

## Patrimonio

Quedan **7 piezas patrimoniales principales** en el catálogo, entre ellas:

- manto de salida de María Santísima del Refugio;
- corona de la Virgen;
- potencias del Cristo;
- *El Juicio Final* de Francisco de Herrera el Viejo, 1628;
- paño mortuorio de Ánimas;
- Guión Sacramental;
- manto de vistas de María Santísima del Refugio, proyecto presentado en 2026 y **en ejecución** por Jesús Rosado Borja.

### Paño mortuorio

Se corrige y amplía:

- aprobado en 1740;
- ejecutado en 1744 por Lucas Ortega;
- cenefa añadida en 1764 por Bernardo Barbosa;
- trasladado al IAPH el 6 de febrero de 2026;
- estado actual: **en restauración**.

No se fija fecha de conclusión no publicada.

### El Juicio Final

Queda relacionada la autoría de Francisco de Herrera el Viejo y la restauración iniciada el 5 de febrero de 2026 por MUSAE, sin convertir la duración estimada del trabajo en fecha efectiva de finalización.

### Guión Sacramental

Se corrige una incoherencia previa importante. La ficha anterior lo fechaba en 1967 y lo atribuía a Manuel Frías. El catálogo oficial vigente indica:

- autor desconocido;
- datación estilística: **siglo XIX**;
- restauración en 1991 por José Ramón Paleteiro y Talleres de Villarreal.

La base queda corregida al estado oficial vigente.

## Acontecimientos históricos

Quedan **12 acontecimientos** jerarquizados y relacionados. Se mantienen los hitos existentes y se añaden únicamente los que explican la corporación actual:

- fusión con Santa Cruz y Patrocinio · 1815;
- reorganización de la Hermandad · 1880;
- llegada del actual Santísimo Cristo de la Salud · 1938;
- bendición de María Santísima del Refugio · 1 de enero de 1939.

Se conservan además, entre otros, las constituciones sacramentales de 1570, el origen penitencial de 1748, reglas de 1764, adopción del Refugio en 1765, pérdidas de 1936, Misión de 1965, fusión sacramental de 1967 y Vía Crucis de 1989.

QA: acontecimientos sin relación `involves` = **0**.

## Fuentes

El cierre prioriza web oficial de la Hermandad y fuentes institucionales/especializadas. Se han incorporado y contextualizado, entre otras:

- Historia oficial;
- Imágenes Titulares;
- Pasos;
- Cultos;
- Patrimonio Musical;
- Heráldica;
- Insignias;
- Otras obras;
- comunicación oficial de la restauración del paño mortuorio;
- comunicación oficial del manto de vistas;
- comunicación oficial de la intervención de María Santísima del Refugio;
- fuentes de actualidad de 2026 para estación de penitencia y acompañamientos.

La ficha cuenta con **12 fuentes directas** a nivel de Hermandad y un conjunto mayor de fuentes contextuales ligadas a cultos, fases, restauraciones, salidas, música, patrimonio y acontecimientos.

## Imagen y presentación

El escudo dispone de archivo canónico en Storage y respaldo oficial de heráldica.

Sí permanece una deuda visual legítima:

- no hay fotografías canónicas/licenciadas en `entity_media` para Hermandad, titulares o pasos;
- no se importan imágenes web sin procedencia y derechos trazables únicamente para completar la capa visual.

Esta ausencia no compromete la certificación documental ni la indexabilidad.

## SEO y producción previa a certificación Git

Validado sobre producción vigente:

- ruta `/hermandades/hermandad-de-san-bernardo` → **HTTP 200**;
- `robots`: **index, follow**;
- `googlebot`: **index, follow**;
- canonical correcta;
- breadcrumbs y JSON-LD soportados;
- URL incluida en `/sitemap.xml` tras #637;
- runtime errors asociados a la ruta durante el control: **0**.

## QA final de grafo

Completitud: **100 %** · 10/10 señales.

Conteos:

- titulares/imágenes: **6**;
- pasos: **3**;
- fases de paso: **9**;
- cultos: **16**;
- ocurrencias de cultos 2026: **10**;
- salidas: **3**;
- periodos musicales vigentes: **3**;
- asignaciones musicales exactas 2026: **3**;
- patrimonio: **7 piezas**;
- actualizaciones de restauración: **10**;
- acontecimientos: **12**;
- obras musicales: **27**;
- fuentes directas de Hermandad: **12**.

Controles a cero:

- duplicados Hermandad→Imagen: **0**;
- duplicados Hermandad→Paso: **0**;
- duplicados Imagen→Paso: **0**;
- cultos duplicados: **0**;
- slugs de salidas duplicados: **0**;
- posiciones musicales duplicadas: **0**;
- asignaciones musicales duplicadas: **0**;
- dedicatorias musicales duplicadas: **0**;
- patrimonio duplicado: **0**;
- acontecimientos duplicados: **0**;
- endpoints no publicados en relaciones nucleares: **0**;
- acontecimientos sin `involves`: **0**;
- música futura como actual: **0**;
- fases sin fuente: **0**;
- relaciones musicales sin fuente: **0**;
- Humildad vinculada: **0**;
- etiqueta vigente de «misterio» en el paso del Cristo: **0**.

## Deuda legítima residual

No impide el cierre:

- fotografías de cabecera, titulares y pasos con derechos/procedencia trazables;
- autoría histórica definitiva del Santísimo Cristo de la Salud, mientras permanezca discutida;
- autor y año de `Salud y Refugio`, mientras no exista una fuente suficientemente unívoca;
- otras piezas menores o datos históricos que no aporten valor suficiente o carezcan de documentación específica.

## Límites respetados

- DDL nuevo: **0**;
- tablas nuevas: **0**;
- migraciones estructurales: **0**;
- cambios RLS: **0**;
- arquitectura nueva: **0**;
- cambios de lector: **0**;
- UX general nueva: **0**.

#492 permanece abierta y aislada y no ha interferido con este cierre.

## Certificación

**SAN BERNARDO · CERRADA Y CERTIFICADA · 100 % TÉCNICO · INDEXABLE · GRAFO CLEAN**
