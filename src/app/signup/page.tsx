"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth-changed"));
        }
        setSuccess(true);
      } else {
        setErrorMsg(data.error || "Failed to create account. Please check your details.");
      }
    } catch {
      setErrorMsg("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-[0_4px_25px_rgba(16,24,40,0.04)]">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <div className="h-10 w-52 mx-auto flex items-center justify-center">
              <img
                src="/images/logo.webp"
                alt="Al Irshad"
                className="h-full w-full object-contain"
              />
            </div>
          </Link>
          <span className="text-xs font-bold uppercase tracking-widest text-accent mb-2 inline-block">
            Join the Community
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary">
            Subscribe & Sign Up
          </h1>
          <p className="text-xs text-secondary mt-1">
            Read, comment, and engage with Malayalam literary discussions
          </p>
        </div>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-primary mb-1">Welcome to Al Irshad!</h3>
            <p className="text-xs text-secondary mb-6">
              Your account has been created successfully. You can now log in or continue browsing.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link
                href="/"
                className="inline-block px-5 py-2.5 bg-accent text-white font-semibold text-xs rounded-xl hover:bg-accent-hover transition-colors shadow-royal"
              >
                Go to Homepage
              </Link>
              <Link
                href="/login"
                className="inline-block px-5 py-2.5 bg-surface text-primary border border-gray-200 font-semibold text-xs rounded-xl hover:bg-gray-50 transition-colors"
              >
                Go to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-200">
                {errorMsg}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-primary mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full pl-10 pr-4 py-3 bg-surface border border-gray-200 rounded-xl text-xs sm:text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent"
                />
              </div>
            </div>

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
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-surface border border-gray-200 rounded-xl text-xs sm:text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-primary mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  id="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-4 py-3 bg-surface border border-gray-200 rounded-xl text-xs sm:text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-accent text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 hover:bg-accent-hover disabled:opacity-75 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{loading ? "Creating Account..." : "Create Account"}</span>
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <p className="text-xs text-secondary">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-accent hover:text-accent-hover transition-colors"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
