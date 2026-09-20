# Matriz de Fuentes · Carmona · octavo macrolote municipal HC-016

**Fecha:** 20 de septiembre de 2026  
**Fase:** MATRIZ CERRADA · sin staging, SQL ni Apply

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
| `CAR-F07` | [Consejo · Amargura](https://consejohermandadescarmona.es/san-felipe/) | A | título, reglas de 1897, titulares e historia | resolver como alias «Cristo de San Felipe»/«Señor de la Amargura» |
| `CAR-F08` | [Consejo · Santo Entierro](https://consejohermandadescarmona.es/hermandad-del-santo-entierro/) | A | título, 1971, titulares, traslados y paso | sede vigente y composición 2026 requieren contraste |
| `CAR-F09` | [Turismo provincial · Semana Santa de Carmona 2026](https://www.turismosevilla.org/es/eventos-y-fiestas/semana-santa-2026-carmona) | B | nueve sujetos, programa, sedes, días, pasos; Desamparados como cortejo de un paso | redacción «nueve hermandades» mezcla ocho hermandades y una orden seglar; fuente previa, no prueba `held` |
| `CAR-F10` | [Turismo Carmona · difusión de Carmona Penitente 2026](https://www.facebook.com/carmonainformacionturistica/posts/1385197720313997/) | B/D | existencia y difusión municipal de la guía 2026 | extraer PDF/edición estable antes de usar itinerarios fila a fila |
| `CAR-F11` | [La Revista Carmona · Carmona Penitente 2026](https://www.larevistacarmona.es/texto-diario/mostrar/5825655/carmona-penitente-guia-imprescindible-semana-santa) | D | descripción de contenido: fechas, itinerarios, estrenos e historia | fuente secundaria; no sustituye el documento ni confirma celebración |
| `CAR-F12` | Fuente existente «Servitas Carmona · publicación oficial en Instagram» | A potencial | Salida de septiembre ya cargada | URL nula y fecha de publicación nula: no utilizable hasta completar procedencia |

## 3. Matriz por sujeto y relación

| Sujeto | Identidad/título | Sede y día 2026 | Titulares | Pasos | Itinerario 2026 | Evidencia `held` | Música | Resultado |
|---|---|---|---|---|---|---|---|---|
| Servitas | `F09`; falta regla/fuente propia | `F09` | `F09`; elevar a propia | `F09` | `F10` pendiente de extracción | pendiente | pendiente | inventariable, no aplicable aún |
| Esperanza | `F01` | `F01` + `F09` | `F01` | `F01` + `F09` | `F10` pendiente | pendiente para ambos cortejos | pendiente | una corporación, dos Salidas |
| Amargura | `F07` | `F07` + `F09` | `F07` | `F07` + `F09` | `F10` pendiente | pendiente | pendiente | resolver alias cristífero |
| Expiración | `F03` | `F03` + `F09` | `F03` | `F03` + `F09` | `F10` pendiente | pendiente | pendiente | separar titulares de cortejo |
| Quinta Angustia | `F04` | `F04` + `F09` | `F04` | `F04` + `F09` | `F10` pendiente | pendiente | pendiente | confirmar sede vigente |
| Santiago | `F05` | `F05` + `F09` | `F05` | `F05` + `F09` | `F10` pendiente | pendiente | pendiente | base estructural suficiente |
| Nuestro Padre | `F02` | `F02` + `F09` | `F02` | `F02` + `F09` | `F10` pendiente | pendiente | pendiente | Pastora fuera del cortejo penitencial salvo prueba |
| Humildad | `F06` | `F06` + `F09` | `F06` | `F06` + `F09` | `F10` pendiente | pendiente | pendiente | confirmar relación actual de San Juan |
| Santo Entierro | `F08` | `F08` + `F09` | `F08` | `F08` + `F09` | `F10` pendiente | pendiente | pendiente | Santa Ana fuera del cortejo salvo prueba |

## 4. Deuda probatoria cuantificada

| Deuda | Filas afectadas | Regla de desbloqueo |
|---|---:|---|
| Confirmación posterior de celebración | 10 Salidas | una fuente C individual o cobertura conjunta inequívoca que enumere los cortejos celebrados |
| Itinerario y horarios históricos | 10 Salidas | guía 2026 estable y contraste con incidencias; nunca agenda futura |
| Denominación canónica de Servitas | 1 corporación | reglas, web o perfil oficial inequívoco |
| Pasos canónicos y relaciones de cortejo | 9 sujetos | fuente A/B por paso y por salida; no inferir por titularidad |
| Acompañamientos musicales | 10 Salidas | anuncio oficial específico y, para `held`, evidencia posterior cuando se modele ejecución real |
| Sedes vigentes | 2 focos principales | confirmar Quinta Angustia y Santo Entierro con programa/fuente propia de 2026 |
| Fuente ya cargada sin URL | 1 Fuente | recuperar URL y fecha o sustituirla por una fuente trazable |
| Salida de septiembre aún `announced` | 1 Salida existente | verificación posterior independiente; fuera de este inventario penitencial |

## 5. Riesgos de duplicación

1. **Esperanza:** un solo nodo corporativo con dos Salidas; no crear «Desamparados» como Hermandad separada.
2. **Servitas:** un solo nodo corporativo para Viernes de Dolores y septiembre; la Salida ya existente debe enlazarse, no recrearse.
3. **Amargura:** «Santísimo Cristo de San Felipe» y «Señor de la Amargura» pueden ser denominaciones del mismo titular; no crear dos Imágenes sin fuente explícita.
4. **Dolores, San Juan, Nazareno, Santo Entierro y Quinta Angustia:** existen numerosos homónimos en Supabase de otros municipios; ningún match nominal aislado es REUSE.
5. **Sedes:** hoy no existe ningún Lugar de Carmona en la base. Deben crearse con municipio y slug municipal, evitando reutilizar templos homónimos.

## 6. Puerta siguiente propuesta

Solo tras nueva orden expresa: obtener la guía 2026 estable, localizar evidencia posterior para las diez Salidas, cerrar Pasos/Bandas/sedes y preparar un plan row-by-row. Hasta entonces no se abrirán staging, SQL, Apply ni PR editorial de datos.
