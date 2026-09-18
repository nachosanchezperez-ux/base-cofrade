# Certificación · Cantillana · tercer macrolote municipal HC-016

**Fecha:** 17 de septiembre de 2026

**HEAD inicial del trabajo:** `b4571ed60ebce91bc40b57437902d57a130e51e8`

**HEAD reconciliado antes de integrar:** `b1213e9b0321e5220443590a12ca83be8f06704f`

**Lote:** `c0160030-0000-4000-8000-000000000001`

**Municipio:** Cantillana  
**Esquema:** sin cambios; DML exclusivamente

## Preflight estricto

- El trabajo arrancó en `b4571ed60ebce91bc40b57437902d57a130e51e8` y se reconcilió con `b1213e9b0321e5220443590a12ca83be8f06704f` después de las integraciones concurrentes #820 y #821.
- Producción estaba `READY` mediante `dpl_CGmMqKJJL3Zikd3GEAvTYb6SV8fJ`, exactamente sobre `b1213e9b0321e5220443590a12ca83be8f06704f`.
- GitHub devolvía 0 PR abiertas después de esas integraciones.
- Supabase `Hilocofrade` estaba `ACTIVE_HEALTHY`.
- Gerena, Dos Hermanas, Alcalá de Guadaíra y Pilas se preservaron como municipios cerrados.
- #492 permanecía cerrada. No se ejecutó DDL ni se modificó RLS.

## Universo cerrado

### Preservar

- Asunción de Cantillana, ya desarrollada.
- Divina Pastora de Cantillana, incluidos patrimonio, Salidas, Banda y Cruceta HC-019.
- Banda de Música de Nuestra Señora de la Soledad, su ficha municipal y el periodo musical vigente.
- Santuario de Nuestra Señora de la Soledad y paso de palio ya existentes.

### Completar

- Hermandad de la Soledad: tipología, titulares, Pasos, Cultos, estación de 2026, música y trazabilidad.
- Paso de palio y relación Hermandad–Paso, que existían en `review`/`draft`.
- Periodo musical local, vinculándolo al paso de palio sin inferir vigencia para 2027.

### Crear

- Cuatro imágenes: Cristo Yacente, Nuestra Señora de la Soledad Coronada, San Juan Evangelista y Santa María Magdalena.
- Dos Pasos nuevos: Santo Sepulcro y Calvario; el palio se reutiliza.
- Juan de Santamaría como agente documentado por el contrato histórico de 1583.
- Siete Cultos y siete ediciones de 2026.
- Serie anual y estación de penitencia celebrada el 3 de abril de 2026.
- Dos posiciones musicales: Banda local tras el palio y Montefrío como crédito textual sin crear una Banda ambigua.

### No entra

- Una ficha de Banda para Montefrío: las fuentes no resuelven de forma inequívoca identidad canónica ni posición exacta.
- Fotografías, escudo o multimedia sin licencia verificable.
- Patrimonio exhaustivo sin Fuente directa suficiente.
- Convocatorias de 2027 deducidas por recurrencia.
- Eventos paralelos que dupliquen un Culto o una Salida ya modelados.

## Composición HC-016

| Concepto | Total |
|---|---:|
| Operaciones editoriales | 93 |
| Insert / upsert | 88 |
| Update | 5 |
| Reuse canónico | 7 |
| Fuentes nuevas | 6 |
| Enlaces de Fuente | 27 |
| Imágenes | 4 |
| Pasos | 3, uno reutilizado |
| Cultos / ediciones | 7 / 7 |
| Salidas | 1 |
| Posiciones / asignaciones musicales | 2 / 2 |

## Preflight y Apply

Secuencia ejecutada: `CARGA → STAGING → PREFLIGHT GLOBAL → REVISIÓN → APPLY → RESULTADOS`.

- Staging: 93/93.
- Válidas: 93/93.
- Inválidas: 0.
- Referencias sin resolver: 0.
- Ambigüedades aplicadas: 0.
- Colisiones de `slug` o URL: 0.
- Fallos: 0.
- Apply: 93/93.
- Reaplicación idempotente: correcta.

La única incidencia del diagnóstico fue una consulta de control que buscó inicialmente el santuario en `entities`; repetida sobre `places`, confirmó correctamente las cinco reutilizaciones nucleares. No afectó al lote ni produjo escrituras editoriales.

## Actualidad estricta

