import Link from "next/link";
import { PlusCircle, Search, Edit2, ExternalLink } from "lucide-react";
import { getPosts } from "@/lib/db-service";
import { formatDate } from "@/lib/utils";
import { DeletePostButton } from "./delete-post-button";

export const revalidate = 0;

export default async function DashboardPostsPage() {
  const posts = await getPosts({ status: "all" });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-sans text-primary">All Articles</h1>
          <p className="text-xs text-secondary mt-1">
            Manage your publication catalog, status, and authors.
          </p>
        </div>
        <Link
          href="/dashboard/posts/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-accent-hover shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Article</span>
        </Link>
      </div>

      {/* Articles Table Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-muted border-b border-gray-100 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Title</th>
                <th className="pb-3 font-semibold">Author</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Views</th>
                <th className="pb-3 font-semibold">Likes</th>
                <th className="pb-3 font-semibold">Published</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-muted">
                    No articles found. If you just published one, check that SUPABASE_SERVICE_ROLE_KEY is set on the server.
                  </td>
                </tr>
              )}
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-4 pr-4">
                    <span className="font-bold text-primary font-malayalam line-clamp-1">
                      {post.title}
                    </span>
                    <span className="text-[11px] text-muted block truncate max-w-xs">
                      /post/{post.slug}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-secondary whitespace-nowrap">
                    {post.author_name}
                  </td>
                  <td className="py-4 pr-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full bg-accent-light text-accent font-semibold text-[10px]">
                      {post.category_name}
                    </span>
                  </td>
                  <td className="py-4 pr-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                        post.status === "published"
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-secondary whitespace-nowrap">
                    {post.views_count}
                  </td>
                  <td className="py-4 pr-4 text-secondary whitespace-nowrap">
                    {post.likes_count}
                  </td>
                  <td className="py-4 pr-4 text-muted whitespace-nowrap">
                    {formatDate(post.published_at)}
                  </td>
                  <td className="py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/posts/${post.id}/edit`}
                        className="p-1.5 text-secondary hover:text-accent hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit article"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/post/${post.slug}`}
                        target="_blank"
                        className="p-1.5 text-secondary hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                        title="View live"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <DeletePostButton id={post.id} title={post.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
