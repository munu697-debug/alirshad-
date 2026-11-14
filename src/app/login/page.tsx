"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Pre-warm dashboard routes for instant navigation upon successful login
  useEffect(() => {
    router.prefetch("/dashboard");
    router.prefetch("/dashboard/posts");
    router.prefetch("/dashboard/posts/new");
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Dispatch auth-changed event so Navbar immediately updates
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth-changed"));
          window.location.href = data.redirect || "/";
        } else {
          router.replace(data.redirect || "/");
        }
      } else {
        setErrorMsg(data.error || "Invalid email or password. Please try again.");
      }
    } catch {
      setErrorMsg("Unable to connect to authentication service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-[0_4px_25px_rgba(230,39,39,0.06)]">
        <div className="text-center mb-8">
          <Link href="/" prefetch={true} className="inline-block mb-4">
            <div className="h-10 w-52 mx-auto flex items-center justify-center">
              <img
                src="/images/logo.webp"
                alt="Al Irshad"
                className="h-full w-full object-contain"
              />
            </div>
          </Link>
          <span className="text-xs font-bold uppercase tracking-widest text-accent mb-2 inline-block">
            Editorial & Member Access
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary">
            Log In to Al Irshad
          </h1>
          <p className="text-xs text-secondary mt-1">
            Access the editorial CMS dashboard or member profile
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-primary mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                id="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 bg-surface border border-gray-200 rounded-xl text-xs sm:text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-xs font-semibold text-primary">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 bg-surface border border-gray-200 rounded-xl text-xs sm:text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-accent transition-colors focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-accent hover:bg-accent-hover text-white font-bold text-xs sm:text-sm rounded-xl shadow-[0_4px_14px_rgba(230,39,39,0.30)] hover:shadow-[0_6px_20px_rgba(230,39,39,0.40)] active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In / പ്രവേശിക്കുക</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <div className="text-center">
          <p className="text-xs text-secondary">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              prefetch={true}
              className="font-semibold text-accent hover:text-accent-hover transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
