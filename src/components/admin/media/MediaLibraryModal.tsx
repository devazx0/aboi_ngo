"use client";

import { useState } from "react";
import { MediaItem } from "@/service/useMediaService";
import { MediaGrid } from "./MediaGrid";
import { MediaDetailsPanel } from "./MediaDetailsPanel";
import { MediaUploader } from "./MediaUploader";
import { X, Upload, Image as ImageIcon } from "lucide-react";

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia: (item: MediaItem) => void;
  title?: string;
  selectButtonText?: string;
}

export function MediaLibraryModal({
  isOpen,
  onClose,
  onSelectMedia,
  title = "Media Library",
  selectButtonText = "Select Media",
}: MediaLibraryModalProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "library">("library");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  if (!isOpen) return null;

  const handleSelectConfirm = () => {
    if (selectedItem) {
      onSelectMedia(selectedItem);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Modal Dialog Container */}
      <div className="bg-surface border border-outline rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header Tabs */}
        <div className="px-4 sm:px-6 pt-4 border-b border-outline flex items-center justify-between shrink-0 bg-surface">
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-bold text-on-surface">{title}</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("upload")}
                className={`flex items-center gap-2 px-3 py-2 border-b-2 text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "upload"
                    ? "border-primary text-primary"
                    : "border-transparent text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <Upload size={15} />
                <span>Upload Files</span>
              </button>
              <button
                onClick={() => setActiveTab("library")}
                className={`flex items-center gap-2 px-3 py-2 border-b-2 text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "library"
                    ? "border-primary text-primary"
                    : "border-transparent text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <ImageIcon size={15} />
                <span>Media Library</span>
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
          {activeTab === "upload" ? (
            <div className="flex-1 flex items-center justify-center overflow-y-auto">
              <MediaUploader
                onSuccess={() => {
                  // Switch to library tab when upload succeeds
                  setActiveTab("library");
                }}
              />
            </div>
          ) : (
            <>
              {/* Media Grid Left Side */}
              <MediaGrid
                selectedItem={selectedItem}
                onSelectItem={(item) => setSelectedItem(item)}
                onUploadClick={() => setActiveTab("upload")}
              />

              {/* Media Details Panel Right Side (if item selected) */}
              {selectedItem && (
                <MediaDetailsPanel
                  item={selectedItem}
                  onClose={() => setSelectedItem(null)}
                  onDeleted={() => setSelectedItem(null)}
                />
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-outline flex items-center justify-between shrink-0 bg-surface">
          <div className="text-xs text-on-surface-variant truncate pr-2">
            {selectedItem ? (
              <span>
                Selected: <strong className="text-on-surface">{selectedItem.filename}</strong>
              </span>
            ) : (
              <span>Select an item from the library</span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-outline text-on-surface text-xs font-medium hover:bg-surface-variant transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSelectConfirm}
              disabled={!selectedItem}
              className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
            >
              {selectButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
