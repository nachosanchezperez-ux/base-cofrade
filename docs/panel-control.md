# Panel de control de Hilo Cofrade

El panel privado vive en `/panel` y utiliza Supabase Auth. No necesita una clave
`service_role` en la aplicación.

## Activación inicial

1. Aplicar la migración `20260812090016_panel_control_auth_roles.sql` en el
   proyecto de Supabase.
2. Crear la primera cuenta desde **Authentication → Users** en Supabase.
3. Vincularla como administradora desde el editor SQL:

```sql
insert into public.panel_users (user_id, display_name, role)
select id, 'Nombre visible', 'admin'
from auth.users
where email = 'correo@ejemplo.com';
```

4. Comprobar que el despliegue mantiene estas variables, ya utilizadas por la
   web pública:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Después, la cuenta puede entrar en `/panel/login` y añadir al resto del equipo
desde **Equipo editorial**. Cada persona debe existir antes en Supabase Auth.

## Perfiles

- **Administrador:** gestiona equipo, contenidos y archivo.
- **Editor:** edita, revisa, publica y archiva contenidos.
- **Colaborador:** consulta el panel para apoyar la documentación.

## Módulos habilitados

- Resumen editorial y actividad auditada.
- Hermandades: identidad, colores, estado y datos públicos.
- Archivo visual con autoría, derechos y relación con la ficha.
- Salidas recurrentes y rosarios, incluidos sus movimientos de ida y regreso.
- Cultos.
- Estrenos y restauraciones.

Los cambios publicados se invalidan en la caché de Next.js y se vuelven a leer
desde las mismas tablas que alimentan las fichas públicas.
