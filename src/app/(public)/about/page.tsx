import { getTranslations } from "next-intl/server";

const VALUES = [
  {
    icon: "volunteer_activism",
    label: "Charity",
  },
  {
    icon: "account_balance",
    label: "Orthodoxy",
  },
  {
    icon: "workspace_premium",
    label: "Excellence",
  },
  {
    icon: "handshake",
    label: "Fraternity",
  },
];

export default async function AboutPage() {
  const t = await getTranslations("about");

  const galleryItems = [
    {
      src: "/assets/3-woman-serving-food.jpeg",
      title: t("galleryItem1Title"),
      desc: t("galleryItem1Desc"),
    },
    {
      src: "/assets/water-tank.jpeg",
      title: t("galleryItem2Title"),
      desc: t("galleryItem2Desc"),
    },
    {
      src: "/assets/sharing_rice.png",
      title: t("galleryItem3Title"),
      desc: t("galleryItem3Desc"),
    },
    {
      src: "/assets/prayer_2.png",
      title: t("galleryItem4Title"),
      desc: t("galleryItem4Desc"),
    },
  ];

  return (
    <div className="max-w-container-max mx-auto px-gutter py-xl flex flex-col gap-xl">
      {/* Intro */}
      <section className="text-center py-xl relative">
        <div className="absolute inset-0 bg-gradient-to-b from-surface-bright to-transparent -z-10 rounded-xl" />
        <h1 className="font-display-lg text-display-lg text-primary-container mb-md max-w-3xl mx-auto">
          {t("title")}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </section>

      {/* Vision, Mission, Values Bento */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-md">
        <div className="bg-surface-container-lowest/90 backdrop-blur-sm border border-outline-variant/50 p-md rounded-lg shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-primary-container/10 rounded-full flex items-center justify-center mb-sm">
            <span className="material-symbols-outlined text-primary-container text-[24px]">
              visibility
            </span>
          </div>
          <h2 className="font-headline-md text-headline-md text-primary-container mb-sm">
            {t("vision")}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant flex-grow">
            {t("visionText")}
          </p>
        </div>

        <div className="md:col-span-2 bg-gradient-to-br from-surface to-surface-container-lowest border border-outline-variant p-md rounded-lg shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-secondary-container/10 rounded-full flex items-center justify-center mb-sm">
            <span className="material-symbols-outlined text-secondary-container text-[24px]">
              flag
            </span>
          </div>
          <h2 className="font-headline-md text-headline-md text-secondary-container mb-sm">
            {t("mission")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm flex-grow">
            {[
              {
                key: "guide",
              },
              {
                key: "educate",
              },
              {
                key: "support",
              },
            ].map((item) => (
              <div key={item.key}>
                <h3 className="font-label-md text-label-md text-on-surface mb-xs">
                  {t(item.key)}
                </h3>
                <p className="text-on-surface-variant text-sm">
                  {t(`${item.key}Text`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-3 bg-surface-container-lowest/90 backdrop-blur-sm border border-outline-variant/50 p-md rounded-lg shadow-sm border-t-4 border-t-primary-container">
          <h2 className="font-headline-md text-headline-md text-primary-container mb-md text-center">
            {t("coreValues")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md text-center">
            {VALUES.map((v) => (
              <div key={v.label} className="flex flex-col items-center group">
                <span className="material-symbols-outlined text-[32px] text-outline group-hover:text-primary transition-colors mb-xs">
                  {v.icon}
                </span>
                <span className="font-label-md text-label-md text-on-surface">
                  {t(v.label.toLowerCase())}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Governance / Message */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-xl items-center py-xl bg-surface-container-lowest rounded-xl p-md border border-outline-variant shadow-sm">
        <div className="md:col-span-5 relative">
          <div className="aspect-[3/4] rounded-lg overflow-hidden relative shadow-md">
            <img
              className="w-full h-full object-cover"
              src="/assets/men_in_front_of_mosque.png"
              alt={t("presidentImgAlt")}
            />
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-secondary-container rounded-full opacity-20 blur-2xl -z-10" />
        </div>
        <div className="md:col-span-7 flex flex-col gap-md">
          <h2 className="font-headline-md text-headline-md text-on-surface border-b border-outline-variant pb-xs">
            {t("messageTitle")}
          </h2>
          <div className="flex gap-sm items-start">
            <div className="w-1 h-full bg-primary-container self-stretch rounded-full shrink-0" />
            <blockquote className="font-quote text-quote text-on-surface-variant italic">
              &ldquo;{t("leadershipQuote")}&rdquo;
            </blockquote>
          </div>
          <div>
            <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">
              {t("presidentName")}
            </h3>
            <p className="text-sm text-outline">{t("presidentRole")}</p>
          </div>
        </div>
      </section>

      {/* Field Operations Gallery */}
      <section className="py-lg">
        <div className="text-center mb-lg">
          <h2 className="font-headline-md text-headline-md text-primary mb-xs">
            {t("galleryTitle")}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
            {t("gallerySubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-md">
          {galleryItems.map((item) => (
            <div
              key={item.src}
              className="group relative rounded-lg overflow-hidden border border-outline-variant bg-surface-container shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-sm bg-surface-container-lowest">
                <h3 className="font-label-md text-label-md text-on-surface font-semibold">
                  {item.title}
                </h3>
                <p className="text-xs text-on-surface-variant">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Transparency */}
      <section className="py-xl">
        <div className="text-center mb-xl">
          <h2 className="font-headline-md text-headline-md text-primary-container mb-xs">
            {t("transparency")}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
            {t("transparencyText")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div className="bg-surface-container-lowest/90 backdrop-blur-sm border border-outline-variant/50 p-md rounded-lg flex gap-sm items-start hover:border-primary-container transition-colors">
            <div className="w-10 h-10 shrink-0 bg-surface-container flex items-center justify-center rounded-DEFAULT">
              <span className="material-symbols-outlined text-on-surface-variant">
                account_tree
              </span>
            </div>
            <div>
              <h3 className="font-label-md text-label-md text-on-surface mb-xs">
                {t("sectorTitle")}
              </h3>
              <p className="text-sm text-on-surface-variant">
                {t("sectorDesc")}
              </p>
            </div>
          </div>
          <div className="bg-surface-container-lowest/90 backdrop-blur-sm border border-outline-variant/50 p-md rounded-lg flex gap-sm items-start hover:border-secondary-container transition-colors">
            <div className="w-10 h-10 shrink-0 bg-surface-container flex items-center justify-center rounded-DEFAULT">
              <span className="material-symbols-outlined text-on-surface-variant">
                analytics
              </span>
            </div>
            <div>
              <h3 className="font-label-md text-label-md text-on-surface mb-xs">
                {t("impactTitle")}
              </h3>
              <p className="text-sm text-on-surface-variant">
                {t("impactDesc")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
