import QuickMediaUploadForm from '@/app/panel/(protected)/hermandades/[id]/multimedia/QuickMediaUploadForm'
import MediaAssetManager from '@/app/panel/(protected)/hermandades/[id]/multimedia/MediaAssetManager'
import styles from './BrotherhoodInlineMedia.module.css'

export default function BrotherhoodInlineMedia({
  brotherhoodId,
  targetId,
  targetKind = 'entity',
  title,
  returnSection,
  defaultAuthor = '',
  defaultAlt = '',
  media = [],
}) {
  if (!brotherhoodId || !targetId) return null

  const cover = media.find((item) => item.is_cover && item.asset)
    || media.find((item) => ['cover', 'hero', 'principal', 'main'].includes(item.relation_type) && item.asset)
    || media.find((item) => item.asset)
    || null
  const author = cover?.asset?.author_name || ''
  const returnPath = `/panel/hermandades/${brotherhoodId}/${returnSection}#media-${targetId}`

  return (
    <details className={styles.panel} id={`media-${targetId}`}>
      <summary className={styles.summary}>
        <span className={styles.summaryCopy}>
          {cover?.publicUrl ? (
            <span className={`${styles.icon} ${styles.preview}`} aria-hidden="true">
              <img src={cover.publicUrl} alt="" />
            </span>
          ) : (
            <span className={styles.icon} aria-hidden="true">＋</span>
          )}
          <span>
            <strong>Fotografía principal</strong>
            <small>
              {cover
                ? (author ? `Fotografía · ${author}` : 'Sin autor documentado · edita la información aquí')
                : 'Añádela aquí, sin salir de esta sección.'}
            </small>
          </span>
        </span>
        <span className={styles.action}>{cover ? 'Ver / editar' : 'Añadir / cambiar'}</span>
      </summary>

      <div className={styles.content}>
        {media.length ? (
          <>
            <p className={styles.intro}>
              Revisa la fotografía vinculada a <strong>{title}</strong> y completa su autoría, pie, descripción accesible o derechos.
            </p>
            <MediaAssetManager
              media={media}
              brotherhoodId={brotherhoodId}
              targetId={targetId}
              targetKind={targetKind}
              returnPath={returnPath}
            />
            <details className={styles.addMore}>
              <summary>Añadir otra fotografía</summary>
              <div className={styles.addMoreContent}>
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
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </details>
  )
}
