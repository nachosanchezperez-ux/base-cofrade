import styles from '@/app/panel/panel.module.css'

export default function PanelFormGroup({
  eyebrow = '',
  title,
  description = '',
  children,
  className = '',
  bodyClassName = '',
}) {
  const sectionClassName = [styles.formGroup, className].filter(Boolean).join(' ')
  const bodyClasses = [styles.formGrid, bodyClassName].filter(Boolean).join(' ')

  return (
    <section className={sectionClassName} data-panel-form-group>
      <div className={styles.formGroupHeading}>
        <div>
          {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
          <h3>{title}</h3>
        </div>
        {description ? <p>{description}</p> : null}
      </div>
      <div className={bodyClasses}>{children}</div>
    </section>
  )
}
