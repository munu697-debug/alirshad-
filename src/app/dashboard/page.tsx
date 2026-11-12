import Link from "next/link";
import {
  FileText,
  Eye,
  Heart,
  Users,
  PlusCircle,
  ArrowUpRight,
} from "lucide-react";
import { getPosts, getAllSubscribers } from "@/lib/db-service";
import { formatDate } from "@/lib/utils";

export const revalidate = 0;

export default async function DashboardOverview() {
  const [posts, subscribers] = await Promise.all([
    getPosts({ status: "all" }),
    getAllSubscribers(),
  ]);

  const totalViews = posts.reduce((acc, p) => acc + (p.views_count || 0), 0);
  const totalLikes = posts.reduce((acc, p) => acc + (p.likes_count || 0), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-sans text-primary">
            Editorial Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Publication analytics, content management, and audience growth.
          </p>
        </div>
        <Link
          href="/dashboard/posts/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-accent-hover shadow-sm transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Article</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Articles</span>
            <FileText className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-bold text-primary">{posts.length}</div>
          <span className="text-[11px] text-green-600 font-medium">Published & Drafts</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Views</span>
            <Eye className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-primary">{totalViews.toLocaleString()}</div>
          <span className="text-[11px] text-muted">Across all articles</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Likes</span>
            <Heart className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-primary">{totalLikes.toLocaleString()}</div>
          <span className="text-[11px] text-muted">Reader engagements</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Subscribers</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-primary">{subscribers.length}</div>
          <span className="text-[11px] text-muted">Active newsletter readers</span>
        </div>
      </div>

      {/* Recent Articles Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-primary">Recent Publications</h2>
          <Link
            href="/dashboard/posts"
            className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-muted border-b border-gray-100 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Title</th>
                <th className="pb-3 font-semibold">Author</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Views</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.slice(0, 5).map((post) => (
                <tr key={post.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 pr-4">
                    <span className="font-bold text-primary font-malayalam line-clamp-1">
                      {post.title}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 text-secondary whitespace-nowrap">
                    {post.author_name}
                  </td>
                  <td className="py-3.5 pr-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full bg-accent-light text-accent font-semibold text-[10px]">
                      {post.category_name}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 text-secondary whitespace-nowrap">
                    {post.views_count}
                  </td>
                  <td className="py-3.5 pr-4 text-muted whitespace-nowrap">
                    {formatDate(post.published_at)}
                  </td>
                  <td className="py-3.5 text-right whitespace-nowrap">
                    <Link
                      href={`/dashboard/posts/${post.id}/edit`}
                      className="text-accent hover:underline font-semibold mr-3"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/post/${post.slug}`}
                      target="_blank"
                      className="text-secondary hover:text-primary"
                    >
                      View
                    </Link>
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
