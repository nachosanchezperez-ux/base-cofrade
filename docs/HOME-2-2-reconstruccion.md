# Home 2.2 · reconstrucción sobre main

Este documento registra la reconstrucción limpia de la propuesta original #226 sobre el `main` vigente tras la integración de Extraordinarias.

## Alcance preservado

- Imagen/Paso: fotografía de portada documentada antes que escudo contextual.
- Hermandad: escudo como identidad principal; fotografía pública documentada solo si no existe escudo.
- Banda: hero fotográfico → fotografía documentada → logotipo.
- Solo recursos con derechos `owned`, `authorized`, `licensed` o `public_domain`.
- Respeto de `focus_x` / `focus_y`.
- Créditos fotográficos disponibles en Hoy y visibles en Explorar.
- Snapshot de Home renovado a `v5` para evitar servir durante el despliegue una caché creada con la lógica visual anterior.

## Compatibilidad con Home actual

La reconstrucción parte del `main` vigente y conserva intactos los loaders y bloques de Extraordinarias presentes en `home-snapshot.js`. El cambio de snapshot altera únicamente la clave de caché; mantiene `revalidate: 60`, la tag `home-public` y el contenido actual del snapshot.

## Validación pendiente antes de producción

- CI y build.
- Preview de Vercel.
- Hero / Tira del hilo / Hoy / Extraordinaria / Últimos hilos / Explorar / Marcha del día.
- Escritorio / tablet / móvil.
- Smoke posterior a merge en producción.
