import { Node, mergeAttributes } from "@tiptap/react";

/**
 * Custom Tiptap node for HTML5 <video> elements.
 *
 * Without this extension, Tiptap's default ProseMirror schema strips
 * <video> tags on `insertContent()` because they are not recognised nodes.
 * Registering the node here ensures videos survive round-trips through the
 * editor's HTML serialiser and are stored correctly in the DB.
 */
export const VideoExtension = Node.create({
  name: "video",

  // Block-level, same group as images/paragraphs
  group: "block",

  // `atom: true` means the node is treated as a single indivisible unit —
  // you can't place the cursor inside it, just select it as a whole.
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) => element.getAttribute("src"),
        renderHTML: (attributes) => ({ src: attributes.src }),
      },
      controls: {
        default: true,
        parseHTML: (element) => element.hasAttribute("controls"),
        renderHTML: (attributes) =>
          attributes.controls ? { controls: "controls" } : {},
      },
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute("class"),
        renderHTML: (attributes) =>
          attributes.class ? { class: attributes.class } : {},
      },
    };
  },

  parseHTML() {
    return [{ tag: "video[src]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "video",
      mergeAttributes({ controls: "controls" }, HTMLAttributes),
    ];
  },
});
