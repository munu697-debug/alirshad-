import Link from "next/link";
import type { Metadata } from "next";
import { User, BookOpen } from "lucide-react";
import { getPosts } from "@/lib/db-service";

export const metadata: Metadata = {
  title: "Authors | Al Irshad",
  description: "Meet the contributing writers and thinkers of Al Irshad.",
};

export default async function AuthorsPage() {
  const posts = await getPosts();

  // Aggregate authors and their counts
  const authorsMap: { [name: string]: number } = {};
  posts.forEach((p) => {
    authorsMap[p.author_name] = (authorsMap[p.author_name] || 0) + 1;
  });

  const authors = Object.entries(authorsMap).map(([name, count]) => ({
    name,
    count,
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-16 animate-fade-in">
      <div className="text-center mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-accent mb-2 inline-block">
          Editorial Voices
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-primary mb-3">
          Our Contributing Authors
        </h1>
        <p className="text-xs sm:text-sm text-secondary">
          Scholars, writers, critics, and creative voices shaping discourse in Malayalam.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map(({ name, count }) => (
          <Link
            key={name}
            href={`/author/${encodeURIComponent(name)}`}
            className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-300 flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-accent to-brand-azure text-white flex items-center justify-center font-bold text-lg shadow-royal group-hover:scale-105 transition-transform">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-base text-primary group-hover:text-accent transition-colors">
                {name}
              </h3>
              <span className="text-xs text-muted flex items-center gap-1 mt-1">
                <BookOpen className="w-3 h-3 text-accent" />
                {count} {count === 1 ? "article" : "articles"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
