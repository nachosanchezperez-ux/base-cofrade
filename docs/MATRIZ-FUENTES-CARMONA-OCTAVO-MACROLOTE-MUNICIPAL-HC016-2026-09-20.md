# Matriz de Fuentes · Carmona · octavo macrolote municipal HC-016

**Fecha:** 21 de septiembre de 2026
**Fase:** MATRIZ ACTUALIZADA · evidencia posterior 10/10 cerrada · sin staging, SQL ni Apply

## 1. Jerarquía probatoria

| Nivel | Uso permitido | Fuentes |
|---|---|---|
| A · canónica | Identidad corporativa, título, titulares, historia y descripción patrimonial | Consejo de Hermandades y Cofradías de Carmona; fuente propia de la corporación |
| B · institucional | Programa, sede, día, número de pasos y marco municipal/provincial | Turismo de la Provincia de Sevilla; Ayuntamiento/Turismo de Carmona |
| C · confirmación | Prueba posterior de celebración, incidencias, itinerario realmente ejecutado | Publicación oficial posterior de la corporación, Consejo o Ayuntamiento; retransmisión municipal fechada |
| D · apoyo | Localización de indicios que deben elevarse a A–C | Prensa local, Carmona Penitente, hemeroteca y vídeo secundario |

Una fuente previa acredita un anuncio, no la celebración. Una captura, vídeo o publicación social solo se usará con URL estable, fecha, autor/editor y alcance explícito.

## 2. Registro de Fuentes

