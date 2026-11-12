"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-[0_4px_25px_rgba(16,24,40,0.04)]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif font-bold text-primary mb-2">
            Reset Your Password
          </h1>
          <p className="text-xs text-secondary">
            Enter your email address and we will send you a recovery link.
          </p>
        </div>

        {sent ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-xs text-secondary mb-6">
              If an account with that email exists, password reset instructions have been sent.
            </p>
            <Link
              href="/login"
              className="inline-block px-5 py-2 bg-accent text-white font-semibold text-xs rounded-xl hover:bg-accent-hover"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <button
              type="submit"
              className="w-full py-3 bg-accent text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-accent/25 hover:bg-accent-hover transition-all"
            >
              Send Reset Link
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <Link
            href="/login"
            className="text-xs font-semibold text-secondary hover:text-accent transition-colors"
          >
            &larr; Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
