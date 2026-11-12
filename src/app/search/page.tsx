import { getPosts } from "@/lib/db-service";
import { ArticleCard } from "@/components/article-card";
import { Search } from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  const allPosts = await getPosts();

  const filteredPosts = query
    ? allPosts.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          p.author_name.toLowerCase().includes(query.toLowerCase()) ||
          p.tags?.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fade-in">
      <div className="max-w-2xl mx-auto mb-12">
        <form action="/search" method="GET" className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search articles, authors, topics..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent"
          />
        </form>
        {query && (
          <p className="text-xs text-muted mt-3 text-center">
            Found {filteredPosts.length} {filteredPosts.length === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
          </p>
        )}
      </div>

      {query && filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
          <p className="text-sm text-secondary">
            No matching articles found. Try searching with different keywords.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
