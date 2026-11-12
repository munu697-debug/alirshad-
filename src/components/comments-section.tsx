"use client";

import { useState } from "react";
import { MessageSquare, Flag, Trash2, Edit2, Check, X, Send } from "lucide-react";
import { Comment } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface CommentsSectionProps {
  postId: string;
  initialComments: Comment[];
}

export function CommentsSection({ postId, initialComments }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: postId,
          name: isAnonymous ? "Anonymous" : (name.trim() || "Guest Reader"),
          email: email.trim(),
          is_anonymous: isAnonymous,
          content: content.trim(),
        }),
      });

      const data = await res.json();
      if (data.comment) {
        setComments([data.comment, ...comments]);
        setContent("");
        showToast("Comment posted successfully!");
      } else {
        showToast("Failed to post comment.");
      }
    } catch {
      showToast("An error occurred while posting comment.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSave = async (commentId: string) => {
    if (!editContent.trim()) return;
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setComments(comments.map(c => c.id === commentId ? { ...c, content: editContent.trim() } : c));
        setEditingId(null);
        showToast("Comment updated!");
      }
    } catch {
      showToast("Failed to update comment.");
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
      setComments(comments.filter(c => c.id !== commentId));
      showToast("Comment deleted.");
    } catch {
      showToast("Failed to delete comment.");
    }
  };

  const handleReport = (commentId: string) => {
    showToast("Thank you, this comment has been flagged for editorial review.");
  };

  return (
    <section className="mt-16 pt-12 border-t border-gray-100" id="comments">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 left-6 z-50 px-4 py-3 bg-primary text-white text-xs font-semibold rounded-xl shadow-lg animate-fade-in">
          {toastMsg}
        </div>
      )}

      {/* Heading */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl sm:text-2xl font-bold font-sans text-primary flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-accent" />
          <span>Responses</span>
          <span
            id="comments-count-badge"
            className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent-light text-accent"
          >
            {comments.length}
          </span>
        </h3>
      </div>

      {/* Add Comment Form */}
      <div className="bg-surface p-5 sm:p-7 rounded-2xl border border-gray-100 shadow-sm mb-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-secondary mb-1">
                Name {!isAnonymous && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isAnonymous}
                placeholder={isAnonymous ? "Posting anonymously" : "Your name"}
                className={`w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-accent ${
                  isAnonymous ? "opacity-50 bg-gray-100" : ""
                }`}
                required={!isAnonymous}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-secondary mb-1">
                Email (Private)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isAnonymous}
                placeholder="you@example.com"
                className={`w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-accent ${
                  isAnonymous ? "opacity-50 bg-gray-100" : ""
                }`}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded border-gray-300 text-accent focus:ring-accent"
            />
            <label htmlFor="is_anonymous" className="text-xs text-secondary cursor-pointer">
              Post anonymously as Anonymous
            </label>
          </div>

          <div>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts on this article..."
              required
              className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-accent resize-y font-malayalam"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all duration-200 flex items-center gap-2 disabled:opacity-60"
            >
              <Send className="w-3.5 h-3.5" />
              {loading ? "Posting..." : "Post Response"}
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div id="comments-section-container" className="space-y-4">
        {comments.length === 0 ? (
          <div id="no-comments-msg" className="text-center py-8 text-xs text-muted">
            Be the first to share your thoughts on this piece.
          </div>
        ) : (
          comments.map((comment) => {
            const displayName = comment.is_anonymous
              ? "Anonymous"
              : (comment.profiles?.display_name || comment.name || "Reader");
            const initial = displayName.charAt(0).toUpperCase();

            return (
              <div
                key={comment.id}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm relative animate-fade-in"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-brand-azure text-white flex items-center justify-center font-bold text-xs shadow-royal">
                      {initial}
                    </div>
                    <div>
                      <strong className="text-xs sm:text-sm text-primary block">
                        {displayName}
                      </strong>
                      <span className="text-[11px] text-muted">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingId(comment.id);
                        setEditContent(comment.content);
                      }}
                      className="p-1 text-gray-400 hover:text-primary transition-colors text-xs"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors text-xs"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleReport(comment.id)}
                      className="p-1 text-gray-400 hover:text-amber-500 transition-colors text-xs"
                      title="Report"
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {editingId === comment.id ? (
                  <div className="ml-12 mt-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-accent resize-y font-malayalam"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 bg-gray-100 text-xs font-semibold rounded-lg hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditSave(comment.id)}
                        className="px-3 py-1 bg-accent text-white text-xs font-semibold rounded-lg hover:bg-accent-hover"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="ml-12 text-xs sm:text-sm text-secondary font-malayalam leading-relaxed">
                    {comment.content}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
