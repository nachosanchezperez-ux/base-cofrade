import { absoluteUrl } from '@/lib/seo';

function normalizeJsonLd(data) {
  if (data?.['@type'] !== 'Event' || data.image) return data;

  return {
    ...data,
    image: [absoluteUrl('/opengraph-image')],
  };
}

export default function JsonLd({ data }) {
  const normalizedData = normalizeJsonLd(data);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(normalizedData).replace(/</g, '\\u003c'),
      }}
    />
  );
}
