import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/600.css';
import '@fontsource/open-sans/700.css';
import '@fontsource/open-sans/800.css';
import './globals.css';
import './typography.css';
import './crest.css';
import HiloHeader from '@/components/HiloHeader';
import HiloFooter from '@/components/HiloFooter';
import JsonLd from '@/components/JsonLd';
import HiloAnalytics from '@/components/analytics/HiloAnalytics';
import {
  DEFAULT_DESCRIPTION,
  HOME_TITLE,
  SITE_NAME,
  SITE_URL,
} from '@/lib/seo';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: '%s · Hilo Cofrade',
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: HOME_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  inLanguage: 'es',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <JsonLd data={websiteJsonLd} />
        <HiloHeader />
        <main>{children}</main>
        <HiloFooter />
        <HiloAnalytics />
      </body>
    </html>
  );
}
