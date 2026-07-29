"use client";

import { MediaItem } from "@/service/useMediaService";
import { Check, FileText, Film, Image as ImageIcon } from "lucide-react";

interface MediaItemCardProps {
  item: MediaItem;
  isSelected: boolean;
  onSelect: (item: MediaItem) => void;
}

export function MediaItemCard({ item, isSelected, onSelect }: MediaItemCardProps) {
  const isImage = item.mimeType.startsWith("image/");
  const isVideo = item.mimeType.startsWith("video/");

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className={`group relative aspect-square rounded-xl border overflow-hidden cursor-pointer bg-surface-variant/30 transition-all ${
        isSelected
          ? "border-primary ring-2 ring-primary/30 shadow-md"
          : "border-outline hover:border-primary/50 hover:shadow-sm"
      }`}
    >
      {/* Thumbnail Content */}
      {isImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.url}
          alt={item.altText || item.filename}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      ) : isVideo ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-surface-variant/70 text-on-surface-variant p-3 text-center">
          <Film size={32} className="text-primary mb-1 shrink-0" />
          <span className="text-xs font-medium truncate max-w-full px-1">{item.filename}</span>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-surface-variant/70 text-on-surface-variant p-3 text-center">
          <FileText size={32} className="text-primary mb-1 shrink-0" />
          <span className="text-xs font-medium truncate max-w-full px-1">{item.filename}</span>
        </div>
      )}

      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md animate-in zoom-in-50 duration-150">
          <Check size={14} strokeWidth={3} />
        </div>
      )}

      {/* Bottom Info Overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between text-[11px]">
        <span className="truncate font-medium pr-1">{item.filename}</span>
        <span className="shrink-0 opacity-80">{formatFileSize(item.size)}</span>
      </div>
    </div>
  );
}
