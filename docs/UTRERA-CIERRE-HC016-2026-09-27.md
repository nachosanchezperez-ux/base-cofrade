# Utrera · cierre del undécimo macrolote municipal HC-016

Fecha: 27 de septiembre de 2026.

## Resultado

**CERRADO Y CERTIFICADO.**

Utrera queda aplicada en producción y supera el QA estructural, público y SEO posterior al Apply.

## Identidad del lote

- PR: #1009
- import_id: `c0160038-0000-4000-8000-000000000001`
- main al Apply: `ddeec5d250ac29b9ed89cb1488fae64269d4750d`
- head reconciliado al Apply: `bad8998eba7719096ddb04d8e6b027403eb0322e`
- SQL SHA256: `a9c629b3e822116821fbb6c6e629fe51da919cd16f2a44f1ef9f97607988f6a3`
- manifiesto SHA256: `cbd9df1abd9654fd19894f48e4300aa4d986b4833ea1efb827d5bacc007f82ae`
- checksum lógico staged: `8055a1cdf70c9744c1db92144a169c1b`

## Apply

Resultado real:

`APPLY_UTRERA_SQL_OK_COMMITTED`

- 1.173 operaciones
- 1.166 INSERT
- 7 UPDATE
- 0 DELETE
- 33 REUSE
- 1.173 applied
- 0 failed
- staging `completed`

El Apply utilizó el candidato staged certificado y se ejecutó en una sola transacción con guards de deriva, claves naturales, filas fuera de scope, tipos y constraints inmediatas.

## QA estructural post-Apply

PASS:

- 1.173/1.173 filas objetivo encontradas.
- 1.173/1.173 filas contienen el payload esperado.
- 0 filas ausentes.
- 0 mismatches.
- 19/19 tablas con los conteos previstos.
- 7/7 UPDATE materializados correctamente.
- held = 7.
- announced = 13.
- Morón permanece `completed 504/504`.
- HC-AUTO-03 permanece `ready 55/55 · 0 applied`.

## Contrato editorial

Las cuatro exclusiones se preservan:

- H17 · Marismas de Pinzón → `review`
- I44 · Nuestro Padre Jesús Resucitado → `review`
- I45 · María Santísima de la Estrella → `review`
- S25 · Paso de Jesús Resucitado → `review`

No se fabricó publicación, relación ni indexación independiente para ellas.

## QA HTTP

Producción: `dpl_Dy24sqC17Zo8H2r1NRMsKU69SHJt` · READY.

- 16/16 Hermandades públicas de Utrera: HTTP 200 + `index, follow`.
- Hub `/hermandades/localidad/utrera`: HTTP 200 + `index, follow`.
- 9/9 Bandas nuevas: HTTP 200; `noindex, follow` según el contrato de indexabilidad vigente.
- Muestra de Imágenes: 5/5 HTTP 200 + `index, follow`.
- Muestra de Pasos: 5/5 HTTP 200 + `index, follow`.
- H17/I44/I45/S25: 4/4 HTTP 404 + `noindex`.
- Runtime inspeccionado: deployment READY y 0 runtime errors en la ventana posterior al Apply.

## QA de sitemaps tras revalidación

Los caches internos terminaron de revalidar después del Apply.

Comprobación determinista manifiesto ↔ sitemap:

- Hermandades: **16/16** entidades públicas del candidato presentes.
- Imágenes: **45/45** entidades públicas del candidato presentes.
- Pasos: **24/24** entidades públicas del candidato presentes.
- H17: ausente del sitemap.
- I44: ausente del sitemap.
- I45: ausente del sitemap.
- S25: ausente del sitemap.

Conteos observados de URLs relacionadas con Utrera, incluyendo hubs y patrimonio previo ajeno al candidato:

- sitemap Hermandades: 17 URLs de Utrera.
- sitemap Imágenes: 47 URLs de Utrera.
- sitemap Pasos: 27 URLs de Utrera.

La diferencia entre esos conteos y 16/45/24 responde a hubs territoriales y patrimonio previo existente; la cobertura exacta del candidato se comprobó por slug.

## QA de código

Sobre la rama reconciliada antes del Apply:

- CI GitHub: SUCCESS.
- suite: 1.371/1.371.
- TypeScript: PASS.
- Next build: PASS.
- diff-check equivalente: PASS.
- Preview Vercel: READY.

## Cierre

No queda bloqueo técnico, editorial o SEO del macrolote.

Utrera pasa de:

`APPLY COMMITTED · QA PASS · sitemap refresh pending`

a:

`CERRADO Y CERTIFICADO`

No reabrir el DML de Utrera sin una nueva orden y nueva evidencia de deriva. No mezclar HC-AUTO-03 con este cierre. El siguiente municipio, si se ordena, debe partir de un nuevo recálculo provincial.
