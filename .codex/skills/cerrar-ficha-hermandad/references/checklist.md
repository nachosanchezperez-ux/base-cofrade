# Checklist de cierre de Hermandad

## 1. Inventario

Recoge el estado existente antes de investigar:

- entidad, ficha `brotherhoods`, municipio, sede, canales y colores;
- titulares e imágenes secundarias, autorías e intervenciones;
- pasos, fases, imágenes que procesionan y personal vigente/histórico;
- hábito, música, cultos, salidas, acontecimientos y patrimonio;
- fuentes, media y derechos;
- representación pública y SEO.

Compara el inventario con las migraciones y certificaciones anteriores. No confundas un dato ya aplicado con una tarea pendiente porque falte en un informe antiguo.

## 2. Matriz de evidencia

Para cada afirmación material registra mentalmente o en el documento de trabajo:

| Campo | Uso |
|---|---|
| Hecho | Afirmación concreta que podría publicarse |
| Estado temporal | Actual, histórico, futuro o desconocido |
| Fuente | URL, editor y fecha de consulta |
| Certeza | Documentado, atribuido, discutido o desconocido |
| Destino | Entidad, relación o texto editorial existente |
| Acción | Conservar, completar, corregir o no publicar |

No uses una fuente para una afirmación más precisa que la que realmente sostiene.

## 3. Clasificación de huecos

- **A · deuda real:** dato necesario y verificable que falta o es incorrecto.
- **B · no aplicable:** el concepto no corresponde a la Hermandad.
- **C · no publicado:** puede existir, pero no hay fuente publicable.
- **D · pendiente de verificar:** hay indicios contradictorios o insuficientes.
- **E · hueco legítimo:** mejora deseable que no bloquea el cierre.

Solo A justifica una corrección obligatoria. C, D y E deben conservar prudencia; B no debe aparecer como deuda.

## 4. Control relacional

Antes de insertar:

1. Busca coincidencias por ID, slug, nombre normalizado y contexto territorial.
2. Comprueba si la realidad ya existe como entidad compartida.
3. Conserva vigencia e histórico en la relación correspondiente.
4. Añade fuente en el nivel más específico disponible sin duplicar enlaces equivalentes.
5. Deriva aserciones de QA de los hechos esperados.

Controles mínimos a cero:

- slug canónico duplicado;
- Hermandad→Imagen activa duplicada;
- Hermandad→Paso activo duplicado;
- Imagen→Paso activa duplicada;
- acompañamiento actual duplicado para la misma salida, posición y paso;
- relación nuclear a una entidad no publicada;
- media pública sin procedencia o permiso trazable.

## 5. QA público

Verifica la URL canónica y, cuando corresponda, las fichas relacionadas:

- HTTP 200;
- título y descripción coherentes;
- canonical exacta;
- `index, follow` si supera el mínimo editorial;
- OG/Twitter válidos;
- identidad, sede, titulares, pasos y música coinciden con Supabase;
- no hay secciones vacías presentadas como contenido;
- no hay errores runtime recientes en la ruta.

## 6. Decisión

- **Cerrada:** no queda deuda A y el QA observable es correcto.
- **Corrección necesaria:** existe deuda A con evidencia suficiente.
- **Bloqueada:** una contradicción material impide publicar con rigor.

Documenta deuda legítima sin convertirla en una reapertura automática.

