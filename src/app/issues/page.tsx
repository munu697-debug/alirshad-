import Link from "next/link";
import { BookOpen, Calendar, ArrowRight, Layers, Sparkles } from "lucide-react";
import { getIssues } from "@/lib/db-service";
import { SAMPLE_ISSUES } from "@/lib/sample-issues";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Magazine Issues & Editions | Al Irshad",
  description: "Browse all monthly editions, packet editions, and vertical magazine covers of Al Irshad.",
};

export const revalidate = 60;

export default async function IssuesPage() {
  const dbIssues = await getIssues({ publishedOnly: true });
  const issues = dbIssues.length > 0 ? dbIssues : SAMPLE_ISSUES;
  const latestIssue = issues.find((i) => i.is_latest) || issues[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
      {/* Top Banner / Hero for Latest Issue if available */}
      {latestIssue && (
        <section className="mb-14 bg-gradient-to-br from-surface to-accent-light/30 rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* 3D Magazine Cover Presentation */}
            <div className="md:col-span-4 flex justify-center">
              <Link href={`/issue/${latestIssue.slug}`} className="group block relative">
                <div className="relative w-48 sm:w-56 aspect-[3/4] rounded-xl overflow-hidden shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_20px_40px_rgba(0,86,255,0.25)] ring-1 ring-black/10">
                  <img
                    src={latestIssue.cover_image}
                    alt={latestIssue.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs font-semibold flex items-center gap-1.5">
                      <span>Open Issue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Issue Description & Action */}
            <div className="md:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-accent text-white shadow-royal flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Current Issue</span>
                </span>
                <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                  {latestIssue.edition_label || "PACKET EDITION"}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold font-sans text-primary tracking-tight">
                {latestIssue.title}
              </h1>

              {latestIssue.description && (
                <p className="text-base text-secondary font-serif leading-relaxed max-w-2xl">
                  {latestIssue.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted pt-2">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span>
                    {latestIssue.published_date
                      ? new Date(latestIssue.published_date).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })
                      : "Recently Published"}
                  </span>
                </span>
                {latestIssue.articles_count !== undefined && (
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-accent" />
                    <span>{latestIssue.articles_count} ലേഖനങ്ങൾ</span>
                  </span>
                )}
              </div>

              <div className="pt-2">
                <Link
                  href={`/issue/${latestIssue.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-royal hover:shadow-lg transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>ഈ ലക്കം വായിക്കുക (Read Issue)</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Grid of All Issues (Matching User Image 3) */}
      <section>
        <div className="flex items-center justify-between pb-4 mb-8 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-wider mb-1">
              <span>AL IRSHAD EDITIONS</span>
            </div>
            <h2 className="text-2xl font-bold font-sans text-primary tracking-tight">
              Latest / പുതിയ പതിപ്പുകൾ
            </h2>
          </div>
          <span className="text-xs text-muted font-medium">
            Total {issues.length} Editions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {issues.map((issue) => (
            <div key={issue.id} className="flex flex-col group">
              {/* Vertical Magazine Cover Link */}
              <Link
                href={`/issue/${issue.slug}`}
                className="block relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 shadow-md group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-1.5"
              >
                <img
                  src={issue.cover_image}
                  alt={issue.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Subtle sheen highlight over magazine cover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none" />

                {/* Top Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-white border border-white/10">
                    {issue.edition_label || "PACKET EDITION"}
                  </span>
                </div>
              </Link>

              {/* Publication metadata box below cover (Matching User Image 3) */}
              <div className="mt-3 bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                <div>
                  <Link
                    href={`/issue/${issue.slug}`}
                    className="font-bold text-primary hover:text-accent transition-colors block line-clamp-1"
                  >
                    {issue.title}
                  </Link>
                  <span className="text-[11px] text-muted block mt-0.5">
                    {issue.published_date
                      ? new Date(issue.published_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Publication date"}
                  </span>
                </div>

                <Link
                  href={`/issue/${issue.slug}`}
                  className="p-2 rounded-lg bg-surface text-secondary group-hover:bg-accent group-hover:text-white transition-colors"
                  aria-label={`View ${issue.title}`}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
