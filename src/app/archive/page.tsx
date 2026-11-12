import Link from "next/link";
import type { Metadata } from "next";
import { Calendar, ArrowRight } from "lucide-react";
import { getPosts } from "@/lib/db-service";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Archive | Al Irshad",
  description: "Browse the complete chronological archive of Al Irshad articles.",
};

export default async function ArchivePage() {
  const posts = await getPosts();

  // Group posts by Year and Month
  const archiveGroups: { [key: string]: typeof posts } = {};

  posts.forEach((post) => {
    const d = new Date(post.published_at);
    const key = d.toLocaleDateString("en-US", { year: "numeric", month: "long" });
    if (!archiveGroups[key]) {
      archiveGroups[key] = [];
    }
    archiveGroups[key].push(post);
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16 animate-fade-in">
      <div className="text-center mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-accent mb-2 inline-block">
          Publication Records
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-primary mb-3">
          Chronological Archive
        </h1>
        <p className="text-xs sm:text-sm text-secondary">
          All published essays, columns, and critiques grouped by month and year.
        </p>
      </div>

      <div className="space-y-12">
        {Object.entries(archiveGroups).map(([period, groupPosts]) => (
          <div key={period} className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-gray-100">
              <Calendar className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-bold font-sans text-primary">{period}</h2>
              <span className="ml-auto px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-secondary">
                {groupPosts.length} posts
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {groupPosts.map((post) => (
                <div
                  key={post.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent block mb-1">
                      {post.category_name}
                    </span>
                    <Link
                      href={`/post/${post.slug}`}
                      className="text-base sm:text-lg font-bold font-malayalam text-primary group-hover:text-accent transition-colors block"
                    >
                      {post.title}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-muted mt-1.5">
                      <span>{post.author_name}</span>
                      <span>&bull;</span>
                      <span>{formatDate(post.published_at)}</span>
                    </div>
                  </div>
                  <Link
                    href={`/post/${post.slug}`}
                    className="p-2 text-gray-300 group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0"
                    aria-label="Read article"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
