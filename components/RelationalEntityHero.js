import Image from 'next/image';
import Link from 'next/link';
import RelationalEntityHeroMedia from './RelationalEntityHeroMedia';
import styles from './RelationalEntityHero.module.css';
import polishStyles from './RelationalEntityHeroPolish.module.css';

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
              {item.href && !isCurrent ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span aria-current={isCurrent ? 'page' : undefined}>{item.label}</span>
              )}
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
    <Link className={`${styles.relation} ${polishStyles.relation}`} href={relation.href}>
      {relation.crestSrc ? (
        <span className={styles.relationCrest}>
          <Image
            src={relation.crestSrc}
            alt=""
            width={42}
            height={50}
            sizes="42px"
          />
        </span>
      ) : (
        <span className={styles.relationNode} aria-hidden="true">HC</span>
      )}
      <span className={styles.relationCopy}>
        <small>{relation.label || 'Pertenece a'}</small>
        <strong>{relation.name}</strong>
      </span>
      <span className={styles.relationArrow} aria-hidden="true">↗</span>
    </Link>
  );
}

function BrotherhoodCrest({ src, alt }) {
  if (!src) return null;

  return (
    <span className={`${styles.identityCrest} ${polishStyles.identityCrest}`}>
      <Image src={src} alt={alt || ''} width={104} height={122} sizes="104px" priority />
    </span>
  );
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
}) {
  const visibleBadges = badges.filter(Boolean).slice(0, 4);
  const visibleFacts = facts.filter((fact) => fact?.label && fact?.value).slice(0, 3);
  const isBrotherhood = variant === 'brotherhood';

  const heading = (
    <div className={styles.titleBody}>
      <div className={styles.identityRow}>
        <span className={styles.entityType}>{entityType}</span>
        {visibleBadges.map((badge) => (
          <span className={styles.badge} key={badge}>{badge}</span>
        ))}
      </div>

      <h1 id="entity-hero-title">{title}</h1>
      {subtitle ? <p className={`${styles.subtitle} ${polishStyles.subtitle}`}>{subtitle}</p> : null}
    </div>
  );

  return (
    <section
      className={`${styles.hero} ${styles[`hero_${variant}`]} ${polishStyles.hero} ${polishStyles[`hero_${variant}`] || ''}`}
      aria-labelledby="entity-hero-title"
    >
      <div className={styles.texture} aria-hidden="true" />
      <div className="shell">
        <Breadcrumb items={breadcrumbItems} />

        <div className={`${styles.grid} ${polishStyles.grid}`}>
          <div className={`${styles.copy} ${polishStyles.copy}`}>
            {isBrotherhood ? (
              <div className={`${styles.brotherhoodLockup} ${polishStyles.brotherhoodLockup}`}>
                <BrotherhoodCrest src={media.crestSrc} alt={media.crestAlt} />
                {heading}
              </div>
            ) : heading}

            <ParentRelation relation={relation} />

            {visibleFacts.length ? (
              <dl className={`${styles.facts} ${polishStyles.facts}`} data-count={visibleFacts.length}>
                {visibleFacts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>
                      {fact.href ? <Link href={fact.href}>{fact.value}</Link> : fact.value}
                    </dd>
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
