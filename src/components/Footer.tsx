import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="bg-tertiary w-full pt-xl pb-md px-gutter">
      <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-md">
        <div className="space-y-sm">
          <h2 className="font-headline-lg text-headline-lg text-surface-container-lowest">
            NGO-ABOI
          </h2>
          <p className="font-body-md text-body-md text-on-tertiary-container">
            {t("tagline")}
          </p>
        </div>

        <div className="space-y-sm">
          <h3 className="font-headline-md text-headline-md text-surface-container-lowest">
            {t("quickLinks")}
          </h3>
          <ul className="space-y-xs">
            {[
              { label: t("mission"), href: "/about" },
              { label: t("ourPillars"), href: "/pillars" },
              { label: t("newsImpact"), href: "/news" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-label-md text-label-md text-on-tertiary-container hover:text-secondary-fixed-dim transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-sm">
          <h3 className="font-headline-md text-headline-md text-surface-container-lowest">
            {t("contactUs")}
          </h3>
          <ul className="space-y-xs font-body-md text-body-md text-on-tertiary-container">
            <li className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">
                location_on
              </span>
              {t("location")}
            </li>
            <li className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">
                phone
              </span>
              {t("phone")}
            </li>
            <li className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">
                mail
              </span>
              {t("email")}
            </li>
          </ul>
        </div>

        <div className="space-y-sm">
          <h3 className="font-headline-md text-headline-md text-surface-container-lowest">
            {t("followUs")}
          </h3>
          <ul className="flex flex-col gap-xs">
            {["Facebook", "YouTube", "LinkedIn"].map((name) => (
              <li key={name}>
                <Link
                  href="#"
                  className="font-label-md text-label-md text-on-tertiary-container hover:text-secondary-fixed-dim transition-colors"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-container-max mx-auto border-t border-on-tertiary-fixed-variant mt-md pt-sm text-center">
        <p className="font-body-md text-body-md text-on-tertiary-container">
          {t("copyright")}
        </p>
      </div>
    </footer>
  );
}
