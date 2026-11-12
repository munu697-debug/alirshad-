"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  PlusCircle,
  FolderTree,
  MessageSquare,
  Users,
  LayoutDashboard,
  ExternalLink,
  BookOpen,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/posts", label: "All Articles", icon: FileText, exact: true },
    { href: "/dashboard/posts/new", label: "Write with Tiptap", icon: PlusCircle },
    { href: "/dashboard/issues", label: "Issues", icon: BookOpen },
    { href: "/dashboard/categories", label: "Categories", icon: FolderTree },
    { href: "/dashboard/comments", label: "Responses", icon: MessageSquare },
    { href: "/dashboard/subscribers", label: "Subscribers", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200/80 p-5 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Brand header */}
          <div className="flex items-center gap-3 pb-6 mb-6 border-b border-gray-100">
            <span className="w-9 h-9 rounded-xl bg-accent text-white flex items-center justify-center font-bold text-sm shadow-royal">
              A
            </span>
            <div>
              <h2 className="text-sm font-bold text-primary">Al Irshad CMS</h2>
              <span className="text-[10px] text-muted font-medium block">
                Editorial Control Room
              </span>
            </div>
          </div>

          {/* Dynamic Nav links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  className={`group flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-accent text-white shadow-royal"
                      : "text-secondary hover:text-accent hover:bg-accent-light/40"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-white" : "text-secondary group-hover:text-accent"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info without the active stack box */}
        <div className="pt-6 border-t border-gray-100 mt-6">
          <Link
            href="/"
            prefetch={true}
            className="flex items-center justify-between text-xs font-semibold text-secondary hover:text-accent p-2 rounded-xl hover:bg-accent-light/40 transition-colors"
          >
            <span>Return to Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main content body */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
