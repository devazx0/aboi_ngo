"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import { VideoExtension } from "./extensions/Video";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading2,
  ImageIcon,
  Strikethrough,
  Minus,
  Link2,
  Video as YoutubeIcon,
  FolderOpen,
  Upload,
  Loader2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { uploadMediaToSupabase } from "@/utils/supabase";
import { MediaLibraryModal } from "./media/MediaLibraryModal";
import { MediaItem } from "@/service/useMediaService";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

function ToolbarButton({
  onClick,
  isActive,
  title,
  disabled,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  title: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      // Prevent the editor from losing focus (and dropping the cursor position)
      // when the user clicks a toolbar button. Without this, the browser fires
      // blur on the editor before the click handler runs, so `.focus()` in the
      // Tiptap chain restores focus at the start of the document — causing
      // commands like toggleBulletList to act on the wrong paragraph.
      onMouseDown={(e) => e.preventDefault()}
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={isActive}
      disabled={disabled}
      className={`p-1.5 sm:p-2 rounded transition-colors ${
        isActive
          ? "bg-primary/15 text-primary"
          : "text-on-surface-variant hover:bg-surface hover:text-on-surface"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /**
   * Bug #1 fix — content prop loop.
   *
   * Tiptap's `useEditor` treats `content` as a one-time initialisation value,
   * not a reactive prop. If we naively pass the parent `content` state and
   * update it on every `onUpdate`, we create a loop:
   *
   *   user types → onUpdate → onChange(html) → parent setState(html)
   *   → re-render → content prop changes → setContent(html) → cursor reset
   *
   * The fix: use a ref (`contentRef`) to track the last HTML value that the
   * editor itself produced. The `useEffect` below only calls `setContent`
   * when `content` diverges from that ref — i.e., when an *external* source
   * changed it (like loading an existing post from the DB via `postData`).
   */
  const contentRef = useRef(content);

  /**
   * Tracks the most recent selection (cursor position or highlighted range)
   * as reported by Tiptap. We restore this explicitly in list-toggle handlers
   * because `onMouseDown` prevention alone isn't always enough in React 19 /
   * Turbopack — the selection can still drift between the mousedown and the
   * click event, causing the list to wrap the WRONG paragraph.
   */
  const lastSelectionRef = useRef<{ from: number; to: number }>({ from: 0, to: 0 });

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      // `link: false` prevents StarterKit from registering its own built-in
      // Link extension (Tiptap v3). We register Link manually below so we can
      // apply our own configuration (openOnClick, autolink). Without this,
      // two extensions with the name "link" exist and Tiptap warns + misbehaves.
      StarterKit.configure({ link: false }),
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false, autolink: true }),
      Youtube.configure({ controls: true, nocookie: true }),
      // Bug #6 fix — register Video node so <video> tags survive serialisation
      VideoExtension,
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Mark this value as editor-originated so the effect below won't
      // call setContent again and reset the cursor.
      contentRef.current = html;
      onChange(html);
    },
    onSelectionUpdate: ({ editor }) => {
      // Keep lastSelectionRef in sync so toolbar commands can restore the
      // exact position the user was at, even if focus temporarily moved.
      const { from, to } = editor.state.selection;
      lastSelectionRef.current = { from, to };
    },
    editorProps: {
      attributes: {
        class:
          "focus:outline-none min-h-[280px] sm:min-h-[360px] p-4 text-on-surface leading-relaxed",
      },
    },
  });

  /**
   * Bug #1 fix (continued) — sync externally-driven content changes.
   *
   * This only fires when `content` differs from `contentRef.current`,
   * which only happens when the parent sets content from outside (e.g.
   * loading an existing post). During normal typing it is a no-op.
   */
  useEffect(() => {
    if (!editor) return;
    if (content === contentRef.current) return; // editor-originated → skip
    contentRef.current = content;
    // In Tiptap v3, the second argument is SetContentOptions (not a boolean).
    // `{ emitUpdate: false }` prevents this programmatic update from triggering
    // another onUpdate callback, which would restart the loop.
    editor.commands.setContent(content, { emitUpdate: false });
  }, [content, editor]);

  // Device File Upload Handler (Supabase)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editor) return;

    setIsUploading(true);
    setUploadError(null);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const { url, error } = await uploadMediaToSupabase(file);

      if (error) {
        setUploadError(error);
        break;
      }

      if (url) {
        if (file.type.startsWith("image/")) {
          editor.chain().focus().setImage({ src: url }).run();
        } else if (file.type.startsWith("video/")) {
          /**
           * Bug #6 fix — insert via the VideoExtension schema node instead
           * of raw HTML. Raw HTML strings passed to `insertContent` are
           * stripped by ProseMirror when the tag is not in the schema.
           */
          editor
            .chain()
            .focus()
            .insertContent({
              type: "video",
              attrs: {
                src: url,
                controls: true,
                class: "w-full rounded-xl my-4 shadow-sm",
              },
            })
            .insertContent({ type: "paragraph" })
            .run();
        } else {
          // Generic link for other attachments — use the Link extension
          // so the mark is properly registered in the schema.
          editor
            .chain()
            .focus()
            .insertContent(file.name)
            .setLink({ href: url })
            .run();
        }
      }
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleMediaLibrarySelect = useCallback(
    (item: MediaItem) => {
      if (!editor) return;
      if (item.mimeType.startsWith("image/")) {
        editor
          .chain()
          .focus()
          .setImage({ src: item.url, alt: item.altText || item.filename })
          .run();
      } else if (item.mimeType.startsWith("video/")) {
        editor
          .chain()
          .focus()
          .insertContent({
            type: "video",
            attrs: {
              src: item.url,
              controls: true,
              class: "w-full rounded-xl my-4 shadow-sm",
            },
          })
          .insertContent({ type: "paragraph" })
          .run();
      } else {
        editor
          .chain()
          .focus()
          .insertContent(item.filename)
          .setLink({ href: item.url })
          .run();
      }
    },
    [editor]
  );

  const addImageFromUrl = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const addYoutube = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("YouTube Video URL:");
    if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
  }, [editor]);

  /**
   * Bug #3 fix — link mark applies to wrong / zero-width range.
   *
   * `window.prompt` is a blocking call that causes the editor to lose focus.
   * By the time the user clicks OK, the ProseMirror selection may have been
   * cleared, so `extendMarkRange("link")` operates on an empty range and the
   * link is applied to zero characters.
   *
   * Fix: snapshot `from` / `to` from the selection *before* the prompt
   * blocks. Then decide the correct chain based on whether a real selection
   * existed at that point.
   */
  const addLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;

    // Snapshot the selection range BEFORE `window.prompt` steals focus.
    const { from, to } = editor.state.selection;
    const hasRealSelection = from !== to;

    const url = window.prompt("Link URL:", prev ?? "");
    if (url === null) return; // user cancelled

    if (url === "") {
      editor.chain().focus().unsetLink().run();
    } else if (hasRealSelection) {
      // Apply the link only to the originally-selected text.
      editor.chain().focus().setLink({ href: url }).run();
    } else {
      // No selection — extend to cover the word/existing link at the cursor.
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) {
    // Skeleton placeholder while editor initialises
    return (
      <div className="border border-outline rounded-lg overflow-hidden bg-surface animate-pulse">
        <div className="h-10 bg-surface-variant border-b border-outline" />
        <div className="min-h-[280px] sm:min-h-[360px] p-4 space-y-2">
          <div className="h-4 bg-surface-variant rounded w-3/4" />
          <div className="h-4 bg-surface-variant rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="border border-outline rounded-lg overflow-hidden bg-surface relative">
      {/* Hidden File Input for Device Selection */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*,video/*,.pdf,.doc,.docx"
        multiple
        className="hidden"
      />

      {/* Toolbar */}
      {/* onMouseDown on the container is a belt-and-suspenders guard: even if
          an individual button's onMouseDown fires after the blur, the container
          event fires first and keeps the editor focused. */}
      <div
        className="bg-surface-variant/60 border-b border-outline p-1.5 sm:p-2 flex items-center gap-0.5 flex-wrap overflow-x-auto"
        onMouseDown={(e) => e.preventDefault()}
      >
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough size={16} />
        </ToolbarButton>

        <span className="w-px h-5 bg-outline mx-1" aria-hidden />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            // Restore the last known cursor position before toggling the list.
            // Without this, a subtle selection-drift in React 19 can cause the
            // command to target the paragraph ABOVE the one the user is on.
            const sel = lastSelectionRef.current;
            editor.chain().setTextSelection(sel).toggleBulletList().run();
          }}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            const sel = lastSelectionRef.current;
            editor.chain().setTextSelection(sel).toggleOrderedList().run();
          }}
          isActive={editor.isActive("orderedList")}
          title="Ordered List"
        >
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <Quote size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus size={16} />
        </ToolbarButton>

        {/* Media Library / Gallery Button */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setIsMediaModalOpen(true)}
          title="Open Media Library Gallery"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary/90 font-medium text-xs transition-colors shrink-0 cursor-pointer shadow-xs"
        >
          <FolderOpen size={15} />
          <span>Media Library</span>
        </button>

        {/* Device Upload Button (Supabase) */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          title="Upload Image/Video from Device to Supabase"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium text-xs transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
        >
          {isUploading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Upload size={15} />
          )}
          <span>{isUploading ? "Uploading..." : "Quick Upload"}</span>
        </button>

        <ToolbarButton onClick={addImageFromUrl} title="Insert Image from URL">
          <ImageIcon size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={addYoutube} title="Embed YouTube Video">
          <YoutubeIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={addLink}
          isActive={editor.isActive("link")}
          title="Insert Link"
        >
          <Link2 size={16} />
        </ToolbarButton>
      </div>

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="bg-error-container text-on-error-container text-xs px-4 py-2 flex items-center justify-between">
          <span>Upload failed: {uploadError}</span>
          <button
            onClick={() => setUploadError(null)}
            className="font-bold underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      <EditorContent editor={editor} />

      {/* WordPress-style Media Library Modal Popup */}
      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelectMedia={handleMediaLibrarySelect}
        title="Insert Media into Post"
        selectButtonText="Insert into Post"
      />
    </div>
  );
}
