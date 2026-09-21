# Matriz de Fuentes · Carmona · octavo macrolote municipal HC-016

**Fecha de revisión:** 21 de septiembre de 2026  
**Fase:** MATRIZ REVISADA · evidencia posterior 11/11 cerrada · FIRST EDITION FREEZE · sin staging, SQL ni Apply

## 1. Jerarquía probatoria

| Nivel | Uso permitido | Fuentes |
|---|---|---|
| A · canónica | Identidad, título, titulares, contratos propios | Consejo de Hermandades, fuente oficial de corporación o banda |
| B · institucional | Programa, sede, día, pasos, música anunciada y marco municipal | Ayuntamiento/Turismo de Carmona; Turismo provincial |
| C · confirmación | Celebración, incidencias y participación observada | publicación oficial posterior o retransmisión municipal fechada |
| D · apoyo | Localizar indicios que deben elevarse | prensa local, reproducción editorial de guía, hemeroteca |

Una fuente previa acredita anuncio, no celebración. Para materializar una relación se exige URL estable, fecha, editor y alcance inequívoco.

## 2. Registro de Fuentes

| ID | Fuente | Nivel | Cobertura | Limitación |
|---|---|---:|---|---|
| `CAR-F01` | [Consejo · Esperanza](https://consejohermandadescarmona.es/hdaesperanza/) | A | identidad, titulares, pasos y Desamparados | no prueba celebración |
| `CAR-F02` | [Consejo · Nuestro Padre](https://consejohermandadescarmona.es/hermandad-de-nuestro-padre/) | A | identidad, titulares y pasos | historia no equivale a programa 2026 |
| `CAR-F03` | [Consejo · Expiración](https://consejohermandadescarmona.es/hermandad-de-la-expiracion/) | A | identidad, titulares y pasos | separar titulares de cortejo |
| `CAR-F04` | [Consejo · Quinta Angustia](https://consejohermandadescarmona.es/quinta-angustia-2/) | A | identidad, titulares e historia | sede vigente contrastada aparte |
| `CAR-F05` | [Consejo · Santiago](https://consejohermandadescarmona.es/hermandad-de-santiago/) | A | identidad, titulares y pasos | no prueba música |
| `CAR-F06` | [Consejo · Humildad](https://consejohermandadescarmona.es/hermandad-de-la-humildad/) | A | identidad e imágenes históricas | la nueva Borriquita requiere la guía 2026 |
| `CAR-F07` | [Consejo · Amargura](https://consejohermandadescarmona.es/san-felipe/) | A | identidad y dos crucificados distintos | solo Señor de la Amargura participa en 2026 |
| `CAR-F08` | [Consejo · Santo Entierro](https://consejohermandadescarmona.es/hermandad-del-santo-entierro/) | A | identidad, titulares y paso | composición 2026 contrastada aparte |
| `CAR-F09` | [Turismo provincial · Semana Santa de Carmona 2026](https://www.turismosevilla.org/es/eventos-y-fiestas/semana-santa-2026-carmona) | B | programa general, sedes, días y pasos | su resumen omite la nueva Borriquita |
| `CAR-F10` | [PDF municipal · Carmona Penitente 2026](https://turismo.carmona.org/wp-content/uploads/Carmona-Penitente-sin-publi-1.pdf) | B | guía institucional: 11 cortejos, pasos, horarios y música | servidor municipal puede fallar al descargar; páginas contrastadas con reproducción íntegra |
| `CAR-F11` | [La Revista Carmona · reproducción de la guía](https://www.larevistacarmona.es/texto-diario/mostrar/5825655/carmona-penitente-guia-imprescindible-semana-santa) | D | acceso visual a páginas completas de la guía municipal | reproducción secundaria; se atribuye al PDF institucional |
| `CAR-F12` | Fuente Supabase «Servitas Carmona · publicación oficial en Instagram» | A potencial | Salida de septiembre ya cargada | URL y fecha nulas |
| `CAR-F13` | [TV Carmona · Servitas](https://play.televisioncarmona.com/v/Wb1GQFWIeHX0e5LC2q/SERVITAS-REPORTAJE-TVC//) | C | celebración del Viernes de Dolores | no identifica música |
| `CAR-F14` | [TV Carmona · Esperanza](https://play.televisioncarmona.com/v/zXMfLnWu4r4Dr4azMF/HERMANDAD-DE-LA-ESPERANZA-REPORTAJE-TVC//) | C | Coronación y Esperanza | no confundir con Desamparados |
| `CAR-F15` | [TV Carmona · San Felipe](https://play.televisioncarmona.com/v/qr2hy93oqRTOHdUYOn/HERMANDAD-DE-SAN-FELIPE-REPORTAJE-TVC//) | C | Amargura | alias parroquial |
| `CAR-F16` | [TV Carmona · San Blas](https://play.televisioncarmona.com/v/U8chRcbT3j3uDRFP9H/HERMANDAD-DE-SAN-BLAS-REPORTAJE-TVC//) | C | Expiración | alias parroquial |
| `CAR-F17` | [TV Carmona · Quinta Angustia](https://play.televisioncarmona.com/v/bto3LTLIsgaqKsFfCY/HERMANDAD-DE-LA-QUINTA-ANGUSTIA-REPORTAJE-TVC//) | C | Quinta Angustia | — |
| `CAR-F18` | [TV Carmona · Santiago](https://play.televisioncarmona.com/v/8R5I6BUGMu2FqEz73k/HERMANDAD-DE-SANTIAGO-REPORTAJE-TVC//) | C | Columna y Paciencia | — |
| `CAR-F19` | [TV Carmona · El Silencio](https://play.televisioncarmona.com/v/84jhfcoMZ8YXNuunmL/HERMANDAD-DE-EL-SILENCIO-REPORTAJE-TVC//) | C | Nuestro Padre | alias local |
| `CAR-F20` | [TV Carmona · Desamparados](https://play.televisioncarmona.com/v/LwOZnudoEYetI0gXnn/CRISTO-DE-LOS-DESAMPARADOS-REALIZACION//) | C | primera Salida de Desamparados | pertenece a Esperanza |
| `CAR-F21` | [TV Carmona · San Pedro](https://play.televisioncarmona.com/v/Imqv1GlpxvEHKd1B9I/HERMANDAD-DE-SAN-PEDRO-REPORTAJE-TVC//) | C | Humildad y Paciencia/Dolores | no es La Borriquita |
| `CAR-F22` | [TV Carmona · Santo Entierro](https://play.televisioncarmona.com/v/d4cj4lCGq1gPR3ixCX/HERMANDAD-DEL-SANTO-ENTIERRO-REPORTAJE-TVC//) | C | Santo Entierro | — |
| `CAR-F23` | [Servitas Carmona · web oficial](https://servitascarmona.com/) | A | identidad pública y sede | no prueba Paso compartido ni música |
| `CAR-F24` | [TV Carmona · La Borriquita](https://play.televisioncarmona.com/v/JeNyAaqE2pPPq7ZqSd/LA-BORRIQUITA-HERMANDAD-DE-LA-HUMILDAD-REPORTAJE-TVC//) | C | celebración de la nueva Salida | pertenece a Humildad |
| `CAR-F25` | [Paz y Caridad · Semana Santa 2026](https://www.ampazycaridad.com/semana-santa-2026.php) | A | contrato Domingo de Ramos, Humildad «La Borriquita», Carmona | fuente de banda, no inventario corporativo |
| `CAR-F26` | [Servitas · anuncio oficial 19/09](https://www.facebook.com/ServitasCarmona/posts/%EF%B8%8F-%F0%9D%90%82%F0%9D%90%94%F0%9D%90%8B%F0%9D%90%93%F0%9D%90%8E%F0%9D%90%92-%F0%9D%90%8F%F0%9D%90%AB%F0%9D%90%A8%F0%9D%90%9C%F0%9D%90%9E%F0%9D%90%AC%F0%9D%90%A2%C3%B3%F0%9D%90%A7-%F0%9D%90%86%F0%9D%90%9E%F0%9D%90%A7%F0%9D%90%9E%F0%9D%90%AB%F0%9D%90%9A%F0%9D%90%A5-%F0%9D%90%9D%F0%9D%90%9E%F0%9D%90%A5-%F0%9D%90%92%F0%9D%90%9A%F0%9D%90%A7%F0%9D%90%AD%F0%9D%90%A8-%F0%9D%90%84%F0%9D%90%AC%F0%9D%90%9C%F0%9D%90%9A%F0%9D%90%A9%F0%9D%90%AE%F0%9D%90%A5%F0%9D%90%9A%F0%9D%90%AB%F0%9D%90%A2%F0%9D%90%A8-s%C3%A1bado-19-de-septiembre-1800-hr/1392126423115930/) | A | fecha, horario, recorrido y MAFERMAN | anuncio; no prueba celebración |

## 3. Matriz por sujeto

| Sujeto | Salidas 2026 | Identidad/sede | Pasos e imágenes | Evidencia `held` | Música | Resultado |
|---|---:|---|---|---|---|---|
| Servitas | 1 penitencial + septiembre existente | `F23` + `F09` | marzo cerrado; REUSE septiembre bloqueado | `F13` | marzo bloqueada; septiembre anunciada en `F26` | una corporación; no inferir Paso compartido |
| Esperanza | 2 | `F01` + `F09` | cerrados con 1 relación de imagen bloqueada | `F14` + `F20` | 2/3 posiciones identificadas; Desamparados no materializable | una corporación, dos Salidas |
| Amargura | 1 | `F07` + `F09` | cerrados | `F15` | 2/2 identificadas | dos crucificados distintos |
| Expiración | 1 | `F03` + `F09` | cerrados | `F16` | 2/2 identificadas | separar titulares del cortejo |
| Quinta Angustia | 1 | `F04` + `F09` | cerrados | `F17` | 2/2 identificadas | misterio de capilla |
| Santiago | 1 | `F05` + `F09` | cerrados | `F18` | 2/2 identificadas | — |
| Nuestro Padre | 1 | `F02` + `F09` | cerrados | `F19` | 2/2 de capilla | Pastora fuera del cortejo |
| Humildad | 2 | `F06` + `F10` | Borriquita + dos pasos del Viernes Santo | `F24` + `F21` | 2/3 identificadas | una corporación, dos Salidas |
| Santo Entierro | 1 | `F08` + `F09` | cerrado con 1 relación de imagen bloqueada | `F22` | 1/1 identificada; cruz de guía de capilla | — |

## 4. Deuda probatoria cuantificada

| Deuda | Filas afectadas | Regla de desbloqueo |
|---|---:|---|
| Celebración penitencial | **0; 11/11 cerradas** | `CAR-F13`–`CAR-F24` |
| Itinerarios históricos | 0 para inventario; 11 fuera de alcance editorial | `CAR-F10`; nunca agenda futura |
| Paso servita de septiembre | 1 relación | fuente que pruebe si reutiliza las andas de marzo |
| Participaciones de Imagen | 3 relaciones | prueba específica de San Juan de Esperanza, San Juan de Humildad y María Magdalena |
| Música penitencial | **3 de 18 posiciones** | Servitas marzo, Desamparados y misterio de Humildad |
| Fuente cargada sin URL | 1 Fuente | reemplazar o complementar con `CAR-F26` solo tras autorización |
| Salida septiembre `announced` | 1 | evidencia posterior independiente |

## 5. Riesgos de duplicación

1. **Esperanza:** una corporación y dos Salidas; no crear Desamparados como hermandad.
2. **Humildad:** una corporación y dos Salidas; no crear La Borriquita como hermandad.
3. **Servitas:** una corporación para marzo y septiembre; la Salida existente se enlaza, no se recrea.
4. **Amargura:** Señor de la Amargura y Cristo de San Felipe son dos tallas, no alias.
5. **Bandas:** los homónimos exigen municipio y UUID; no conciliar por nombre incompleto.
6. **Sedes:** no reutilizar templos homónimos de otros municipios.

## 6. Puerta siguiente

La evidencia posterior queda cerrada para las **11 Salidas penitenciales**. La guía municipal eleva la estructura a 18 Pasos y permite resolver 15 de 18 posiciones musicales; las tres restantes permanecen `BLOCKED`. La trazabilidad del anuncio servita de septiembre está recuperada, pero su ejecución y su posible Paso compartido siguen sin prueba posterior.

La primera edición queda congelada en documentación. No se autorizan staging, manifiesto de datos, SQL, dry-run, Apply ni publicación.
