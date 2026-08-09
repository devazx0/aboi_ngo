import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SectionIntro } from "@/components/SectionIntro";
import { PillarCard } from "@/components/PillarCard";
import { NewsCard } from "@/components/NewsCard";

const PILLARS = [
  {
    icon: "diversity_3",
    title: "Religious & Cohesion",
    description:
      "Fostering deep-rooted peace and mutual understanding across diverse communities.",
    href: "/pillars",
    accentColor: "primary" as const,
    blurColor: "rgba(176, 240, 214, 0.2)",
  },
  {
    icon: "handshake",
    title: "Social & Solidarity",
    description:
      "Empowering vulnerable populations through targeted economic and social support.",
    href: "/pillars",
    accentColor: "secondary" as const,
    blurColor: "rgba(255, 220, 195, 0.3)",
  },
  {
    icon: "school",
    title: "Educational & Scientific",
    description:
      "Advancing knowledge and scientific excellence for the next generation of leaders.",
    href: "/pillars",
    accentColor: "tertiary" as const,
    blurColor: "rgba(220, 226, 247, 0.3)",
  },
  {
    icon: "eco",
    title: "Health & Environmental",
    description:
      "Promoting holistic well-being and ecological sustainability grounded in Islamic ethics.",
    href: "/pillars",
    accentColor: "primary" as const,
    blurColor: "rgba(149, 211, 186, 0.3)",
  },
];

const NEWS_ITEMS = [
  {
    category: "Health",
    date: "Oct 15, 2026",
    title: "Clean Water Initiative Reaches 10 New Villages",
    description:
      "Our latest ecological health drive successfully installed solar-powered water filtration systems in rural communities.",
    imageUrl: "/assets/water_tank.png",
    imageAlt: "Water tank providing clean water",
    href: "#",
  },
  {
    category: "Education",
    date: "Oct 02, 2026",
    title: "Annual Science Excellence Awards 2024",
    description:
      "Celebrating outstanding academic achievements of over 500 scholars supported by the NGO-ABOI educational fund.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBd-flc18dXtmL_TZ-v5ZHmQBQO5VGJzvg-ux5q1blNXpiXYUUeA6Puw-wcSE4OKm1tOS8mA94ApVF6NjsAa0XRwQPuMCW9W6neKE_R0XkkGkIQCkohUpTy71-GpFwqqYzkXgcgez1BzmJOaQfhTqxTloV7cCUPBcjWrgHHXbRXGw8j8v7rq9zs6zmbWBRpHsaRr3BGIOysfWeGukS_j462AG53fY_jMO63BPD7-5ugk067bvPjxwVq9HBGXFLZOJUI7YaW-NNlxZE",
    imageAlt: "Students in a modern classroom",
    href: "#",
  },
  {
    category: "Peace",
    date: "Sep 18, 2026",
    title: "Interfaith Dialogue for Regional Cohesion",
    description:
      "A landmark symposium bringing together community leaders to draft a unified charter for lasting peace and solidarity.",
    imageUrl: "/assets/prayer.png",
    imageAlt: "Community in prayer",
    href: "#",
  },
];

