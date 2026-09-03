# Hilo Cofrade · Certificación de actualidad · Virgen del Castillo de Lebrija

**Corte:** 3 de septiembre de 2026  
**Lote:** deuda editorial de actualidad  
**Resultado:** 🟢 CERRADO · SIN BLOQUEOS RELACIONALES  
**Régimen:** `FIRST EDITION FREEZE` activo

## Alcance

Este cierre resuelve exclusivamente la deuda temporal de septiembre de 2026 detectada en la ficha de la Hermandad del Castillo de Lebrija. No constituye una certificación enciclopédica completa de todos sus bloques históricos y patrimoniales.

No se ha introducido DDL, nuevas tablas, nuevos enums, RLS, arquitectura ni UX específica.

## Situación canónica y temporal

- Sede canónica / histórica: **Ermita de Nuestra Señora del Castillo**, Lebrija.
- Ubicación temporal de la imagen en septiembre de 2026: **Convento de la Purísima Concepción**.
- Motivo: las obras de Santa María de la Oliva obligan a suspender el traslado previsto para el 6 de septiembre de 2026.
- La excepción de 2026 se conserva como acontecimiento y ubicación temporal; no sustituye la sede canónica.

## Titular

- **Nuestra Señora del Castillo Coronada** queda publicada y relacionada con la Hermandad.
- Cronología artística conservada con la precisión documental disponible; no se inventa autoría.
- La ubicación actual queda resuelta mediante la relación de localización temporal vigente.

## Cultos 2026

Se estructuran y relacionan:

- Ofrenda floral · 11 de septiembre de 2026.
- Solemne Función · 12 de septiembre de 2026 · 11:00.
- Novena · 13–21 de septiembre de 2026.

Las ocurrencias cuentan con evidencia enlazada.

## Salida procesional

- Fecha: **12 de septiembre de 2026**.
- Hora: **19:00**.
- Carácter: **ordinario / Procesión de Gloria**.
- Origen y destino 2026: Convento de la Purísima Concepción.
- Acompañamiento: **Banda de Música Virgen del Castillo de Lebrija**, tras el paso.
- Recorrido: **no incorporado**; no consta publicado en las fuentes actuales verificadas.

Se corrige el dato anterior de Hilo Cofrade que mantenía las 20:00.

## Identidad cromática

Paleta indicada por Dirección y aplicada sobre el modelo existente:

- Morado · `#5B2C83` · principal.
- Blanco · `#FFFFFF`.
- Dorado · `#C6A15B` · acento.

## Acontecimiento 2026

Se crea y relaciona el acontecimiento **Reorganización temporal de los cultos de la Virgen del Castillo por las obras de Santa María de la Oliva (2026)**.

Relaciones publicadas:

- acontecimiento → Hermandad;
- acontecimiento → Nuestra Señora del Castillo Coronada.

## Fuentes principales

1. Hermandad del Castillo de Lebrija · páginas institucionales de sede, cultos y traslados.
2. Ayuntamiento de Lebrija · recursos patrimoniales sobre la Ermita del Castillo.
3. Ayuntamiento de Lebrija · programa de Feria y Fiestas Patronales 2026, publicado el 17/08/2026; confirma la procesión del 12/09 a las 19:00.
4. El Pespunte Cofrade · 28/08/2026; documenta el cambio temporal motivado por las obras y el acompañamiento musical.

## QA relacional

Resultado de la auditoría final:

- colores publicados: 3;
- titulares publicados: 1;
- ubicaciones actuales del titular: 1;
- acontecimientos: 1;
- relaciones `involves` del acontecimiento: 2;
- cultos: 3;
- ocurrencias 2026: 3;
- enlaces de Fuente a ocurrencias: 4;
- salidas publicadas: 1;
- enlaces de Fuente a la salida: 2;
- posiciones musicales: 1;
- asignaciones musicales: 1;
- Fuente de la asignación musical: 1;
- duplicados de slug de Hermandad: 0;
- duplicados de slug de Imagen: 0;
- duplicados de slug de salida: 0.

**Grafo → 🟢 CLEAN para el alcance de actualidad.**

## QA público

- `/hermandades/castillo-lebrija` → HTTP 200.
- `/procesiones-de-gloria` → HTTP 200; tarjeta de Lebrija muestra `Salida 19:00`.
- `/procesiones-de-gloria/lebrija-castillo-2026-09-12` → HTTP 200.
- La ficha de la procesión muestra Purísima, 19:00, Banda Virgen del Castillo y recorrido pendiente.
- Runtime productivo: 0 `error/fatal` en la comprobación final de una hora.

## Incidencia transversal detectada

Durante el QA se comprobó que las fichas de Hermandad ofrecían `Ver guía` para cualquier salida con slug, aunque no existiera una ficha en el directorio de extraordinarias. Esto producía 404 en salidas ordinarias como Castillo y Amparo.

La reparación se hizo sistémicamente en **#568**:

- el lector valida el slug contra `extraordinary_outings_directory`;
- solo las guías extraordinarias reales generan enlace;
- el slug canónico de la salida permanece intacto;
- no se reclasifican salidas ordinarias;
- no existen excepciones por Hermandad o slug.

`npm ci`, `npm test`, `npm run build` y Vercel quedaron en verde antes del merge.

## Huecos legítimos

- recorrido 2026: pendiente de publicación oficial;
- hora de entrada: pendiente;
- multimedia nueva: no incorporada sin derechos trazables;
- el resto de deuda histórica/patrimonial de la ficha no forma parte de este lote de actualidad.

## Resultado

**VIRGEN DEL CASTILLO · DEUDA DE ACTUALIDAD SEPTIEMBRE 2026 → 🟢 RESUELTA.**
