# Hermandades en borrador · fichas completadas

Continuación de `docs/auditorias/relaciones-musicales-tarea05-20261012/` (lista priorizada de las 57 Hermandades en borrador).

## Calle Real de Castilleja de la Cuesta · 12/10/2026 · aplicado, en borrador

`calle-real-castilleja.sql`; reversión: `calle-real-castilleja-rollback.sql`.

### Fuentes

- [Hermandad del Gran Poder de Sevilla · La Hermandad del Gran Poder de Castilleja de la Cuesta](https://www.gran-poder.es/devocion/las-hermandades-del-gran-poder-historia-y-patrimonio/la-hermandad-del-gran-poder-de-castilleja-de-la-cuesta-sevilla/): nombre oficial, sede, titulares, pasos y salidas.
- [ArteSacro · Jueves Santo y Madrugada en Castilleja (2019)](https://www.artesacro.org/Noticia.asp?idreg=129355): Vuelta del Jueves Santo con el Cristo de la Vera Cruz y la Piedad, sobre un nuevo paso renacentista.
- Banda de la Cruz Roja · Domingo de Resurrección: la Inmaculada sale en «un paso de madera dorada».

### Ficha de la Hermandad

- **Nombre oficial:** Pontificia, Real, Ilustre, Antigua y Franciscana Hermandad y Archicofradía Sacramental de la Inmaculada Concepción Coronada y de Nazarenos de la Santísima Vera Cruz y Sangre de Nuestro Señor Jesucristo, Nuestro Padre Jesús del Gran Poder y María Santísima de los Dolores.
- **Sede:** parroquia de la Purísima Concepción (Calle Real).

### Titulares (5)

- Cristo de la Vera Cruz (anónimo, siglo XVII).
- Nuestra Señora de la Piedad (atribuida a Pedro Roldán).
- Jesús del Gran Poder (primera mitad del siglo XVIII).
- María Santísima de los Dolores (procedente de las Mínimas, 1899).
- Inmaculada Concepción Coronada (Gumersindo Jiménez Astorga, 1878).

### Pasos (4), cada uno enlazado a su imagen

| Paso | Detalle | Música enlazada |
|---|---|---|
| Vera Cruz | Paso renacentista, 2019 · Jueves Santo | Carmen de Salteras |
| Gran Poder | José Gil, 1913 · Madrugá | Valme hasta 2026 y Las Cigarreras desde 2027 |
| Palio de los Dolores | Madrugá | Ninguna: no hay periodo vigente documentado |
| Inmaculada | José Gil · Domingo de Resurrección | Cruz Roja |

### Estado

- Todo queda en **borrador**, como la Hermandad. Publicarla requiere autorización del propietario.
- Las autorías se recogen en la descripción de cada imagen, citando su fuente. No se crean vínculos con autores.
- No se crean San Juan ni Magdalena (figuras secundarias del paso de la Vera Cruz).

### Publicación · 12/10/2026 · aplicado y verificado

`calle-real-publicacion.sql`; reversión: `calle-real-publicacion-rollback.sql`.

- Con autorización del propietario se publican la Hermandad, sus 5 imágenes, sus 4 pasos y todas sus relaciones.
- Nuevo periodo, confirmado por el propietario: Banda de Música del Rosario de Sanlúcar la Mayor, tras el palio de los Dolores, en la Madrugá, «al menos desde 2019».

**Verificado en `/hermandades/hermandad-calle-real-castilleja-cuesta`:**

- Aparecen los 5 titulares y los 4 pasos.
- Música actual: Carmen de Salteras (Jueves Santo), Sanlúcar (Madrugá, palio) y Cruz Roja (Domingo de Resurrección).
- Valme figura en el histórico.
- Las Cigarreras (Gran Poder, desde 2027) aparece en Música 2027 y no como vigente, porque es un contrato futuro.
- La cabecera indica «3 pasos» de Semana Santa y, aparte, la Gloria. Es el diseño de la ficha.

## Caridad de Santa Aurelia (Sevilla) · 12/10/2026 · aplicado, en borrador

`caridad-santa-aurelia.sql`; reversión: `caridad-santa-aurelia-rollback.sql`.

### Fuentes

- [Banda Las Nieves de Olivares · Agrupación Parroquial María Santísima de la Caridad](https://lasnievesdeolivares.com/agrupacion-parroquial-maria-santisima-de-la-caridad/): sede en San Lucas Evangelista (Santa Aurelia), imagen de Antonio Joaquín Dubé de Luque, salida el quinto sábado de Cuaresma, banda desde 2025.
- [Inri Información (2022)](https://inriinformacion.com/2022/04/02/la-virgen-de-la-caridad-de-san-lucas-hara-su-salida-procesional-por-santa-aurelia/): primera procesión el 2 de abril de 2022, **bajo palio**, con el Maestro Tejera.

### Ficha

- Titular: María Santísima de la Caridad, de Dubé de Luque. **Las fuentes discrepan en la fecha (1998 o 2008)**; se recogen las dos.
- Paso de palio de María Santísima de la Caridad.

### Música

- Las Nieves de Olivares, desde 2025, enlazada al palio.
- **Nuevo periodo histórico documentado:** Maestro Tejera en 2022.

### Estado

Todo queda en **borrador** hasta que el propietario autorice publicarlo.

**Publicada el 12/10/2026** con autorización del propietario: la Agrupación, su imagen, su paso y sus relaciones. Verificada en `/hermandades/agrupacion-parroquial-caridad-santa-aurelia-sevilla`. Reversión de la publicación: devolver esas 3 entidades y sus 3 relaciones a `draft`.

## La Borriquita de Huévar del Aljarafe · 12/10/2026 · aplicado y publicado

`cristo-amor-huevar.sql`; reversión: `cristo-amor-huevar-rollback.sql`. Autorizado por el propietario («Hazlo todo»).

- **Fuentes:** [ArteSacro, abril de 2026](https://www.artesacro.org/Noticia.asp?idreg=167374) y [ArteSacro, abril de 2025](https://www.artesacro.org/Noticia/Ver/161370/provincia-domingo-ramos-huevar-aljarafe).
- **Nombre:** Agrupación Parroquial del Santísimo Cristo del Amor en su Entrada Triunfal en Jerusalén.
  - Antes figuraba como «Asociación de Fieles Devotos».
  - Sede: parroquia de Nuestra Señora de la Asunción.
- **Titular:** Cristo del Amor, de los Talleres de Olot (finales del siglo XX).
- **Paso:** un único paso, el de la Entrada Triunfal, que llegó a Huévar en 1993.
- **Música:** La Redención (A.M. Nuestro Padre Jesús de la Redención), confirmada en 2026, enlazada al paso.
- **Verificado** en `/hermandades/cristo-amor-entrada-triunfal-huevar`.

## Hermandad de Jesús de La Algaba · 12/10/2026 · aplicado y publicado

`jesus-la-algaba.sql`; reversión: `jesus-la-algaba-rollback.sql`.

### Fuentes

- [Guía «La Algaba: Patrimonio entre naranjos»](https://sites.google.com/g.educaand.es/guiapatrimoniomatilde/hermandad-de-jes%C3%BAs-nazareno-jes%C3%BAs).
- [Banda de la Cruz Roja · Madrugá](https://www.bandacruzroja.es/hermandades/semana-santa/la-madruga).

### Ficha

- **Nombre oficial:** Pontificia, Real e Ilustre Hermandad de Nuestro Padre Jesús Nazareno. Sede: Iglesia de Jesús. Salida: Madrugá.
- **Titulares:**
  - Jesús Nazareno: anónimo de 1685, atribuido a La Roldana.
  - Dolores: de candelero, atribuida a Juan de Astorga.
  - San Juan Evangelista: Miguel Ángel Domínguez, 2005.
- **Pasos:**
  - Jesús Nazareno: Antonio Martín, 1958; caídas de Hermanas Ramas, 2008.
  - Palio de los Dolores.
- **Música:** Cruz Roja tras el palio, desde 2019.

Verificado en `/hermandades/hermandad-jesus-la-algaba`.

**Hallazgo técnico, sin tocar:** en las fichas de Hermandad, el recuento de Hermandades de una banda difiere entre la tarjeta («11 con acompañamiento actual») y el bloque «Sigue tirando del hilo» (10). Parece que uno excluye la propia Hermandad. Revisar en una tarea de código aparte.

## Hermandad de la Divina Pastora de Capuchinos (Sevilla) · 12/10/2026 · aplicado y publicado

`divina-pastora-capuchinos.sql`; reversión: `divina-pastora-capuchinos-rollback.sql`. El propietario confirmó que es de Sevilla.

### Fuentes

- [Archidiócesis de Sevilla · La Pastora de Capuchinos](https://www.archisevillasiempreadelante.org/pastora-de-capuchinos/).
- [Banda Las Nieves de Olivares · Pastora de Capuchinos](https://lasnievesdeolivares.com/divina-pastora-de-las-almas-pastora-de-capuchinos/).
- [Gente de Paz · Las Nieves acompañará a la Pastora de Capuchinos (2022)](https://www.gentedepaz.es/las-nieves-de-olivares-acompanara-a-la-pastora-de-capuchinos-en-su-procesion-triunfal-de-mayo-de-2022-con-motivo-del-centenario-de-su-coronacion/).
- [ArteSacro · Procesión de 2025](https://www.artesacro.org/Noticia/Ver/161920/emocion-devocion-procesion-divina-pastora-capuchinos).

### Ficha

- **Datos generales:**
  - Municipio: Sevilla; barrio: Capuchinos.
  - Tipo: Gloria; sale el último domingo de mayo.
  - Sede: convento de las Santas Justa y Rufina.
  - El nombre oficial no se cambia, porque ninguna fuente lo documenta completo.
- **Titular:** Divina Pastora de las Almas Coronada.
  - Su autoría no es unánime y se recogen las dos versiones: atribución a José Fernández Guerrero (Archidiócesis y Gente de Paz, citando a Martínez Alcalde) o talla anónima (web de la banda).
  - Restaurada por Sebastián Santos en 1956; nuevo cuerpo de Buiza en 1982.
  - Coronada en 1921; coronación canónica en 2004.
- **Paso:** paso procesional de Gloria; autor y fecha no documentados.
- **Música:** Las Nieves de Olivares tras el paso, desde 2022, enlazada al paso.

Verificado en `/hermandades/hermandad-divina-pastora-capuchinos-sevilla`.

## Hermandad de la Esperanza de Arahal · 12/10/2026 · aplicado y publicado

`esperanza-arahal.sql`; reversión: `esperanza-arahal-rollback.sql`.

### Fuentes

- [Web de la Hermandad · Santísimo Cristo de la Esperanza](https://hermandadesperanzaarahal.es/blog/santisimo-cristo-de-la-esperanza/).
- [ArteSacro · Una mirada a la provincia (2009)](https://www.artesacro.org/Noticia/Ver/49049/provincia-mirada-provincia-hermandad-esperanza-arahal).
- [Archidiócesis de Sevilla · Jubileo 2025](https://www.archisevilla.org/jubileo-2025-santisimo-cristo-de-la-esperanza-parroquia-de-santa-maria-magdalena-arahal/).

### Ficha

- **Nombre oficial:** Hermandad Sacramental y Cofradía de Nazarenos del Santísimo Cristo de la Esperanza, Nuestra Señora de las Angustias, San Juan Evangelista y Santa María Magdalena.
  - Sede: parroquia de Santa María Magdalena.
  - Sale la tarde del Viernes Santo.
- **Titulares:** los tres son de Manuel Pineda Calderón.
  - Cristo de la Esperanza, 1946-1947.
  - Angustias, 1938 según ArteSacro.
  - San Juan Evangelista.
- **Pasos:**
  - Cristo: neobarroco, sin autor documentado.
  - Palio: de los años 60, de Villarreal, con bordados de Francisco Expósito y respiraderos de Seco Imberg procedentes del Buen Fin.
- **No se ha creado:**
  - La imagen de Santa María Magdalena: es cotitular en el nombre, pero ninguna fuente la describe.
  - La relación de San Juan con un paso: las fuentes no dicen en cuál procesiona.
- **Música:** se enlazan los tres periodos existentes, sin cambiar fechas ni bandas.
  - Santa María Magdalena de Arahal, tras el Cristo, vigente.
  - AMUECI, tras el palio, 2026.
  - Bollullos, tras el palio, 2027-2028. No se muestra en la web porque la ficha de la banda sigue en borrador.

Verificado en `/hermandades/hermandad-esperanza-arahal`.

## Hermandad de la Humillación de Camas · 12/10/2026 · aplicado y publicado

`humillacion-camas.sql`; reversión: `humillacion-camas-rollback.sql`.

### Fuentes

- [Turismo Aljarafe · Hermandad de la Humillación](https://turismo.aljarafe.com/recursos-turisticos/guias-turisticas/Hermandad-de-la-Humillacion.).
- [ArteSacro · Estreno de San Pedro (2014)](https://www.artesacro.org/Noticia.asp?idreg=94562).
- [Ayuntamiento de Camas · Camas Cofrade 2023](https://www.camas.es/export/sites/camas/.galleries/documentos-noticias/camas-cofrade-2023.pdf).

### Ficha

- **Nombre oficial:** según «Camas Cofrade 2023». Turismo Aljarafe recoge la denominación anterior de Agrupación Parroquial.
  - Sale el Sábado de Pasión.
  - Orígenes en 1991; Agrupación Parroquial desde 2009; primera estación de penitencia en 2013.
  - No se indica sede: ninguna fuente la confirma.
- **Titulares,** de Ángel Velázquez Vega:
  - Soberano Poder (2006);
  - Humillación (2004).
- **San Pedro** (Velázquez Vega, 2014): se vincula como imagen secundaria del misterio.
- **Pasos:** misterio de las Negaciones y palio, sin autor documentado.
- **No se ha creado:** la Inmaculada Concepción ni la Virgen Gloriosa, porque ninguna fuente las describe.
- **Música:** Santa María Magdalena de Arahal, tras el misterio desde 2024, enlazada al paso. El propietario confirmó que es la banda actual; su confirmación queda registrada como fuente del periodo.
- **Música histórica (13/10/2026):** periodo nuevo de la A.M. Virgen de los Reyes tras el misterio hasta 2023, confirmado por el propietario y por «Camas Cofrade 2023». No hay año de inicio documentado, así que se deja como texto.
- **Música del palio (13/10/2026):** periodo nuevo de la Banda Municipal de Mairena del Alcor tras el palio, vigente desde 2026. Se firmó en diciembre de 2025 (El Pespunte) y el propietario confirma que 2026 fue el primer año. La duración del contrato no está documentada.

### Propuesto, sin aplicar

Estos acompañamientos aparecen en las fuentes pero no están en la base:

- Cigarreras tras el palio, desde 2018, según «Camas Cofrade 2023» y El Pespunte. El año de fin no está confirmado. Por la llegada de Mairena en 2026, el último año sería 2025: pendiente de confirmar.

### Hallazgo técnico, sin tocar

La ficha de Hermandad muestra todas las imágenes vinculadas dentro de «Titulares», también las de tipo `secondary_image` (aquí, San Pedro). Revisar en una tarea de código aparte.

Verificado en `/hermandades/hermandad-humillacion-camas`.
