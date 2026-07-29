"use client";

import { useState, useEffect } from "react";
import { MediaItem, useUpdateMedia, useDeleteMedia } from "@/service/useMediaService";
import { Copy, Trash2, Check, ExternalLink, Loader2, AlertTriangle, X } from "lucide-react";

interface MediaDetailsPanelProps {
  item: MediaItem;
  onClose?: () => void;
  onDeleted?: (deletedId: string) => void;
}

export function MediaDetailsPanel({ item, onClose, onDeleted }: MediaDetailsPanelProps) {
  const [altText, setAltText] = useState(item.altText || "");
  const [caption, setCaption] = useState(item.caption || "");
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const updateMutation = useUpdateMedia();
  const deleteMutation = useDeleteMedia();

  // Sync state when selected item changes
  useEffect(() => {
    setAltText(item.altText || "");
    setCaption(item.caption || "");
    setShowDeleteConfirm(false);
  }, [item]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(item.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveMetadata = () => {
    updateMutation.mutate({
      id: item.id,
      altText: altText.trim(),
      caption: caption.trim(),
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(item.id, {
      onSuccess: () => {
        if (onDeleted) onDeleted(item.id);
        if (onClose) onClose();
      },
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const isImage = item.mimeType.startsWith("image/");
  const isVideo = item.mimeType.startsWith("video/");

  return (
    <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-outline bg-surface p-4 flex flex-col h-full overflow-y-auto space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-outline pb-3">
        <h3 className="font-semibold text-on-surface text-sm">Attachment Details</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-md text-on-surface-variant hover:bg-surface-variant transition-colors cursor-pointer"
            title="Close details"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Preview Section */}
      <div className="rounded-xl overflow-hidden bg-surface-variant/40 border border-outline flex items-center justify-center min-h-[160px] max-h-[220px] relative group">
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.url}
            alt={item.altText || item.filename}
            className="w-full h-full object-contain max-h-[220px]"
          />
        ) : isVideo ? (
          <video src={item.url} controls className="w-full max-h-[220px] object-contain" />
        ) : (
          <div className="p-6 text-center text-on-surface-variant text-sm font-medium">
            {item.filename}
          </div>
        )}

        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
          title="Open original file in new tab"
        >
          <ExternalLink size={14} />
        </a>
      </div>

      {/* File Info Meta */}
      <div className="space-y-1.5 text-xs text-on-surface-variant border-b border-outline pb-4">
        <div className="font-semibold text-on-surface truncate text-sm mb-1">{item.filename}</div>
        <div className="flex justify-between">
          <span>Uploaded:</span>
          <span className="font-medium text-on-surface">{formatDate(item.createdAt)}</span>
        </div>
        <div className="flex justify-between">
          <span>File size:</span>
          <span className="font-medium text-on-surface">{formatFileSize(item.size)}</span>
        </div>
        <div className="flex justify-between">
          <span>File type:</span>
          <span className="font-medium text-on-surface uppercase">{item.mimeType.split("/")[1] || item.mimeType}</span>
        </div>
        {item.uploadedBy && (
          <div className="flex justify-between">
            <span>Uploaded by:</span>
            <span className="font-medium text-on-surface">{item.uploadedBy.name}</span>
          </div>
        )}
      </div>

      {/* Metadata Editing Inputs */}
      <div className="space-y-3 text-xs">
        <div>
          <label className="block font-medium text-on-surface mb-1">
            Alt Text <span className="text-on-surface-variant font-normal">(for SEO & Accessibility)</span>
          </label>
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            onBlur={handleSaveMetadata}
            placeholder="Describe this image..."
            className="w-full px-3 py-2 rounded-lg border border-outline bg-transparent text-on-surface focus:outline-none focus:border-primary transition-all text-xs"
          />
        </div>

        <div>
          <label className="block font-medium text-on-surface mb-1">Caption</label>
          <textarea
            rows={2}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            onBlur={handleSaveMetadata}
            placeholder="Optional caption..."
            className="w-full px-3 py-2 rounded-lg border border-outline bg-transparent text-on-surface focus:outline-none focus:border-primary transition-all text-xs resize-none"
          />
        </div>

        {/* Copy File URL */}
        <div>
          <label className="block font-medium text-on-surface mb-1">File URL</label>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              readOnly
              value={item.url}
              className="flex-1 px-3 py-1.5 rounded-lg border border-outline bg-surface-variant/40 text-on-surface-variant text-[11px] focus:outline-none select-all"
            />
            <button
              onClick={handleCopyUrl}
              className="p-2 rounded-lg border border-outline bg-surface hover:bg-surface-variant text-on-surface transition-colors cursor-pointer shrink-0"
              title="Copy URL"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Item Actions */}
      <div className="pt-2 border-t border-outline">
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg border border-error/30 text-error hover:bg-error/10 transition-colors text-xs font-medium cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Delete permanently</span>
          </button>
        ) : (
          <div className="p-3 rounded-xl bg-error/10 border border-error/20 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-error font-medium">
              <AlertTriangle size={15} className="shrink-0" />
              <span>Delete from gallery & storage?</span>
            </div>
            <p className="text-[11px] text-error/80">
              This will permanently delete the file from Supabase Storage and Prisma database.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="flex-1 py-1.5 bg-error text-on-error rounded-lg font-medium hover:bg-error/90 transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {deleteMutation.isPending ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  "Yes, Delete"
                )}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="py-1.5 px-3 bg-surface border border-outline rounded-lg text-on-surface hover:bg-surface-variant transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
