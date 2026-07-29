"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LayoutDashboard, FileText, Image as ImageIcon, Settings, LogOut, X } from "lucide-react";
import { useLogout } from "@/service";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Admin");
  const logoutMutation = useLogout();

  const links = [
    { href: "/admin/dashboard", label: "dashboard", icon: LayoutDashboard },
    { href: "/admin/blog", label: "blog", icon: FileText },
    { href: "/admin/media", label: "media", icon: ImageIcon },
    { href: "/admin/settings", label: "settings", icon: Settings },
  ];

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        router.push("/admin/login");
        router.refresh();
      },
    });
  };

  const getLabel = (key: string) =>
    t.has(`nav.${key}`) ? t(`nav.${key}`) : key.charAt(0).toUpperCase() + key.slice(1);

  const SidebarContent = () => (
    <aside className="w-64 bg-surface flex flex-col h-full">
      <div className="h-16 flex items-center justify-between px-6 border-b border-outline shrink-0">
        <span className="text-xl font-bold text-primary">NGO ABOI</span>
        {/* Close button — only visible on mobile overlay */}
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-md text-on-surface-variant hover:bg-surface-variant cursor-pointer"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-on-primary font-semibold"
                  : "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
              }`}
            >
              <Icon size={20} className="shrink-0" />
              <span className="text-sm">{getLabel(link.label)}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-outline shrink-0">
        <button
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-error hover:bg-error/10 transition-colors w-full cursor-pointer text-left font-medium disabled:opacity-50"
        >
          <LogOut size={20} className="shrink-0" />
          <span className="text-sm">
            {logoutMutation.isPending
              ? "Logging out..."
              : t.has("nav.logout")
              ? t("nav.logout")
              : "Logout"}
          </span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop: static sidebar */}
      <div className="hidden lg:flex h-full w-64 shrink-0 border-r border-outline">
        <SidebarContent />
      </div>

      {/* Mobile: drawer overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Drawer panel */}
          <div className="relative z-50 flex h-full w-64 shrink-0 shadow-2xl">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
