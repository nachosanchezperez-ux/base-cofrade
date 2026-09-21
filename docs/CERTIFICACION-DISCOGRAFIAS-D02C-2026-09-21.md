# Certificación discográfica D-02C

Fecha de certificación: 21 de septiembre de 2026.

## Resultado

| Control | Antes | Después | Estado |
|---|---:|---:|---|
| Ediciones globales | 533 | 551 | Conforme |
| Pistas globales | 3.313 | 3.429 | Conforme |
| Bandas con discografía publicada | 34 | 36 | Conforme |
| Gerena | 0 / 0 | 14 / 73 | Conforme |
| Rosario de Sanlúcar la Mayor | 0 / 0 | 4 / 43 | Conforme |

## Controles ejecutados

- Preflight: las dos entidades canónicas existían, estaban publicadas y no tenían discografía previa.
- Simulación transaccional: `BEGIN` + receta + controles + `ROLLBACK`, con cierre previsto de 551 ediciones y 3.429 pistas.
- Aplicación real: una transacción DML, sin DDL ni cambios de RLS.
- Integridad: 18 ediciones y 116 pistas en el lote, todas publicadas y con carátula.
- Identidad: una sola entidad por formación; los dos perfiles editoriales de Rosario quedan trazados sin crear una banda duplicada.
- Exclusión: el recopilatorio *Partituras de Pasión, Vol. 2* no se carga como edición propia de Rosario.
- Idempotencia: una segunda ejecución dentro de una transacción mantiene 551 ediciones, 3.429 pistas y cinco fuentes canónicas; la transacción se revierte.
- Verificación pública: ambas fichas responden `200`, renderizan «Discografía» y muestran respectivamente *Sangre de Amor Coronada*, *El Costumbrismo en la Música Sacra* y *Angustias Gitana*.
- Alcance: las doce entidades `NO LOCALIZADO` no forman parte de ninguna sentencia del lote.

## Fuentes canónicas

- Gerena: `https://open.spotify.com/artist/0tQhg109ySNXCC0g7Xzivu`.
- Rosario, web oficial: `https://elrosariodesanlucar.com/`.
- Rosario, perfil oficial histórico: `https://open.spotify.com/artist/42adDBkCNRNr3natyIjrNt`.
- Rosario, perfil de catálogo: `https://open.spotify.com/artist/7jpxg8y1TvdhvjFL33EGOr`.
- Rosario, catálogo Apple Music: `https://music.apple.com/us/artist/bm-rosario-sanl%C3%BAcar-la-mayor/1752862642`.

La carga queda certificada en producción y visible en las fichas públicas.
