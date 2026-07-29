import { getTranslations } from "next-intl/server";
import { SectionIntro } from "@/components/SectionIntro";
import { PillarDetail } from "@/components/PillarDetail";

const PILLARS = [
  {
    icon: "mosque",
    title: "Religious Plan",
    subtitle: "Awakening & Peace",
    description:
      "Fostering spiritual growth and promoting peaceful coexistence through religious education, dialogue, and the construction of spaces for worship and community gathering.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBzNsjPdGkAOHD0PRKDfq1Gut87eojc-qGJEiSUXzFPoLqW7Bmz-A5WaQFUSJY4GuTzr1xerifAAYfNy4AKsYxFXrx1vruGB3GentzWf5n45D5kNcrkKzTtllq3JlwaUnsXpj6r_8JlMARLDXfD_Yd9LnOpcOXj6fK66-ZrjmJ7WG0VnmFevX2ryCVMcRE4krCJNORxY3BQoee2qrgIUCFa4pMbeb9DSxUt5w9xjVfy94RK3d9HPz22eOlrU_fl9DdWktxO_LViby0",
    imageAlt: "Modern mosque interior in West Africa",
    objectives: [
      { label: "Promote religious literacy" },
      { label: "Foster interfaith harmony" },
    ],
    actions: [
      { label: "Build community mosques" },
      { label: "Organize peace seminars" },
    ],
  },
  {
    icon: "volunteer_activism",
    title: "Social Plan",
    subtitle: "Charity & Waqf",
    description:
      "Providing immediate relief to vulnerable populations while establishing sustainable charitable endowments (Waqf) to ensure long-term community support and economic empowerment.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBjStHRuCyUCra8fo-Vk3jYEuTqlS6qY_hfofOVzd7LArAuPrRYY_7egNEJKxq71-0AsOBTiluVJaQ1MV735hryoeU5FkkcL1DdFN2D96iu9qi1YrOoWG4peKBhLp70F1tgZFEkkHpkSGsOiTH0rOyL6mxHeIrZfV8H-BIMnhveHjK91HcX8ku9qphMcpIQl-TDE4mSq7BdYeC8ax2BZ-Fm5GR79mnGthdMsG5kphI2Az__qBNcWMzSnWwjKtoUiJvMt5IAxvlf5mI",
    imageAlt: "Volunteers distributing aid packages in Benin",
    objectives: [
      { label: "Eradicate extreme poverty" },
      { label: "Support orphans & widows" },
    ],
    actions: [
      { label: "Food distribution drives" },
      { label: "Establish Waqf properties" },
    ],
    reversed: true,
  },
  {
    icon: "school",
    title: "Educational Plan",
    subtitle: "Knowledge & Digital Daawah",
    description:
      "Equipping the next generation with both foundational religious knowledge and modern digital skills, bridging the gap between traditional wisdom and contemporary communication.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBsZBtQoy4Emiym5LQX74QhkxRDaWUgwJXgsB756BT8GLjrNI0XwrU3TcEa8JL4ZBZvxSu1UML5cvQXcstPwZr4kg_e__P9QwNiAK-6zc5iONnMeezXE71cfrWeg56d7IRQIDV_6F_2HMMSSovaroKCAs1tBwJPP1u7n145VrfQApfDGsdkQty6xiSFtaP1a36r1e5kVVKMUzuMLNVBZ5JRscxsXnhd7sHLKmNniJU2sQkgxQOkl3HkJ4TpQETHcnLuMQC2GuGHs4s",
    imageAlt: "Students using laptops in a modern classroom",
    objectives: [
      { label: "Improve literacy rates" },
      { label: "Promote digital inclusion" },
    ],
    actions: [
      { label: "Build modern madrasas" },
      { label: "Launch online learning hubs" },
    ],
  },
  {
    icon: "colab",
    title: "Health & Environmental Plan",
    subtitle: "Assistance & Ecology",
    description:
      "Promoting holistic well-being by providing essential healthcare access and championing sustainable environmental practices to protect our shared planet.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD69sRwNoN1QvWpku1P1uaV2K9s3ZUaMUHAyGQeIqffDa2hp7ZiXoBJe2QJSinjqNcUR2avO00qX2RtLG7tDZek29AZrinMVziEyU6H7CLuU6WtH4vD0uskOOk4U9bgOsTOlEY4aI7unJloZO-K66JZk6j445XxsqCsVPy0VQa8ANUFQfN7oDDK-VxrenerMf7b7XwsZC1TDaKCjl1p8lrjx7BFj1U5Fv8aaQ3v0kYZ6zImAZJxPw9z-mbbV-SOe_TQuvk-EFflhEo",
    imageAlt: "Solar panels and water well in rural community",
    objectives: [
      { label: "Increase access to clean water" },
      { label: "Promote sustainable farming" },
    ],
    actions: [
      { label: "Construct borehole wells" },
      { label: "Host medical camps" },
    ],
    reversed: true,
  },
];

export default async function PillarsPage() {
  const t = await getTranslations("pillars");

  return (
    <div className="max-w-container-max mx-auto px-gutter pb-xl pt-lg">
      <SectionIntro
        badge={t("badge")}
        title={t("title")}
        description={t("subtitle")}
      />

      <div className="space-y-xl">
        {PILLARS.map((pillar) => (
          <PillarDetail key={pillar.title} {...pillar} />
        ))}
      </div>
    </div>
  );
}
