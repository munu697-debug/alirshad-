"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  PlusCircle,
  FolderTree,
  MessageSquare,
  Users,
  LayoutDashboard,
  ExternalLink,
  BookOpen,
  LogOut,
  Loader2,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.authenticated || data.role !== "admin") {
          // Strictly protect dashboard: Only the admin can manage everything
          router.replace("/");
        } else {
          setAuthorized(true);
        }
      })
      .catch(() => {
        router.replace("/");
      });
  }, [router]);

  const handleAdminLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth-changed"));
      }
      router.replace("/");
    } catch {
      router.replace("/");
    }
  };

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-[#fcfcfd] flex items-center justify-center">
        <div className="flex items-center gap-3 text-secondary text-xs font-semibold">
          <Loader2 className="w-5 h-5 animate-spin text-accent" />
          <span>Verifying Admin Permissions...</span>
        </div>
      </div>
    );
  }

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

        {/* Footer info with Return to Site and Logout */}
        <div className="pt-6 border-t border-gray-100 mt-6 space-y-1">
          <Link
            href="/"
            prefetch={true}
            className="flex items-center justify-between text-xs font-semibold text-secondary hover:text-accent p-2 rounded-xl hover:bg-accent-light/40 transition-colors"
          >
            <span>Return to Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleAdminLogout}
            className="w-full flex items-center justify-between text-xs font-semibold text-red-600 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition-colors"
          >
            <span>Admin Logout</span>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* Main content body */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
