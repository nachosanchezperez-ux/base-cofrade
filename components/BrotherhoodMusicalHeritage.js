import Link from 'next/link';
import SectionTitle from './SectionTitle';
import styles from './BrotherhoodMusicalHeritage.module.css';

const GROUPS = [
  { key: 'Cornetas y Tambores', label: 'Cornetas y tambores', short: 'CT' },
  { key: 'Banda de Música', label: 'Banda de música', short: 'BM' },
];

function AuthorLine({ item }) {
  const composerNames = item.composers.map((author) => author.name).join(' · ');
  const adapterNames = item.adapters.map((author) => author.name).join(' · ');

  return (
    <div className={styles.authorship}>
      <span>{composerNames || 'Autoría por documentar'}</span>
      {adapterNames ? <small>Instrumentación · {adapterNames}</small> : null}
    </div>
  );
}

function MarchRow({ item }) {
  return (
    <article className={styles.march}>
      <div className={styles.year}>{item.year || '—'}</div>
      <div className={styles.copy}>
        <h4>{item.name}</h4>
        <AuthorLine item={item} />
        {item.bandRelation?.name ? (
          <div className={styles.bandRelation}>
            <small>{item.bandRelation.label}</small>
            {item.bandRelation.slug ? (
              <Link href={`/bandas/${item.bandRelation.slug}`}>{item.bandRelation.name} <span>↗</span></Link>
            ) : (
              <strong>{item.bandRelation.name}</strong>
            )}
          </div>
        ) : null}
      </div>
      {item.listening?.url ? (
        <a
          className={styles.listen}
          href={item.listening.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Escuchar ${item.name} en ${item.listening.provider}`}
        >
          <span>▶</span>{item.listening.provider}
        </a>
      ) : null}
    </article>
  );
}

export default function BrotherhoodMusicalHeritage({ items = [] }) {
  if (!items.length) return null;

  const groups = GROUPS.map((group) => ({
    ...group,
    items: items.filter((item) => item.musicType === group.key),
  })).filter((group) => group.items.length);

  return (
    <section className={`section ${styles.section}`} id="musica">
      <div className="shell">
        <div className={styles.intro}>
          <SectionTitle
            eyebrow="Sonidos propios"
            title="Patrimonio musical"
            description="Marchas dedicadas a la Hermandad y a sus titulares. La dedicatoria forma parte del patrimonio del Baratillo con independencia de qué banda la estrene, la grabe o acompañe actualmente a la cofradía."
          />
          <div className={styles.summary} aria-label="Resumen del patrimonio musical">
            <strong>{items.length}</strong>
            <span>marchas documentadas</span>
            {groups.map((group) => (
              <small key={group.key}>{group.items.length} · {group.short}</small>
            ))}
          </div>
        </div>

        <div className={styles.groups}>
          {groups.map((group) => (
            <section className={styles.group} key={group.key} aria-labelledby={`music-${group.short.toLowerCase()}`}>
              <header className={styles.groupHeader}>
                <span className={styles.groupMark} aria-hidden="true">{group.short}</span>
                <div>
                  <h3 id={`music-${group.short.toLowerCase()}`}>{group.label}</h3>
                  <p>{group.items.length} marchas documentadas</p>
                </div>
              </header>
              <div className={styles.list}>
                {group.items.map((item) => <MarchRow item={item} key={item.id} />)}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
