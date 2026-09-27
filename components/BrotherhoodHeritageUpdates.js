import Image from 'next/image';
import { groupHeritageReleases, knownReleaseText, releaseAuthorship } from '@/lib/heritage-release-groups';
import styles from './BrotherhoodHeritageUpdates.module.css';

function ReleaseEntry({ item, entryKey, sourcesHref }) {
  const imageSrc = String(item.imagen?.src || '').trim();
  const title = knownReleaseText(item.titulo) || knownReleaseText(item.elemento);
  const authorship = releaseAuthorship(item);
  const description = String(item.descripcion || '').trim();
  const discipline = knownReleaseText(item.disciplina);
  const date = knownReleaseText(item.fecha);
  const agents = (Array.isArray(item.agentes) ? item.agentes : [])
    .filter((agent) => knownReleaseText(agent?.nombre) && knownReleaseText(agent?.rol));
  const hasDetails = Boolean(description || discipline || date || agents.length || imageSrc || sourcesHref);
  const summary = (
    <>
      {imageSrc ? (
        <span className={styles.thumbnail}>
          <Image src={imageSrc} alt="" fill sizes="52px" />
        </span>
      ) : null}
      <span className={styles.entryCopy}>
        {knownReleaseText(item.tipo) ? <span className={styles.type}>{item.tipo}</span> : null}
        <strong className={styles.title}>{title}</strong>
        {authorship ? <span className={styles.authorship}>{authorship}</span> : null}
      </span>
      {hasDetails ? <b className={styles.toggle} aria-hidden="true" /> : null}
    </>
  );

  if (!hasDetails) return <div className={styles.staticEntry}>{summary}</div>;

  return (
    <details className={styles.entry} id={`estreno-${entryKey}`}>
      <summary className={styles.entrySummary}>{summary}</summary>
      <div className={styles.detail}>
        {description ? <p className={styles.description}>{description}</p> : null}
        {(discipline || date) ? (
          <dl className={styles.facts}>
            {discipline ? <div><dt>Disciplina</dt><dd>{discipline}</dd></div> : null}
            {date ? <div><dt>Fecha</dt><dd><time dateTime={item.fechaIso || undefined}>{date}</time></dd></div> : null}
          </dl>
        ) : null}
        {agents.length ? (
          <dl className={styles.facts}>
            {agents.map((agent, index) => (
              <div key={`${agent.id || index}-${agent.rol}`}><dt>{agent.rol}</dt><dd>{agent.nombre}</dd></div>
            ))}
          </dl>
        ) : null}
        {imageSrc ? (
          <figure className={styles.figure}>
            <div className={styles.imageFrame}>
              <Image src={imageSrc} alt={item.imagen.alt || title} fill sizes="(max-width: 700px) calc(100vw - 80px), 640px" />
            </div>
            {item.imagen.credito ? <figcaption>{item.imagen.credito}</figcaption> : null}
          </figure>
        ) : null}
        {sourcesHref ? <a className={styles.sourceLink} href={sourcesHref}>Fuentes documentales <span aria-hidden="true">→</span></a> : null}
      </div>
    </details>
  );
}

/** Native disclosures keep the full text in server HTML and work without JavaScript. */
export default function BrotherhoodHeritageUpdates({ items = [], currentYear, sourcesHref }) {
  const groups = groupHeritageReleases(items, currentYear);
  if (!groups.length) return null;

  return (
    <div className={`heritage-timeline-block ${styles.section}`} id="estrenos" data-heritage-updates="compact">
      <div className="heritage-subheading"><span className="eyebrow">Evolución documentada</span><h3>Estrenos y restauraciones</h3></div>
      <div className={styles.years}>
        {groups.map((group) => (
          <details className={styles.year} key={group.key} open={group.open} data-release-year={group.key}>
            <summary className={styles.yearSummary}>
              <strong>{group.label}</strong><span>{group.countLabel}</span><b className={styles.toggle} aria-hidden="true" />
            </summary>
            <div className={styles.entries}>
              {group.items.map((item, index) => (
                <ReleaseEntry key={item.id || `${group.key}-${index}`} entryKey={item.id || `${group.key}-${index}`} item={item} sourcesHref={sourcesHref} />
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
