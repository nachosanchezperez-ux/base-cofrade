import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section page-top">
      <div className="shell empty-page">
        <span className="eyebrow">404</span>
        <h1>No encontramos esa ficha.</h1>
        <p>Puede que todavía no esté incorporada al prototipo.</p>
        <Link className="button button-primary" href="/hermandades">Volver a hermandades</Link>
      </div>
    </section>
  );
}
