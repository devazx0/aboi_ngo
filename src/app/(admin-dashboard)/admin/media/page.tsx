"use client";

import { useState } from "react";
import { MediaItem } from "@/service/useMediaService";
import { MediaGrid } from "@/components/admin/media/MediaGrid";
import { MediaDetailsPanel } from "@/components/admin/media/MediaDetailsPanel";
import { MediaUploader } from "@/components/admin/media/MediaUploader";
import { Plus, X, Image as ImageIcon } from "lucide-react";

export default function AdminMediaPage() {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [showUploader, setShowUploader] = useState(false);

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-4">
      {/* Top Title Bar */}
      <div className="flex items-center justify-between gap-4 px-1 shrink-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-on-surface flex items-center gap-2.5">
            <ImageIcon size={24} className="text-primary" />
            <span>Media Library</span>
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Upload, manage, search, and delete media files stored in your Supabase media storage.
          </p>
        </div>

        <button
          onClick={() => setShowUploader((prev) => !prev)}
          className="bg-primary text-on-primary px-4 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 text-xs sm:text-sm cursor-pointer shadow-sm shrink-0"
        >
          {showUploader ? <X size={16} /> : <Plus size={16} />}
          <span>{showUploader ? "Close Upload" : "Add New Media"}</span>
        </button>
      </div>

      {/* Slide-down Uploader Zone */}
      {showUploader && (
        <div className="bg-surface border border-outline rounded-2xl shadow-sm animate-in slide-in-from-top-4 duration-200 shrink-0">
          <MediaUploader
            onSuccess={() => {
              // Hide uploader after upload success
              setShowUploader(false);
            }}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 bg-surface border border-outline rounded-2xl overflow-hidden flex flex-col lg:flex-row min-h-0 shadow-xs">
        {/* Left: Media Grid */}
        <MediaGrid
          selectedItem={selectedItem}
          onSelectItem={(item) => setSelectedItem(item)}
          onUploadClick={() => setShowUploader(true)}
        />

        {/* Right: Selected Item Details Sidebar */}
        {selectedItem && (
          <MediaDetailsPanel
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onDeleted={() => setSelectedItem(null)}
          />
        )}
      </div>
    </div>
  );
}
