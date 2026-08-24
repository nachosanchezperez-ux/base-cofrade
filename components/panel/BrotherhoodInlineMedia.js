'use client'

import QuickMediaUploadForm from '@/app/panel/(protected)/hermandades/[id]/multimedia/QuickMediaUploadForm'
import styles from './BrotherhoodInlineMedia.module.css'

export default function BrotherhoodInlineMedia({
  brotherhoodId,
  targetId,
  targetKind = 'entity',
  title,
  returnSection,
  defaultAuthor = '',
  defaultAlt = '',
}) {
  if (!brotherhoodId || !targetId) return null

  return (
    <details className={styles.panel} id={`media-${targetId}`}>
      <summary className={styles.summary}>
        <span className={styles.summaryCopy}>
          <span className={styles.icon} aria-hidden="true">＋</span>
          <span>
            <strong>Fotografía principal</strong>
            <small>Añádela o sustitúyela aquí, sin salir de esta sección.</small>
          </span>
        </span>
        <span className={styles.action}>Añadir / cambiar</span>
      </summary>

      <div className={styles.content}>
        <p className={styles.intro}>
          La fotografía quedará vinculada automáticamente a <strong>{title}</strong>.
        </p>
        <QuickMediaUploadForm
          brotherhoodId={brotherhoodId}
          targetId={targetId}
          targetKind={targetKind}
          title={title}
          defaultAuthor={defaultAuthor}
          defaultAlt={defaultAlt || title}
          returnSection={returnSection}
          rightsHelp="Usa material propio o autorizado. Las licencias abiertas se gestionan desde Multimedia."
          uploadNote="Al terminar volverás a este mismo elemento."
        />
      </div>
    </details>
  )
}
