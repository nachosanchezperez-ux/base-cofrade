import Link from 'next/link';
import { socialMetadata } from '@/lib/seo';
import styles from './page.module.css';

const title = 'Colabora';
const description = 'Ayuda a completar Hilo Cofrade proponiendo información, correcciones, nuevas entidades o fuentes documentales para su revisión.';

export const metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path: '/colabora' }),
};

export default function ColaboraPage() {
  return (
    <section className={styles.page}>
      <div className="shell">
        <span className={styles.eyebrow}>Participa</span>
        <h1>Ayúdanos a completar el hilo</h1>
        <p className={styles.lead}>
          Hilo Cofrade crecerá también con propuestas de hermandades, bandas y usuarios,
          siempre con revisión y documentación antes de publicar
        </p>

        <div className={styles.card}>
          <span className={styles.status}>Formulario beta</span>
          <h2>Estamos preparando el sistema de aportaciones</h2>
          <p>
            El formulario permitirá proponer nueva información, corregir un dato, incorporar
            una entidad o aportar una fuente documental
          </p>
          <div className={styles.steps}>
            <span>1 · Envías</span>
            <span>2 · Revisamos</span>
            <span>3 · Documentamos</span>
            <span>4 · Publicamos</span>
          </div>
          <p className={styles.note}>
            Ninguna aportación se publicará automáticamente. Hilo Cofrade revisará cada propuesta antes de incorporarla
          </p>
        </div>

        <Link className={styles.back} href="/#enciclopedia">← Volver a Hilo Cofrade</Link>
      </div>
    </section>
  );
}
