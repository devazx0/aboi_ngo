import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Total Page Visits Count
    const totalViews = await prisma.pageVisit.count();

    // 2. Unique Visitors (distinct ipHash count)
    const uniqueVisitorsGroup = await prisma.pageVisit.groupBy({
      by: ["ipHash"],
      _count: { ipHash: true },
    });
    const uniqueVisitors = uniqueVisitorsGroup.length;

    // 3. Interaction Rate Calculation (percentage of returning or unique interactions)
    const interactionRate = totalViews > 0 ? ((uniqueVisitors / totalViews) * 100).toFixed(1) + "%" : "0.0%";

    // 4. Real Monthly Traffic aggregation over past 6 calendar months
    const now = new Date();
    const monthIntervals = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
      const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
      const monthName = d.toLocaleString("en-US", { month: "short" });

      monthIntervals.push({ startOfMonth, endOfMonth, name: monthName });
    }

    const traffic = await Promise.all(
      monthIntervals.map(async ({ startOfMonth, endOfMonth, name }) => {
        const views = await prisma.pageVisit.count({
          where: { visitedAt: { gte: startOfMonth, lte: endOfMonth } },
        });
        const uniqueGroup = await prisma.pageVisit.groupBy({
          by: ["ipHash"],
          where: { visitedAt: { gte: startOfMonth, lte: endOfMonth } },
          _count: { ipHash: true },
        });
        return {
          name,
          views,
          visitors: uniqueGroup.length,
        };
      })
    );

    // 5. Country Demographics Breakdown
    const countryGroups = await prisma.pageVisit.groupBy({
      by: ["country", "countryCode"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 6,
    });

    const topCountries = countryGroups.map((c) => {
      const percentage = totalViews > 0 ? Number(((c._count.id / totalViews) * 100).toFixed(1)) : 0;
      return {
        name: c.country || "Unknown",
        code: c.countryCode || "XX",
        visitors: c._count.id,
        percentage,
      };
    });

    // 6. Continent Demographics Breakdown
    const continentGroups = await prisma.pageVisit.groupBy({
      by: ["continent"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });

    const continentColors: Record<string, string> = {
      Africa: "#064e3b",
      Europe: "#fe932c",
      "North America": "#272e3e",
      Asia: "#80bea6",
      "South America": "#6366f1",
      Oceania: "#ec4899",
      Unknown: "#c0c6db",
    };

    const topContinents = continentGroups.map((cg) => {
      const percentage = totalViews > 0 ? Number(((cg._count.id / totalViews) * 100).toFixed(1)) : 0;
      return {
        name: cg.continent || "Unknown",
        visitors: cg._count.id,
        percentage,
        color: continentColors[cg.continent || "Unknown"] || "#c0c6db",
      };
    });

    return NextResponse.json({
      statCards: [
        {
          key: "totalViews",
          fallback: "Total Page Views",
          value: totalViews.toLocaleString(),
          change: totalViews > 0 ? "+100%" : "0%",
        },
        {
          key: "uniqueVisitors",
          fallback: "Unique Visitors",
          value: uniqueVisitors.toLocaleString(),
          change: uniqueVisitors > 0 ? "+100%" : "0%",
        },
        {
          key: "interactionRate",
          fallback: "Interaction Rate",
          value: interactionRate,
          change: "0%",
        },
      ],
      traffic,
      topCountries,
      topContinents,
    });
  } catch (error: any) {
    console.error("GET /api/admin/analytics Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to calculate analytics stats." },
      { status: 500 }
    );
  }
}
