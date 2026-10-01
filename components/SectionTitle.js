export default function SectionTitle({ eyebrow, title, description, level = 2 }) {
  const Heading = `h${level}`;
  return (
    <div className="section-heading">
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <Heading>{title}</Heading>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
