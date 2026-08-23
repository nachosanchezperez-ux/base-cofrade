# Protocolo editorial de Wikimedia Commons y media abierta

## Propósito

Hilo Cofrade puede reutilizar fotografías externas únicamente cuando la licencia concreta permite el uso y se conserva una atribución verificable. Que un archivo aparezca en Wikimedia Commons, una red social, un buscador o una web pública no significa por sí solo que pueda incorporarse al proyecto.

Este protocolo se aplica a portadas, galerías, carteles, patrimonio y cualquier otra superficie que utilice `media_assets` con `rights_status = licensed` o `public_domain`.

## Regla canónica

> Una pieza de media abierta solo puede guardarse y publicarse cuando Hilo Cofrade conoce quién la creó, quién ostenta los derechos, bajo qué licencia exacta se reutiliza y cuál es su página original de procedencia.

La imagen directa y la página de procedencia cumplen funciones distintas:

- `storage_path`: archivo que renderiza el Front;
- `source_url`: página original donde pueden verificarse autoría, licencia y contexto.

## Licencias admitidas

### Con licencia

- CC BY 1.0, 2.0, 2.5, 3.0 o 4.0.
- CC BY-SA 1.0, 2.0, 2.5, 3.0 o 4.0.

Estas licencias permiten reutilización con atribución. Las variantes BY-SA obligan además a respetar sus condiciones de compartir igual cuando exista una adaptación.

### Dominio público

- CC0 1.0.
- Public Domain Mark 1.0 o PDM 1.0.
- Declaración expresa `Public domain` o `Dominio público`, acompañada de una nota editorial que explique la base de esa condición.

## Licencias y situaciones excluidas

No se incorporan como media abierta:

- licencias NC o «No comercial»;
- licencias ND o «Sin obras derivadas»;
- `All rights reserved` o «Todos los derechos reservados»;
- `fair use` o «uso justo»;
- licencia desconocida, genérica o sin versión cuando la versión es aplicable;
- capturas de redes sociales, resultados de buscadores o repositorios que no identifican el archivo original;
- piezas con avisos de borrado, autoría discutida o revisión de licencia pendiente;
- archivos cuyo único argumento de uso sea «está publicado en internet».

Una pieza excluida puede entrar únicamente por otra vía jurídica documentada, por ejemplo autorización expresa, y debe registrarse entonces como `authorized`, no como `licensed` ni `public_domain`.

## Metadatos obligatorios

Toda pieza `licensed` o `public_domain` debe conservar:

| Campo | Contenido exigido |
|---|---|
| `alt_text` | Descripción accesible de la imagen. |
| `author_name` | Autor, fotógrafo o creador identificado en la Fuente. |
| `rights_holder` | Titular de derechos o responsable de la cesión. |
| `rights_status` | `licensed` o `public_domain`, según corresponda. |
| `license` | Nombre normalizado y versión exacta de la licencia. |
| `source_name` | Nombre de la Fuente y, cuando proceda, título del archivo. |
| `source_url` | URL HTTPS de la página original, nunca un resultado de búsqueda. |
| `permission_notes` | Explicación breve de la base de reutilización y de cualquier obligación relevante. |

La fecha de creación, el título, el pie de foto y las dimensiones se añaden cuando estén documentados, pero no sustituyen ninguno de los campos anteriores.

## Procedimiento específico para Wikimedia Commons

1. Abrir la ficha individual del archivo en Commons.
2. Comprobar autor, titular, licencia, versión y cualquier aviso activo.
3. Verificar que la licencia figura entre las admitidas por este protocolo.
4. Registrar como `source_url` la ficha canónica `https://commons.wikimedia.org/wiki/File:…` o `…/Archivo:…`.
5. Registrar como `storage_path` la URL directa `https://upload.wikimedia.org/wikipedia/commons/…` solo cuando sea necesario servir el archivo desde origen.
6. Identificar la Fuente como `Wikimedia Commons · …`.
7. Redactar texto alternativo, pie y nota de permiso sin atribuir datos que la ficha original no documenta.
8. Elegir portada o galería por criterio editorial; ambas posiciones exigen el mismo nivel de procedencia.

No se admite como `source_url` la URL directa de la imagen, una categoría de Commons, una búsqueda ni una página ajena que la haya reproducido.

## Crédito público

El Front mantiene un crédito visible formado por:

```text
Fotografía • Autor · Licencia
```

Cuando existe `source_url`, el crédito enlaza a la procedencia original. El enlace no sustituye el texto visible ni la licencia almacenada.

## Comportamiento ante datos incompletos

La protección opera en tres niveles:

1. **Panel:** explica el protocolo y bloquea el envío de formularios abiertos incompletos o con licencias no admitidas.
2. **Supabase:** una restricción de `media_assets` impide guardar el recurso aunque la escritura llegue desde otra herramienta o futura importación.
3. **Front / RLS:** la política pública solo expone media propia, autorizada o media abierta que cumple íntegramente el contrato.

No se corrige automáticamente una licencia, no se inventa un autor y no se degrada silenciosamente una pieza a otro estado de derechos.

## Auditoría inicial · 24 de agosto de 2026

- Recursos multimedia auditados: **231**.
- Recursos Wikimedia detectados: **5**.
- Recursos Wikimedia con licencia, autoría, titular, Fuente, URL canónica, nota de permiso y texto alternativo completos: **5 de 5**.
- Recursos `licensed` o `public_domain` sin licencia: **0**.

El cierre no modifica ni elimina ninguno de esos cinco recursos. Añade una barrera preventiva para las cargas futuras.
