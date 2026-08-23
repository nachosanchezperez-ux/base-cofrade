# Carril C · Estado operativo

> Checkpoint específico de contenido, fuentes y relaciones para Hilo Orquestador. GitHub, Vercel y Supabase siguen siendo la fuente de verdad; refrescar siempre el estado real antes de actuar.

## Corte observado

- Fecha: **2026-08-23**.
- Supabase: `Hilocofrade` (`kcevwkucqzcyrqaimyhl`).
- `main` de referencia tras reconciliar la migración de acompañamientos: `c8f95737bc84a1ee782b414815c28859bc8f56e6`.
- Carril A mantiene prioridad sobre **Bandas**.
- Carril C no debe completar deuda propia de Bandas mientras ese corte permanezca activo.

## Trazabilidad estructural cerrada

Estado verificado en Supabase para relaciones publicadas:

- Hermandad ↔ Imagen: **35/35 con Fuente exacta**.
- Hermandad ↔ Paso: **31/31 con Fuente exacta**.
- Imagen ↔ Paso: **30/30 con Fuente exacta**.
- Autorías de Imagen: **36/36 con Fuente exacta**.
- Dedicatorias de Marcha: **172/172 con Fuente exacta**.
- Fases de Paso: **46/46 con Fuente exacta**.
- Grabaciones de Marcha: **3/4 con Fuente exacta**.

No crear relaciones redundantes para satisfacer Salud. Una autoría `anonymous` publicada y documentada es autoría válida. Imagen → Paso → Hermandad puede ser contexto relacional válido sin convertir una Imagen secundaria en titular.

## Cobertura de Fuentes por entidad publicada

Fuera de Bandas, la cobertura directa queda completa:

- Hermandades: **14/14**.
- Imágenes: **36/36**.
- Pasos: **25/25**.
- Marchas: **198/198**.
- Eventos: **12/12**.
- Advocaciones: **11/11**.
- Bienes patrimoniales: **37/37**.

Agentes/profesionales:

- publicados: **265**;
- sin Fuente directa: **11**;
- los 11 restantes están vinculados a **Bandas** y se reservan para ese frente.

La limpieza de agentes reutilizó evidencia relacional exacta ya existente: autorías de Imagen, responsables de Paso, fases, intervenciones patrimoniales, patrimonio musical, repertorio oficial, cartelería y otras relaciones documentadas. No se inventaron biografías para cerrar métricas.

## Excepciones documentales legítimas

### El Descendimiento

- Marcha publicada: `marcha-el-descendimiento-misericordia`.
- Pertenece al trabajo discográfico `Misericordia` de la Banda de Música Las Cigarreras.
- La grabación/álbum está documentada, pero **no existe todavía una Fuente inequívoca para el compositor de esta pista concreta**.
- No asignar autor por coincidencia de título con obras homónimas.

### Refúgiame · Directos de la Calzá

- Registro de grabación publicado.
- La obra `Refúgiame` y su repertorio están documentados, pero **la grabación concreta en `Directos de la Calzá` no tiene todavía una Fuente documental independiente del streaming**.
- Spotify/Amazon/Qobuz pueden servir para escucha o comprobación de catálogo, pero no deben convertirse automáticamente en Fuente documental canónica si el estándar editorial exige una referencia específica.

## Cambios editoriales relevantes del corte

- San Benito: resumen/fundación y autorías estructuradas de sus tres Imágenes principales completadas y publicadas con Fuente.
- San Esteban: Mariano Falcón Cachero y Juan José Cobos Rosales vinculados a misterio/palio con vigencia 2026 y Fuente.
- Baratillo: fichas básicas y Fuentes de sus Imágenes principales reforzadas.
- Pastora de Cantillana: el vídeo oficial del traslado al paso documenta Hermandad ↔ Imagen ↔ Paso sin recurrir al directorio externo como única evidencia.
- Banderín de Las Cigarreras: resumen corregido; diseñado en 1999, culminado en 2001 y restaurado en 2017, con Fuente oficial y profesionales asociados documentados.
- Cartelería de Pastora: Ángel Sarmiento, David Payán Campos, Juan Miguel Martín Mena y Ricardo Gil Lozano cuentan con Fuente directa y trazabilidad de autoría.
- Coro Apóstol Santiago: identidad como formación de Aznalcázar y actividad en 2026 documentadas.
- Antonio Castro del Pozo: Fuente oficial propagada desde el evento del proyecto de palio de Desconsuelo y Visitación a su ficha profesional y relación exacta.

## Migración reconciliada durante el corte

PR **#276 · Corrige fechas de acompañamiento en San Benito y San Esteban** fue reconciliada e integrada porque la migración ya estaba aplicada en Supabase.

Migración versionada:

`20260823182110_corrige_fechas_acompanamientos_san_benito_san_esteban.sql`

Estado canónico verificado:

- La Encarnación ↔ San Benito: **Desde 1995** como periodo vigente.
- Banda de Música María Santísima de la Victoria ↔ San Esteban: **Desde 2009** como periodo vigente; la ausencia de estación en 2021 no reinicia la relación en 2022.

## Deuda fuera de este carril

Mientras Bandas sea el corte activo del Carril A, no resolver aquí:

- 6 Bandas publicadas sin Fuente directa;
- 11 agentes/profesionales restantes, todos vinculados a Bandas;
- cualquier ajuste de loaders, RLS, vistas, contratos públicos o componentes de Bandas.

## Próxima acción de Carril C

No reabrir las auditorías ya cerradas. Mantener Salud como cola viva y trabajar solo nuevas incidencias reales derivadas de contenido entrante. Si una carga nueva revela carencia de modelo, elevarla a Hilo Orquestador en lugar de crear tablas/campos ad hoc.
