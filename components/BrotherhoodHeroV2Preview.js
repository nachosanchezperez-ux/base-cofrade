import Image from 'next/image';
import Link from 'next/link';
import styles from './BrotherhoodHeroV2Preview.module.css';

function Breadcrumb({ items = [] }) {
  if (!items.length) return null;

  return (
    <nav className={styles.breadcrumb} aria-label="Ruta de navegación">
      <span className={styles.breadcrumbLine} aria-hidden="true" />
      <ol>
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`}>
              {item.href && !current ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span aria-current={current ? 'page' : undefined}>{item.label}</span>
              )}
              {!current ? <i aria-hidden="true">→</i> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default function BrotherhoodHeroV2Preview({
  title,
  subtitle = '',
  breadcrumbItems = [],
  badges = [],
  facts = [],
  crestSrc = '',
  crestAlt = '',
  photoSrc,
  photoAlt,
  photoCredit,
}) {
  const visibleBadges = badges.filter(Boolean).slice(0, 3);
  const visibleFacts = facts.filter((fact) => fact?.label && fact?.value).slice(0, 3);
  const seat = visibleFacts.find((fact) => /sede/i.test(fact.label))?.value || '';
  const outingDay = visibleFacts.find((fact) => /salida/i.test(fact.label))?.value || '';
  const context = [outingDay, seat].filter(Boolean).join(' · ');

  return (
    <section className={styles.hero} aria-labelledby="entity-hero-title">
      <div className={styles.photoLayer} aria-hidden="true">
        <img src={photoSrc} alt="" />
      </div>
      <div className={styles.photoVeil} aria-hidden="true" />
      <div className={styles.texture} aria-hidden="true" />

      <div className={`shell ${styles.shell}`}>
        <Breadcrumb items={breadcrumbItems} />

        <div className={styles.content}>
          <div className={styles.lockup}>
            {crestSrc ? (
              <div className={styles.crest}>
                <Image
                  src={crestSrc}
                  alt={crestAlt || `Escudo de ${title}`}
                  width={130}
                  height={154}
                  sizes="(max-width: 620px) 76px, (max-width: 980px) 102px, 126px"
                  priority
                />
              </div>
            ) : null}

            <div className={styles.copy}>
              <div className={styles.identityRow}>
                <span className={styles.entityType}>Hermandad</span>
                {visibleBadges.map((badge) => (
                  <span className={styles.badge} key={badge}>{badge}</span>
                ))}
              </div>

              <h1 id="entity-hero-title">{title}</h1>
              {context ? <p className={styles.context}>{context}</p> : null}
              {subtitle ? <p className={styles.officialName}>{subtitle}</p> : null}
            </div>
          </div>

          {visibleFacts.length ? (
            <dl className={styles.facts} data-count={visibleFacts.length}>
              {visibleFacts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.href ? <Link href={fact.href}>{fact.value}</Link> : fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        <div className={styles.photoMeta}>
          <span aria-hidden="true" />
          <small>{photoCredit}</small>
        </div>
        <span className={styles.srOnly}>{photoAlt}</span>
      </div>
    </section>
  );
}
