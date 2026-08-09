"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function FaqSection() {
  const t = useTranslations("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { qKey: "q1", aKey: "a1" },
    { qKey: "q2", aKey: "a2" },
    { qKey: "q3", aKey: "a3" },
    { qKey: "q4", aKey: "a4" },
    { qKey: "q5", aKey: "a5" },
  ];

  const toggleFaq = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="py-xl bg-surface border-t border-outline-variant/30 relative">
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="text-center mb-xl max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-xs px-sm py-xs rounded-full font-label-md text-label-md bg-primary-container/10 text-primary-container mb-sm border border-primary-container/20">
            <span className="material-symbols-outlined text-[18px]">
              help_outline
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

        <div className="max-w-3xl mx-auto space-y-md">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.qKey}
                className="bg-surface-container-lowest rounded-lg border border-outline-variant/60 shadow-sm overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-md text-left flex justify-between items-center gap-md hover:bg-surface-container/50 transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-headline-md text-[18px] text-on-surface font-semibold">
                    {t(faq.qKey)}
                  </span>
                  <span
                    className={`material-symbols-outlined text-primary text-[24px] transform transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    keyboard_arrow_down
                  </span>
                </button>

                {isOpen && (
                  <div className="px-md pb-md text-on-surface-variant font-body-md text-body-md border-t border-outline-variant/20 pt-sm leading-relaxed animate-fade-in">
                    {t(faq.aKey)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
