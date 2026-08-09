"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

type CategoryKey = "All" | "Social Impact" | "Education" | "Healthcare" | "Press Releases";

interface CategoryItem {
  key: CategoryKey;
  tKey: string;
}

const CATEGORIES: CategoryItem[] = [
  { key: "All", tKey: "catAll" },
  { key: "Social Impact", tKey: "catSocialImpact" },
  { key: "Education", tKey: "catEducation" },
  { key: "Healthcare", tKey: "catHealthcare" },
  { key: "Press Releases", tKey: "catPressReleases" },
];

interface Article {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  category: string;
  date: string;
}

interface NewsPageClientProps {
  articles: Article[];
}

export function NewsPageClient({ articles }: NewsPageClientProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("All");
  const t = useTranslations("news");

  const filteredArticles =
    activeCategory === "All"
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  return (
    <div className="max-w-container-max mx-auto px-gutter py-xl flex flex-col gap-xl">
      {/* Header & Filter */}
      <section className="flex flex-col gap-md text-center md:text-left">
        <h1 className="font-display-lg text-display-lg text-primary">
          {t("title")}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          {t("subtitle")}
        </p>
        <div className="flex flex-wrap gap-xs justify-center md:justify-start mt-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-full font-label-md text-label-md transition-colors border ${
                activeCategory === cat.key
                  ? "bg-primary text-on-primary border-primary"
                  : "bg-surface-container-high text-on-surface hover:bg-surface-variant border-outline-variant"
              }`}
            >
              {t(cat.tKey)}
            </button>
          ))}
        </div>
      </section>

      {/* News Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
        {filteredArticles.map((article) => (
          <Link
            key={article.id}
            href={`/news/${article.slug}`}
            className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden hover:shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-shadow duration-300 flex flex-col h-full group cursor-pointer block"
          >
            <div className="w-full h-48 bg-surface-container relative overflow-hidden">
              {article.imageUrl ? (
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url(${article.imageUrl})` }}
                  role="img"
                  aria-label={article.imageAlt}
                />
              ) : (
                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-4xl text-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    newspaper
                  </span>
                </div>
              )}
              <div className="absolute top-4 left-4 bg-surface-container-lowest px-3 py-1 rounded-full font-label-md text-label-md text-primary-container shadow-sm border border-outline-variant">
                {article.category}
              </div>
            </div>
            <div className="p-md flex flex-col flex-grow">
              <div className="flex items-center gap-2 mb-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">
                  calendar_today
                </span>
                <span className="font-label-md text-label-md text-[12px]">
                  {article.date}
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant flex-grow line-clamp-3 mb-4">
                {article.description}
              </p>
              <div className="flex items-center text-primary font-label-md text-label-md mt-auto">
                {t("readFullStory")}
                <span className="material-symbols-outlined ml-1 text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {filteredArticles.length === 0 && (
        <section className="text-center py-16">
          <p className="text-on-surface-variant text-body-lg">
            {t("noArticles")}
          </p>
        </section>
      )}
    </div>
  );
}
