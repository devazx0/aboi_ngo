"use client";

import { useState, useRef } from "react";
import { useUploadMedia } from "@/service/useMediaService";
import { Upload, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface MediaUploaderProps {
  onSuccess?: () => void;
}

export function MediaUploader({ onSuccess }: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const uploadMutation = useUploadMedia();

  const handleFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((file) => file.size > 0);
    if (fileArray.length === 0) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    uploadMutation.mutate(fileArray, {
      onSuccess: (data) => {
        setSuccessMessage(`Successfully uploaded ${data.items?.length || 1} file(s) to gallery.`);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (onSuccess) onSuccess();
      },
      onError: (err: any) => {
        setErrorMessage(err.message || "Failed to upload file(s).");
      },
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="w-full space-y-4 p-4 sm:p-6">
      {/* Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
          isDragging
            ? "border-primary bg-primary/10 shadow-inner scale-[0.99]"
            : "border-outline hover:border-primary/60 hover:bg-surface-variant/30"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          {uploadMutation.isPending ? (
            <Loader2 size={28} className="animate-spin" />
          ) : (
            <Upload size={28} />
          )}
        </div>

        <div className="space-y-1">
          <p className="text-base font-semibold text-on-surface">
            {uploadMutation.isPending
              ? "Uploading files to media gallery..."
              : "Drop files here to upload"}
          </p>
          <p className="text-xs text-on-surface-variant">
            or <span className="text-primary font-medium underline">Select Files</span> from your device
          </p>
        </div>

        <p className="text-[11px] text-on-surface-variant opacity-70">
          Supported files: JPG, PNG, WEBP, GIF, MP4, PDF (Max size 25MB per file)
        </p>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-2.5 text-xs font-medium animate-in fade-in duration-200">
          <CheckCircle2 size={18} className="shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error flex items-center justify-between text-xs font-medium animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={18} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="underline font-semibold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