| ID | Fuente | Nivel | Cobertura | Limitación |
|---|---|---:|---|---|
| `CAR-F01` | [Consejo · Esperanza](https://consejohermandadescarmona.es/hdaesperanza/) | A | título, 1566, titulares, pasos y segundo cortejo anunciado | no prueba por sí sola que la primera salida de Desamparados se celebrara en 2026 |
| `CAR-F02` | [Consejo · Nuestro Padre](https://consejohermandadescarmona.es/hermandad-de-nuestro-padre/) | A | título, reglas de 1597, titulares y pasos | historia no equivale a programa 2026 |
| `CAR-F03` | [Consejo · Expiración](https://consejohermandadescarmona.es/hermandad-de-la-expiracion/) | A | título, fundación de 1649, titulares y pasos | debe distinguir titulares de cortejo anual |
| `CAR-F04` | [Consejo · Quinta Angustia](https://consejohermandadescarmona.es/quinta-angustia-2/) | A | título, 1607, titulares e historia de sede | sede vigente requiere contraste 2026 |
| `CAR-F05` | [Consejo · Santiago](https://consejohermandadescarmona.es/hermandad-de-santiago/) | A | título, reglas de 1656, titulares y pasos | sin evidencia posterior individual de 2026 |
| `CAR-F06` | [Consejo · Humildad](https://consejohermandadescarmona.es/hermandad-de-la-humildad/) | A | título, origen de 1604, titulares e historia | San Juan y su encaje procesional actual requieren contraste |
| `CAR-F07` | [Consejo · Amargura](https://consejohermandadescarmona.es/san-felipe/) | A | título, reglas de 1897, titulares e historia | prueba que «Cristo de San Felipe» y «Señor de la Amargura» son dos tallas distintas; solo el Señor participa en 2026 |
| `CAR-F08` | [Consejo · Santo Entierro](https://consejohermandadescarmona.es/hermandad-del-santo-entierro/) | A | título, 1971, titulares, traslados y paso | sede vigente y composición 2026 requieren contraste |
| `CAR-F09` | [Turismo provincial · Semana Santa de Carmona 2026](https://www.turismosevilla.org/es/eventos-y-fiestas/semana-santa-2026-carmona) | B | nueve sujetos, programa, sedes, días, pasos; Desamparados como cortejo de un paso | redacción «nueve hermandades» mezcla ocho hermandades y una orden seglar; fuente previa, no prueba `held` |
| `CAR-F10` | [Turismo Carmona · difusión de Carmona Penitente 2026](https://www.facebook.com/carmonainformacionturistica/posts/1385197720313997/) | B/D | existencia y difusión municipal de la guía 2026 | extraer PDF/edición estable antes de usar itinerarios fila a fila |
| `CAR-F11` | [La Revista Carmona · Carmona Penitente 2026](https://www.larevistacarmona.es/texto-diario/mostrar/5825655/carmona-penitente-guia-imprescindible-semana-santa) | D | descripción de contenido: fechas, itinerarios, estrenos e historia | fuente secundaria; no sustituye el documento ni confirma celebración |
| `CAR-F12` | Fuente existente «Servitas Carmona · publicación oficial en Instagram» | A potencial | Salida de septiembre ya cargada | URL nula y fecha de publicación nula: no utilizable hasta completar procedencia |
| `CAR-F13` | [Televisión Carmona · Servitas](https://play.televisioncarmona.com/v/Wb1GQFWIeHX0e5LC2q/SERVITAS-REPORTAJE-TVC//) | C | reportaje posterior de la Salida del Viernes de Dolores | no acredita por sí solo itinerario, música ni participación completa |
| `CAR-F14` | [Televisión Carmona · Esperanza](https://play.televisioncarmona.com/v/zXMfLnWu4r4Dr4azMF/HERMANDAD-DE-LA-ESPERANZA-REPORTAJE-TVC//) | C | reportaje posterior del cortejo de Coronación y Esperanza | no debe confundirse con Desamparados |
| `CAR-F15` | [Televisión Carmona · San Felipe](https://play.televisioncarmona.com/v/qr2hy93oqRTOHdUYOn/HERMANDAD-DE-SAN-FELIPE-REPORTAJE-TVC//) | C | reportaje posterior del cortejo de la Amargura | alias parroquial; conciliar con `CAR-F07` |
| `CAR-F16` | [Televisión Carmona · San Blas](https://play.televisioncarmona.com/v/U8chRcbT3j3uDRFP9H/HERMANDAD-DE-SAN-BLAS-REPORTAJE-TVC//) | C | reportaje posterior del cortejo de la Expiración | alias parroquial; conciliar con `CAR-F03` |
| `CAR-F17` | [Televisión Carmona · Quinta Angustia](https://play.televisioncarmona.com/v/bto3LTLIsgaqKsFfCY/HERMANDAD-DE-LA-QUINTA-ANGUSTIA-REPORTAJE-TVC//) | C | reportaje posterior del Miércoles Santo | no resuelve por sí solo la sede vigente |
| `CAR-F18` | [Televisión Carmona · Santiago](https://play.televisioncarmona.com/v/8R5I6BUGMu2FqEz73k/HERMANDAD-DE-SANTIAGO-REPORTAJE-TVC//) | C | reportaje posterior del cortejo de Columna y Paciencia | completar participación fila a fila |
| `CAR-F19` | [Televisión Carmona · El Silencio](https://play.televisioncarmona.com/v/84jhfcoMZ8YXNuunmL/HERMANDAD-DE-EL-SILENCIO-REPORTAJE-TVC//) | C | reportaje posterior del cortejo de Nuestro Padre | alias local; conciliar con `CAR-F02` |
| `CAR-F20` | [Televisión Carmona · Cristo de los Desamparados](https://play.televisioncarmona.com/v/LwOZnudoEYetI0gXnn/CRISTO-DE-LOS-DESAMPARADOS-REALIZACION//) | C | realización posterior de la primera Salida de Desamparados | pertenece a la única Hermandad de la Esperanza |
| `CAR-F21` | [Televisión Carmona · San Pedro](https://play.televisioncarmona.com/v/Imqv1GlpxvEHKd1B9I/HERMANDAD-DE-SAN-PEDRO-REPORTAJE-TVC//) | C | reportaje posterior del cortejo de Humildad | alias parroquial; conciliar con `CAR-F06` |
| `CAR-F22` | [Televisión Carmona · Santo Entierro](https://play.televisioncarmona.com/v/d4cj4lCGq1gPR3ixCX/HERMANDAD-DEL-SANTO-ENTIERRO-REPORTAJE-TVC//) | C | reportaje posterior del Sábado Santo | no resuelve por sí solo sede o composición |
| `CAR-F23` | [Orden Seglar Siervos de María · web oficial](https://servitascarmona.com/) | A | denominación pública, identidad propia y sede en la Real Iglesia del Salvador | no prueba por sí sola música ni celebración de una Salida concreta |

## 3. Matriz por sujeto y relación

| Sujeto | Identidad/título | Sede y día 2026 | Titulares | Pasos | Itinerario 2026 | Evidencia `held` | Música | Resultado |
|---|---|---|---|---|---|---|---|---|
| Servitas | `F23` + `F09` | `F23` + `F09` | `F23` + `F09` | `F09`; concretado en documento de participación | `F10` pendiente de extracción | `F13` cerrada | parcial | identidad y sede cerradas; una corporación para marzo y septiembre |
| Esperanza | `F01` | `F01` + `F09` | `F01` | `F01` + `F09` | `F10` pendiente | `F14` + `F20` cerradas | pendiente | una corporación, dos Salidas acreditadas |
| Amargura | `F07` | `F07` + `F09` | `F07` | `F07` + `F09` | `F10` pendiente | `F15` cerrada | parcial | dos crucificados distintos; Cristo de San Felipe queda fuera de la Salida 2026 |
| Expiración | `F03` | `F03` + `F09` | `F03` | `F03` + `F09` | `F10` pendiente | `F16` cerrada | pendiente | separar titulares de cortejo |
| Quinta Angustia | `F04` | `F04` + `F09` | `F04` | `F04` + `F09` | `F10` pendiente | `F17` cerrada | pendiente | confirmar sede vigente |
| Santiago | `F05` | `F05` + `F09` | `F05` | `F05` + `F09` | `F10` pendiente | `F18` cerrada | pendiente | base estructural suficiente |
| Nuestro Padre | `F02` | `F02` + `F09` | `F02` | `F02` + `F09` | `F10` pendiente | `F19` cerrada | pendiente | Pastora fuera del cortejo penitencial salvo prueba |
| Humildad | `F06` | `F06` + `F09` | `F06` | `F06` + `F09` | `F10` pendiente | `F21` cerrada | pendiente | confirmar relación actual de San Juan |
| Santo Entierro | `F08` | `F08` + `F09` | `F08` | `F08` + `F09` | `F10` pendiente | `F22` cerrada | pendiente | Santa Ana fuera del cortejo salvo prueba |

## 4. Deuda probatoria cuantificada

| Deuda | Filas afectadas | Regla de desbloqueo |
|---|---:|---|
| Confirmación posterior de celebración | **0 pendientes; 10/10 cerradas** | `CAR-F13`–`CAR-F22`; correspondencia auditada en la evidencia posterior del 21 de septiembre |
| Itinerario y horarios históricos | 10 Salidas | guía 2026 estable y contraste con incidencias; nunca agenda futura |
| Denominación canónica de Servitas | **0 pendientes** | `CAR-F23` fija Orden Seglar de los Siervos de María de Carmona y su sede |
| Pasos canónicos y relaciones de cortejo | 9 sujetos | fuente A/B por paso y por salida; no inferir por titularidad |
| Acompañamientos musicales | 10 Salidas | anuncio oficial específico y, para `held`, evidencia posterior cuando se modele ejecución real |
| Sedes vigentes | 2 focos principales | confirmar Quinta Angustia y Santo Entierro con programa/fuente propia de 2026 |
| Fuente ya cargada sin URL | 1 Fuente | recuperar URL y fecha o sustituirla por una fuente trazable |
| Salida de septiembre aún `announced` | 1 Salida existente | verificación posterior independiente; fuera de este inventario penitencial |

## 5. Riesgos de duplicación

1. **Esperanza:** un solo nodo corporativo con dos Salidas; no crear «Desamparados» como Hermandad separada.
2. **Servitas:** un solo nodo corporativo para Viernes de Dolores y septiembre; la Salida ya existente debe enlazarse, no recrearse.
3. **Amargura:** «Santísimo Cristo de San Felipe» y «Señor de la Amargura» son tallas distintas según `CAR-F07`; crear dos Imágenes titulares, pero enlazar solo al Señor con la Salida de 2026.
4. **Dolores, San Juan, Nazareno, Santo Entierro y Quinta Angustia:** existen numerosos homónimos en Supabase de otros municipios; ningún match nominal aislado es REUSE.
5. **Sedes:** hoy no existe ningún Lugar de Carmona en la base. Deben crearse con municipio y slug municipal, evitando reutilizar templos homónimos.

## 6. Puerta siguiente

La evidencia posterior de las diez Salidas está cerrada. La participación efectiva, los Pasos, las sedes y la normalización de Servitas se desarrollan en el documento de modelado del 21 de septiembre. La música queda parcial y mantiene bloqueada la puerta row-by-row cerrada. Hasta completar esas puertas no se abrirán staging, SQL, Apply ni PR editorial de datos.

La trazabilidad detallada queda en [`EVIDENCIA-POSTERIOR-CARMONA-OCTAVO-MACROLOTE-MUNICIPAL-HC016-2026-09-21.md`](./EVIDENCIA-POSTERIOR-CARMONA-OCTAVO-MACROLOTE-MUNICIPAL-HC016-2026-09-21.md).
