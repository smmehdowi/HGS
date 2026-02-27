import Link from 'next/link';
import Image from 'next/image';
import { NewsArticle } from '@/lib/admin-types';

interface Props {
  articles: NewsArticle[];
  locale: string;
}

export default function NewsSection({ articles, locale }: Props) {
  const isAr = locale === 'ar';

  if (articles.length === 0) return null;

  return (
    <section className="py-20 bg-[var(--color-sand)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex items-end justify-between mb-10 ${isAr ? 'flex-row-reverse' : ''}`}>
          <div>
            <p className={`text-[var(--color-gold)] text-sm font-semibold mb-2 ${isAr ? '' : 'uppercase tracking-widest'}`}>
              {isAr ? 'آخر الأخبار' : 'Latest News'}
            </p>
            <h2 className="text-3xl font-bold text-[var(--color-obsidian)]">
              {isAr ? 'أخبار وتحديثات' : 'News & Updates'}
            </h2>
          </div>
          <Link
            href={`/${locale}/news`}
            className="text-[var(--color-deep-green)] text-sm font-semibold hover:underline"
          >
            {isAr ? 'عرض الكل ←' : 'View All →'}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {article.imageUrl && (
                <div className="relative h-48 w-full">
                  <Image
                    src={article.imageUrl}
                    alt={isAr ? article.titleAr : article.titleEn}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}
              <div className={`p-5 ${isAr ? 'text-right' : ''}`}>
                <p className="text-[var(--color-warm-gray)] text-xs mb-2">
                  {new Date(article.publishedAt).toLocaleDateString(isAr ? 'ar-SA' : 'en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
                <h3 className="font-semibold text-[var(--color-obsidian)] mb-2 line-clamp-2">
                  {isAr ? article.titleAr : article.titleEn}
                </h3>
                <p className="text-[var(--color-warm-gray)] text-sm line-clamp-3">
                  {isAr ? article.summaryAr : article.summaryEn}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
