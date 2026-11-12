"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const ADMIN_EMAIL = "alirshadmagazine@gmail.com";
const ADMIN_PASS = "ALIRSHAD2025";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Pre-warm the dashboard route so clicking Log In transitions instantly without compilation lag
  useEffect(() => {
    router.prefetch("/dashboard");
    router.prefetch("/dashboard/posts");
    router.prefetch("/dashboard/posts/new");
  }, [router]);

  const handleFillAdmin = () => {
    setEmail(ADMIN_EMAIL);
    setPassword(ADMIN_PASS);
    setErrorMsg(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Instant Admin Check - 0 millisecond latency bypass
    if (cleanEmail === ADMIN_EMAIL.toLowerCase() && cleanPassword === ADMIN_PASS) {
      setLoading(true);
      if (typeof window !== "undefined") {
        document.cookie = "admin_auth=true; path=/; max-age=2592000; SameSite=Lax";
        localStorage.setItem(
          "alirshad_admin",
          JSON.stringify({ email: ADMIN_EMAIL, role: "admin", timestamp: Date.now() })
        );
      }
      // Instant transition to dashboard
      router.replace("/dashboard");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (error) {
        // If wrong credentials entered
        setErrorMsg("Invalid email or password. Please verify your credentials.");
      } else {
        router.replace("/dashboard");
      }
    } catch {
      setErrorMsg("Authentication error. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-[0_4px_25px_rgba(0,86,255,0.06)]">
        <div className="text-center mb-6">
          <Link href="/" prefetch={true} className="inline-block mb-4">
            <div className="relative h-10 w-52 mx-auto">
              <Image
                src="/images/logo.png"
                alt="Al Irshad"
                fill
                priority
                className="object-contain"
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

        {/* Admin One-Click Quick Fill Helper */}
        <div className="mb-6 p-3 bg-accent-light/50 border border-accent/20 rounded-2xl flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0" />
            <div className="text-left">
              <span className="text-[11px] font-bold text-primary block">Admin Access</span>
              <span className="text-[10px] text-secondary font-mono">alirshadmagazine@gmail.com</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleFillAdmin}
            className="px-2.5 py-1 text-[11px] font-semibold text-accent hover:text-white hover:bg-accent border border-accent/40 rounded-lg transition-all"
          >
            Auto-fill
          </button>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alirshadmagazine@gmail.com"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
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
            className="w-full py-3.5 bg-accent hover:bg-accent-hover text-white font-bold text-xs sm:text-sm rounded-xl shadow-[0_4px_14px_rgba(0,86,255,0.30)] hover:shadow-[0_6px_20px_rgba(0,86,255,0.40)] active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Entering Dashboard...</span>
              </>
            ) : (
              <>
                <span>Log In & Enter Dashboard</span>
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
