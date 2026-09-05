# Hilo Cofrade · Estado canónico

**Corte validado:** 5 de septiembre de 2026  
**Base de sincronización:** `main = fc63f4f10c126755d07af53ce4bdfcdd2caed038` · #619 ya integrada junto al merge concurrente #620  
**Régimen:** `FIRST EDITION FREEZE` activo  
**Fase:** editorial / documental sobre el modelo vigente  
**Frente editorial activo:** ninguno

## Dónde estamos ahora

La Primera Edición permanece cerrada, certificada y congelada. No existe bloqueo editorial general ni una Hermandad abierta en trabajo.

En la revalidación de este corte:

- GitHub: `main = fc63f4f10c126755d07af53ce4bdfcdd2caed038`;
- #619 sincronizó el estado canónico anterior;
- #620 entró de forma concurrente y aplica a Cuatrovitas una paleta verde, blanco y dorado mediante DML sobre el modelo existente;
- Vercel producción: `READY` sobre `fc63f4f`;
- Supabase producción: operativa;
- #492: abierta y aislada;
- FIRST EDITION FREEZE: activo.

El SHA que resulte de fusionar este ajuste documental pasa a ser el nuevo HEAD de referencia sin cambiar el estado funcional descrito aquí.

## Cierres documentales vigentes

No deben reabrirse por deuda legítima, mejoras cosméticas o por perseguir un 100 % técnico:

- Amparo;
- San Esteban;
- La Sed;
- Virgen del Castillo de Lebrija · actualidad de septiembre de 2026;
- Estrella de Coria;
- La Trinidad;
- Consolación de Carrión de los Céspedes;
- Mercedes de Mairena del Aljarafe;
- Dulce Nombre de Bellavista;
- Pino Montano;
- Vera Cruz y Encarnación de Aznalcázar;
- Hermandad Sacramental de Tomares;
- Nuestra Señora de los Reyes · Sastres;
- Hermandad Mayor de Nuestra Señora de Setefilla;
- Hermandad Sacramental de Camas;
- Nuestra Señora de la Luz de San Esteban;
- El Cerro del Águila.

Solo procede reabrir una ficha certificada ante una regresión real o información nueva verificable que cambie materialmente su estado.

## Estado posterior a Tomares

### Sastres · #607 + #608

86 % técnico. Sede, titular, paso, cultos, salidas, patrimonio, acontecimientos y Fuentes estructurados. Las Cigarreras queda vigente en 2026 con continuidad desde 2024. Escudo/media y detalles no publicados permanecen como deuda legítima.

### Hermandad Sacramental de Camas · #609–#613

#613 prevalece sobre el cierre inicial #609. La ficha canónica representa **Penitencia + Sacramental + Gloria**, con Jueves Santo, Corpus y Gloria separados; Gran Poder, Dolores Coronada y San Sebastián; 3 pasos; 12 cultos; salidas y música 2026; hitos históricos y paleta burdeos/dorado/negro/blanco. Completitud técnica: 100 %.

#610 corrigió la búsqueda del Panel y #611 retiró el placeholder duplicado que provocaba 404, conservando Cruz Roja como histórica.

### Setefilla · #612

93 % técnico considerado cierre completo para su idiosincrasia. Santuario, Asunción y Casa de la Virgen están diferenciados; Romería anual e Idas/Venidas son series distintas; Venida 2022 e Ida 2024 están estructuradas. La ausencia de música no constituye deuda automática.

### Nuestra Señora de la Luz de San Esteban · #614

21 % → 86 %. Identidad, sede, titular, paso, cultos y procesión 2026 estructurados. Las Cigarreras solo se acredita en 2025; no se extrapola a 2026. Escudo y música 2026 específica permanecen como deuda legítima.

### El Cerro del Águila · #615–#618

93 % técnico. Penitencia + Sacramental + Gloria; 3 titulares; 3 pasos; 8 cultos; 6 salidas; música actual 2026; 5 hitos. La misión/Rosario del 06/09/2026 reutiliza la guía existente. Nazareno de Huelva queda histórico 2019–2026 y no vigente para 2027. #616 y #618 cierran la fotografía principal del Rosario 2026.

## Reglas transversales ya vigentes

- #580 · huecos secundarios transparentes no fuerzan `noindex`;
- #584 · histórico musical estructurado visible;
- #587 · fotografías de Salidas Panel → ficha pública;
- #589 · Fuentes heredadas acotadas al contexto real;
- #594 · Vía Crucis de las Cofradías como relación reutilizable;
- #595–#596 · contraste común estable;
- #597–#599 + #603 · directorios ordenados por territorio, naturaleza, jornada/mes y estilo;
- #604 · nombre oficial completo en móvil;
- #606 · contratos futuros excluidos de la actualidad hasta su fecha efectiva;
- #610 · búsqueda de Hermandades por nombre corto, popular, oficial y localidad;
- #617 · `Vestidor actual` como relación `agent → dresser_of → image`, editable desde Panel, con conservación de histórico y visualización pública;
- #620 · paleta de Cuatrovitas: verde, blanco y dorado.

No se admiten excepciones por slug para ocultar problemas comunes.

## Vestidores

Relaciones actuales cargadas sobre el modelo vigente:

- Francisco Carrera Iglesias «Paquili» → Nuestra Señora de los Dolores del Cerro;
- José Antonio Grande de León → Piedad y Caridad del Baratillo, Dolores y Misericordia de Jesús Despojado y Amor de Pino Montano;
- Leandro González Ruiz → Encarnación de San Benito;
- Antonio Sanabria Vázquez → Guadalupe y Mayor Dolor de Las Aguas.

La relación Leandro González Ruiz → María Santísima de la Estrella de Sevilla permanece `draft`, igual que la Imagen y su Hermandad, y no constituye frente abierto ni contenido publicado.

## #492

**#492 · Reconciliar Supabase Preview Branches → ABIERTA Y AISLADA.**

Bloquea únicamente:

- nuevo DDL;
- nuevas tablas;
- migraciones estructurales;
- cambios RLS relacionados.

No bloquea contenido/DML editorial, Hermandades, titulares, pasos, música, patrimonio, agentes, cultos, salidas, acontecimientos, Fuentes, media soportada, relaciones existentes ni SEO editorial.

No debe resolverse reescribiendo migraciones históricas ya aplicadas ni alterando producción por un problema exclusivo de preview.

## Bloqueos y criterio editorial

Los límites reales son FIRST EDITION FREEZE, #492 para estructura/RLS, actualidad estricta 2026/2027, trazabilidad de Fuentes/media y la obligación de no inventar datos para elevar completitud.

Una ausencia debe clasificarse como deuda real, no aplicable, dato todavía no publicado, pendiente de verificar o hueco legítimo.

## Siguiente movimiento autorizado

1. Recalcular la deuda documental de todas las Hermandades publicadas.
2. Generar un TOP 3 por oportunidad real, no solo porcentaje.
3. Elegir UNA sola Hermandad.
4. Diagnosticarla antes de modificar datos.
5. Cerrar exclusivamente con evidencia verificable y sin nuevo modelo.
6. Ejecutar QA, PR, merge y producción.
7. Actualizar de nuevo este estado con el cierre final y confirmar 0 PR abiertas.