- La estación del Viernes Santo figura `held`: la crónica del 6 de abril acredita su celebración y la presencia de Sepulcro, Calvario y palio.
- Septenario y besamanos figuran `held` por evidencia posterior de marzo.
- Función al Yacente, veneración, Descendimiento, Función Principal y celebración pascual conservan `announced`: el programa acredita convocatoria, no celebración.
- No se modifica en bloque ninguno de los 112 acontecimientos pasados globales que permanecen legítimamente `announced`.
- Ningún dato de 2027 se presenta como vigente en 2026.

## QA de datos y grafo

- 3 Hermandades públicas de Cantillana, preservadas como identidades separadas.
- 1 Banda local pública y reutilizada.
- Soledad: 4 imágenes, 3 Pasos, 7 Cultos, 7 ediciones, 1 Salida y 2 asignaciones musicales.
- 1 Salida `held`, 2 ediciones cultuales `held` y 5 `announced`.
- 0 slugs duplicados.
- 0 perfiles nuevos sin subtipo.
- 0 entidades nuevas en estado no público.
- 0 contaminación entre Soledad, Asunción y Pastora.
- 0 eventos paralelos creados para duplicar Agenda.

## Fuentes principales

- [Programa de Cuaresma y Semana Santa de Cantillana 2026](https://drive.google.com/file/d/1npeoMWaU1xox46apKEOOlKwk__QXKjc-/view)
- [Passio Naevensis · marzo de 2026](https://passionaevensis.blogspot.com/2026/03/)
- [Passio Naevensis · abril de 2026](https://passionaevensis.blogspot.com/2026/04/)
- [Hermandad de la Soledad · Viernes Santo](https://soledadcantillana.blogspot.com/2009/11/viernes-santo.html)
- [Hermandad de la Soledad · Paso del Calvario](https://soledadcantillana.blogspot.com/2009/11/paso-del-calvario.html)
- [Archidiócesis de Sevilla · La Soledad de Cantillana y su ermita (II)](https://www.archisevilla.org/la-soledad-de-cantillana-y-su-ermita-ii/)

## Deuda legítima restante

- Identidad completa y posición procesional de la formación citada como «Montefrío».
- Fotografías y escudo con licencia apta para publicación.
- Patrimonio no respaldado por una Fuente directa suficiente.
- Celebración efectiva de cinco convocatorias cultuales de 2026 todavía sin evidencia posterior.
- Agenda futura, conciertos e igualás sin convocatoria vigente verificable.

## Observación de Auditor

1. Cantillana estaba menos incompleta de lo que sugería el recuento bruto: Asunción, Pastora, Banda y Cruceta ya estaban cerradas; la deuda nuclear se concentraba en la Soledad.
2. Los falsos pendientes principales eran exigir multimedia, patrimonio exhaustivo y una ficha musical no desambiguada.
3. Se reutilizaron la Hermandad, el santuario, el palio, la Banda local, su periodo musical y las estructuras municipales comunes.
4. La deuda legítima restante es visual, documental o temporal y no impide el cierre.
5. El modelo soportó tres pasos, Cultos fechados, salida celebrada y música parcialmente textual sin DDL ni excepciones territoriales.
6. No apareció un problema transversal que merezca abrir arquitectura nueva.
7. Coria del Río es la única recomendación para el siguiente recálculo; no queda activada por esta certificación.

## Cierre técnico

La PR, el SHA final, el deployment exacto y los errores posteriores forman parte del postflight de integración y del entregable final, porque no pueden conocerse antes del commit que contiene esta certificación. Cantillana solo se declara **MUNICIPIO CERRADO** cuando la suite, CI, Supabase Preview y Vercel estén correctos, `main` y producción coincidan y GitHub vuelva a 0 PR abiertas.

## Revalidación sobre main vigente · 18 de septiembre de 2026

- La rama histórica de #822 partía de `b1213e9b0321e5220443590a12ca83be8f06704f`.
- Antes de la integración final se reconstruye sobre `bf0db88e47b705ed3df3febf27b5d376f93c1aca`, después de reconciliar el historial de migraciones de Supabase en #846.
- El lote HC-016 de Cantillana **no se reaplica**: las 93/93 operaciones ya ejecutadas se preservan y la validación final es de datos, grafo, tests y previews.
- Los checks del 17 de septiembre quedan expresamente invalidados como certificación final; la rama reconstruida exige CI, Vercel Preview y Supabase Preview nuevos.
- No se introduce DDL, RLS ni ninguna excepción territorial para Cantillana.
