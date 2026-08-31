# Hilo Cofrade

Enciclopedia relacional de la Semana Santa y las cofradías de Sevilla y su provincia.

## Producto

- Home editorial con actualidad, descubrimiento y acceso a la enciclopedia.
- Directorios públicos de Hermandades, Imágenes, Pasos y Bandas.
- Procesiones extraordinarias y de Gloria construidas sobre el modelo común de salidas.
- Fichas relacionadas con fuentes, patrimonio, música, autores y acontecimientos.
- Tira del hilo para consultar únicamente conocimiento documentado en el grafo.
- Panel editorial autenticado, responsive y conectado a Supabase.
- Canal de aportaciones públicas con revisión humana y cuarentena privada.

## Arquitectura

- Next.js 16 y React 19.
- PostgreSQL, Auth y Storage en Supabase.
- Despliegues de producción y preview en Vercel.
- Migraciones SQL versionadas en `supabase/migrations`.
- Lectura pública stateless separada de la sesión editorial.

## Desarrollo local

Necesitas Node.js compatible con Next.js 16 y las variables de entorno del proyecto.

```bash
npm install
npm test
npm run dev
```

La aplicación queda disponible en `http://localhost:3000`.

El formulario de `/colabora` se muestra en vista previa y falla de forma cerrada. Para aceptar
envíos deben aplicarse las migraciones, configurar Supabase y Turnstile en el entorno, publicar
la actualización de privacidad y establecer `PUBLIC_CONTRIBUTIONS_ENABLED=true`. Ninguna clave
privada debe usar el prefijo `NEXT_PUBLIC_`; consulta `.env.example` para los nombres esperados.

Antes de proponer un cambio consulta `docs/HILO-ORQUESTADOR.md` y
`docs/ESTADO-PROYECTO.md`. Todo corte debe superar tests, build, preview y smoke
antes de llegar a producción.

## Gobierno editorial

- Las propuestas automáticas nunca son verdad canónica sin revisión humana.
- Las entidades y relaciones nuevas nacen en borrador.
- Las fotografías conservan procedencia, crédito y derechos.
- Las aportaciones públicas nunca escriben directamente en el grafo: pasan por controles
  antiabuso, una cola privada y revisión editorial trazable.
