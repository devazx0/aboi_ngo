"use client";

import { useState } from "react";
import { MediaItem } from "@/service/useMediaService";
import { MediaLibraryModal } from "./MediaLibraryModal";
import { Image as ImageIcon, FolderOpen, X } from "lucide-react";

interface MediaPickerInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
}

export function MediaPickerInput({
  value,
  onChange,
  label = "Cover Image",
  placeholder = "https://example.com/image.jpg or select from gallery",
  error,
}: MediaPickerInputProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMediaSelect = (item: MediaItem) => {
    onChange(item.url);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-on-surface">{label}</label>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* URL Input */}
        <div className="flex-1 relative min-w-0">
          <ImageIcon
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant shrink-0"
            size={18}
          />
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full pl-9 pr-4 py-3 rounded-lg border bg-transparent text-on-surface text-sm focus:outline-none focus:ring-1 transition-all ${
              error
                ? "border-error focus:border-error focus:ring-error/20"
                : "border-outline focus:border-primary focus:ring-primary"
            }`}
          />
        </div>

        {/* Gallery Modal Trigger */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-surface-variant hover:bg-surface-variant/80 text-on-surface text-sm font-medium transition-colors shrink-0 cursor-pointer"
        >
          <FolderOpen size={16} />
          <span>Select from Gallery</span>
        </button>

        {/* Preview Thumbnail + Clear Button */}
        {value && (
          <div className="relative group self-center sm:self-auto shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="w-12 h-12 rounded-lg border border-outline object-cover"
            />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-error text-on-error flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              title="Remove image"
            >
              <X size={12} />
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-error font-medium px-1 mt-1.5">{error}</p>}

      {/* Media Library Modal Popup */}
      <MediaLibraryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectMedia={handleMediaSelect}
        title="Select Cover Image"
        selectButtonText="Use as Cover Image"
      />
    </div>
  );
}
