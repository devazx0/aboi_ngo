import { apiClient } from "@/service/apiClient";

/**
 * Securely uploads a file (image or video) via authenticated admin server API route (/api/admin/upload).
 * This ensures ONLY logged-in admins can upload files, while the public can view uploaded images.
 */
export async function uploadMediaToSupabase(
  file: File,
  bucket = "posts-media"
): Promise<{ url: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", bucket);

    const { data } = await apiClient.post<{ success: boolean; url: string }>(
      "/api/admin/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return { url: data.url };
  } catch (err: any) {
    console.error("Upload error via admin API:", err);
    return { url: "", error: err.message || "Failed to upload file." };
  }
}
