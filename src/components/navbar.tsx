"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X, LayoutDashboard, LogOut, ChevronDown, User } from "lucide-react";
import type { Category } from "@/lib/types";

interface AuthUser {
  email: string;
  name: string;
  initial: string;
  role: string;
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchSession = () => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated && d.user) {
          setCurrentUser(d.user);
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => setCurrentUser(null));
  };

  useEffect(() => {
    fetchSession();

    // Listen to login/logout events across the app
    window.addEventListener("auth-changed", fetchSession);
    return () => window.removeEventListener("auth-changed", fetchSession);
  }, []);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => { if (d.categories) setCategories(d.categories); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change or outside click
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth-changed"));
      }
      router.replace("/");
    } catch {
      router.replace("/");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <header
        id="mainHeader"
        className={`bg-white border-b border-gray-200 sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "shadow-sm bg-white/95 backdrop-blur-md" : ""
        }`}
      >
        {/* Top Tier: Logo & Actions */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 md:py-5">
            {/* Mobile Menu Button */}
            <div className="flex-1 md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 -ml-2 text-primary hover:text-accent focus:outline-none transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Left Actions (Desktop Search) */}
            <div className="hidden md:flex flex-1 items-center space-x-4">
              <form onSubmit={handleSearchSubmit} className="relative group flex items-center">
                <Search className="w-4 h-4 text-gray-400 group-hover:text-accent transition-colors absolute left-0 z-10 pointer-events-none" />
                <input
                  type="text"
                  name="q"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-9 group-hover:w-64 focus:w-64 pl-7 pr-3 py-1.5 text-xs bg-transparent group-hover:bg-gray-50 focus:bg-gray-50 border border-transparent group-hover:border-gray-200 focus:border-accent rounded-full transition-all duration-300 focus:outline-none text-primary placeholder:text-gray-400 cursor-pointer group-hover:cursor-text focus:cursor-text"
                />
              </form>
            </div>

            {/* Center: Brand Logo */}
            <div className="flex-shrink-0 text-center">
              <Link href="/" className="inline-block group">
                <div className="h-10 sm:h-12 md:h-14 w-52 sm:w-64 md:w-80 flex items-center justify-center">
                  <img
                    src="/images/logo.webp"
                    alt="Al Irshad"
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
              </Link>
            </div>

            {/* Right: Auth & Account */}
            <div className="flex-1 flex justify-end items-center gap-2 sm:gap-4 relative" ref={dropdownRef}>
              {currentUser ? (
                /* Logged In User Avatar (Matching User Image 3) */
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-0.5 rounded-full hover:opacity-95 transition-all focus:outline-none"
                    aria-label="User profile menu"
                  >
                    {/* Circular Avatar matching user Image 3: Red circle with orange/gold ring and letter inside */}
                    <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#991b1b] to-[#dc2626] text-white flex items-center justify-center font-serif font-bold text-base sm:text-lg shadow-md ring-[2.5px] ring-[#f59e0b] ring-offset-2 ring-offset-white cursor-pointer select-none">
                      <span>{currentUser.initial}</span>
                    </div>
                  </button>

                  {/* Dropdown Menu with Logout Option */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2.5 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2.5 z-50 animate-fade-in text-left">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <div className="flex items-center gap-2.5 mb-1">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#991b1b] to-[#dc2626] text-white flex items-center justify-center font-serif font-bold text-xs shadow-xs ring-1 ring-[#f59e0b]">
                            {currentUser.initial}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-primary truncate">
                              {currentUser.name}
                            </p>
                            <p className="text-[10px] text-muted truncate">
                              {currentUser.email}
                            </p>
                          </div>
                        </div>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-accent/10 text-accent">
                          {currentUser.role === "admin" ? "Editorial Administrator" : "Reader Member"}
                        </span>
                      </div>

                      <div className="py-1">
                        {currentUser.role === "admin" && (
                          <Link
                            href="/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-primary hover:text-accent hover:bg-accent-light/40 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-accent" />
                            <span>Editorial CMS Dashboard</span>
                          </Link>
                        )}

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out / പുറത്തുകടക്കുക</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Guest State */
                <>
                  <Link
                    href="/login"
                    prefetch={true}
                    className="text-xs sm:text-sm font-semibold text-secondary hover:text-accent transition-colors px-3 py-1.5 rounded-lg hover:bg-accent-light/40"
                  >
                    Log In
                  </Link>

                  <Link
                    href="/signup"
                    prefetch={true}
                    className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-full bg-accent text-white hover:bg-accent-hover shadow-[0_4px_14px_rgba(230,39,39,0.30)] hover:shadow-[0_6px_20px_rgba(230,39,39,0.40)] transition-all duration-200"
                  >
                    Subscribe
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Second Tier: Category Navigation */}
        <div className="border-t border-gray-100 bg-white/80 backdrop-blur-sm hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none text-xs font-semibold uppercase tracking-wider text-secondary">
              <Link
                href="/"
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  pathname === "/" ? "text-accent bg-accent-light font-bold" : "hover:text-accent hover:bg-accent-light/40"
                }`}
              >
                Home
              </Link>

              <Link
                href="/about"
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  pathname === "/about" ? "text-accent bg-accent-light font-bold" : "hover:text-accent hover:bg-accent-light/40"
                }`}
              >
                About
              </Link>

              <Link
                href="/issues"
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  pathname.startsWith("/issue") ? "text-accent bg-accent-light font-bold" : "hover:text-accent hover:bg-accent-light/40"
                }`}
              >
                Issues
              </Link>

              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    pathname === `/category/${cat.slug}`
                      ? "text-accent bg-accent-light font-bold"
                      : "hover:text-accent hover:bg-accent-light/40"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}

              <Link
                href="/archive"
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  pathname === "/archive" ? "text-accent bg-accent-light font-bold" : "hover:text-accent hover:bg-accent-light/40"
                }`}
              >
                Archive
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[60px] bg-white border-b border-gray-200 z-40 shadow-xl max-h-[85vh] overflow-y-auto animate-fade-in p-5">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="mb-5">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-accent"
              />
            </div>
          </form>

          {/* Mobile Auth / Account Card */}
          <div className="mb-5 pb-4 border-b border-gray-100">
            {currentUser ? (
              <div className="bg-surface p-3.5 rounded-2xl border border-gray-200/80">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#991b1b] to-[#dc2626] text-white flex items-center justify-center font-serif font-bold text-base shadow-sm ring-2 ring-[#f59e0b]">
                    <span>{currentUser.initial}</span>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-primary truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-muted truncate">
                      {currentUser.email}
                    </p>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-accent/10 text-accent">
                      {currentUser.role === "admin" ? "Administrator" : "Reader"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t border-gray-200/60">
                  {currentUser.role === "admin" && (
                    <Link
                      href="/dashboard"
                      className="flex items-center justify-between text-xs font-semibold text-primary hover:text-accent p-2 rounded-xl hover:bg-white"
                    >
                      <span>Editorial CMS Dashboard</span>
                      <LayoutDashboard className="w-4 h-4 text-accent" />
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between text-xs font-semibold text-red-600 p-2 rounded-xl hover:bg-red-50 text-left"
                  >
                    <span>Log Out / പുറത്തുകടക്കുക</span>
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex-1 py-2 text-center text-xs font-semibold text-primary bg-surface border border-gray-200 rounded-xl"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="flex-1 py-2 text-center text-xs font-semibold text-white bg-accent rounded-xl shadow-royal"
                >
                  Subscribe
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Links */}
          <div className="space-y-1 mb-6">
            <Link
              href="/"
              className="block px-3 py-2 text-sm font-semibold rounded-lg text-primary hover:bg-gray-50"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 text-sm font-semibold rounded-lg text-primary hover:bg-gray-50"
            >
              About Us
            </Link>
            <Link
              href="/issues"
              className="block px-3 py-2 text-sm font-semibold rounded-lg text-primary hover:bg-gray-50"
            >
              Issues
            </Link>
            <Link
              href="/archive"
              className="block px-3 py-2 text-sm font-semibold rounded-lg text-primary hover:bg-gray-50"
            >
              Archive
            </Link>
            <Link
              href="/authors"
              className="block px-3 py-2 text-sm font-semibold rounded-lg text-primary hover:bg-gray-50"
            >
              Authors
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 text-sm font-semibold rounded-lg text-primary hover:bg-gray-50"
            >
              Contact & Submissions
            </Link>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">Categories</h4>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="px-3 py-2 text-xs font-medium rounded-lg text-secondary hover:text-accent hover:bg-gray-50"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
