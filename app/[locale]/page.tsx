import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Hero from '@/components/home/Hero';
import ProductCategories from '@/components/home/ProductCategories';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import SourcingStory from '@/components/home/SourcingStory';
import Statistics from '@/components/home/Statistics';
import CTABanner from '@/components/home/CTABanner';
import NewsSection from '@/components/home/NewsSection';
import CustomSections from '@/components/home/CustomSections';
import PopularProducts from '@/components/home/PopularProducts';
import DiscountedProducts from '@/components/home/DiscountedProducts';
import { getNews, getSections, getHomeLayout, getProducts } from '@/lib/config-store';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });
  const th = await getTranslations({ locale, namespace: 'hero' });
  return {
    title: t('company_name'),
    description: th('subtitle'),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  const [allNews, customSections, homeLayout, allProducts] = await Promise.all([
    getNews(),
    getSections(),
    getHomeLayout(),
    getProducts().catch(() => []),
  ]);

  const latestNews = allNews.filter((a) => a.visible).slice(0, 3);
  const visibleSections = [...homeLayout].sort((a, b) => a.order - b.order).filter((s) => s.visible);

  return (
    <>
      {visibleSections.map((section) => {
        switch (section.type) {
          case 'hero':
            return <Hero key={section.id} />;
          case 'product_categories':
            return <ProductCategories key={section.id} />;
          case 'why_choose_us':
            return <WhyChooseUs key={section.id} />;
          case 'sourcing_story':
            return <SourcingStory key={section.id} />;
          case 'statistics':
            return <Statistics key={section.id} />;
          case 'custom_sections':
            return <CustomSections key={section.id} sections={customSections} locale={locale} />;
          case 'news':
            return <NewsSection key={section.id} articles={latestNews} locale={locale} />;
          case 'cta_banner':
            return <CTABanner key={section.id} />;
          case 'popular_products':
            return <PopularProducts key={section.id} products={allProducts} locale={locale} />;
          case 'discounted_products':
            return <DiscountedProducts key={section.id} products={allProducts} locale={locale} />;
          default:
            return null;
        }
      })}
    </>
  );
}
