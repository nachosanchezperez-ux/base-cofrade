# Hilo Cofrade · Estado canónico

**Corte validado:** 5 de septiembre de 2026  
**Último cierre funcional validado:** `main = 3b6ed27018b928b20a045435f32249413e38643a` · #625 integrada  
**Régimen:** `FIRST EDITION FREEZE` activo  
**Fase:** editorial / documental sobre el modelo vigente  
**Frente editorial activo:** ninguno

> La PR que sincronice este documento pasa a ser el nuevo HEAD canónico sin alterar el estado funcional descrito aquí. GitHub, Supabase y Vercel prevalecen siempre sobre cualquier SHA transitorio escrito en documentación.

## Dónde estamos ahora

La Primera Edición permanece cerrada, certificada y congelada. No existe bloqueo editorial general ni una Hermandad abierta en trabajo.

Estado validado antes de esta sincronización final:

- GitHub: `main = 3b6ed27018b928b20a045435f32249413e38643a`;
- PR abiertas: 0;
- último cierre certificado: **Consolación de Utrera · #625**;
- Vercel producción: `READY` exactamente sobre `3b6ed27018b928b20a045435f32249413e38643a`;
- Supabase producción: operativa;
- #492: abierta y aislada;
- FIRST EDITION FREEZE: activo;
- frente editorial activo: ninguno.

## Cierres documentales vigentes

Estas fichas no deben reabrirse por deuda legítima, mejoras cosméticas o por perseguir un 100 % técnico. Solo procede reabrirlas ante una regresión real o nueva información verificable que cambie materialmente su estado.

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
- El Cerro del Águila;
- **Pontificia, Real e Ilustre Hermandad de Nuestra Señora de Consolación Coronada de Utrera**.

## Último cierre certificado · Consolación de Utrera · #625

Completitud técnica de cierre: **30 % → 90 %**.

Quedan estructurados y validados:

- identidad y Santuario canónico;
- titular mariana;
- andas procesionales estrenadas en 2026;
- trono histórico de la Coronación de 1964;
- 4 cultos recurrentes y 4 ocurrencias concretas de 2026;
- salida anual del 8 de septiembre de 2026;
- participación extraordinaria en el II Congreso Internacional de Hermandades de 2024;
- 4 acontecimientos históricos;
- 3 piezas patrimoniales visibles en la ficha pública;
- 5 marchas dedicadas y sus autores;
- acompañamiento histórico de la Asociación Musical Álvarez Quintero limitado a 2024;
- Fuentes y relaciones del grafo.

Actualidad estricta aplicada:

- la salida del 08/09/2026 permanece `announced`;
- 2024 permanece histórico y `held`;
- no existe música vigente 2026 publicada por inferencia;
- el Coro de la Virgen no se modela como banda;
- no se fuerza autoría exacta de la talla, vestidor ni autor de las nuevas andas sin Fuente suficiente.

Deuda legítima restante:

- escudo/cabecera/fotografías con procedencia y derechos trazables;
- autoría exacta de la talla;
- vestidor actual;
- autoría inequívoca de las andas 2026;
- acompañamiento musical vigente 2026 si llegara a publicarse oficialmente.

## Reglas y mejoras transversales vigentes

- los huecos secundarios transparentes no fuerzan `noindex`;
- histórico musical estructurado visible donde corresponde;
- fotografías de Salidas desde Panel hacia ficha pública;
- Fuentes heredadas acotadas al contexto real;
- Vía Crucis de las Cofradías como relación reutilizable;
- contraste común estable;
- directorios ordenados por territorio, naturaleza, jornada/mes y estilo;
- nombre oficial completo visible también en móvil;
- contratos futuros excluidos de la actualidad hasta su fecha efectiva;
- búsqueda de Hermandades por nombre corto, popular, oficial y localidad;
- `Vestidor actual` como relación `agent → dresser_of → image`, editable desde Panel, con histórico y lectura pública;
- Cuatrovitas: paleta verde, blanco y dorado;
- Purísima de La Algaba: paleta celeste, blanco y dorado.

No se admiten excepciones por slug para ocultar problemas comunes.

## Vestidores estructurados

Relaciones actuales cargadas sobre el modelo vigente:

- Francisco Carrera Iglesias «Paquili» → Nuestra Señora de los Dolores del Cerro;
- José Antonio Grande de León → Nuestra Señora de la Piedad y María Santísima de la Caridad en su Soledad del Baratillo;
- José Antonio Grande de León → María Santísima de los Dolores y Misericordia de Jesús Despojado;
- José Antonio Grande de León → María Santísima del Amor de Pino Montano;
- Leandro González Ruiz → Nuestra Señora de la Encarnación Coronada de San Benito;
- Antonio Sanabria Vázquez → María Santísima de Guadalupe y Nuestra Madre y Señora del Mayor Dolor de Las Aguas.

La relación Leandro González Ruiz → María Santísima de la Estrella de Sevilla permanece `draft`, igual que la Imagen y su Hermandad. No constituye frente abierto ni contenido publicado.

## #492

**#492 · Reconciliar Supabase Preview Branches → ABIERTA Y AISLADA.**

No bloquea:

- contenido ni DML editorial;
- Hermandades;
- titulares;
- pasos;
- música e históricos;
- patrimonio;
- cultos;
- acontecimientos;
- salidas;
- Fuentes;
- imágenes/media soportada por el modelo actual;
- relaciones existentes;
- agentes;
- SEO editorial.

Sí bloquea:

- nuevo DDL;
- nuevas tablas;
- migraciones estructurales;
- cambios RLS relacionados.

No debe resolverse reescribiendo migraciones históricas ya aplicadas ni alterando producción por un problema exclusivo de preview.

## Bloqueos y criterio editorial

Los límites reales son:

- FIRST EDITION FREEZE;
- #492 para estructura/RLS;
- actualidad estricta 2026/2027;
- trazabilidad de Fuentes y media;
- no inventar datos para elevar completitud.

Cada ausencia debe clasificarse como:

- A · deuda real;
- B · no aplicable;
- C · dato todavía no publicado;
- D · pendiente de verificar;
- E · hueco legítimo.

## Siguiente movimiento autorizado

No existe frente abierto.

Antes de abrir otra Hermandad:

1. refrescar `main`, PR y producción;
2. comprobar que este estado sigue vigente;
3. recalcular deuda documental actual;
4. elegir UNA sola Hermandad;
5. diagnosticar antes de escribir;
6. cerrar únicamente con evidencia verificable y sin nuevo modelo;
7. QA → PR → merge → producción → actualización canónica → 0 PR abiertas.
