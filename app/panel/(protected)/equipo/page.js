import { requirePanelAdmin } from '@/lib/panel/auth'
import { getPanelUsers } from '@/lib/panel/data'
import { savePanelUserAction } from './actions'
import styles from '@/app/panel/panel.module.css'

const ROLE_LABELS = { admin: 'Administrador', editor: 'Editor', collaborator: 'Colaborador' }

export const metadata = { title: 'Equipo editorial · Panel' }

function RoleSelect({ value = 'collaborator' }) {
  return <select name="role" defaultValue={value}><option value="admin">Administrador</option><option value="editor">Editor</option><option value="collaborator">Colaborador</option></select>
}

export default async function PanelTeamPage({ searchParams }) {
  await requirePanelAdmin()
  const [profiles, query] = await Promise.all([getPanelUsers(), searchParams])

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}><div><span className={styles.eyebrow}>Administración</span><h1>Equipo editorial</h1><p>Accesos y responsabilidades del panel de control.</p></div></header>
      {query?.saved ? <div className={styles.savedNotice} role="status">Perfil guardado correctamente.</div> : null}

      <section className={styles.panelCard}>
        <div className={styles.listHeading}><strong>{profiles.length} perfiles autorizados</strong><small>La autenticación permanece en Supabase Auth</small></div>
        <div className={styles.teamList}>
          {profiles.map((profile) => (
            <form action={savePanelUserAction} key={profile.user_id}>
              <input type="hidden" name="user_id" value={profile.user_id} />
              <input type="hidden" name="is_new" value="false" />
              <span className={styles.avatar}>{profile.display_name.slice(0, 2).toUpperCase()}</span>
              <label><span>Nombre visible</span><input name="display_name" defaultValue={profile.display_name} required /></label>
              <label><span>Perfil</span><RoleSelect value={profile.role} /></label>
              <label className={styles.inlineCheck}><input name="active" type="checkbox" defaultChecked={profile.active} /><span>Activo</span></label>
              <button className={styles.smallButton} type="submit">Guardar</button>
            </form>
          ))}
        </div>
      </section>

      <section className={`${styles.panelCard} ${styles.teamCreate}`}>
        <div><span className={styles.eyebrow}>Nuevo acceso</span><h2>Vincular una cuenta existente</h2><p>Primero crea el usuario en Supabase Auth. Después pega aquí su identificador y asigna su responsabilidad.</p></div>
        <form action={savePanelUserAction} className={styles.formGrid}>
          <input type="hidden" name="is_new" value="true" />
          <label className={styles.fieldWide}><span>ID de usuario de Supabase Auth</span><input name="user_id" placeholder="00000000-0000-0000-0000-000000000000" required /></label>
          <label><span>Nombre visible</span><input name="display_name" required /></label>
          <label><span>Perfil</span><RoleSelect /></label>
          <label className={styles.inlineCheck}><input name="active" type="checkbox" defaultChecked /><span>Acceso activo</span></label>
          <div className={styles.formActions}><small>El correo y la contraseña no se guardan en esta tabla.</small><button className={styles.primaryButton} type="submit">Añadir al equipo</button></div>
        </form>
      </section>

      <section className={styles.roleGuide} aria-label="Permisos por perfil">
        {Object.entries(ROLE_LABELS).map(([role, label]) => <article key={role}><strong>{label}</strong><p>{role === 'admin' ? 'Gestiona perfiles y todo el contenido.' : role === 'editor' ? 'Edita, revisa y publica contenidos.' : 'Consulta el panel y participa en la documentación.'}</p></article>)}
      </section>
    </div>
  )
}
