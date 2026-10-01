# Autores · ciclo 1 Vestidores · postflight

Estado actual: **DATOS Y CORRECCIÓN PUBLICADOS; CERTIFICACIÓN PENDIENTE SOLO DE QA VISUAL MÓVIL**. No repetir el DML ni iniciar Restauración hasta completar esa revisión. Los apartados anteriores al postflight de producción conservan evidencia histórica de las incidencias ya resueltas.

## Corte y alcance

Preflight renovado contra main `a993ca20e4402cdfcdede1ec7e94be043bcc299f` y producción READY `dpl_Dq6rTjTVKMWhjDDvQFxJu3hTdpLZ`. PR abiertas #1019 (Pastora, aparcada) y #1020 (rendimiento), fuera de alcance. Las 17 migraciones estructurales permanecen intactas.

Se aplicó únicamente el lote revisado de nueve INSERT: seis disciplinas y tres enlaces directos a Fuentes existentes. No se alteraron entidades, relaciones, cronologías, slugs, criterios de indexación ni lectores públicos. La auditoría previa cubre 751 entidades de tipo agent, 744 publicadas; la tabla de extensión agents contiene 718 filas, 711 publicadas. Son universos distintos y no deben intercambiarse.

## Operaciones y postflight de datos

| Perfil | Disciplina insertada | Principal | Fuentes directas después |
|---|---|---|---:|
| Antonio Bejarano Ruiz | Vestidor | Sí | 1 |
| Antonio Jesús del Castillo Fernández | Vestidor | Sí | 1 |
| Leandro González Ruiz | Vestidor | Sí | 1 |
| Manuel Vespia Román | Vestidor | Sí | 1 |
| José Manuel Lozano Rivero | Vestidor | Sí | 1 |
| José Antonio Grande de León | Vestidor | No; conserva Bordado | 2 |

Los tres enlaces nuevos corresponden a Castillo (La Cena), Vespia (Torreblanca) y Lozano (San Bernardo). Los IDs, notas y guardas están en el [SQL histórico aplicado](./archive/editorial/2026-10-01-vestidores-applied.sql), fuera de la cadena de migraciones. No reejecutar.

Dry-run renovado: `DRY_RUN_QA_OK_ROLLBACK`, seis disciplinas, tres Fuentes, nueve operaciones. Apply: `VESTIDORES_APPLY_QA_OK`, COMMIT confirmado. Postflight: seis Vestidor presentes; un único principal en cada perfil; Bordado principal de Grande de León preservado. Agentes con disciplina: 82 → 87.

## Resultado público observado

| Métrica | Antes | Después |
|---|---:|---:|
| Directorio indexable | 421 | 422 |
| Vestidores | 6 | 8 |
| Bordado y arte textil | 17 | 16 |
| URLs de autores en sitemap general observado | 421 | 421, pendiente de refresco |

Se corrige la previsión de siete Vestidores de la propuesta anterior: el clasificador vigente evalúa todas las disciplinas en orden de categorías, sin priorizar is_primary. Vestidores precede a Bordado; por eso Grande de León pasa a la categoría Vestidores aunque la tarjeta, el title y Person.jobTitle conservan Bordado. Este comportamiento se documenta como dependencia del lector, sin cambiar silenciosamente su algoritmo ni el principal documental.

Lozano gana indexabilidad al recibir su Fuente directa, conforme al umbral existente; no se ha rebajado dicho umbral. El resto de las categorías conserva sus recuentos.

QA HTTP: directorio, filtro, seis perfiles y sitemap responden 200. `/autores` mantiene index, follow; el filtro mantiene noindex, follow y canonical `/autores`. Las seis fichas mantienen canonical propia e index, follow. Person.jobTitle = Vestidor en cinco perfiles y Bordado en Grande de León. Todas tienen un H1 y cinco bloques JSON-LD que parsean correctamente. Las descripciones existentes se conservan.

QA visual de escritorio: filtro con ocho tarjetas, métricas, navegación a Lozano, breadcrumbs, disciplina principal, una imagen vestida y una Fuente directa verificados. No se observaron errores de aplicación en consola; los mensajes de extensión Chrome pertenecen al entorno de comprobación. Consulta Vercel error/fatal del deployment vigente, 04:29:43–04:59:43 UTC del 01/10/2026: sin filas. Esto certifica únicamente esa ventana.

## Pendientes que impiden el cierre

1. Sitemap: el general aún contiene 421 URLs de autores y excluye a Lozano. El directorio ya devuelve 422. El lector y la ruta de sitemap tienen caché de 3600 segundos; repetir la comprobación tras regeneración y verificar la familia de Autores. No hay revalidación pública disponible; la CLI Vercel no tiene sesión autenticada. No se purgó globalmente ni se desplegó código para ocultar el desfase.
2. QA móvil: pendiente. agent-browser no pudo iniciar su daemon; la recuperación con Chrome oficial tampoco arrancó. El navegador alternativo permitió QA de escritorio, pero no ofrece control documentado del viewport y los atajos de emulación no tuvieron efecto. No declarar PASS móvil sin observación.
3. Title de Castillo: el compactador existente genera `Antonio Jesús del Castillo Fernández ·… · Hilo Cofrade`, omitiendo Vestidor. Registrar una corrección acotada de metadata antes de certificar semántica completa.
4. Grande de León: resolver explícitamente la discrepancia categoría/principal descrita arriba antes de certificar su clasificación pública. El lote de datos no autoriza una normalización global del lector.

