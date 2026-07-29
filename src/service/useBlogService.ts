import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./apiClient";

export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  status: string;
  createdAt: string;
  author: {
    name: string;
    email: string;
  };
}

export interface SaveBlogPostParams {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  status: string;
}

// Fetch all blog posts with search query
export function useBlogPosts(search: string = "") {
  return useQuery({
    queryKey: ["blog", "list", search],
    queryFn: async () => {
      const { data } = await apiClient.get<{ posts: BlogPostItem[] }>(
        `/api/admin/blog?search=${encodeURIComponent(search)}`
      );
      return data.posts;
    },
  });
}

// Fetch single blog post by ID
export function useBlogPost(id: string) {
  return useQuery({
    queryKey: ["blog", "detail", id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ post: BlogPostItem }>(`/api/admin/blog/${id}`);
      return data.post;
    },
    enabled: Boolean(id) && id !== "new",
  });
}

// Create blog post mutation
export function useCreateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: SaveBlogPostParams) => {
      const { data } = await apiClient.post<{ success: boolean; post: BlogPostItem }>(
        "/api/admin/blog",
        params
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog"] });
    },
  });
}

// Update blog post mutation
export function useUpdateBlogPost(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: Partial<SaveBlogPostParams>) => {
      const { data } = await apiClient.put<{ success: boolean; post: BlogPostItem }>(
        `/api/admin/blog/${id}`,
        params
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog"] });
    },
  });
}

// Delete blog post mutation
export function useDeleteBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete<{ success: boolean; message: string }>(
        `/api/admin/blog/${id}`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog"] });
    },
  });
}
