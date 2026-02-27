import Image from 'next/image';
import { getNews } from '@/lib/config-store';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const isAr = locale === 'ar';
  return {
    title: isAr ? 'أخبار وتحديثات' : 'News & Updates',
  };
}

export default async function NewsPage({ params }: Props) {
  const { locale } = await params;
  const isAr = locale === 'ar';

  const allNews = await getNews();
  const articles = allNews.filter((a) => a.visible);

  return (
    <div className="min-h-screen bg-[var(--color-marble-white)]">
      {/* Hero */}
      <div className="bg-[var(--color-obsidian)] text-white py-20 px-6">
        <div className={`max-w-7xl mx-auto ${isAr ? 'text-right' : ''}`}>
          <p className="text-[var(--color-gold)] text-sm font-semibold uppercase tracking-widest mb-3">
            {isAr ? 'آخر الأخبار' : 'Latest News'}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold">
            {isAr ? 'أخبار وتحديثات' : 'News & Updates'}
          </h1>
        </div>
      </div>

      {/* Articles */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {articles.length === 0 ? (
          <p className={`text-[var(--color-warm-gray)] text-center py-20 ${isAr ? 'text-right' : ''}`}>
            {isAr ? 'لا توجد مقالات بعد.' : 'No articles yet. Check back soon.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {article.imageUrl && (
                  <div className="relative h-52 w-full">
                    <Image
                      src={article.imageUrl}
                      alt={isAr ? article.titleAr : article.titleEn}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className={`p-6 ${isAr ? 'text-right' : ''}`}>
                  <p className="text-[var(--color-warm-gray)] text-xs mb-3">
                    {new Date(article.publishedAt).toLocaleDateString(isAr ? 'ar-SA' : 'en-GB', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                  <h2 className="text-xl font-bold text-[var(--color-obsidian)] mb-3">
                    {isAr ? article.titleAr : article.titleEn}
                  </h2>
                  <p className="text-[var(--color-warm-gray)] text-sm mb-4">
                    {isAr ? article.summaryAr : article.summaryEn}
                  </p>
                  {(article.contentEn || article.contentAr) && (
                    <div
                      className={`text-[var(--color-obsidian)] text-sm leading-relaxed whitespace-pre-line pt-4 border-t border-[var(--color-sand)]`}
                    >
                      {isAr ? article.contentAr : article.contentEn}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
