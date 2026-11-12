import { notFound } from "next/navigation";
import Link from "next/link";
import { getIssueBySlug, getPosts } from "@/lib/db-service";
import { ArticleCard } from "@/components/article-card";
import { Calendar, Layers, ArrowLeft, BookOpen, Share2 } from "lucide-react";
import type { Metadata } from "next";

interface IssuePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: IssuePageProps): Promise<Metadata> {
  const { slug } = await params;
  const issue = await getIssueBySlug(slug);

  if (!issue) {
    return { title: "Issue Not Found | Al Irshad" };
  }

  return {
    title: `${issue.title} - ${issue.edition_label || "Magazine Edition"} | Al Irshad`,
    description: issue.description || `Read articles and features published in Al Irshad ${issue.title} edition.`,
    openGraph: {
      title: issue.title,
      description: issue.description || undefined,
      images: [{ url: issue.cover_image }],
    },
  };
}

export const revalidate = 60;

export default async function IssueDetailPage({ params }: IssuePageProps) {
  const { slug } = await params;
  const issue = await getIssueBySlug(slug);

  if (!issue) {
    notFound();
  }

  // Fetch articles actually associated with this issue
  const issuePosts = await getPosts({
    issueId: issue.id,
    status: "published",
  });

  const coverStory = issuePosts.find((p) => p.is_cover_story) || (issuePosts.length > 0 ? issuePosts[0] : null);
  const remainingPosts = coverStory ? issuePosts.filter((p) => p.id !== coverStory.id) : issuePosts;

  const formattedPublished = issue.published_date
    ? new Date(issue.published_date).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recent";

  return (
    <div className="animate-fade-in pb-20">
      {/* Top Breadcrumb & Return Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link
            href="/issues"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Editions / എല്ലാ പതിപ്പുകളും</span>
          </Link>
          <span className="text-xs font-medium text-muted">
            {issue.title}
          </span>
        </div>
      </div>

      {/* Top Issue Presentation Area (Matching User Image 4) */}
      <section className="bg-[#FAF9F5] border-b border-gray-200/70 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14 items-center">
            
            {/* 3D Magazine Cover Presentation (Left Column) */}
            <div className="md:col-span-5 flex justify-center md:justify-end">
              <div className="relative group perspective-1000">
                {/* 3D Cover Book Shadow Effect */}
                <div className="relative w-64 sm:w-72 aspect-[3/4] rounded-r-lg rounded-l-xs overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.30)] ring-1 ring-black/10 bg-neutral-900 transition-transform duration-500 group-hover:scale-[1.02]">
                  <img
                    src={issue.cover_image}
                    alt={issue.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Spine Highlight Shadow */}
                  <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/40 via-black/10 to-transparent pointer-events-none" />
                  {/* Subtle glossy sheen */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Issue Metadata & Details (Right Column, Matching Image 4) */}
            <div className="md:col-span-7 space-y-5 text-left">
              <div>
                <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-accent block mb-2">
                  {issue.edition_label || "PACKET EDITION"}
                </span>
                <h1 className="text-3xl sm:text-5xl font-bold font-sans text-primary tracking-tight">
                  {issue.title}
                </h1>
              </div>

              {issue.description && (
                <p className="text-sm sm:text-base font-serif text-secondary leading-relaxed max-w-xl">
                  {issue.description}
                </p>
              )}

              {/* Two Column Issue / Published Metadata (Matching Image 4) */}
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-200/80 max-w-md">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-1">
                    ISSUE
                  </span>
                  <p className="text-sm font-semibold text-primary">
                    {issue.title}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-1">
                    PUBLISHED
                  </span>
                  <p className="text-sm font-semibold text-primary">
                    {formattedPublished}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <a
                  href="#articles"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-royal hover:shadow-lg transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>ലേഖനങ്ങൾ വായിക്കുക (Browse Articles)</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Underneath: "ലേഖനങ്ങൾ" (Articles) Section (Matching User Image 4) */}
      <section id="articles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16">
        <div className="flex items-center justify-between pb-4 mb-8 border-b border-gray-200">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-malayalam text-primary tracking-tight">
              ലേഖനങ്ങൾ
            </h2>
            <span className="text-xs text-muted font-sans mt-1 block">
              Articles & Features in this Edition
            </span>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-surface border border-gray-200 text-secondary">
            {issuePosts.length} ലേഖനങ്ങൾ
          </span>
        </div>

        {issuePosts.length === 0 ? (
          <div className="bg-surface rounded-3xl p-12 text-center border border-gray-100 max-w-2xl mx-auto">
            <BookOpen className="w-10 h-10 text-muted mx-auto mb-3" />
            <h3 className="text-base font-bold text-primary mb-1">
              ലേഖനങ്ങൾ ചേർത്തിട്ടില്ല (No Articles Assigned Yet)
            </h3>
            <p className="text-xs text-secondary mb-4">
              Articles assigned to this edition in the CMS editor will automatically appear here.
            </p>
            <Link
              href="/archive"
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-xs font-semibold rounded-xl shadow-royal"
            >
              <span>Explore All Articles</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Featured / Cover Story Card if present */}
            {coverStory && (
              <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent text-white shadow-royal">
                    മുഖചിത്ര ലേഖനം / Cover Story
                  </span>
                  <span className="text-xs text-muted font-medium">
                    Lead Article of this Issue
                  </span>
                </div>
                <ArticleCard post={coverStory} variant="horizontal" />
              </div>
            )}

            {/* Remaining Articles in Issue */}
            {remainingPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {remainingPosts.map((post) => (
                  <ArticleCard key={post.id} post={post} variant="standard" />
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
