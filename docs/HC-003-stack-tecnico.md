# HC-003 · Stack técnico

**Estado:** IMPLEMENTADA / VIGENTE  
**Ámbito:** arquitectura de aplicación, despliegue y datos

## Decisión

El stack canónico de Hilo Cofrade se compone de:

- **Next.js App Router** para aplicación pública y Panel;
- **Vercel** para build, previews, producción y observabilidad;
- **Supabase / PostgreSQL** para datos, relaciones, RLS y funciones de base de datos;
- **GitHub** como fuente versionada de código, migraciones y documentación operativa.

## Reglas

- Los cambios estructurales de base de datos se versionan como migraciones.
- GitHub y el historial remoto de Supabase deben permanecer reconciliados.
- Cada cambio funcional significativo pasa por CI, preview y smoke de producción cuando proceda.
- El Front público utiliza lectura `anon` stateless y no debe depender de la sesión editorial del Panel.
- El Panel puede utilizar sesión SSR autenticada para operaciones editoriales.
- Vercel y Supabase son fuentes de verdad operativa; la documentación resume el estado pero no lo sustituye.

## Regla de no regresión

No introducir un segundo backend, una base de datos paralela, una capa de persistencia local o un mecanismo de despliegue alternativo para resolver un caso que encaja en este stack sin una decisión HC nueva.