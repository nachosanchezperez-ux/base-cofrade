# HC-001 · Enciclopedia relacional

**Estado:** IMPLEMENTADA / VIGENTE  
**Ámbito:** arquitectura de producto y conocimiento

## Decisión

Hilo Cofrade es una **enciclopedia relacional**, no una colección de fichas aisladas ni un conjunto de artículos independientes.

Hermandades, Imágenes, Pasos, Bandas, Marchas, Personas/Agentes, Acontecimientos, Advocaciones, Lugares y bienes patrimoniales se modelan como nodos independientes cuando tienen identidad propia. Sus conexiones se almacenan como relaciones estructuradas y documentadas.

## Reglas

- No duplicar una entidad para poder mostrarla en dos contextos.
- No degradar a texto libre una relación que ya tiene un nodo canónico.
- Cada ficha pública representa una entidad; el contexto procede de sus relaciones.
- La navegación debe permitir recorrer el grafo mediante directorios, fichas enlazadas y Tira del hilo.
- Las relaciones temporales conservan vigencia e histórico conforme a HC-005.
- Una relación solo se afirma cuando existe de forma explícita o puede derivarse de un recorrido canónico previamente validado.

## Implementación vigente

La arquitectura actual dispone de entidades tipadas, relaciones canónicas, directorios conectados, fichas relacionales y Tira del hilo. La incorporación futura de nuevos tipos de ficha pública no reabre HC-001 mientras reutilice el grafo existente.

## Regla de no regresión

No crear tablas, JSON locales, mapas por `slug` o modelos paralelos para representar una realidad que ya existe como entidad o relación canónica.