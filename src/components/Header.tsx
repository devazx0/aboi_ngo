"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { setLocale } from "@/actions/locale";
import { localeOrder } from "@/utils/locale";

const NAV_HREFS = ["/", "/about", "/pillars", "/news", "/contact", "/donate"] as const;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");

  const navLabels = [
    t("home"),
    t("about"),
    t("pillars"),
    t("news"),
    t("contact"),
    t("donate"),
  ];

  return (
    <header className="sticky top-0 w-full z-50 flex justify-between items-center px-gutter py-4 bg-surface/95 backdrop-blur-sm border-b border-outline-variant shadow-sm">
      <div className="flex items-center gap-sm">
        <Link href="/" className="flex items-center gap-sm">
          <img
            alt={t("logoAlt")}
            className="h-[40px] w-auto object-contain"
            src="/logo.png"
          />
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-md">
        {NAV_HREFS.map((href, i) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`font-label-md text-label-md transition-colors duration-200 ${
                isActive
                  ? "text-primary font-bold border-b-2 border-primary pb-1"
                  : "text-on-surface-variant font-medium hover:text-secondary"
              }`}
            >
              {navLabels[i]}
            </Link>
          );
        })}
      </nav>

      <div className="hidden md:flex items-center gap-sm">
        <div className="flex items-center gap-1 font-label-md text-label-md">
          {localeOrder.map((loc, i) => (
            <span key={loc} className="flex items-center">
              <button
                onClick={() => setLocale(loc)}
                className={`transition-colors duration-150 px-0.5 ${
                  locale === loc
                    ? "text-secondary font-bold"
                    : "text-on-surface-variant hover:text-secondary"
                }`}
              >
                {loc.toUpperCase()}
              </button>
              {i < localeOrder.length - 1 && (
                <span className="text-on-surface-variant mx-0.5">|</span>
              )}
            </span>
          ))}
        </div>
        <Link
          href="/contact"
          className="border border-primary text-primary hover:bg-primary/5 h-[44px] px-[16px] rounded font-label-md text-label-md transition-colors inline-flex items-center"
        >
          {t("becomePartner")}
        </Link>
        <Link
          href="/donate"
          className="bg-secondary-container text-on-secondary-container hover:bg-secondary-container/90 h-[44px] px-[18px] rounded font-label-md text-label-md font-bold shadow-xs hover:shadow-sm transition-all inline-flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">favorite</span>
          {t("donate")}
        </Link>
      </div>

      <button
        aria-label="Menu"
        className="md:hidden text-primary p-2"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <span
          className="material-symbols-outlined text-[28px]"
          style={{ fontVariationSettings: "'FILL' 0" }}
        >
          {mobileOpen ? "close" : "menu"}
        </span>
      </button>

      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-surface/95 backdrop-blur-sm border-b border-outline-variant shadow-md md:hidden">
          <nav className="flex flex-col px-gutter py-md gap-sm">
            {NAV_HREFS.map((href, i) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`font-label-md text-label-md py-2 transition-colors ${
                    isActive
                      ? "text-primary font-bold"
                      : "text-on-surface-variant font-medium"
                  }`}
                >
                  {navLabels[i]}
                </Link>
              );
            })}
            <hr className="border-outline-variant my-xs" />
            <div className="flex items-center gap-1 font-label-md text-label-md py-2">
              {localeOrder.map((loc, i) => (
                <span key={loc} className="flex items-center">
                  <button
                    onClick={() => {
                      setLocale(loc);
                      setMobileOpen(false);
                    }}
                    className={`transition-colors duration-150 px-0.5 ${
                      locale === loc
                        ? "text-secondary font-bold"
                        : "text-on-surface-variant hover:text-secondary"
                    }`}
                  >
                    {loc.toUpperCase()}
                  </button>
                  {i < localeOrder.length - 1 && (
                    <span className="text-on-surface-variant mx-0.5">|</span>
                  )}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/donate"
                onClick={() => setMobileOpen(false)}
                className="bg-secondary-container text-on-secondary-container h-[48px] px-[16px] rounded font-label-md text-label-md font-bold inline-flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">favorite</span>
                {t("donate")}
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="border border-primary text-primary h-[48px] px-[16px] rounded font-label-md text-label-md inline-flex items-center justify-center"
              >
                {t("becomePartner")}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
