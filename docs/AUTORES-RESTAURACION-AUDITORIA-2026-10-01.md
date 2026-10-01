# Autores · Restauración y conservación · auditoría del ciclo 2

**Actualización posterior: primer lote aplicado y cerrado.** [Cierre y postflight](./AUTORES-RESTAURACION-CIERRE-2026-10-01.md). El manifest y los resultados de dry-run siguientes conservan su estado histórico; no reejecutar el lote.

Estado histórico del corte: **AUDITORÍA, PROPUESTA Y DRY-RUN PREPARADOS; SIN APPLY**. El dry-run termina en `ROLLBACK`; las 22 filas propuestas no existen después. No certificar el ciclo completo ni abrir Imaginería todavía.

## Preflight vigente · 01/10/2026

- Main: `4da1794a9673c3ee7a3b7e42f6c482cc0ecb1605` (#1057).
- Producción: `dpl_3uFZWKyiJabTvGiyjzTnTnTE8f9f`, READY, mismo SHA.
- Supabase `kcevwkucqzcyrqaimyhl`: ACTIVE_HEALTHY; 17 migraciones aplicadas, alineadas con los 17 archivos SQL locales; README aparte. No se ejecutó ninguna migración en este ciclo.
- PR abiertas #1019 (Pastora aparcada), #1020 (rendimiento) y #1055 (laboratorio de lectura de Hermandades), preservadas.
- #1042/#1043 y correcciones #1051/#1056 siguen presentes en el lector vigente. Se preservan `publicAgentIsIndexable`, redirects, filtros noindex/follow y URLs.
- Primer lote Vestidores cerrado por #1057: no reejecutar sus nueve INSERT.

## Inventario y alcance

751 entidades de tipo agente, 744 publicadas; 422 elegibles según el contrato público actual. Esta cifra no acredita indexación en Google. 87 agentes tienen al menos una disciplina; 103 filas de `agent_disciplines`.

Cruce amplio por nombre/resumen/descripción, disciplinas, `heritage_interventions` y `intervened`: **149 candidatos, 147 publicados, 88 elegibles, 107 sin disciplinas**, con 257 intervenciones asociadas; 36 no tienen Fuente específica. La tabla patrimonial completa contiene 272 registros, 266 publicados y 138 agentes identificados.

El conjunto es un inventario para examinar, no una lista de 149 restauradores. Incluye ejecución original, creación, diseño, joyería, dorado y bordado. «Conservatorio» (Paredes), «contrato conservado» (Santamaría) y mención a la restauración realizada por otra persona (Fernando Cruz) son señales textuales insuficientes.

[Informe legible e inventario de candidatos](./evidence/autores-restauracion-auditoria-20261001.html) · [cobertura vigente](./evidence/autores-cobertura-20261001.json) · [datos del cruce](./evidence/autores-restauracion-inventario-20261001.json).

## Vocabulario controlado propuesto para este lote

| Valor canónico | Significado | Uso en el lote | Regla |
|---|---|---|---|
| Restauración | Actuaciones de restauración documentadas | 7 perfiles: 6 principales y 1 secundaria | No atribuirlo automáticamente a toda intervención |
| Conservación | Conservación, mantenimiento y actuaciones conservativas documentadas | 5 perfiles: 1 principal y 4 secundarias | Nuevo valor de agent_disciplines; ya reconocido por el lector y sin restricción de vocabulario en la tabla |
| Restauración textil | Restauración del soporte/bordado textil | 0 cambios; 2 filas existentes conservadas | Distinguir del lienzo pictórico de un Simpecado |
| Conservación textil | Conservación de piezas textiles | 0 cambios; 1 fila existente conservada | No equiparar a Bordado |

Las variantes de disciplinas de las intervenciones («Conservación-restauración», «Conservación y restauración», «Restauración pictórica») se conservan. No es una normalización global del vocabulario.

## Primer lote exacto

| Perfil | Principal | Secundaria | Disciplinas nuevas | Fuentes directas nuevas |
|---|---|---|---:|---:|
| Almudena Fernández García | Restauración | Conservación | 2 | 2 |
| Ballesteros Cascajares | Conservación | Restauración | 2 | 2 |
| Cinta Rubio Faure | Restauración | — | 1 | 1 |
| Francisco Arquillo de la Torre | Restauración | — | 1 | 1 |
| Instituto Andaluz del Patrimonio Histórico | Restauración | Conservación | 2 | 2 |
| José Joaquín Fijo León | Restauración | Conservación | 2 | 2 |
| Laura Pérez Meléndez | Restauración | Conservación | 2 | 0 |
| **Total** | | | **12** | **10** |

**22 INSERT**: no UPDATE, DELETE, entidades nuevas, relaciones nuevas o Fuentes nuevas. Los diez enlaces reutilizan Fuentes de intervenciones existentes. Laura ya tiene Fuente profesional directa; no se duplica. Se conserva tipo persona/taller/institución. El principal representa la actividad documentada de la ficha; Ballesteros se apoya en dos actuaciones conservativas de 2021.

[Manifiesto con IDs, operaciones y URLs](./evidence/autores-restauracion-lote-20261001.json).

La Hermandad del Amparo acredita restauración del lienzo del Simpecado en 2007 y limpieza de la imagen en 2015 por Almudena y Fijo: no se les asigna restauración textil por intervenir sobre una pintura incorporada al Simpecado. San Esteban acredita a Cinta en la restauración de 2004 y a Ballesteros en conservación de 2021. Tomares acredita a Arquillo en Dolores (2023). Junta/IAPH acredita la intervención de Aguas Santas y su repositorio conserva la memoria del Simpecado. La web de Laura acredita conservación y restauración como actividad profesional.

Las fuentes primarias revisadas se enlazan en el informe HTML y en el manifiesto. No se ha contrastado externamente la trayectoria de los 149 candidatos; las conclusiones aplicables se limitan al lote y a las deudas concretas identificadas.

## Impacto y comprobación

Simulación con `authorCategoryFor` y el contrato actual de elegibilidad:

- Elegibles **422 → 422**, sin cambios de elegibilidad.
- Restauración **21 → 22**; Patrimonio **19 → 18**; demás categorías sin cambios.
- Único cambio de categoría: Francisco Arquillo, antes Patrimonio.
- Seis perfiles dejan de depender del fallback sin cambiar de categoría.
- Agentes con disciplinas **87 → 94**; filas de disciplinas **103 → 115**.
- Enlaces de Fuente **8.494 → 8.504**.
- Un principal por cada uno de los siete perfiles; no se alteran otras disciplinas.

[Impacto proyectado](./evidence/autores-restauracion-impacto-20261001.json).

Dry-run ejecutado: `RESTORATION_DRY_RUN_QA_OK_ROLLBACK`. Verifica perfiles y slugs publicados, disciplinas vacías, Fuente/URL/intervención exactas, ausencia de enlaces directos previos, 12+10 inserciones y un principal por perfil. Consulta posterior: **0 residuos**, totales 103 disciplinas y 8.494 enlaces.

[SQL solo dry-run](./evidence/autores-restauracion-dry-run-20261001.sql) · [resultado y rollback](./evidence/autores-restauracion-dry-run-result-20261001.json).

QA público anterior al Apply: directorio, filtro, sitemap y siete fichas responden HTTP 200; directorio index/follow, filtro noindex/follow con canonical al directorio, fichas con canonical propia/index/follow/H1 único. El sitemap tiene 423 loc: landing + 422 perfiles. Arquillo todavía presenta «Autor patrimonial», coherente con el estado sin Apply. [Comprobación pública](./evidence/autores-restauracion-publico-20261001.json).

No se declara una preview de los datos propuestos, QA responsive posterior al Apply ni certificación de cambios aún no publicados. El CSS y el lector no cambian.

## Deudas y exclusiones

- **Principal biográfico dudoso:** Cayetano González, Gabriel de Astorga y Fernando Murciano tienen Restauración principal a partir de una intervención puntual o atribuida. Antes de cambiarlo, revisar trayectoria y fuentes; este lote los preserva.
- **Textiles/dorado con fallback Restauración:** Convento de Santa Isabel, José Ramón Paleteiro y Luis Sánchez Jiménez requieren contraste de oficio. No decidir por la primera mención a restauración.
- **Precisar material:** talleres Grande de León y Santa Bárbara conservan Bordado principal y Restauración secundaria genérica. Una propuesta posterior debe distinguir restauración textil documentada, sin convertir a restauradores de pinturas en bordadores.
- **Multidisciplinares:** Buiza, Miñarro, Álvarez Duarte, Dubé y otros imagineros no se reclasifican por una intervención. Buiza conserva su alerta de dos principales.
- **Posibles duplicados:** Dubé/Antonio Joaquín Dubé de Luque; Fernando Marmolejo/Marmolejo Camargo; Rafael Barbero/Barbero Medina. Revisión individual; no fusión. Aguado mantiene su deuda previa.
- **Variante nominal:** Eva Villanueva Romera en la fuente de San Esteban, Romero en fuentes institucionales IAPH; resolver identidad/grafía antes de normalizar este perfil.
- **Sin Fuente específica:** MUSAE/Retablo del Juicio Final e IAPH/Paño de Ánimas; no ampliar ni certificar trayectorias por esos registros.
- **Institución ≠ autor individual:** no duplicar trabajos del IAPH entre técnicos y entidad ni asignar al Taller Leal Pérez la obra ya documentada de Laura solo para aumentar sus relaciones.

## Solapamientos

13 intervenciones comparten agente y destino con otra representación: ocho con autorías de imágenes, tres con relaciones del grafo `author_of`, dos con fases de Pasos. Esto no prueba duplicado: puede existir creación más restauración en otro año. Ninguno de los siete perfiles del lote está en ese conjunto. No se cambia el lector ni se eliminan relaciones.

[Inventario de coincidencias](./evidence/autores-restauracion-solapamientos-20261001.json).

## Continuidad

Primer lote preparado para revisión y aplicación exacta, aún sin Apply. Antes de aplicar: refrescar main/producción y repetir las guardas de deriva. Después: comprobar disciplinas/Fuentes, categoría/title de Arquillo, las siete fichas, responsive, sitemap e integridad del directorio; certificar solo ese lote y conservar las deudas anteriores. No avanzar a Imaginería ni reabrir Vestidores todavía.