export default async function HomePage() {
  const t = await getTranslations("home");

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden bg-surface-dim">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/assets/standing_in_front_of_mosque.png')",
            }}
          />
          <div className="absolute inset-0 bg-primary/70 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface/90" />
        </div>
        <div className="relative z-10 max-w-container-max mx-auto px-gutter text-center flex flex-col items-center py-xl">
          <h1 className="font-display-lg text-display-lg md:text-[64px] text-surface-container-lowest max-w-4xl mb-md drop-shadow-md">
            {t("heroTitle")}
          </h1>
          <p className="font-body-lg text-body-lg text-surface-container-low max-w-2xl mb-lg mx-auto opacity-90">
            {t("heroSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-sm justify-center items-center w-full sm:w-auto">
            <Link
              href="/pillars"
              className="w-full sm:w-auto bg-secondary-container hover:bg-secondary hover:text-on-primary text-on-secondary-container font-label-md text-label-md uppercase px-lg py-[16px] rounded-md transition-all shadow-sm sm:hover:-translate-y-1 text-center"
            >
              {t("discoverActions")}
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto bg-surface-container-lowest/10 backdrop-blur-md border border-surface-container-lowest/30 hover:bg-surface-container-lowest hover:text-primary text-surface-container-lowest font-label-md text-label-md uppercase px-lg py-[16px] rounded-md transition-all shadow-sm text-center"
            >
              {t("becomePartner")}
            </Link>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-xl bg-surface">
        <div className="max-w-container-max mx-auto px-gutter flex flex-col items-center text-center">
          <span className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-sm block">
            {t("ourMission")}
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-md max-w-3xl">
            {t("welcomeTitle")}
          </h2>
          <div className="w-16 h-1 bg-primary-container mb-md rounded-full" />
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-4xl leading-relaxed">
            {t("welcomeDesc")}
          </p>
        </div>
      </section>

      {/* 4 Pillars Bento Grid */}
      <section className="py-xl bg-surface-bright border-t border-outline-variant/30">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="text-center mb-xl">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-sm">
              {t("ourPillars")}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {t("pillarsSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {PILLARS.map((pillar) => (
              <PillarCard key={pillar.title} {...pillar} />
            ))}
          </div>
        </div>
      </section>

      {/* Key Figures */}
      <section className="py-lg bg-primary-container relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-surface-container-lowest to-transparent" />
        <div className="relative z-10 max-w-container-max mx-auto px-gutter grid grid-cols-2 md:grid-cols-4 gap-lg md:divide-x md:divide-primary/20 text-center">
          {[
            { value: "100%", label: t("orthodoxy") },
            { value: "5k+", label: t("studentsSupported") },
            { value: "2k+", label: t("familiesAssisted") },
            { value: "#1", label: t("commitmentToPeace") },
          ].map((fig) => (
            <div key={fig.label} className="flex flex-col items-center py-md">
              <span className="font-display-lg text-display-lg text-inverse-primary mb-xs">
                {fig.value}
              </span>
              <span className="font-label-md text-label-md text-surface-container-highest uppercase">
                {fig.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Latest News */}
      <section className="py-xl bg-surface">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="flex flex-col md:flex-row justify-between items-end mb-lg gap-sm">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
                {t("latestNews")}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {t("newsSubtitle")}
              </p>
            </div>
            <Link
              href="/news"
              className="font-label-md text-label-md text-primary-container border border-primary-container hover:bg-primary-container hover:text-on-primary px-sm py-xs rounded-md transition-colors uppercase whitespace-nowrap shrink-0"
            >
              {t("viewAllNews")}
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {NEWS_ITEMS.map((item) => (
              <NewsCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Partnership CTA */}
      <section className="py-xl bg-surface-bright relative border-t border-outline-variant/30">
        <div className="max-w-[900px] mx-auto px-gutter text-center relative z-10">
          <div className="inline-flex items-center justify-center p-sm bg-secondary-fixed text-on-secondary-fixed rounded-full mb-md">
            <span
              className="material-symbols-outlined text-[32px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              favorite
            </span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-sm">
            {t("ctaTitle")}
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg max-w-2xl mx-auto">
            {t("ctaSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-sm">
            <Link
              href="/contact"
              className="w-full sm:w-auto bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md uppercase px-xl py-[16px] rounded-md transition-colors shadow-sm text-center"
            >
              {t("contactUs")}
            </Link>
          </div>
        </div>
        <div className="absolute top-10 left-10 w-24 h-24 border border-outline-variant/40 rounded-full hidden md:block" />
        <div className="absolute bottom-10 right-10 w-32 h-32 border border-outline-variant/30 rounded-lg transform rotate-12 hidden md:block" />
      </section>
    </>
  );
}
