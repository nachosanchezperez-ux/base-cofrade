import Link from 'next/link';

// Without its own metadata the 404 inherited the layout's `index, follow` and
// home title next to Next's automatic `noindex`.
export const metadata = {
  title: 'Página no encontrada',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="section page-top">
      <div className="shell empty-page">
        <span className="eyebrow">404</span>
        <h1>No encontramos esa ficha.</h1>
        <p>Puede que la dirección haya cambiado o que la ficha todavía no esté publicada.</p>
        <Link className="button button-primary" href="/hermandades">Volver a hermandades</Link>
      </div>
    </section>
  );
}
