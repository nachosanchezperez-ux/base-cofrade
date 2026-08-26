import Link from 'next/link';
import { socialMetadata } from '@/lib/seo';
import styles from './page.module.css';

const title = 'Colabora';
const description = 'La vía pública de aportaciones de Hilo Cofrade está en preparación y todavía no recoge propuestas ni datos personales.';

export const metadata = {
  title,
  description,
  robots: {
    index: false,
    follow: true,
  },
  ...socialMetadata({ title, description, path: '/colabora' }),
};

export default function ColaboraPage() {
  return (
    <section className={styles.page}>
      <div className="shell">
        <span className={styles.eyebrow}>Canal en preparación</span>
        <h1>Las aportaciones públicas aún no están abiertas</h1>
        <p className={styles.lead}>
          Esta página no recoge propuestas ni datos personales. Antes de abrir el canal
          publicaremos sus condiciones de uso, privacidad y tratamiento editorial.
        </p>

        <div className={styles.card}>
          <span className={styles.status}>Cerrado temporalmente</span>
          <h2>Primero debe quedar definido el proceso completo</h2>
          <p>
            La futura vía de colaboración deberá ofrecer un único contacto, explicar qué datos
            se conservan y mantener toda aportación en revisión antes de incorporarla al grafo.
          </p>
          <p className={styles.note}>
            No se anunciará ni habilitará un formulario hasta completar esa información.
          </p>
        </div>

        <Link className={styles.back} href="/#enciclopedia">← Volver a Hilo Cofrade</Link>
      </div>
    </section>
  );
}
