# Autores · ciclo 1 Vestidores · postflight

Estado: **APPLY CONFIRMADO; CERTIFICACIÓN PÚBLICA PENDIENTE**. No repetir el DML ni iniciar Restauración hasta resolver las comprobaciones pendientes.

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
