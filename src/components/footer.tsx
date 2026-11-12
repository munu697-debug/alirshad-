"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Send, CheckCircle2 } from "lucide-react";
import type { Category } from "@/lib/types";

export function Footer() {
  const [email, setEmail] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => { if (d.categories) setCategories(d.categories); })
      .catch(() => {});
  }, []);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setMessage(data.message || "Thank you for subscribing!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Subscription failed. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Subscription failed. Please try again.");
    }
  };

  return (
    <footer className="mt-20 bg-[#111111] text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-16">
        {/* Footer Brand Logo */}
        <div className="mb-10 pb-8 border-b border-gray-800/80">
          <Link href="/" className="inline-block">
            <div className="h-11 w-64 brightness-0 invert opacity-90 hover:opacity-100 transition-opacity flex items-center">
              <img
                src="/images/logo.webp"
                alt="Al Irshad"
                className="h-full w-full object-contain object-left"
              />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mb-16">
          {/* Column 1: Editorial Links */}
          <div className="flex flex-col w-full border-b md:border-b-0 border-gray-800 pb-8 md:pb-0">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">
              Explore
            </h3>
            <div className="divide-y divide-gray-800/80">
              <Link
                href="/archive"
                className="py-3.5 text-xs font-bold text-gray-200 hover:text-white uppercase tracking-[0.15em] transition-all duration-300 group flex items-center"
              >
                <ArrowRight className="w-3 h-3 text-accent opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 mr-2" />
                Archive
              </Link>
              <Link
                href="/authors"
                className="py-3.5 text-xs font-bold text-gray-200 hover:text-white uppercase tracking-[0.15em] transition-all duration-300 group flex items-center"
              >
                <ArrowRight className="w-3 h-3 text-accent opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 mr-2" />
                Authors
              </Link>
              <Link
                href="/about"
                className="py-3.5 text-xs font-bold text-gray-200 hover:text-white uppercase tracking-[0.15em] transition-all duration-300 group flex items-center"
              >
                <ArrowRight className="w-3 h-3 text-accent opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 mr-2" />
                About Us
              </Link>
              <Link
                href="/contact"
                className="py-3.5 text-xs font-bold text-gray-200 hover:text-white uppercase tracking-[0.15em] transition-all duration-300 group flex items-center"
              >
                <ArrowRight className="w-3 h-3 text-accent opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 mr-2" />
                Contact & Feedback
              </Link>
              <a
                href="mailto:info@alirshad.in?subject=Content Submission Proposal"
                className="py-3.5 text-xs font-bold text-gray-200 hover:text-white uppercase tracking-[0.15em] transition-all duration-300 group flex items-center"
              >
                <ArrowRight className="w-3 h-3 text-accent opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 mr-2" />
                Submit Writing
              </a>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div className="flex flex-col w-full border-b md:border-b-0 border-gray-800 pb-8 md:pb-0">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">
              Categories
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="text-xs text-gray-400 hover:text-white hover:underline transition-colors py-1"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Newsletter & Mission */}
          <div className="flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">
              Newsletter
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Stay connected with thoughtful perspectives, deep literary engagements, and critical essays delivered directly to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address..."
                  required
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-accent"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-60"
                >
                  {status === "loading" ? "..." : <Send className="w-3.5 h-3.5" />}
                </button>
              </div>
              {status === "success" && (
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {message}
                </p>
              )}
              {status === "error" && (
                <p className="text-xs text-red-400">{message}</p>
              )}
            </form>

            <div className="mt-8 pt-6 border-t border-gray-800/80">
              <span className="text-[11px] text-gray-500 block mb-2 uppercase tracking-wider">Community</span>
              <a
                href="https://chat.whatsapp.com/Gj9KdYNHJaj7BHGxlU4DFI"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs text-green-400 hover:text-green-300 font-medium transition-colors"
              >
                <span>Join our WhatsApp Group</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} Al Irshad. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-gray-400">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <a href="mailto:info@alirshad.in" className="hover:text-white transition-colors">
              info@alirshad.in
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
