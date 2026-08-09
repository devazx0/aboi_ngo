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
    imageUrl: "/assets/standing_in_front_of_mosque.png",
    imageAlt: "Person standing in front of a mosque",
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
    imageUrl: "/assets/sharing_rice2.png",
    imageAlt: "Volunteers sharing rice",
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
    imageUrl: "/assets/water_tank.png",
    imageAlt: "Water tank in rural community",
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
