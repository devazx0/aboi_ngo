import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./apiClient";

export interface MediaItem {
  id: string;
  filename: string;
  filePath: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number | null;
  height?: number | null;
  altText?: string | null;
  caption?: string | null;
  uploadedById?: string | null;
  uploadedBy?: {
    name: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface FetchMediaQueryParams {
  search?: string;
  type?: "all" | "image" | "video" | "document";
  page?: number;
  limit?: number;
}

export interface MediaListResponse {
  items: MediaItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UpdateMediaParams {
  id: string;
  altText?: string;
  caption?: string;
  filename?: string;
}

// Fetch paginated media items list with search and filter
export function useMediaItems(params: FetchMediaQueryParams = {}) {
  const { search = "", type = "all", page = 1, limit = 24 } = params;

  return useQuery({
    queryKey: ["media", "list", { search, type, page, limit }],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (search) searchParams.set("search", search);
      if (type) searchParams.set("type", type);
      searchParams.set("page", page.toString());
      searchParams.set("limit", limit.toString());

      const { data } = await apiClient.get<MediaListResponse>(
        `/api/admin/media?${searchParams.toString()}`
      );
      return data;
    },
  });
}

// Fetch single media item details by ID
export function useMediaItem(id: string | null) {
  return useQuery({
    queryKey: ["media", "detail", id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await apiClient.get<{ item: MediaItem }>(`/api/admin/media/${id}`);
      return data.item;
    },
    enabled: Boolean(id),
  });
}

// Upload file(s) to media gallery
export function useUploadMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const { data } = await apiClient.post<{
        success: boolean;
        items: MediaItem[];
        item: MediaItem;
      }>("/api/admin/media", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });
}

// Update media metadata (altText, caption, filename)
export function useUpdateMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateMediaParams) => {
      const { data } = await apiClient.patch<{ success: boolean; item: MediaItem }>(
        `/api/admin/media/${id}`,
        payload
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      queryClient.invalidateQueries({ queryKey: ["media", "detail", variables.id] });
    },
  });
}

// Delete single or multiple media items (from storage and DB)
export function useDeleteMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string | string[]) => {
      const idArray = Array.isArray(ids) ? ids : [ids];
      const { data } = await apiClient.delete<{
        success: boolean;
        count: number;
        message: string;
      }>("/api/admin/media", {
        data: { ids: idArray },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });
}
