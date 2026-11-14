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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

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

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  // Focus mobile search input when opened
  useEffect(() => {
    if (mobileSearchOpen) {
      setTimeout(() => {
        mobileSearchInputRef.current?.focus();
      }, 100);
    }
  }, [mobileSearchOpen]);

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
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2.5 md:py-4 gap-2">
            {/* Mobile Menu Button (Hamburger) */}
            <div className="flex items-center md:hidden shrink-0">
              <button
                onClick={() => {
                  setMobileMenuOpen(!mobileMenuOpen);
                  if (mobileSearchOpen) setMobileSearchOpen(false);
                }}
                className="p-1.5 -ml-1 text-primary hover:text-accent focus:outline-none transition-colors rounded-lg"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Left Actions (Desktop Search - Always visible in laptop / desktop) */}
            <div className="hidden md:flex flex-1 items-center">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full max-w-[220px] lg:max-w-[260px]">
                <Search className="w-4 h-4 text-accent absolute left-3 z-10 pointer-events-none" />
                <input
                  type="text"
                  name="q"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50/80 hover:bg-gray-100/60 focus:bg-white border border-gray-200 hover:border-gray-300 focus:border-accent rounded-full transition-all duration-200 focus:outline-none text-primary placeholder:text-gray-400"
                />
              </form>
            </div>

            {/* Center: Brand Logo */}
            <div className="flex-1 md:flex-initial flex items-center justify-center min-w-0">
              <Link href="/" className="inline-block group max-w-[170px] sm:max-w-[220px] md:max-w-none">
                <div className="h-8 sm:h-10 md:h-12 w-36 sm:w-48 md:w-64 lg:w-72 flex items-center justify-center">
                  <img
                    src="/images/logo.webp"
                    alt="Al Irshad"
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
              </Link>
            </div>

            {/* Right: Search Symbol (Mobile) + Auth / Login */}
            <div className="flex items-center justify-end gap-1.5 sm:gap-3 shrink-0 md:flex-1" ref={dropdownRef}>
              {/* Mobile Search Symbol (Right in header, not hidden in drawer) */}
              <button
                type="button"
                onClick={() => {
                  setMobileSearchOpen(!mobileSearchOpen);
                  if (mobileMenuOpen) setMobileMenuOpen(false);
                }}
                className={`md:hidden p-1.5 sm:p-2 rounded-full transition-colors ${
                  mobileSearchOpen
                    ? "bg-accent/10 text-accent"
                    : "text-accent hover:bg-accent-light/40"
                }`}
                aria-label="Search articles"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {currentUser ? (
                /* Logged In User Avatar */
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center p-0.5 rounded-full hover:opacity-95 transition-all focus:outline-none"
                    aria-label="User profile menu"
                  >
                    {/* Circular Avatar: Red circle with orange/gold ring and letter inside */}
                    <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-[#991b1b] to-[#dc2626] text-white flex items-center justify-center font-serif font-bold text-sm sm:text-base md:text-lg shadow-md ring-[2px] sm:ring-[2.5px] ring-[#f59e0b] ring-offset-2 ring-offset-white cursor-pointer select-none shrink-0">
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
                /* Guest State - Login Button (Clean alignment, no line wrapping) */
                <Link
                  href="/login"
                  prefetch={true}
                  className="whitespace-nowrap shrink-0 inline-flex items-center justify-center text-xs sm:text-sm font-semibold px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-accent text-white hover:bg-accent-hover shadow-[0_4px_14px_rgba(230,39,39,0.30)] hover:shadow-[0_6px_20px_rgba(230,39,39,0.40)] transition-all duration-200 leading-none"
                >
                  Log In
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar Drawer (Opens when mobile search icon is clicked) */}
        {mobileSearchOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/98 backdrop-blur-md px-4 py-2.5 shadow-sm animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-4 h-4 text-accent absolute left-3.5 pointer-events-none" />
              <input
                ref={mobileSearchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-10 pr-9 py-2 text-xs bg-gray-50 border border-gray-200 focus:border-accent focus:bg-white rounded-full focus:outline-none text-primary placeholder:text-gray-400"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 p-1 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setMobileSearchOpen(false)}
                  className="absolute right-3 p-1 text-gray-400 hover:text-gray-600"
                  aria-label="Close search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          </div>
        )}

        {/* Second Tier: Category Navigation (Desktop) */}
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

      {/* Mobile Menu Dropdown (Nav links drawer - search moved to top header bar) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[52px] sm:top-[60px] bg-white border-b border-gray-200 z-40 shadow-xl max-h-[85vh] overflow-y-auto animate-fade-in p-5">
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
              <div className="flex items-center">
                <Link
                  href="/login"
                  className="w-full py-2.5 text-center text-xs font-semibold text-white bg-accent hover:bg-accent-hover rounded-xl shadow-royal transition-colors"
                >
                  Log In
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
