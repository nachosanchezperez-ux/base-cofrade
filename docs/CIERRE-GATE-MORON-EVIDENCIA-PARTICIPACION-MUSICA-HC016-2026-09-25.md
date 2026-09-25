# Morón de la Frontera · cierre de modelo previo al row-by-row · HC-016

**Fecha:** 25 de septiembre de 2026  
**Base reconciliada:** `800d1a80962ec6b53f555c3b8487734f25b22388`  
**Estado:** MODELO DOCUMENTAL CERRADO · 0 DML · 0 staging · 0 SQL · 0 dry-run · 0 Apply  
**HC-AUTO-03:** BLOQUEADO

## Resultado determinista

| Familia | Resultado |
|---|---|
| Municipio | **INSERT futuro** · 1 nodo canónico |
| Hermandades | **10 INSERT** |
| Salidas históricas 2026 | **10 INSERT · held-ready** |
| Pasos | **18 INSERT** |
| Figuras físicas | **37 inventariadas** |
| Imágenes canónicas | **35 INSERT** |
| Figuras sin identidad individual | **2 sanedritas · NULL legítimo** |
| Lugares | **8 INSERT** |
| Música de Paso | **18/18 con evidencia 2026** |
| Bandas de Paso | **4 REUSE + 9 INSERT** |
| Música extra | Jesús · Cruz de Guía · **1 INSERT de formación juvenil** |
| Ars Sacra | **HISTÓRICA · NO RELACIONAR 2026** |

## Municipio

La auditoría directa de `public.municipalities` no encuentra `Morón de la Frontera`, `Morón`, variante sin tilde ni slug equivalente. Tampoco hay Hermandades, Lugares, Pasos o Salidas de Morón ocultos en producción.

Los únicos textos `moron` del grafo corresponden a apellidos de autores/agentes o slugs derivados de ellos.

**Decisión:** INSERT futuro único `moron-de-la-frontera`. No se crea UUID en esta puerta.

## Universo

Se preservan:

- 10 Hermandades;
- 10 Salidas 2026;
- 18 Pasos;
- 8 sedes;
- 37 figuras procesionales físicamente documentadas.

La única refinación de modelado afecta a dos figuras secundarias: el Consejo identifica colectivamente «Poncio Pilato y dos sanedritas», sin nombre individual para cada sanedrita. Por ello se materializan 35 Imágenes y se conservan 2 figuras como deuda documental legítima, sin fabricar identidades.

## Música

Las 18 posiciones de Paso están cerradas con evidencia 2026. Se distingue:

- **EJECUTADA**: existe evidencia posterior o retrospectiva suficiente de esa formación;
- **ANUNCIADA 2026**: existe una Fuente específica de 2026, pero no se eleva artificialmente a ejecución;
- **HISTÓRICA**: relación de otro ejercicio;
- **SIN EVIDENCIA**: no modelar como vigente.

No hay ninguna de las 18 posiciones de Paso en HISTÓRICA o SIN EVIDENCIA.

### REUSE

- Nazareno de Arahal · `0efc10f7-ca6e-4c8e-8d94-be35db689a7b`;
- Vera Cruz de Campillos · `c0160032-0407-4000-8000-000000000007`;
- Asociación Musical de La Algaba · `aa0f526c-2b63-41f0-aa74-ecaa14365375`;
- Capilla Musical Dulce Nombre · `7d0aa85b-b657-4ca2-9846-1dc4f8f11c74`.

### INSERT

- Banda Municipal de Música de Morón;
- El Amarrado de Ávila;
- Coronación de Espinas de Córdoba;
- Redentoris Mundi;
- AM Ntro. Padre Jesús Nazareno de la Fuensanta;
- Banda de Música de El Saucejo;
- Sayones de Pozoblanco;
- BM Municipal Gailín de Puerto Serrano;
- Banda de Música de El Campillo.

### Música no asociada a Paso

Diario de Morón documenta el 3 de abril de 2026 una formación juvenil de la Fuensanta en Cruz de Guía de Jesús. No existe nodo ni alias en Supabase: **INSERT futuro**, posición `cross_guide`, `step_entity_id = NULL`.

Ars Sacra existe como nodo, pero la prueba localizada para la Cruz de Guía de la Soledad es histórica y no 2026: **NO RELACIONAR**.

## Modelo de participación

Se usa la taxonomía real ya presente en producción:

- `mystery`;
- `palio`;
- `cross_guide`;
- `participation_mode = unspecified` por defecto si la Fuente no demuestra tramo o ruta completa.

No se crean códigos nominales nuevos para Morón.

## Duplicidades y homónimos

La auditoría detecta numerosos homónimos en otros municipios —Borriquita, Cautivo, Calvario, Santa Cruz, Jesús/Nazareno, Santo Entierro, Soledad, San José, San Ignacio, María Auxiliadora y otros—, pero ninguno es un nodo de Morón.

**Resultado:** 0 REUSE territoriales indebidos; 0 duplicados Morón preexistentes.

## Deuda legítima

- dos sanedritas sin identidad individual canónica;
- multimedia/escudos sin licencia no se fabrican;
- Ars Sacra no se vincula a 2026;
- ejecución posterior no demostrada de las posiciones marcadas solo como ANUNCIADA 2026.

Ninguna de estas deudas bloquea identidad, Paso, Salida, sede, municipio ni formación vigente documentable.

## Puerta

**MORÓN DE LA FRONTERA · MODELO CERRADO.**

La integración de esta documentación no autoriza datos. La siguiente orden debe limitarse a:

**PLAN ROW-BY-ROW → MANIFIESTO DETERMINISTA → PREFLIGHT SQL DE MORÓN.**

Prohibido en esta puerta: staging · payload SQL · dry-run · Apply · creación del municipio.
