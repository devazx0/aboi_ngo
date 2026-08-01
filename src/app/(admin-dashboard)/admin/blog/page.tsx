"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { AlertCircle, Plus, Edit2, Trash2, Search, Loader2, CheckCircle2 } from "lucide-react";
import { useBlogPosts, useDeleteBlogPost } from "@/service";

export default function AdminBlogPage() {
  const t = useTranslations("Admin");
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data: posts = [], isLoading, error: fetchError } = useBlogPosts(search);
  const deleteMutation = useDeleteBlogPost();

  const handleDelete = (id: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!confirm("Are you sure you want to delete this post?")) return;

    deleteMutation.mutate(id, {
      onSuccess: () => {
        setSuccessMessage("Post deleted successfully.");
        setTimeout(() => setSuccessMessage(null), 4000);
      },
      onError: (err: any) => {
        setErrorMessage(err.message || "Failed to delete post.");
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Notifications */}
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

      {successMessage && (
        <div role="status" className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 flex items-center justify-between text-sm font-medium">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-xs underline font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {fetchError && (
        <div role="alert" className="p-4 rounded-xl bg-error/10 border border-error/20 text-error flex items-center gap-2 text-sm font-medium">
          <AlertCircle size={18} className="shrink-0" />
          <span>Failed to load blog posts. Please check your connection.</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-on-surface">
            {t.has("blog.title") ? t("blog.title") : "Blog Management"}
          </h1>
          <p className="text-on-surface-variant text-sm mt-0.5">
            {t.has("blog.subtitle")
              ? t("blog.subtitle")
              : "Manage your platform's news and articles."}
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="bg-primary text-on-primary px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm shrink-0"
        >
          <Plus size={18} />
          {t.has("blog.createNew") ? t("blog.createNew") : "Create Post"}
        </Link>
      </div>

      {/* Table card */}
      <div className="bg-surface rounded-2xl border border-outline shadow-sm overflow-hidden">
        {/* Search bar */}
        <div className="p-4 border-b border-outline">
          <div className="relative w-full max-w-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
              size={18}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.has("blog.search") ? t("blog.search") : "Search posts..."}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-outline bg-surface-variant/50 text-on-surface text-sm focus:outline-none focus:border-primary focus:bg-surface transition-all"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-16 flex items-center justify-center gap-2 text-on-surface-variant text-sm">
            <Loader2 size={20} className="animate-spin text-primary" />
            <span>Loading blog posts via Service Hook...</span>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-variant/30 border-b border-outline">
                    <th className="py-3 px-6 font-medium text-xs uppercase tracking-wider text-on-surface-variant">
                      Title
                    </th>
                    <th className="py-3 px-6 font-medium text-xs uppercase tracking-wider text-on-surface-variant">
                      Author
                    </th>
                    <th className="py-3 px-6 font-medium text-xs uppercase tracking-wider text-on-surface-variant">
                      Status
                    </th>
                    <th className="py-3 px-6 font-medium text-xs uppercase tracking-wider text-on-surface-variant">
                      Category
                    </th>
                    <th className="py-3 px-6 font-medium text-xs uppercase tracking-wider text-on-surface-variant">
                      Date
                    </th>
                    <th className="py-3 px-6 font-medium text-xs uppercase tracking-wider text-on-surface-variant text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr
                      key={post.id}
                      className="border-b border-outline last:border-0 hover:bg-surface-variant/20 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <p className="font-medium text-on-surface text-sm">{post.title}</p>
                      </td>
                      <td className="py-4 px-6 text-on-surface-variant text-sm">
                        {post.author?.name || "Admin"}
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={post.status} />
                      </td>
                      <td className="py-4 px-6 text-on-surface-variant text-sm">
                        {post.category}
                      </td>
                      <td className="py-4 px-6 text-on-surface-variant text-sm">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <PostActions id={post.id} onDelete={() => handleDelete(post.id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="sm:hidden divide-y divide-outline">
              {posts.map((post) => (
                <div key={post.id} className="p-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-on-surface text-sm truncate">{post.title}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <StatusBadge status={post.status} />
                      <span className="text-xs text-on-surface-variant bg-surface-variant px-2 py-0.5 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <PostActions id={post.id} onDelete={() => handleDelete(post.id)} />
                </div>
              ))}
            </div>

            {posts.length === 0 && (
              <p className="text-center text-on-surface-variant py-12 text-sm">No posts found.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isPublished = status === "PUBLISHED" || status === "Published";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isPublished
          ? "bg-green-100 text-green-800"
          : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}

function PostActions({ id, onDelete }: { id: string; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-1 shrink-0">
      <Link
        href={`/admin/blog/${id}`}
        className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
        title="Edit"
      >
        <Edit2 size={16} />
      </Link>
      <button
        onClick={onDelete}
        className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
