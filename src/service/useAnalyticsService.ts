import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "./apiClient";

export interface AnalyticsResponse {
  statCards: Array<{
    key: string;
    fallback: string;
    value: string;
    change: string;
  }>;
  traffic: Array<{
    name: string;
    views: number;
    visitors: number;
  }>;
  topCountries: Array<{
    name: string;
    code: string;
    visitors: number;
    percentage: number;
  }>;
  topContinents: Array<{
    name: string;
    visitors: number;
    percentage: number;
    color: string;
  }>;
}

export function useAnalyticsStats() {
  return useQuery({
    queryKey: ["analytics", "dashboard"],
    queryFn: async () => {
      const { data } = await apiClient.get<AnalyticsResponse>("/api/admin/analytics");
      return data;
    },
    refetchInterval: 1000 * 60 * 2, // Refetch analytics every 2 minutes
  });
}

export function useTrackVisit() {
  return useMutation({
    mutationFn: async (path: string) => {
      const { data } = await apiClient.post<{ success: boolean }>("/api/analytics/track", { path });
      return data;
    },
  });
}
