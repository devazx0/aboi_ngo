import { getTranslations } from "next-intl/server";
import { SectionIntro } from "@/components/SectionIntro";
import { PillarDetail } from "@/components/PillarDetail";

export default async function PillarsPage() {
  const t = await getTranslations("pillars");

  const PILLARS = [
    {
      icon: "mosque",
      title: t("religiousTitle"),
      subtitle: t("religiousSubtitle"),
      description: t("religiousDesc"),
      imageUrl: "/assets/standing_in_front_of_mosque.png",
      imageAlt: "Person standing in front of a mosque",
      objectives: [
        { label: t("objLiteracy") },
        { label: t("objHarmony") },
      ],
      actions: [
        { label: t("actMosques") },
        { label: t("actSeminars") },
      ],
    },
    {
      icon: "volunteer_activism",
      title: t("socialTitle"),
      subtitle: t("socialSubtitle"),
      description: t("socialDesc"),
      imageUrl: "/assets/sharing_rice2.png",
      imageAlt: "Volunteers sharing rice",
      objectives: [
        { label: t("objPoverty") },
        { label: t("objOrphans") },
      ],
      actions: [
        { label: t("actFood") },
        { label: t("actWaqf") },
      ],
      reversed: true,
    },
    {
      icon: "school",
      title: t("eduTitle"),
      subtitle: t("eduSubtitle"),
      description: t("eduDesc"),
      imageUrl: "/assets/woman_with_food.png",
      imageAlt: "Supporting community education and families",
      objectives: [
        { label: t("objEduLiteracy") },
        { label: t("objDigital") },
      ],
      actions: [
        { label: t("actMadrasas") },
        { label: t("actHubs") },
      ],
    },
    {
      icon: "colab",
      title: t("healthTitle"),
      subtitle: t("healthSubtitle"),
      description: t("healthDesc"),
      imageUrl: "/assets/water_tank.png",
      imageAlt: "Water tank in rural community",
      objectives: [
        { label: t("objWater") },
        { label: t("objFarming") },
      ],
      actions: [
        { label: t("actWells") },
        { label: t("actCamps") },
      ],
      reversed: true,
    },
  ];

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
