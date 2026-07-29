"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Menu, Globe, User } from "lucide-react";
import { useCurrentUser } from "@/service";

interface AdminTopNavProps {
  onMenuToggle: () => void;
}

export function AdminTopNav({ onMenuToggle }: AdminTopNavProps) {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { data: user } = useCurrentUser();

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      // must match the cookie key read in src/i18n/request.ts
      document.cookie = `aboi-locale=${nextLocale}; path=/; max-age=31536000`;
      router.refresh();
    });
  };

  const displayName = user?.name || "Admin";
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <header className="h-16 bg-surface border-b border-outline flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shrink-0">
      <div className="flex items-center gap-3">
        {/* Hamburger: visible on mobile/tablet */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-base sm:text-lg font-semibold text-on-surface truncate">
          {t.has("dashboard.title") ? t("dashboard.title") : "Dashboard Overview"}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Language switcher */}
        <div className="flex items-center gap-1.5">
          <Globe size={16} className="text-on-surface-variant shrink-0" />
          <select
            value={locale}
            onChange={handleLocaleChange}
            disabled={isPending}
            aria-label="Select language"
            className="bg-transparent border-none text-sm font-medium outline-none cursor-pointer text-on-surface disabled:opacity-50 max-w-[6rem] sm:max-w-none"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
        </div>

        {/* Admin avatar */}
        <div className="flex items-center gap-2.5 pl-3 sm:pl-4 border-l border-outline">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm shrink-0 shadow-xs">
            {userInitial}
          </div>
          <div className="hidden sm:block text-sm leading-tight">
            <p className="font-semibold text-on-surface">{displayName}</p>
            {user?.role && (
              <p className="text-[11px] text-on-surface-variant/80 font-medium capitalize">
                {user.role.toLowerCase().replace("_", " ")}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
