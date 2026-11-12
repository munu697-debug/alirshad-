"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Plus, 
  BookOpen, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Sparkles,
  Calendar,
  Layers,
  X,
  Loader2
} from "lucide-react";
import { Issue } from "@/lib/types";
import { ImageUploader } from "@/components/image-uploader";
import { generateSlug } from "@/lib/utils";

interface IssuesClientProps {
  initialIssues: Issue[];
}

export function IssuesClient({ initialIssues }: IssuesClientProps) {
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [editionLabel, setEditionLabel] = useState("PACKET EDITION");
  const [publishedDate, setPublishedDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [isLatest, setIsLatest] = useState(false);

  const resetForm = () => {
    setEditingIssue(null);
    setTitle("");
    setSlug("");
    setCoverImage("");
    setEditionLabel("PACKET EDITION");
    setPublishedDate(new Date().toISOString().split("T")[0]);
    setDescription("");
    setIsPublished(true);
    setIsLatest(false);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (issue: Issue) => {
    setEditingIssue(issue);
    setTitle(issue.title);
    setSlug(issue.slug);
    setCoverImage(issue.cover_image);
    setEditionLabel(issue.edition_label || "PACKET EDITION");
    setPublishedDate(issue.published_date ? issue.published_date.split("T")[0] : new Date().toISOString().split("T")[0]);
    setDescription(issue.description || "");
    setIsPublished(issue.is_published);
    setIsLatest(Boolean(issue.is_latest));
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingIssue && (!slug || slug === generateSlug(title))) {
      setSlug(generateSlug(val));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !coverImage.trim()) {
      alert("Title and Cover Image are required.");
      return;
    }

    setLoading(true);

    const payload = {
      title: title.trim(),
      slug: slug.trim() || generateSlug(title),
      cover_image: coverImage.trim(),
      edition_label: editionLabel.trim() || "PACKET EDITION",
      published_date: publishedDate,
      description: description.trim(),
      is_published: isPublished,
      is_latest: isLatest,
    };

    try {
      if (editingIssue) {
        const res = await fetch(`/api/issues/${editingIssue.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.issue) {
          setIssues((prev) =>
            prev.map((iss) => {
              if (iss.id === editingIssue.id) {
                return { ...data.issue, articles_count: iss.articles_count };
              }
              if (payload.is_latest) {
                return { ...iss, is_latest: false };
              }
              return iss;
            })
          );
          setIsModalOpen(false);
          resetForm();
        } else {
          alert("Failed to update issue: " + (data.error || "Unknown error"));
        }
      } else {
        const res = await fetch("/api/issues", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.issue) {
          const newIssue = { ...data.issue, articles_count: 0 };
          setIssues((prev) => [
            newIssue,
            ...prev.map((iss) => (payload.is_latest ? { ...iss, is_latest: false } : iss)),
          ]);
          setIsModalOpen(false);
          resetForm();
        } else {
          alert("Failed to create issue: " + (data.error || "Unknown error"));
        }
      }
    } catch {
      alert("Error saving issue.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (issue: Issue) => {
    if (!confirm(`Are you sure you want to delete "${issue.title}"? Articles in this issue will be detached but not deleted.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/issues/${issue.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setIssues((prev) => prev.filter((i) => i.id !== issue.id));
      } else {
        alert("Failed to delete issue: " + (data.error || "Unknown error"));
      }
    } catch {
      alert("Error deleting issue.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent/10 text-accent">
              Editions & Magazine Covers
            </span>
            <span className="text-xs text-muted">/ പതിപ്പുകൾ</span>
          </div>
          <h1 className="text-2xl font-bold font-sans text-primary">Issues Management</h1>
          <p className="text-xs text-secondary mt-1 max-w-xl">
            Manage monthly magazine editions, vertical cover designs, and assign curated articles to each issue.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-xl shadow-royal hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Magazine Issue</span>
        </button>
      </div>

      {/* Grid of Issues */}
      {issues.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-accent-light/40 text-accent mx-auto flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-primary mb-1">No Magazine Issues Yet</h3>
          <p className="text-xs text-secondary max-w-md mx-auto mb-6">
            Create your first magazine edition (e.g. November 2026) with its portrait cover page. You can then assign articles to it when writing posts.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-xs font-semibold rounded-xl shadow-royal"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Issue</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              {/* Cover Image Container */}
              <div className="relative aspect-[3/4] bg-neutral-900 overflow-hidden">
                <img
                  src={issue.cover_image}
                  alt={issue.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-white border border-white/10">
                    {issue.edition_label || "PACKET EDITION"}
                  </span>
                  {issue.is_latest && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-accent text-white shadow-royal flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Latest</span>
                    </span>
                  )}
                </div>

                {!issue.is_published && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white">
                      Draft / Unpublished
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-primary group-hover:text-accent transition-colors line-clamp-1">
                    {issue.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {issue.published_date ? new Date(issue.published_date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      {issue.articles_count || 0} ലേഖനങ്ങൾ
                    </span>
                  </div>
                  {issue.description && (
                    <p className="text-[11px] text-secondary line-clamp-2 mt-2 font-serif">
                      {issue.description}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <Link
                    href={`/issue/${issue.slug}`}
                    target="_blank"
                    className="text-secondary hover:text-accent font-medium flex items-center gap-1 transition-colors"
                  >
                    <span>View Cover</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(issue)}
                      className="p-1.5 rounded-lg text-secondary hover:text-accent hover:bg-accent-light/40 transition-colors"
                      title="Edit Issue"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(issue)}
                      className="p-1.5 rounded-lg text-secondary hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete Issue"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-secondary hover:text-primary hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent/10 text-accent">
                {editingIssue ? "Edit Edition" : "New Edition"}
              </span>
              <h2 className="text-xl font-bold font-sans text-primary mt-1">
                {editingIssue ? "Edit Magazine Issue" : "Create Magazine Issue"}
              </h2>
              <p className="text-xs text-secondary mt-0.5">
                Set up vertical cover art and publication metadata.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Cover Image Uploader */}
              <ImageUploader
                value={coverImage}
                onChange={setCoverImage}
                label="Magazine Cover Image (ലംബ രൂപത്തിലുള്ള കവർ ചിത്രം)"
              />

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">
                  Issue Title (e.g. November 2026 / നവംബർ 2026)
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="November 2026"
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-accent"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="november-2026"
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-accent"
                />
              </div>

              {/* Edition Label & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">
                    Edition Label
                  </label>
                  <input
                    type="text"
                    value={editionLabel}
                    onChange={(e) => setEditionLabel(e.target.value)}
                    placeholder="PACKET EDITION"
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">
                    Published Date
                  </label>
                  <input
                    type="date"
                    value={publishedDate}
                    onChange={(e) => setPublishedDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">
                  Issue Description / Theme (Optional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief note about the central theme or feature of this edition..."
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-accent resize-none"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isLatest}
                    onChange={(e) => setIsLatest(e.target.checked)}
                    className="rounded border-gray-300 text-accent focus:ring-accent"
                  />
                  <span className="text-xs font-medium text-primary">
                    Highlight as Current / Latest Issue (മുൻനിര പതിപ്പായി കാണിക്കുക)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded border-gray-300 text-accent focus:ring-accent"
                  />
                  <span className="text-xs font-medium text-primary">
                    Published (Visible to readers on website)
                  </span>
                </label>
              </div>

              {/* Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-secondary hover:text-primary rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-xl shadow-royal disabled:opacity-50 transition-all"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingIssue ? "Save Changes" : "Create Issue"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
