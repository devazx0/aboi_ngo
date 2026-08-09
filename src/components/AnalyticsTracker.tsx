"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useTrackVisit } from "@/service";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const { mutate: trackVisit } = useTrackVisit();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Exclude tracking inside admin section or auth routes
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    // Only track when path changes
    if (lastTrackedPath.current !== pathname) {
      lastTrackedPath.current = pathname;
      trackVisit(pathname);
    }
  }, [pathname, trackVisit]);

  return null;
}
