import type { Locale } from "@/i18n/routing";

export const localeDirections: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  fr: "ltr",
  ar: "rtl",
};

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  ar: "AR",
};

export const localeOrder: Locale[] = ["fr", "ar", "en"];
