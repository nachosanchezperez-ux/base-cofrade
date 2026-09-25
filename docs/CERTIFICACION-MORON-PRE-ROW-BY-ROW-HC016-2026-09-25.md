# Certificación previa al row-by-row · Morón de la Frontera · HC-016

**Fecha:** 25 de septiembre de 2026  
**Base de reconciliación:** `800d1a80962ec6b53f555c3b8487734f25b22388`  
**Alcance:** identidad y modelo documental · sin escrituras de datos

## Preflight vivo

- GitHub: `main = 800d1a80962ec6b53f555c3b8487734f25b22388` al reconciliar #953.
- Vercel: el deployment productivo del SHA base estaba en despliegue durante la reconciliación; la puerta técnica exige READY antes del merge.
- Supabase: ACTIVE_HEALTHY.
- Migraciones estructurales activas: 17.
- Carmona: cerrada.
- Écija: cerrada.
- #955: cerrada como superseded; su corrección ya existe en main.
- #931: conserva deuda técnica independiente; no bloquea Morón y no se declara obsoleta.
- HC-AUTO-03: bloqueado.

## Certificación del modelo

| Dominio | Cierre |
|---|---|
| Municipio | 1 INSERT futuro; no existe REUSE |
| Hermandades | 10 INSERT |
| Salidas | 10 INSERT históricas 2026 · held-ready |
| Pasos | 18 INSERT |
| Imágenes | 35 INSERT + 2 figuras secundarias sin identidad individual |
| Lugares | 8 INSERT |
| Música de Paso | 18/18 con evidencia 2026 |
| Bandas de Paso | 4 REUSE + 9 INSERT |
| Posición extra | Jesús · Cruz de Guía · formación juvenil · INSERT futuro |
| Ars Sacra | histórica; NO RELACIONAR 2026 |

## Auditoría

- No hay nodo municipal de Morón ni variante ortográfica.
- No hay Hermandades, Pasos, Lugares o Salidas de Morón preexistentes.
- Los homónimos de otros municipios quedan excluidos de REUSE.
- Los únicos `moron` textuales del grafo ajenos al municipio son apellidos de agentes/autores y slugs asociados.
- Las 18 posiciones musicales distinguen EJECUTADA de ANUNCIADA 2026; no se convierte anuncio en ejecución.
- El modelo de posición musical reutiliza `mystery`, `palio` y `cross_guide`, sin taxonomía especial de Morón.
- `participation_mode = unspecified` se conserva cuando la Fuente no delimita el recorrido.
- El recuento físico de 37 figuras se mantiene, pero dos sanedritas no reciben nodos inventados.

## Deuda no bloqueante

- 2 sanedritas sin identidad individual.
- multimedia y escudos sin derechos.
- relaciones musicales históricas sin prueba 2026.
- prueba posterior de ejecución no localizada para varias posiciones que sí tienen anuncio 2026 específico.

## Resultado

**MODELO DOCUMENTAL CERRADO.**

Esta certificación no autoriza staging, SQL, dry-run, Apply ni creación material de nodos.
