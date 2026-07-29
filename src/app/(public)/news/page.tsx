"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Category = "All" | "Social Impact" | "Education" | "Healthcare" | "Press Releases";

const CATEGORIES: Category[] = [
  "All",
  "Social Impact",
  "Education",
  "Healthcare",
  "Press Releases",
];

const ARTICLES = [
  {
    category: "Education",
    date: "Oct 24, 2026",
    title: "New Rural Education Initiative Launched in Northern Region",
    description:
      "Our latest program aims to provide foundational learning materials and infrastructure support to over 50 isolated communities, bridging the educational gap.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCHqHYybTcBokhB_MpSFA3jSqrk5n20ayou0o-7Nc-9j3cKtsVMo7euscPzRxDkXmz1rE6eIpFklDbHqlMNsltpzf_sncG012Rv3BDiyxL81dLfPbe13ptlmPRLx6Ol-2G2-uzFvw3m9f259ni1OdwLfAyR4wglCttJDjtdICQM7tUi60-D_1APE_s-IsL9dtzE_4ril6g2zPobCAOrbceniici3gbBy2izEZOMmhA1n4fPsPjyYb_mDDTxOAqe0DffbP0UwEhzjjk",
    imageAlt: "Children reading in a rural school classroom",
  },
  {
    category: "Social Impact",
    date: "Oct 18, 2026",
    title: "Clean Water Access Secured for 10,000 Residents",
    description:
      "The completion of our multi-phase bore-well project marks a significant milestone in public health and sanitation for the district.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDVsOpJbnHtN9PMpCrEOPr51B7AfjludbxTaH7X1RZ6308D9Kw2cocsj2tMJGZTrSbH1TfmRo3jH0CiSn7j65BzV7JpOJ9Mc4nbeP1Bc2Fxp74dBq8NhE5QgVeJhSjOaRfED5ti1awTjZ20-AdNvcZw1g5XzoOIz5Z4qrozGHmkVkfW_CMwTaDUIoZ0xMKtdoxSaCrpneWVHPCLx1e2uZk5UKmjp3TffhSmcM9n0-V9JSnM3vOqbPWCcDdDcft4tJPYhsdMR19IkjM",
    imageAlt: "Community water well opening ceremony",
  },
  {
    category: "Press Releases",
    date: "Oct 10, 2026",
    title: "Annual Transparency Report 2023 Published",
    description:
      "NGO-ABOI releases its comprehensive financial and operational impact report, reinforcing our commitment to institutional transparency and donor accountability.",
    imageUrl: "",
    imageAlt: "Press release announcement",
  },
  {
    category: "Healthcare",
    date: "Oct 05, 2026",
    title: "Mobile Clinics Reach Remote Villages, Providing Vital Maternal Care",
    description:
      "In an unprecedented logistical effort, NGO-ABOI's healthcare division has successfully deployed three newly equipped mobile clinic units to the southern rural districts.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDsP_Qbc24Hsb7s9u1ENBCP_u2dOmqHPsgXfouSmnenMbxVm1FddIscPRqERUEVRm5MohiYXkE0sGX2HoH652LFMtMn28BkzgmmfIB-YI6MOf1GOowyihs1eLLueIT9NDnjWY0UuKOhSWpzpfNr0jJ8cFRnQAZkQ5OkwAk52cglk3QV3C356g0DHGTZWBAgSC977vKhVPGAHUxb20B3Ch8gmVBNkVKEyfoKUiKlAvAw2NboytoCzlLWnmbcKxyfa62uMGSS4u0Wut8",
    imageAlt: "Mobile medical clinic van in rural setting",
  },
  {
    category: "Education",
    date: "Sep 28, 2026",
    title: "Digital Literacy Program Empowers 500 Youth",
    description:
      "A comprehensive digital skills training program equipped young adults with modern IT competencies, opening new pathways for employment and entrepreneurship.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBd-flc18dXtmL_TZ-v5ZHmQBQO5VGJzvg-ux5q1blNXpiXYUUeA6Puw-wcSE4OKm1tOS8mA94ApVF6NjsAa0XRwQPuMCW9W6neKE_R0XkkGkIQCkohUpTy71-GpFwqqYzkXgcgez1BzmJOaQfhTqxTloV7cCUPBcjWrgHHXbRXGw8j8v7rq9zs6zmbWBRpHsaRr3BGIOysfWeGukS_j462AG53fY_jMO63BPD7-5ugk067bvPjxwVq9HBGXFLZOJUI7YaW-NNlxZE",
    imageAlt: "Students using digital tablets in classroom",
  },
  {
    category: "Social Impact",
    date: "Sep 15, 2026",
    title: "Food Security Program Supports 2,000 Families",
    description:
      "Our quarterly food distribution initiative reached vulnerable households across three provinces, providing essential nutrition and agricultural supplies.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBjStHRuCyUCra8fo-Vk3jYEuTqlS6qY_hfofOVzd7LArAuPrRYY_7egNEJKxq71-0AsOBTiluVJaQ1MV735hryoeU5FkkcL1DdFN2D96iu9qi1YrOoWG4peKBhLp70F1tgZFEkkHpkSGsOiTH0rOyL6mxHeIrZfV8H-BIMnhveHjK91HcX8ku9qphMcpIQl-TDE4mSq7BdYeC8ax2BZ-Fm5GR79mnGthdMsG5kphI2Az__qBNcWMzSnWwjKtoUiJvMt5IAxvlf5mI",
    imageAlt: "Food distribution to families",
  },
];

