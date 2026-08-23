import panelStyles from '@/app/panel/panel.module.css'
import styles from './PanelFormGroup.module.css'

export default function PanelFormGroup({
  eyebrow = '',
  title,
  description = '',
  children,
  className = '',
  bodyClassName = '',
}) {
  const sectionClassName = [styles.group, className].filter(Boolean).join(' ')
  const bodyClasses = [panelStyles.formGrid, styles.body, bodyClassName].filter(Boolean).join(' ')

  return (
    <section className={sectionClassName} data-panel-form-group>
      <div className={styles.heading}>
        <div>
          {eyebrow ? <span className={panelStyles.eyebrow}>{eyebrow}</span> : null}
          <h3>{title}</h3>
        </div>
        {description ? <p>{description}</p> : null}
      </div>
      <div className={bodyClasses}>{children}</div>
    </section>
  )
}
