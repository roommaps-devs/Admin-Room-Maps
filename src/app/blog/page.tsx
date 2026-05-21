import { Metadata } from "next";
import Link from "next/link";
import { ARTICLES } from "@/lib/articles";
import BlogIndexClient from "./BlogIndexClient";

export const metadata: Metadata = {
  title: "RoomMaps Blog - Renting Advice, City Guides & Coliving Insights",
  description: "Explore zero-brokerage renting guides, student housing tips, city survival manuals, and coliving reviews across major cities in India like Bangalore and Delhi NCR.",
  keywords: ["renting advice", "bangalore rent guide", "student housing delhi", "coliving techies", "zero brokerage"],
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#121214] py-16 md:py-24 px-6 relative z-10">
      <div className="max-w-6xl mx-auto mt-6">
        
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]/40 uppercase tracking-widest">
          <Link href="/" className="hover:text-[#FF5211] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[var(--text-primary)]/70">Blog</span>
        </nav>

        {/* Dynamic Interactive Blog Content */}
        <BlogIndexClient initialArticles={ARTICLES} />

      </div>
    </div>
  );
}

