"use client";

import { useTranslations } from "next-intl";

export function TestimonialsSection() {
  const t = useTranslations("testimonials");

  const testimonials = [
    {
      id: "1",
      quoteKey: "quote1",
      nameKey: "name1",
      roleKey: "role1",
      avatar: "/assets/men_in_front_of_mosque.png",
      tag: "Education",
    },
    {
      id: "2",
      quoteKey: "quote2",
      nameKey: "name2",
      roleKey: "role2",
      avatar: "/assets/standing_in_front_of_mosque.png",
      tag: "Clean Water",
    },
    {
      id: "3",
      quoteKey: "quote3",
      nameKey: "name3",
      roleKey: "role3",
      avatar: "/assets/3-woman-serving-food.jpeg",
      tag: "Relief",
    },
  ];

  return (
    <section className="py-xl bg-surface-bright border-t border-outline-variant/30 relative">
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="text-center mb-xl max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-xs px-sm py-xs rounded-full font-label-md text-label-md bg-secondary-container/20 text-secondary-container mb-sm border border-secondary-container/30">
            <span className="material-symbols-outlined text-[18px]">
              record_voice_over
            </span>
            {t("badge")}
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
            {t("title")}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-md">
                  <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-primary/20">
                    {item.tag}
                  </span>
                  <span
                    className="material-symbols-outlined text-secondary-container text-[32px] opacity-40"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    format_quote
                  </span>
                </div>
                <p className="font-body-lg text-body-lg text-on-surface-variant italic mb-lg leading-relaxed">
                  &ldquo;{t(item.quoteKey)}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-sm pt-md border-t border-outline-variant/30">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-outline-variant shrink-0 bg-surface-container">
                  <img
                    src={item.avatar}
                    alt={t(item.nameKey)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-label-md text-label-md text-on-surface font-bold">
                    {t(item.nameKey)}
                  </h4>
                  <p className="text-xs text-on-surface-variant">
                    {t(item.roleKey)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
