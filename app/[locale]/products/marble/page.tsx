import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getProducts } from '@/lib/config-store';
import ProductGrid from '@/components/products/ProductGrid';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'categories' });
  return {
    title: t('marble.page_title' as Parameters<typeof t>[0]),
    description: t('marble.page_desc' as Parameters<typeof t>[0]),
  };
}

export default async function MarblePage({ params }: Props) {
  const { locale } = await params;
  const isAr = locale === 'ar';
  const [allProducts, tEn, tAr] = await Promise.all([
    getProducts(),
    getTranslations({ locale: 'en', namespace: 'categories' }),
    getTranslations({ locale: 'ar', namespace: 'categories' }),
  ]);
  const products = allProducts.filter((p) => p.category === 'marble' && p.visible !== false);
  const heroImage = isAr
    ? tAr('marble.hero_image' as Parameters<typeof tAr>[0])
    : tEn('marble.hero_image' as Parameters<typeof tEn>[0]);

  return (
    <ProductGrid
      products={products}
      titleEn={tEn('marble.page_title' as Parameters<typeof tEn>[0])}
      titleAr={tAr('marble.page_title' as Parameters<typeof tAr>[0])}
      heroImage={heroImage}
      descEn={tEn('marble.page_desc' as Parameters<typeof tEn>[0])}
      descAr={tAr('marble.page_desc' as Parameters<typeof tAr>[0])}
    />
  );
}
