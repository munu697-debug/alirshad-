import Link from "next/link";
import {
  FileText,
  PlusCircle,
  FolderTree,
  MessageSquare,
  Users,
  LayoutDashboard,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200/80 p-5 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Brand header */}
          <div className="flex items-center gap-2 pb-6 mb-6 border-b border-gray-100">
            <span className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center font-bold text-sm shadow-royal">
              A
            </span>
            <div>
              <h2 className="text-sm font-bold text-primary">Al Irshad CMS</h2>
              <span className="text-[10px] text-muted font-medium block">
                Editorial Control Room
              </span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl text-primary hover:bg-gray-50 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-secondary" />
              <span>Overview</span>
            </Link>

            <Link
              href="/dashboard/posts"
              className="flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl text-primary hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-4 h-4 text-secondary" />
              <span>All Articles</span>
            </Link>

            <Link
              href="/dashboard/posts/new"
              className="flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl bg-accent text-white hover:bg-accent-hover shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Write with Tiptap</span>
            </Link>

            <Link
              href="/dashboard/categories"
              className="flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl text-primary hover:bg-gray-50 transition-colors"
            >
              <FolderTree className="w-4 h-4 text-secondary" />
              <span>Categories</span>
            </Link>

            <Link
              href="/dashboard/comments"
              className="flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl text-primary hover:bg-gray-50 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-secondary" />
              <span>Responses</span>
            </Link>

            <Link
              href="/dashboard/subscribers"
              className="flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl text-primary hover:bg-gray-50 transition-colors"
            >
              <Users className="w-4 h-4 text-secondary" />
              <span>Subscribers</span>
            </Link>
          </nav>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-gray-100 mt-6">
          <Link
            href="/"
            className="flex items-center justify-between text-xs font-semibold text-secondary hover:text-accent p-2 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <span>Return to Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <div className="mt-4 p-3 bg-accent-light/50 border border-accent/20 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent block mb-1">
              Active Stack
            </span>
            <p className="text-[11px] text-secondary leading-tight">
              Next.js 16+, Supabase DB & Auth, Cloudinary Images, Tiptap Editor.
            </p>
          </div>
        </div>
      </aside>

      {/* Main content body */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
