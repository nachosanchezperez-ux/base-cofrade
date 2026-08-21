import Image from 'next/image';
import Link from 'next/link';
import RelationalEntityHeroMedia from './RelationalEntityHeroMedia';
import styles from './RelationalEntityHero.module.css';

function Breadcrumb({ items = [] }) {
  if (!items.length) return null;

  return (
    <nav className={styles.breadcrumb} aria-label="Ruta de navegación">
      <span className={styles.breadcrumbAccent} aria-hidden="true" />
      <ol>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`}>
              {item.href && !isCurrent ? <Link href={item.href}>{item.label}</Link> : <span aria-current={isCurrent ? 'page' : undefined}>{item.label}</span>}
              {!isCurrent ? <i aria-hidden="true">→</i> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function ParentRelation({ relation }) {
  if (!relation?.name || !relation?.href) return null;

  return (
    <Link className={styles.relation} href={relation.href}>
      {relation.crestSrc ? (
        <span className={styles.relationCrest}>
          <Image src={relation.crestSrc} alt="" width={40} height={46} sizes="40px" />
        </span>
      ) : null}
      <span className={styles.relationCopy}>
        <small>{relation.label || 'Pertenece a'}</small>
        <strong>{relation.name}</strong>
      </span>
      <span className={styles.relationArrow} aria-hidden="true">↗</span>
    </Link>
  );
}

function titleScale(title = '') {
  if (title.length > 82) return 'dense';
  if (title.length > 52) return 'compact';
  return 'default';
}

export default function RelationalEntityHero({
  variant = 'image',
  entityType,
  title,
  subtitle = '',
  breadcrumbItems = [],
  badges = [],
  relation = null,
  facts = [],
  media = {},
  mark = null,
}) {
  const visibleBadges = badges.filter(Boolean).slice(0, 4);
  const visibleFacts = facts.filter((fact) => fact?.label && fact?.value).slice(0, 3);

  return (
    <section className={`${styles.hero} ${styles[`hero_${variant}`]}`} aria-labelledby="entity-hero-title">
      <div className={`shell ${styles.inner}`}>
        <Breadcrumb items={breadcrumbItems} />
        <div className={styles.grid}>
          <div className={styles.copy}>
            <div className={styles.identityLead}>
              {mark?.src ? (
                <span className={styles.identityMark}>
                  <Image src={mark.src} alt={mark.alt || ''} width={52} height={60} sizes="52px" />
                </span>
              ) : null}
              <div className={styles.identityRow}>
                <span className={styles.entityType}>{entityType}</span>
                {visibleBadges.map((badge) => <span className={styles.badge} key={badge}>{badge}</span>)}
              </div>
            </div>

            <h1 id="entity-hero-title" data-scale={titleScale(title)}>{title}</h1>
            {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
            <ParentRelation relation={relation} />

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

          <RelationalEntityHeroMedia variant={variant} {...media} />
        </div>
      </div>
    </section>
  );
}
