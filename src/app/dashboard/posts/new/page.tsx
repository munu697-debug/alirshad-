"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { TiptapEditor } from "@/components/tiptap-editor";
import { ImageUploader } from "@/components/image-uploader";
import type { Category, Issue } from "@/lib/types";
import { calculateReadingTime, generateSlug } from "@/lib/utils";

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("<p>Write your article content here...</p>");
  const [featuredImage, setFeaturedImage] = useState("");
  const [authorName, setAuthorName] = useState("Editorial Team");
  const [categoryId, setCategoryId] = useState("");
  const [issueId, setIssueId] = useState("");
  const [isCoverStory, setIsCoverStory] = useState(false);
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<"published" | "draft">("published");
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => {
        if (d.categories && d.categories.length > 0) {
          setCategories(d.categories);
          setCategoryId(d.categories[0].id);
        }
      })
      .catch(() => {});

    fetch("/api/issues")
      .then((r) => r.json())
      .then((d) => {
        if (d.issues && d.issues.length > 0) {
          setIssues(d.issues);
        }
      })
      .catch(() => {});
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(val));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Title and content are required.");
      return;
    }

    setLoading(true);
    const categoryObj = categories.find((c) => c.id === categoryId);
    const selectedIssue = issues.find((i) => i.id === issueId);

    const postPayload = {
      title: title.trim(),
      slug: slug.trim() || generateSlug(title),
      excerpt: excerpt.trim(),
      content: content.trim(),
      featured_image: featuredImage || "",
      author_name: authorName.trim(),
      category_id: categoryId || null,
      category_name: categoryObj?.name || "Feature",
      category_slug: categoryObj?.slug || "feature",
      issue_id: issueId || null,
      issue_title: selectedIssue?.title || null,
      is_cover_story: issueId ? isCoverStory : false,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      status,
      is_featured: isFeatured,
      read_time: calculateReadingTime(content),
      published_at: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postPayload),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/dashboard/posts");
      } else {
        alert("Failed to save post: " + data.error);
      }
    } catch {
      alert("Error saving post.");
    } finally {
      setLoading(false);
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
            onClick={() => setStatus(status === "published" ? "draft" : "published")}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white font-medium"
          >
            Status: <strong className="capitalize">{status}</strong>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2 bg-accent text-white text-xs font-semibold rounded-xl hover:bg-accent-hover shadow-sm transition-all flex items-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save & Publish</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 columns: Title, Slug, Tiptap Editor */}
        <div className="lg:col-span-8 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5">Article Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. മലയാള സാഹിത്യവും പുതിയ ഭാവുകത്വവും..."
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
              placeholder="url-slug"
              className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-accent text-secondary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5">Excerpt / Summary</label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary displayed on cards and social share previews..."
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

        {/* Right 4 columns: Featured Image, Category, Author, Tags */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-5">
            {/* Featured Image with Cloudinary */}
            <ImageUploader value={featuredImage} onChange={setFeaturedImage} />

            {/* Magazine Issue selection (Image 5) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-primary">
                  Magazine Issue (പതിപ്പ്)
                </label>
                <Link
                  href="/dashboard/issues"
                  target="_blank"
                  className="text-[10px] text-accent hover:underline"
                >
                  Manage Issues
                </Link>
              </div>
              <select
                value={issueId}
                onChange={(e) => {
                  setIssueId(e.target.value);
                  if (!e.target.value) setIsCoverStory(false);
                }}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-accent"
              >
                <option value="">None (Independent Web Article)</option>
                {issues.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.title} {i.edition_label ? `(${i.edition_label})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Category selection */}
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

            {/* Author */}
            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5">Author Name</label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Author Name"
                className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-accent"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5">Tags (Comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Culture, Heritage, Kerala"
                className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-accent"
              />
            </div>

            {/* Featured in Hero Carousel toggle & Cover Story toggle */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
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

              {issueId && (
                <div className="flex items-center gap-2 p-2 bg-accent/5 rounded-xl border border-accent/20">
                  <input
                    type="checkbox"
                    id="isCoverStory"
                    checked={isCoverStory}
                    onChange={(e) => setIsCoverStory(e.target.checked)}
                    className="rounded border-gray-300 text-accent focus:ring-accent"
                  />
                  <label htmlFor="isCoverStory" className="text-xs text-primary font-semibold cursor-pointer">
                    Main Cover Story (മുഖചിത്ര ലേഖനം)
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
