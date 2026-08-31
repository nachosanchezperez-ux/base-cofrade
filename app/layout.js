import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/600.css';
import '@fontsource/open-sans/700.css';
import '@fontsource/open-sans/800.css';
import './globals.css';
import './brand.css';
import './typography.css';
import './crest.css';
import './habit-layout.css';
import './step-preview.css';
import './home-mobile-contract.css';
import './titulars-desktop-layout.css';
import './readability.css';
import HiloHeader from '@/components/HiloHeader';
import HiloFooter from '@/components/HiloFooter';
import JsonLd from '@/components/JsonLd';
import HiloAnalytics from '@/components/analytics/HiloAnalytics';
import { DEFAULT_DESCRIPTION, HOME_TITLE, SITE_NAME, SITE_URL } from '@/lib/seo';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: HOME_TITLE, template: '%s · Hilo Cofrade' },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  creator: SITE_NAME,
  publisher: SITE_NAME,
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/brand/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/brand/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
    ],
    shortcut: '/brand/favicon.ico',
    apple: [{ url: '/brand/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website', locale: 'es_ES', url: SITE_URL, siteName: SITE_NAME, title: HOME_TITLE, description: DEFAULT_DESCRIPTION,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Hilo Cofrade, enciclopedia cofrade de Sevilla y provincia' }],
  },
  twitter: { card: 'summary_large_image', title: HOME_TITLE, description: DEFAULT_DESCRIPTION, images: ['/opengraph-image'] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
};

export const viewport = { themeColor: '#112339' };

const websiteJsonLd = {
  '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: SITE_URL, name: SITE_NAME, description: DEFAULT_DESCRIPTION, inLanguage: 'es',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body id="hc-app">
        <JsonLd data={websiteJsonLd} />
        <a className="skip-link" href="#main-content">Saltar al contenido</a>
        <HiloHeader />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <HiloFooter />
        <HiloAnalytics />
      </body>
    </html>
  );
}