Álvaro Martín y Fernando José Aguado siguen por fallback. No se fusiona el posible duplicado Aguado ni se amplían trayectorias o vigencias. Las seis relaciones dresser_of sin Fuente específica y los solapamientos con otros sistemas continúan como deuda de la auditoría 0; este lote no los certifica.

Siguiente acción: resolver los cuatro pendientes, renovar postflight público y documentar el cierre real del lote. Solo después procede la propuesta de Restauración y conservación.

## Continuación del 01/10/2026 · estado actualizado

Este apartado prevalece sobre los pendientes del corte anterior. El sitemap general y `/sitemaps/autores.xml` ya responden 200, contienen 422 URLs de autores e incluyen a Lozano. La caché se regeneró sin purga ni DML adicional.

Corrección preparada en esta PR: la categoría respeta el principal solo cuando existe exactamente un is_primary; sin principal explícito o con varios, conserva la resolución anterior. El lector expone primaryDisciplineCount y renueva únicamente las claves de caché de directorio y detalle de Autores para evitar objetos del contrato anterior. Los umbrales de indexabilidad, relaciones y fuentes no cambian.

Comparación del inventario de 751 entidades con las disciplinas actuales: siete cambios de categoría. Buiza, con dos principales, conserva su resolución anterior y sigue pendiente de revisión documental.

| Perfil | Categoría actual en producción | Categoría con la corrección | Principal existente |
|---|---|---|---|
| Gabriel de Astorga | Imaginería | Restauración | Restauración |
| Hermanas Zuloaga | Restauración | Bordado | Bordado |
| José Antonio Grande de León | Vestidores | Bordado | Bordado |
| Luis Miguel Garduño Lara | Restauración | Bordado | Bordado |
| Manuel Caro | Bordado | Diseño | Diseño |
| Taller de Bordados de José Antonio Grande de León | Restauración | Bordado | Bordado |
| Talleres Santa Bárbara | Restauración | Bordado | Bordado |

Recuentos esperados tras publicar: Música 213; Imaginería 83; Restauración 21; Vestidores 7; Bordado 20; Orfebrería 20; Talla 22; Diseño 17; Patrimonio 19. Total 422. Son efectos del lector sobre disciplinas ya existentes, sin normalizar datos de otras categorías.

Los titles de Autores conservan nombre y oficio completos, usando el mismo resultado en metadata social; se retira únicamente en esta familia el compactador de 44 caracteres. Castillo queda `Antonio Jesús del Castillo Fernández · Vestidor · Hilo Cofrade`. El título completo puede superar 60 caracteres: se preserva identidad y oficio, sin prometer cómo lo mostrará Google.

Validación local: 1.424/1.424 tests PASS, build Next.js 16.3.0 PASS y diff sin errores. Cuatro regresiones cubren prioridad del principal, fallback, principales ambiguos y titles completos. Build local sin credenciales públicas: valida compilación, no lectura real de datos.

QA móvil continúa bloqueado: agent-browser 0.20 aporta diagnóstico reproducible `Failed to bind socket: Operation not permitted`; Chrome oficial confirma socket() prohibido en este entorno. No se solicita una escalación rechazada ni se declara PASS móvil. Antes del cierre siguen necesarios publicación del código, QA vivo de los siete cambios y revisión móvil en un entorno que permita renderizado.

## Postflight de producción · 01/10/2026

#1051 fusionada en `cf46c9d5c33caf481fd64eca761f506c3b025c52`; producción `dpl_7wT22n7CjoiyVDKhe5xC4rmqPDNV` READY sobre ese SHA. Preview del head `6185a15b02fa31462937e6d789cb60948756dc58` READY y GitHub CI SUCCESS; HTTP preview confirmó title completo de Castillo, Grande de León en Bordado con ocho imágenes vestidas conservadas y filtro de siete Vestidores.

Producción: 14/14 rutas HTTP 200 (directorio, filtro, dos sitemaps, siete perfiles reclasificados, Castillo, Lozano y Buiza). Canonical y robots preservados. Las siete categorías de la tabla anterior coinciden con el contenido público; los siete perfiles contienen cinco bloques JSON-LD válidos. Los talleres conservan Organization; no se exige Person.jobTitle en ellos. Buiza permanece en la resolución anterior ante sus dos principales.

Castillo publica `Antonio Jesús del Castillo Fernández · Vestidor · Hilo Cofrade`; Grande de León publica Bordado como principal y categoría. Vestidores muestra siete tarjetas y ya no incluye a Grande de León. El directorio y ambos sitemaps mantienen 422 autores y Lozano está incluido en ambos. No se alteró ni reaplicó el lote de nueve INSERT.

Vercel, deployment vigente: consulta error/fatal de 05:05:40–05:20:40 UTC del 01/10/2026 sin filas. La ausencia se limita a esa ventana. Pruebas locales 1.424/1.424 y build PASS.

Única puerta pendiente de este lote: QA visual móvil real (categorías, desplazamiento horizontal, legibilidad, densidad, navegación y tarjetas de obra). El entorno disponible impide iniciar el navegador local y el navegador alternativo no expone control del viewport. No declarar el ciclo cerrado ni abrir la normalización de Restauración hasta completar esa puerta. Las deudas documentales generales de la auditoría 0 siguen separadas del alcance de estas nueve operaciones.
