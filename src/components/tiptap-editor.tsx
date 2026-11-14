"use client";

import { useEditor, EditorContent, Mark, Extension, mergeAttributes } from "@tiptap/react";
import { uploadImage } from "@/lib/upload-client";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  Undo,
  Redo,
} from "lucide-react";
import { useState } from "react";

// Custom FontSize Mark extension for Tiptap
const FontSize = Mark.create({
  name: "fontSize",
  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: (element) => element.style.fontSize || null,
        renderHTML: (attributes) => {
          if (!attributes.size) return {};
          return {
            style: `font-size: ${attributes.size}`,
          };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "span[style*='font-size']",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), 0];
  },
});

// Custom TabIndentation Extension: inserts a 4-space tab space on Tab key
const TabIndentation = Extension.create({
  name: "tabIndentation",
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        return this.editor.commands.insertContent("\u00A0\u00A0\u00A0\u00A0");
      },
    };
  },
});

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function TiptapEditor({
  content,
  onChange,
  placeholder = "Write your article in Malayalam or English...",
}: TiptapEditorProps) {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFontSize, setSelectedFontSize] = useState<string>("default");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      ImageExtension.configure({
        inline: true,
        allowBase64: true,
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-accent underline cursor-pointer",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        defaultAlignment: "justify",
      }),
      Placeholder.configure({
        placeholder,
      }),
      FontSize,
      TabIndentation,
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none focus:outline-none min-h-[350px] p-4 text-primary font-malayalam leading-relaxed",
      },
    },
    onSelectionUpdate: ({ editor }) => {
      const size = (editor.getAttributes("fontSize")?.size as string) || "default";
      setSelectedFontSize(size);
    },
    onTransaction: ({ editor }) => {
      const size = (editor.getAttributes("fontSize")?.size as string) || "default";
      setSelectedFontSize(size);
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return <div className="h-64 border rounded-xl animate-pulse bg-gray-50" />;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleInsertImageUrl = () => {
    if (imageUrl.trim()) {
      editor.chain().focus().setImage({ src: imageUrl.trim() }).run();
      setImageUrl("");
      setImageModalOpen(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      editor.chain().focus().setImage({ src: url }).run();
      setImageModalOpen(false);
    } catch (err) {
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-xs">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200 text-secondary">
        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded-lg hover:bg-white hover:text-primary disabled:opacity-40"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded-lg hover:bg-white hover:text-primary disabled:opacity-40"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-gray-300 mx-1" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive("heading", { level: 1 })
              ? "bg-white text-accent font-bold shadow-xs"
              : "hover:bg-white hover:text-primary"
          }`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive("heading", { level: 2 })
              ? "bg-white text-accent font-bold shadow-xs"
              : "hover:bg-white hover:text-primary"
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive("heading", { level: 3 })
              ? "bg-white text-accent font-bold shadow-xs"
              : "hover:bg-white hover:text-primary"
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-gray-300 mx-1" />

        {/* Font Size Selector */}
        <div className="flex items-center gap-1">
          <select
            value={selectedFontSize}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedFontSize(val);
              if (!val || val === "default") {
                editor.chain().focus().unsetMark("fontSize").run();
              } else {
                editor.chain().focus().setMark("fontSize", { size: val }).run();
              }
            }}
            className="text-xs font-semibold bg-white border border-gray-200 rounded-lg px-2 py-1 text-primary focus:outline-none focus:border-accent hover:border-gray-300 transition-colors cursor-pointer shadow-2xs"
            title="Font Size / അക്ഷരവലിപ്പം"
            aria-label="Font Size"
          >
            <option value="default">Size: Default</option>
            <option value="14px">14px - Small</option>
            <option value="16px">16px - Normal</option>
            <option value="18px">18px - Standard</option>
            <option value="20px">20px - Medium</option>
            <option value="24px">24px - Large</option>
            <option value="28px">28px - Extra Large</option>
            <option value="32px">32px - Headline</option>
          </select>
        </div>

        <div className="h-4 w-px bg-gray-300 mx-1" />

        {/* Basic formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive("bold") ? "bg-white text-accent shadow-xs" : "hover:bg-white hover:text-primary"
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive("italic") ? "bg-white text-accent shadow-xs" : "hover:bg-white hover:text-primary"
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive("strike") ? "bg-white text-accent shadow-xs" : "hover:bg-white hover:text-primary"
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-gray-300 mx-1" />

        {/* Lists & Quotes */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive("bulletList") ? "bg-white text-accent shadow-xs" : "hover:bg-white hover:text-primary"
          }`}
          title="Bullet list"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive("orderedList") ? "bg-white text-accent shadow-xs" : "hover:bg-white hover:text-primary"
          }`}
          title="Numbered list"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive("blockquote") ? "bg-white text-accent shadow-xs" : "hover:bg-white hover:text-primary"
          }`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-gray-300 mx-1" />

        {/* Text Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive({ textAlign: "left" }) ? "bg-white text-accent shadow-xs" : "hover:bg-white"
          }`}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive({ textAlign: "center" }) ? "bg-white text-accent shadow-xs" : "hover:bg-white"
          }`}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive({ textAlign: "right" }) ? "bg-white text-accent shadow-xs" : "hover:bg-white"
          }`}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive({ textAlign: "justify" }) ? "bg-white text-accent shadow-xs" : "hover:bg-white"
          }`}
          title="Justify"
        >
          <AlignJustify className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-gray-300 mx-1" />

        {/* Link & Image */}
        <button
          type="button"
          onClick={setLink}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive("link") ? "bg-white text-accent shadow-xs" : "hover:bg-white hover:text-primary"
          }`}
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setImageModalOpen(true)}
          className="p-1.5 rounded-lg hover:bg-white hover:text-primary"
          title="Insert Image (Cloudinary)"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-1.5 rounded-lg hover:bg-white hover:text-primary"
          title="Horizontal Rule"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Cloudinary Image Insert Modal */}
      {imageModalOpen && (
        <div className="p-4 bg-accent-light/50 border-b border-accent/25 flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex-1 w-full">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste Cloudinary / image URL..."
              className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleInsertImageUrl}
              className="px-3 py-1.5 bg-accent text-white text-xs font-semibold rounded-lg hover:bg-accent-hover"
            >
              Insert URL
            </button>
            <label className="px-3 py-1.5 bg-white border border-gray-300 text-secondary text-xs font-semibold rounded-lg cursor-pointer hover:bg-gray-50">
              {uploading ? "Uploading..." : "Upload File"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
            <button
              type="button"
              onClick={() => setImageModalOpen(false)}
              className="px-2 py-1.5 text-xs text-muted hover:text-primary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <EditorContent editor={editor} className="bg-white min-h-[350px]" />
    </div>
  );
}
