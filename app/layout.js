import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: {
    default: 'Base Cofrade',
    template: '%s · Base Cofrade',
  },
  description: 'Enciclopedia digital e interactiva de hermandades y cofradías.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <header className="site-header">
          <div className="shell header-inner">
            <Link href="/" className="brand" aria-label="Base Cofrade, inicio">
              <span className="brand-mark">BC</span>
              <span>
                <strong>Base Cofrade</strong>
                <small>Archivo vivo de hermandades</small>
              </span>
            </Link>
            <nav className="main-nav" aria-label="Navegación principal">
              <Link href="/hermandades">Hermandades</Link>
              <span className="nav-disabled">Imágenes</span>
              <span className="nav-disabled">Autores</span>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="shell footer-inner">
            <div>
              <strong>Base Cofrade</strong>
              <p>Prototipo v0.1 · Datos de demostración.</p>
            </div>
            <p>Una base de conocimiento cofrade construida para crecer por relaciones.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
