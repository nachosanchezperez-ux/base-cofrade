import './globals.css';
import HiloHeader from '@/components/HiloHeader';
import HiloFooter from '@/components/HiloFooter';

export const metadata = {
  title: {
    default: 'Hilo Cofrade',
    template: '%s · Hilo Cofrade',
  },
  description: 'Hilo Cofrade, todo en las cofradías está relacionado',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <HiloHeader />
        <main>{children}</main>
        <HiloFooter />
      </body>
    </html>
  );
}
