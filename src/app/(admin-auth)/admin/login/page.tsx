"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Lock, Mail, Globe, ShieldCheck, AlertCircle } from "lucide-react";
import { useLogin } from "@/service";

export default function AdminLoginPage() {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const loginMutation = useLogin();

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      errors.email = "Email address is required.";
    } else if (!emailRegex.test(email.trim())) {
      errors.email = "Please enter a valid email address (e.g. admin@aboi.org).";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!validateForm()) {
      return;
    }

    loginMutation.mutate(
      { email: email.trim(), password },
      {
        onSuccess: () => {
          router.push("/admin/dashboard");
          router.refresh();
        },
        onError: (err: any) => {
          const msg = err.message || "";
          if (
            msg.includes("prisma") ||
            msg.includes("ENOTFOUND") ||
            msg.includes("FATAL") ||
            msg.includes("postgres") ||
            msg.includes("invocation")
          ) {
            setErrorMsg(
              "Unable to connect to database service. Please check your database connection or try again later."
            );
          } else {
            setErrorMsg(msg || "Invalid email or password credentials.");
          }
        },
      }
    );
  };

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      document.cookie = `aboi-locale=${nextLocale}; path=/; max-age=31536000`;
      router.refresh();
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-surface-container-low p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle ambient background accent */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Language selector in top corner */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 flex items-center gap-2 bg-surface/80 backdrop-blur border border-outline/30 px-3 py-1.5 rounded-full shadow-sm">
        <Globe size={16} className="text-on-surface-variant shrink-0" />
        <select
          value={locale}
          onChange={handleLocaleChange}
          disabled={isPending}
          aria-label="Select language"
          className="bg-transparent border-none text-xs font-semibold text-on-surface focus:outline-none cursor-pointer"
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
          <option value="ar">العربية</option>
        </select>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-[440px] bg-surface-container-lowest border border-outline/20 rounded-3xl p-6 sm:p-10 shadow-xl relative z-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-on-primary shadow-md mb-1">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">NGO ABOI</h1>
            <p className="text-sm font-medium text-on-surface-variant mt-1">
              {t.has("login.subtitle") ? t("login.subtitle") : "Admin Panel Login"}
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div role="alert" className="p-3.5 rounded-xl bg-error/10 border border-error/20 text-error flex items-center gap-2.5 text-xs font-medium animate-fadeIn">
            <AlertCircle size={18} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5" noValidate>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant px-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70 shrink-0" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }}
                disabled={loginMutation.isPending}
                aria-invalid={Boolean(fieldErrors.email)}
                className={`w-full pl-11 pr-4 py-3 text-sm rounded-xl border bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 transition-all ${
                  fieldErrors.email
                    ? "border-error focus:ring-error/20"
                    : "border-outline/30 focus:border-primary focus:ring-primary/20"
                }`}
                placeholder="admin@aboi.org"
              />
            </div>
            {fieldErrors.email && (
              <p className="text-xs text-error font-medium px-1 mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant px-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70 shrink-0" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }}
                disabled={loginMutation.isPending}
                aria-invalid={Boolean(fieldErrors.password)}
                className={`w-full pl-11 pr-4 py-3 text-sm rounded-xl border bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 transition-all ${
                  fieldErrors.password
                    ? "border-error focus:ring-error/20"
                    : "border-outline/30 focus:border-primary focus:ring-primary/20"
                }`}
                placeholder="••••••••"
              />
            </div>
            {fieldErrors.password && (
              <p className="text-xs text-error font-medium px-1 mt-1">{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full mt-2 bg-primary text-on-primary py-3.5 px-4 rounded-xl font-semibold text-sm hover:bg-primary/95 active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? (
              <>
                <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              t.has("login.button") ? t("login.button") : "Sign In"
            )}
          </button>
        </form>

        <p className="text-center text-xs text-on-surface-variant/60 pt-2">
          NGO ABOI &copy; {new Date().getFullYear()} &bull; Admin Portal
        </p>
      </div>
    </div>
  );
}
