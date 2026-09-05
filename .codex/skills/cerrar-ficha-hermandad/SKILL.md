---
name: cerrar-ficha-hermandad
description: Audita, completa y certifica una ficha de Hermandad en Hilo Cofrade sobre el modelo vigente. Úsala cuando se pida cerrar, revalidar o corregir una Hermandad concreta; no para cambios generales de UX, arquitectura o esquema.
---

# Cerrar ficha de Hermandad

Lleva una Hermandad desde su estado real hasta una decisión auditable: `cerrada`, `corrección necesaria` o `bloqueada por evidencia insuficiente`.

## Preflight obligatorio

1. Lee `docs/HILO-ORQUESTADOR.md`, `docs/ESTADO-PROYECTO.md` y el manual editorial disponible.
2. Refresca el estado real: SHA de `main`, PR abiertas, producción Vercel y salud de Supabase.
3. Identifica el slug y confirma que existe una sola entidad canónica.
4. Comprueba si la ficha ya está certificada. Si lo está, trabaja en modo revalidación y no la reabras por deuda legítima o por perseguir un porcentaje.

El estado real de GitHub, Supabase y Vercel prevalece sobre documentos desactualizados.

## Decide el modo antes de escribir

- **Revalidación:** la ficha ya cumple. Ejecuta QA y documenta el resultado sin DML.
- **Corrección editorial:** existe una regresión o nueva información verificable. Modifica únicamente datos y relaciones necesarios.
- **Bloqueo:** la evidencia no permite afirmar el dato. Clasifica el hueco y no inventes precisión.

Una orden de auditoría no autoriza mutaciones. Solo cambia datos cuando la petición del usuario incluya completar o corregir la ficha.

## Contrato de cierre

Una ficha puede cerrarse cuando:

- identifica correctamente nombre popular y oficial, municipio, sede y naturaleza;
- separa actualidad, histórico e incertidumbre;
- relaciona titulares, pasos y otras entidades sin duplicarlas;
- permite rastrear las afirmaciones materiales a fuentes adecuadas;
- no muestra notas internas ni medios sin derechos trazables;
- su ruta pública responde, es coherente con el grafo y tiene SEO/indexabilidad correctos cuando alcanza el mínimo editorial.

No es obligatorio rellenar todos los campos. Lee [references/checklist.md](references/checklist.md) para ejecutar el inventario, clasificar huecos y cerrar QA.

## Reglas editoriales

- Prioriza fuentes oficiales de la Hermandad y fuentes institucionales. Usa prensa especializada para hechos que la fuente primaria no documente.
- Verifica fechas de consulta y vigencia. Un anuncio, contrato futuro o proyecto en curso no es un hecho concluido.
- Conserva intervalos, atribuciones discutidas y autorías anónimas cuando la evidencia no sea unívoca.
- Modela una realidad como una entidad y una relación; no repitas texto para simular estructura.
- Los conteos son comprobaciones derivadas de la evidencia, nunca objetivos a rellenar.
- Una fuente contextual válida puede respaldar una afirmación aunque el modelo histórico no disponga de un enlace específico para cada relación. No crees DML solo para elevar una métrica mecánica.

## Límites permanentes

- No introduzcas UX nueva, excepciones por slug, arquitectura, tablas, DDL, RLS ni migraciones estructurales.
- `#492` permanece aislada: no reescribas migraciones ya aplicadas ni la uses para bloquear DML editorial sobre el modelo existente.
- No cambies IDs, no borres relaciones válidas para reconstruirlas y no dupliques entidades.
- Si hace falta DML, crea una migración nueva, idempotente y verificable. Ejecútala dos veces dentro de una transacción con `ROLLBACK` antes de aplicarla.
- Haz escrituras secuenciales y detente ante conflictos, checks rojos o divergencia entre Git y producción.

## Cierre verificable

Comprueba, según corresponda:

- unicidad y estado público de la Hermandad;
- relaciones actuales y sus históricos;
- duplicados nucleares a cero;
- fuentes y derechos de media;
- página pública, móvil/escritorio si hubo cambio visual, enlaces, canonical, robots, metadatos y OG;
- pruebas, build, preview y producción cuando exista implementación;
- errores runtime de la ruta;
- documentación de certificación y `docs/ESTADO-PROYECTO.md` solo cuando cambie el estado operativo.

No declares el cierre por haber escrito SQL o por alcanzar un porcentaje. Decláralo por evidencia, integridad relacional y verificación observable.

## Entrega

Informa con esta estructura compacta:

- **Realizado:** cambio o decisión de no mutar.
- **Afecta a:** datos, documentación, código y producción.
- **Comprobado:** evidencias, conteos derivados y QA público.
- **Pendiente:** solo deuda real; separa la deuda legítima que no bloquea.

