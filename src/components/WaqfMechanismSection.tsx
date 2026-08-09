"use client";

import { useTranslations } from "next-intl";

export function WaqfMechanismSection() {
  const t = useTranslations("waqf");

  const steps = [
    {
      icon: "savings",
      titleKey: "step1Title",
      descKey: "step1Desc",
      stepNum: "01",
      color: "bg-primary-container/10 text-primary-container border-primary-container/20",
    },
    {
      icon: "domain",
      titleKey: "step2Title",
      descKey: "step2Desc",
      stepNum: "02",
      color: "bg-secondary-container/20 text-secondary-container border-secondary-container/30",
    },
    {
      icon: "trending_up",
      titleKey: "step3Title",
      descKey: "step3Desc",
      stepNum: "03",
      color: "bg-tertiary/10 text-tertiary border-tertiary/20",
    },
    {
      icon: "workspace_premium",
      titleKey: "step4Title",
      descKey: "step4Desc",
      stepNum: "04",
      color: "bg-primary/10 text-primary border-primary/20",
    },
  ];

  return (
    <section className="py-xl bg-surface border-t border-outline-variant/30 relative overflow-hidden">
      <div className="max-w-container-max mx-auto px-gutter relative z-10">
        <div className="text-center mb-xl max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-xs px-sm py-xs rounded-full font-label-md text-label-md bg-primary-container/10 text-primary-container mb-sm border border-primary-container/20">
            <span className="material-symbols-outlined text-[18px]">
              account_balance
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
          {steps.map((step) => (
            <div
              key={step.stepNum}
              className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col relative group"
            >
              <div className="flex justify-between items-center mb-md">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center border ${step.color}`}
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {step.icon}
                  </span>
                </div>
                <span className="font-display-lg text-[28px] font-bold text-outline-variant/40 group-hover:text-primary-container transition-colors">
                  {step.stepNum}
                </span>
              </div>

              <h3 className="font-headline-md text-[18px] text-on-surface mb-xs font-bold">
                {t(step.titleKey)}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant flex-grow">
                {t(step.descKey)}
              </p>

              <div className="mt-md pt-sm border-t border-outline-variant/30 flex items-center gap-xs text-xs font-semibold text-primary">
                <span>Perpetual Benefit</span>
                <span className="material-symbols-outlined text-[14px]">
                  arrow_forward
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
