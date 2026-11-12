"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { Post, Category } from "@/lib/types";
import { TiptapEditor } from "@/components/tiptap-editor";
import { ImageUploader } from "@/components/image-uploader";
import { calculateReadingTime } from "@/lib/utils";

interface EditPostClientProps {
  initialPost: Post;
}

export default function EditPostClient({ initialPost }: EditPostClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [title, setTitle] = useState(initialPost.title);
  const [slug, setSlug] = useState(initialPost.slug);
  const [excerpt, setExcerpt] = useState(initialPost.excerpt);
  const [content, setContent] = useState(initialPost.content);
  const [featuredImage, setFeaturedImage] = useState(initialPost.featured_image);
  const [authorName, setAuthorName] = useState(initialPost.author_name);
  const [categoryId, setCategoryId] = useState(initialPost.category_id || "");
  const [tags, setTags] = useState(initialPost.tags?.join(", ") || "");
  const [status, setStatus] = useState<"published" | "draft" | "archived">(initialPost.status);
  const [isFeatured, setIsFeatured] = useState(initialPost.is_featured);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => { if (d.categories) setCategories(d.categories); })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Title and content are required.");
      return;
    }

    setLoading(true);
    const categoryObj = categories.find((c) => c.id === categoryId);

    const postPayload = {
      ...initialPost,
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      featured_image: featuredImage,
      author_name: authorName.trim(),
      category_id: categoryId,
      category_name: categoryObj?.name || initialPost.category_name,
      category_slug: categoryObj?.slug || initialPost.category_slug,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      status,
      is_featured: isFeatured,
      read_time: calculateReadingTime(content),
      updated_at: new Date().toISOString(),
    };

    try {
      const res = await fetch(`/api/posts/${initialPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postPayload),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/dashboard/posts");
      } else {
        alert("Failed to update post: " + data.error);
      }
    } catch {
      alert("Error updating post.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this article? This action cannot be undone.")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${initialPost.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        router.push("/dashboard/posts");
      }
    } catch {
      alert("Error deleting post.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <Link
          href="/dashboard/posts"
          className="text-xs font-semibold text-secondary hover:text-primary flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2 bg-accent text-white text-xs font-semibold rounded-xl hover:bg-accent-hover shadow-sm transition-all flex items-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5">Article Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 text-base sm:text-lg font-bold font-malayalam bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-secondary mb-1">URL Slug</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-accent text-secondary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5">Excerpt / Summary</label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm font-malayalam bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-accent resize-y"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-primary">
                Article Body (Tiptap Rich-Text Editor)
              </label>
              <span className="text-[11px] text-muted">Supports headings, quotes, Malayalam text</span>
            </div>
            <TiptapEditor content={content} onChange={setContent} />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-5">
            <ImageUploader value={featuredImage} onChange={setFeaturedImage} />

            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-accent"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5">Author Name</label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-accent"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <input
                type="checkbox"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-gray-300 text-accent focus:ring-accent"
              />
              <label htmlFor="isFeatured" className="text-xs text-primary font-medium cursor-pointer">
                Feature in Homepage Carousel
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
