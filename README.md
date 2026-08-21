# Base Cofrade · Prototipo v0.1

Primera versión funcional de la aplicación web Base Cofrade.

## Qué incluye

- Portada del proyecto.
- Listado de hermandades con buscador en cliente.
- Ficha piloto de El Baratillo.
- Secciones de titulares, pasos, hábito, salidas, cultos y curiosidades.
- Fichas individuales de las cuatro imágenes cargadas en el prototipo.
- Datos locales en `lib/data.js`, preparados para sustituirse por Supabase.
- Diseño responsive sin librerías CSS externas.

## Ejecutar en local

Necesitas Node.js compatible con Next.js 16.

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Publicar en Vercel

1. Sube esta carpeta a un repositorio de GitHub.
2. En Vercel, crea un nuevo proyecto importando ese repositorio.
3. Vercel detectará Next.js automáticamente.
4. Pulsa Deploy.

## Próxima fase

- Crear proyecto en Supabase.
- Convertir `lib/data.js` en consultas reales.
- Crear tablas para hermandades, imágenes, pasos, hábitos, salidas, cultos, curiosidades y fuentes.
- Incorporar fotografías y escudos reales con gestión de derechos/autorizaciones.
- Añadir restauraciones, acontecimientos, cronología, autores, patrimonio y música.

## Nota de contenido

Este prototipo utiliza datos de ejemplo y estructura de trabajo. Antes de la publicación pública definitiva, cada dato histórico debe revisarse y vincularse a sus fuentes documentales.

<!-- deployment refresh: 2026-08-21 -->
