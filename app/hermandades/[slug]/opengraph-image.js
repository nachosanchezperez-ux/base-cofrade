import { renderBrotherhoodSocialImage } from '@/lib/brotherhood-social-image';

export const alt = 'Hilo Cofrade · ficha de Hermandad';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage({ params }) {
  const { slug } = await params;
  return renderBrotherhoodSocialImage(slug);
}
