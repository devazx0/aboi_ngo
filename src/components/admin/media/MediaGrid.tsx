"use client";

import { useState } from "react";
import { MediaItem, useMediaItems } from "@/service/useMediaService";
import { MediaItemCard } from "./MediaItemCard";
import { Search, Loader2, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

interface MediaGridProps {
  selectedItem: MediaItem | null;
  onSelectItem: (item: MediaItem) => void;
  onUploadClick?: () => void;
}

export function MediaGrid({ selectedItem, onSelectItem, onUploadClick }: MediaGridProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "video" | "document">("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useMediaItems({
    search,
    type: typeFilter,
    page,
    limit: 24,
  });

  const items = data?.items || [];
  const totalPages = data?.totalPages || 1;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to page 1 on new search
  };

  const handleTypeChange = (type: "all" | "image" | "video" | "document") => {
    setTypeFilter(type);
    setPage(1);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-surface">
      {/* Top Filter & Search Toolbar */}
      <div className="p-4 border-b border-outline flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1 bg-surface-variant/40 p-1 rounded-xl border border-outline self-start sm:self-auto overflow-x-auto">
          {(["all", "image", "video", "document"] as const).map((t) => (
            <button
              key={t}
              onClick={() => handleTypeChange(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer whitespace-nowrap ${
                typeFilter === t
                  ? "bg-surface text-primary shadow-sm font-semibold"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {t === "all" ? "All Media" : `${t}s`}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-xs">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search media by filename, alt text..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-outline bg-transparent text-on-surface text-xs focus:outline-none focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Main Grid View */}
      <div className="flex-1 overflow-y-auto p-4 min-h-[300px]">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-2 text-on-surface-variant">
            <Loader2 size={28} className="animate-spin text-primary" />
            <span className="text-xs font-medium">Loading media library...</span>
          </div>
        ) : isError ? (
          <div className="h-64 flex items-center justify-center text-error text-xs font-medium">
            Failed to load media items. Please try refreshing.
          </div>
        ) : items.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3 text-on-surface-variant text-center p-6">
            <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
              <ImageIcon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-on-surface">No media items found</p>
              <p className="text-xs text-on-surface-variant">
                {search ? "Try searching for a different keyword" : "Upload your first file to get started"}
              </p>
            </div>
            {onUploadClick && (
              <button
                onClick={onUploadClick}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Upload Files
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {items.map((item) => (
              <MediaItemCard
                key={item.id}
                item={item}
                isSelected={selectedItem?.id === item.id}
                onSelect={onSelectItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-outline flex items-center justify-between text-xs text-on-surface-variant shrink-0">
          <span>
            Page {page} of {totalPages} ({data?.total || 0} items)
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-outline hover:bg-surface-variant disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              title="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-outline hover:bg-surface-variant disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              title="Next Page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
