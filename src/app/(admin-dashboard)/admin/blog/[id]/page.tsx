"use client";

import { useState, use, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Image as ImageIcon, ChevronDown, Upload, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { MediaPickerInput } from "@/components/admin/media/MediaPickerInput";
import { uploadMediaToSupabase } from "@/utils/supabase";
import { useBlogPost, useCreateBlogPost, useUpdateBlogPost } from "@/service";

export default function AdminBlogEditPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const { id } = use(params);
  const isNew = id === "new";

  const { data: postData, isLoading: isPostLoading } = useBlogPost(id);
  const createMutation = useCreateBlogPost();
  const updateMutation = useUpdateBlogPost(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("Draft");
  const [category, setCategory] = useState("Social Impact");
  const [coverImage, setCoverImage] = useState("");
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ title?: string; content?: string; coverImage?: string }>({});
  const coverFileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (postData) {
      setTitle(postData.title || "");
      setContent(postData.content || "");
      setStatus(postData.status === "PUBLISHED" ? "Published" : "Draft");
      setCategory(postData.category || "Social Impact");
      setCoverImage(postData.coverImage || "");
    }
  }, [postData]);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setIsUploadingCover(true);
    const { url, error } = await uploadMediaToSupabase(file);
    setIsUploadingCover(false);

    if (error) {
      setErrorMessage("Cover image upload failed: " + error);
      return;
    }

    if (url) {
      setCoverImage(url);
      setFieldErrors((prev) => ({ ...prev, coverImage: undefined }));
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const validateForm = () => {
    const errors: { title?: string; content?: string; coverImage?: string } = {};

    if (!title.trim()) {
      errors.title = "Post title is required.";
    } else if (title.trim().length < 3) {
      errors.title = "Post title must be at least 3 characters long.";
    }

    const textContent = content.replace(/<[^>]*>/g, "").trim();
    if (!textContent) {
      errors.content = "Post content cannot be empty.";
    }

    if (coverImage.trim() && !/^https?:\/\/.+/i.test(coverImage.trim())) {
      errors.coverImage = "Cover image must be a valid HTTP or HTTPS URL.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    setErrorMessage(null);

    if (!validateForm()) {
      setErrorMessage("Please correct the validation errors in the form before saving.");
      return;
    }

    const payload = { title: title.trim(), content, coverImage: coverImage.trim(), category, status };

    if (isNew) {
      createMutation.mutate(payload, {
        onSuccess: () => {
          router.push("/admin/blog");
          router.refresh();
        },
        onError: (err: any) => {
          setErrorMessage(err.message || "Failed to create post.");
        },
      });
    } else {
      updateMutation.mutate(payload, {
        onSuccess: () => {
          router.push("/admin/blog");
          router.refresh();
        },
        onError: (err: any) => {
          setErrorMessage(err.message || "Failed to update post.");
        },
      });
    }
  };

  if (!isNew && isPostLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3 text-on-surface-variant">
        <Loader2 size={32} className="animate-spin text-primary" />
        <p className="text-sm font-medium">Loading Post Details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 pb-24">
      {/* Hidden File Input for Cover Image */}
      <input
        type="file"
        ref={coverFileInputRef}
        onChange={handleCoverUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Top Error Alert */}
      {errorMessage && (
        <div role="alert" className="p-4 rounded-xl bg-error/10 border border-error/20 text-error flex items-center justify-between text-sm font-medium">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={18} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-xs underline font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {/* Top bar — stacks on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Back + Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/admin/blog"
            className="p-2 bg-surface border border-outline rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors shrink-0"
            aria-label="Back to blog list"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-lg sm:text-2xl font-bold text-on-surface truncate">
            {isNew
              ? t.has("blog.createNew") ? t("blog.createNew") : "Create Post"
              : t.has("blog.editPost") ? t("blog.editPost") : "Edit Post"}
          </h1>
        </div>

        {/* Status + Save — row on all sizes */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="appearance-none bg-surface border border-outline text-on-surface rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary text-on-primary px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            <span className="hidden sm:inline">
              {isSaving ? "Saving..." : t.has("blog.save") ? t("blog.save") : "Save Post"}
            </span>
            <span className="sm:hidden">{isSaving ? "..." : "Save"}</span>
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-4 sm:space-y-6">
        <div className="bg-surface p-4 sm:p-6 rounded-2xl border border-outline shadow-sm space-y-4">
          {/* Title input */}
          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">
              {t.has("blog.postTitle") ? t("blog.postTitle") : "Post Title"}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (fieldErrors.title) setFieldErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="Enter post title here..."
              className={`w-full px-4 py-3 text-base sm:text-lg rounded-lg border bg-transparent text-on-surface focus:outline-none focus:ring-1 transition-all font-medium ${
                fieldErrors.title
                  ? "border-error focus:border-error focus:ring-error/20"
                  : "border-outline focus:border-primary focus:ring-primary"
              }`}
            />
            {fieldErrors.title && (
              <p className="text-xs text-error font-medium px-1 mt-1.5">{fieldErrors.title}</p>
            )}
          </div>

          {/* Category selector */}
          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">
              Category
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="appearance-none w-full bg-surface border border-outline text-on-surface rounded-lg pl-4 pr-10 py-3 text-base focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer transition-all"
              >
                <option value="Social Impact">Social Impact</option>
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Press Releases">Press Releases</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
              />
            </div>
          </div>

          {/* Cover image with Gallery & Supabase Upload */}
          <MediaPickerInput
            value={coverImage}
            onChange={(url) => {
              setCoverImage(url);
              if (fieldErrors.coverImage) setFieldErrors((prev) => ({ ...prev, coverImage: undefined }));
            }}
            label={t.has("blog.coverImage") ? t("blog.coverImage") : "Cover Image"}
            error={fieldErrors.coverImage}
          />
        </div>

        {/* WYSIWYG Editor */}
        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">
            {t.has("blog.content") ? t("blog.content") : "Content"}
          </label>
          <RichTextEditor
            content={content}
            onChange={(newContent) => {
              setContent(newContent);
              if (fieldErrors.content) setFieldErrors((prev) => ({ ...prev, content: undefined }));
            }}
          />
          {fieldErrors.content && (
            <p className="text-xs text-error font-medium px-1 mt-1.5">{fieldErrors.content}</p>
          )}
        </div>
      </div>
    </div>
  );
}
