"use client";

import { useTranslations } from "next-intl";
import { Users, Eye, MousePointerClick, ArrowUpRight, Globe, Compass, Loader2 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAnalyticsStats } from "@/service";

const defaultStatCards = [
  {
    key: "totalViews",
    fallback: "Total Page Views",
    value: "19,550",
    change: "+12.5%",
    icon: Eye,
    colorClass: "bg-primary/10 text-primary",
  },
  {
    key: "uniqueVisitors",
    fallback: "Unique Visitors",
    value: "12,406",
    change: "+8.2%",
    icon: Users,
    colorClass: "bg-secondary/10 text-secondary",
  },
  {
    key: "interactionRate",
    fallback: "Interaction Rate",
    value: "4.6%",
    change: "+1.2%",
    icon: MousePointerClick,
    colorClass: "bg-tertiary/10 text-tertiary",
  },
];

const countryFlags: Record<string, string> = {
  BJ: "🇧🇯",
  FR: "🇫🇷",
  NG: "🇳🇬",
  US: "🇺🇸",
  CA: "🇨🇦",
  TG: "🇹🇬",
  XX: "🌐",
};

export default function AdminDashboardPage() {
  const t = useTranslations("Admin");
  const { data, isLoading, error } = useAnalyticsStats();

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3 text-on-surface-variant">
        <Loader2 size={32} className="animate-spin text-primary" />
        <p className="text-sm font-medium">Loading Dashboard Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-error/10 border border-error/20 rounded-2xl text-error text-sm font-medium flex items-center justify-between">
        <span>Failed to load real-time analytics data. Please refresh or try again later.</span>
      </div>
    );
  }

  const statCards = [
    {
      key: "totalViews",
      fallback: "Total Page Views",
      value: data?.statCards[0]?.value ?? "0",
      change: data?.statCards[0]?.change ?? "0%",
      icon: Eye,
      colorClass: "bg-primary/10 text-primary",
    },
    {
      key: "uniqueVisitors",
      fallback: "Unique Visitors",
      value: data?.statCards[1]?.value ?? "0",
      change: data?.statCards[1]?.change ?? "0%",
      icon: Users,
      colorClass: "bg-secondary/10 text-secondary",
    },
    {
      key: "interactionRate",
      fallback: "Interaction Rate",
      value: data?.statCards[2]?.value ?? "0.0%",
      change: data?.statCards[2]?.change ?? "0%",
      icon: MousePointerClick,
      colorClass: "bg-tertiary/10 text-tertiary",
    },
  ];

  const trafficData = data?.traffic || [];
  const topCountries = data?.topCountries || [];
  const topContinents = data?.topContinents || [];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {statCards.map(({ key, fallback, value, change, icon: Icon, colorClass }) => (
          <div key={key} className="bg-surface p-5 sm:p-6 rounded-2xl border border-outline shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-on-surface-variant font-medium">
                {t.has(`dashboard.${key}`) ? t(`dashboard.${key}`) : fallback}
              </p>
              <div className={`p-2 rounded-lg ${colorClass}`}>
                <Icon size={18} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-on-surface">{value}</p>
            <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
              <ArrowUpRight size={14} />
              <span>{change}</span>
              <span className="text-on-surface-variant">
                {t.has("dashboard.fromLastMonth") ? t("dashboard.fromLastMonth") : "vs last month"}
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* Traffic Chart */}
      <div className="bg-surface p-4 sm:p-6 rounded-2xl border border-outline shadow-sm">
        <h3 className="text-base sm:text-lg font-bold text-on-surface mb-4 sm:mb-6">
          {t.has("dashboard.trafficOverview") ? t("dashboard.trafficOverview") : "Traffic Overview"}
        </h3>
        <div className="h-[240px] sm:h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trafficData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-on-surface-variant)", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-on-surface-variant)", fontSize: 12 }}
                width={40}
              />
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--color-outline-variant)"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-surface)",
                  borderRadius: "12px",
                  border: "1px solid var(--color-outline)",
                  boxShadow: "0 4px 16px rgb(0 0 0 / 0.08)",
                  fontSize: "13px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "13px", paddingTop: "16px" }} />
              <Area
                type="monotone"
                dataKey="views"
                name="Page Views"
                stroke="var(--color-primary)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorViews)"
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Area
                type="monotone"
                dataKey="visitors"
                name="Visitors"
                stroke="var(--color-secondary)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorVisitors)"
                dot={false}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Demographics: Top Countries & Top Continents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Countries */}
        <div className="bg-surface p-5 sm:p-6 rounded-2xl border border-outline shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Globe size={18} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-on-surface">
                {t.has("dashboard.topCountries") ? t("dashboard.topCountries") : "Top Countries"}
              </h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant">
              {topCountries.length} Active
            </span>
          </div>

          {topCountries.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant text-sm font-medium">
              No country traffic recorded yet.
            </div>
          ) : (
            <div className="space-y-4">
              {topCountries.map((c) => (
                <div key={c.code} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2.5 font-medium text-on-surface">
                      <span className="text-lg leading-none">{countryFlags[c.code] || "🌐"}</span>
                      <span>{c.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-on-surface-variant text-xs">
                        {c.visitors.toLocaleString()}{" "}
                        {t.has("dashboard.visitors") ? t("dashboard.visitors") : "visitors"}
                      </span>
                      <span className="font-semibold text-primary text-xs w-10 text-right">
                        {c.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${c.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Continents */}
        <div className="bg-surface p-5 sm:p-6 rounded-2xl border border-outline shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                <Compass size={18} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-on-surface">
                {t.has("dashboard.topContinents") ? t("dashboard.topContinents") : "Top Continents"}
              </h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant">
              Global Distribution
            </span>
          </div>

          {topContinents.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant text-sm font-medium">
              No continent traffic recorded yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Donut Chart */}
              <div className="sm:col-span-5 h-[170px] relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topContinents}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="visitors"
                    >
                      {topContinents.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-surface)",
                        borderRadius: "10px",
                        border: "1px solid var(--color-outline)",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs text-on-surface-variant font-medium truncate max-w-[80px]">
                    {topContinents[0]?.name || "Traffic"}
                  </span>
                  <span className="text-sm font-bold text-on-surface">
                    {topContinents[0]?.percentage ?? 0}%
                  </span>
                </div>
              </div>

              {/* Continents List */}
              <div className="sm:col-span-7 space-y-3">
                {topContinents.map((cont) => (
                  <div key={cont.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-2 font-medium text-on-surface">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: cont.color }}
                        />
                        <span>{cont.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-on-surface-variant text-xs">
                          {cont.visitors.toLocaleString()}
                        </span>
                        <span className="font-semibold text-on-surface text-xs">
                          {cont.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${cont.percentage}%`, backgroundColor: cont.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