function getCategoryColor(category: string) {
  switch (category) {
    case "Healthcare":
      return "text-primary";
    case "Education":
      return "text-tertiary";
    case "Social Impact":
      return "text-secondary";
    default:
      return "text-primary";
  }
}

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const t = useTranslations("news");

  const filteredArticles =
    activeCategory === "All"
      ? ARTICLES
      : ARTICLES.filter((a) => a.category === activeCategory);

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
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full font-label-md text-label-md transition-colors border ${
                activeCategory === cat
                  ? "bg-primary text-on-primary border-primary"
                  : "bg-surface-container-high text-on-surface hover:bg-surface-variant border-outline-variant"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* News Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
        {filteredArticles.map((article) => (
          <article
            key={article.title}
            className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden hover:shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-shadow duration-300 flex flex-col h-full group cursor-pointer"
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
          </article>
        ))}
      </section>

      {/* Detailed Article Template Example */}
      <section className="mt-xl pt-xl border-t border-outline-variant max-w-4xl mx-auto w-full flex flex-col gap-md">
        <h2 className="font-headline-lg text-headline-lg text-primary mb-md">
          {t("featuredStory")}
        </h2>
        <div className="flex items-center gap-2 text-on-surface-variant mb-4">
          <a
            href="#"
            className="font-label-md text-label-md hover:text-primary transition-colors"
          >
            {t("title")}
          </a>
          <span className="material-symbols-outlined text-[16px]">
            chevron_right
          </span>
          <span className="font-label-md text-label-md">Healthcare</span>
        </div>
        <h3 className="font-display-lg text-display-lg text-on-surface leading-tight">
          Mobile Clinics Reach Remote Villages, Providing Vital Maternal Care
        </h3>
        <div className="flex items-center justify-between py-4 border-b border-outline-variant flex-wrap gap-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-bold">
              AB
            </div>
            <div>
              <p className="font-label-md text-label-md text-on-surface">
                {t("by")} Amina Bello
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant text-[12px]">
                Field Coordinator &bull; October 05, 2024
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              aria-label={t("share")}
              className="p-2 rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                share
              </span>
            </button>
            <button
              aria-label={t("print")}
              className="p-2 rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                print
              </span>
            </button>
          </div>
        </div>
        <div className="w-full aspect-[16/9] rounded-lg overflow-hidden my-4 bg-surface-container">
          <img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsP_Qbc24Hsb7s9u1ENBCP_u2dOmqHPsgXfouSmnenMbxVm1FddIscPRqERUEVRm5MohiYXkE0sGX2HoH652LFMtMn28BkzgmmfIB-YI6MOf1GOowyihs1eLLueIT9NDnjWY0UuKOhSWpzpfNr0jJ8cFRnQAZkQ5OkwAk52cglk3QV3C356g0DHGTZWBAgSC977vKhVPGAHUxb20B3Ch8gmVBNkVKEyfoKUiKlAvAw2NboytoCzlLWnmbcKxyfa62uMGSS4u0Wut8"
            alt="Mobile clinic unit operating in the southern district"
          />
          <p className="text-center font-body-md text-body-md text-on-surface-variant text-[12px] mt-2 italic">
            Mobile clinic unit operating in the southern district.
          </p>
        </div>
        <div className="space-y-6 font-body-lg text-body-lg text-on-surface">
          <p className="leading-relaxed">
            <span className="text-4xl float-left mr-2 font-headline-lg text-primary leading-none">
              I
            </span>
            n an unprecedented logistical effort, NGO-ABOI&apos;s healthcare
            division has successfully deployed three newly equipped mobile
            clinic units to the southern rural districts. This initiative
            targets the critical lack of maternal and pediatric care facilities
            in areas traditionally cut off during the rainy season.
          </p>
          <p className="leading-relaxed">
            The project, funded by international institutional partners, aims to
            provide routine check-ups, vaccinations, and prenatal care directly
            to the doorstep of over 20 isolated communities.
          </p>
          <blockquote className="border-l-4 border-primary-container pl-6 my-8 py-2">
            <p className="font-quote text-quote text-on-surface-variant italic m-0">
              &ldquo;The arrival of these clinics means that expectant mothers
              no longer have to walk 15 kilometers to the nearest health post.
              We are bringing dignity and safety back to childbirth in these
              regions.&rdquo;
            </p>
            <footer className="mt-2 font-label-md text-label-md text-primary">
              &mdash; Dr. Ibrahim Ouedraogo, Chief Medical Officer
            </footer>
          </blockquote>
          <h3 className="font-headline-lg text-headline-lg text-on-surface mt-8 mb-4">
            Multimedia Gallery
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              {
                url: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9jSNRHXOVTmQbldosBAyqmPpyZAyfiqmLfvsh5yc4qVjnBsBmsSfD4iBFgvi8ovKCu_ejq2m9KHfanZi1dDdcsQGHp1H_OBIGEZ52xN68yZrZIFlQq9XSH5y5gP9-rk9FVACE3C7gkdzlDolAUQ_N_sHWogAz5dn4JQvEqDtXgpn9kC2m38q-OziKfawvi9q-qQoTWT8mYlpigEBv7CMdnlh2Yhy6pCuk3XqJG_P0kiMf9EdJtPPveiJBnvZQmShhYzpmUMozXVg",
                alt: "Healthcare worker vaccinating a child",
              },
              {
                url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIKLrfWRQgzmAUhw-PXju6nOwUQPRXbU4BgiA2XWlYxAv1NaTq_m22faRekm71O-61S1pmBuPNCNvw_ic5bDXSSgeX8W4BXlzs69GxyhdnIWfq9S1dTh6lGo_CZCg5EXoNWfLOAGI02v47ctYW5-JB_qgWPD031OQigBTNDfKVVE_YRmiuR4SnrwHa4XfZXSPvtO3Blow30Dxi5ElgwglcTgPU0cTF1pE87T7ELWBG7D1Ppewvs1yUzdiUGTSJslC8_v8YwCfZm40",
                alt: "Drone shot of mobile clinic in village",
              },
              {
                url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfVjdji-2ip5cfF_Nz_93sFNZVkTOYPs-Zc_KN7iZOwrY-sE3wlLGUTuBX7qoj454RlQ4KABMnbE1ecvXS-LAy2Sp0ugfLFKYvoi1Pre3P9Zc4hEsYdmm0witZQ61mbegQjcyvRrocoLUok5IbDLL0oFBnn15b2q1Z13pEM3zOk2a0Z-N3qrAVT9D5uYiMumaqm8PsbvENJZLMefHzh4cvJriIeIH0nTNjA6S8zXYFQ9CDAWsE1Nf_azu8lpNO9XT0Cz130_m6OQs",
                alt: "Health workers analyzing data on tablet",
              },
            ].map((img) => (
              <div
                key={img.alt}
                className="aspect-square bg-surface-container rounded-md overflow-hidden"
              >
                <img
                  className="w-full h-full object-cover"
                  src={img.url}
                  alt={img.alt}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-outline-variant">
          <span className="font-label-md text-label-md text-on-surface-variant py-2">
            {t("tags")}
          </span>
          {["Healthcare", "Rural Development", "Maternal Health"].map(
            (tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-surface-variant text-on-surface-variant font-label-md text-label-md text-[12px]"
              >
                {tag}
              </span>
            )
          )}
        </div>
      </section>
    </div>
  );
}
