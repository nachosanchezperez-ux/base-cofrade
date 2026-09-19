# Certificación de selección · Estepa · quinto macrolote municipal HC-016

**Fecha:** 19 de septiembre de 2026  
**Resultado:** **ESTEPA · SELECCIONADA COMO QUINTO MACROLOTE MUNICIPAL HC-016**  
**Apply:** 0  
**Staging:** 0  
**DDL:** 0  
**RLS:** 0

## Certificación

El recálculo provincial se ha realizado desde cero sobre el grafo productivo, después de excluir los cierres municipales certificados y Sevilla capital.

La selección **no procede del ranking histórico** posterior a Cantillana o Coria.

Estepa se selecciona por el mejor equilibrio actual entre:

- deuda material verificable;
- profundidad y estabilidad de Fuentes;
- actualidad 2026;
- valor relacional;
- reutilización de nodos existentes;
- bajo riesgo de duplicidad;
- y ejecutabilidad íntegra mediante HC-016 DML.

No se abre el segundo ni el tercer municipio del TOP.

## Auditor · respuestas

### 1. ¿Cuál es el HEAD real?

Al inicio de la misión:

`256acd63c4ea0ae9e3c2598e40c26850bd7e4efe`

### 2. ¿Hay PR abiertas?

**0** al inicio de la misión.

La documentación de esta selección debe volver a **0 PR** tras su integración.

### 3. ¿Producción y main coinciden?

Sí.

Producción estaba `READY` en `dpl_3vBNWw6BxMJntVbPx5Am22quJjjB`, exactamente sobre el SHA inicial de `main`.

### 4. ¿Supabase está limpio?

Sí.

- `ACTIVE_HEALTHY`;
- 12/12 migraciones;
- sin DDL nuevo;
- sin cambios RLS;
- sin staging creado por esta misión;
- sin Apply editorial.

### 5. ¿Qué municipios quedan realmente cerrados?

- Gerena;
- Dos Hermanas;
- Alcalá de Guadaíra;
- Pilas;
- Cantillana;
- Coria del Río.

Sevilla capital no compite.

### 6. ¿Cuántos municipios compiten de verdad?

**41 municipios** con contenido real en el grafo productivo después de aplicar las exclusiones.

### 7. ¿Cuál es el TOP 3 nuevo?

1. **Estepa**
2. **Osuna**
3. **Utrera**

### 8. ¿Qué municipio gana?

**Estepa**.

### 9. ¿Por qué gana frente al segundo y tercero?

Frente a **Osuna**:
- Estepa tiene un universo municipal más claramente cerrado para el alcance actual: 9 Pasión + 4 Glorias;
- existe una página municipal por cada Hermandad penitencial;
- el programa 2026 documenta música y Pasos;
- mantiene actualidad inmediata el 25 de septiembre y dos Salidas extraordinarias futuras ya modeladas;
- presenta reutilizaciones concretas de nodos ya canónicos.

Osuna tiene Fuentes igualmente excelentes y un cierre penitencial muy atractivo, pero su universo letífico completo exige una delimitación adicional antes de poder cuantificarlo con el mismo grado de precisión.

Frente a **Utrera**:
- Utrera ofrece más actualidad y una red enorme, pero contiene Hermandades multijornada y dos nodos Álvarez Quintero que obligan a una reconciliación previa;
- Estepa tiene menos riesgo de fragmentación y de duplicado;
- Estepa permite cuantificar ya un lote nuclear completo sin resolver primero un frente de identidad musical.

### 10. ¿Cuál es su universo canónico?

**13 corporaciones**:

**Penitencia**
1. Borriquita.
2. Angustias.
3. San Pedro.
4. Estudiantes.
5. Dulce Nombre.
6. Calvario.
7. Paz y Caridad.
8. Jesús Nazareno.
9. Santo Entierro.

**Glorias**
10. Asunción.
11. Remedios.
12. Carmen.
13. Santa Ana.

La Inmaculada no se separa de Paz y Caridad.

### 11. ¿Cuánto mediría aproximadamente el lote?

Estimación pre-staging:

- TOTAL conceptual: **≈395**;
- INSERT: **≈375**;
- UPDATE: **≈6**;
- REUSE: **≈14**;
- margen: ±25 por trazabilidad/autorías/identidad de Bandas externas.

### 12. ¿Qué huecos son legítimos?

- multimedia sin derechos;
- Cultos 2026 sin convocatoria directa;
- Pasos de Glorias sin Fuente física;
- Salidas 2026 de Asunción, Remedios o Carmen sin evidencia suficiente;
- continuidad musical futura no acreditada;
- bandas externas sin identidad canónica global resuelta;
- autorías antiguas ambiguas;
- patrimonio exhaustivo.

### 13. ¿Puede ejecutarse únicamente con DML?

**Sí.**

El modelo actual ya soporta:

- Hermandades;
- Imágenes;
- Pasos;
- Bandas;
- lugares;
- Salidas;
- series;
- música;
- autores;
- acontecimientos;
- Fuentes y trazabilidad.

No se requiere DDL, nueva tabla, cambio RLS ni excepción nominal.

### 14. ¿Está preparado para abrirse como quinto macrolote HC-016?

**Sí, en fase de pre-lote.**

Queda autorizado únicamente:

`preflight específico Estepa → resolver incertidumbres → plan row-by-row → staging futuro`

No queda autorizado por esta certificación:

- Apply;
- sexto municipio;
- HC-018;
- Laboratorio;
- DDL;
- RLS;
- excepciones territoriales.

## Estado final de esta misión

- recálculo desde cero: **completado**;
- municipios cerrados: **excluidos**;
- deuda real: **medida**;
- Fuentes: **auditadas**;
- TOP 5: **cerrado**;
- TOP 3: **cerrado**;
- municipio único: **Estepa**;
- inventario canónico: **cerrado**;
- matriz de Fuentes: **cerrada**;
- mapa de reutilización: **cerrado**;
- lote futuro: **cuantificado**;
- Apply: **0**;
- staging: **0**;
- frente paralelo: **0**.

