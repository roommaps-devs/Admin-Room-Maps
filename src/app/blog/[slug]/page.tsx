import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES } from "@/lib/articles";
import { Calendar, Clock, ArrowLeft, ArrowRight, Share2 } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate dynamic metadata for SEO crawling
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return { title: "Article Not Found | RoomMaps" };

  return {
    title: `${article.title} | RoomMaps Blog`,
    description: article.excerpt,
    keywords: [...article.tags, "zero brokerage", "renting guides", "room maps"],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: new Date(article.date).toISOString(),
      authors: [article.author],
      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
  };
}

// Pre-generate static paths for instant loading and SEO crawling
export async function generateStaticParams() {
  return ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export default async function BlogDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  // Create JSON-LD Article Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "image": [article.image],
    "datePublished": new Date(article.date).toISOString(),
    "author": {
      "@type": "Person",
      "name": article.author,
    },
    "publisher": {
      "@type": "Organization",
      "name": "RoomMaps",
      "logo": {
        "@type": "ImageObject",
        "url": "https://roommaps.in/logo.png"
      }
    },
    "description": article.excerpt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://roommaps.in/blog/${article.slug}`
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#121214] py-16 md:py-24 px-6 relative z-10">
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto mt-6">
        
        {/* Back navigation and Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#FF5211] hover:translate-x-[-2px] transition-transform"
          >
            <ArrowLeft size={16} />
            <span>Back to Blog</span>
          </Link>

          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]/40 uppercase tracking-widest">
            <Link href="/" className="hover:text-[#FF5211] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[#FF5211] transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-[var(--text-primary)]/70 max-w-[150px] truncate">{article.title}</span>
          </nav>
        </div>

        {/* Article Header */}
        <header className="mb-10">
          <span className="inline-block bg-[#FF5211]/10 text-[#FF5211] text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-4">
            {article.category}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-[44px] font-sans font-black text-[var(--text-primary)] tracking-tight leading-tight mb-6">
            {article.title}
          </h1>

          {/* Meta details */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[var(--glass-border)]">
            <div className="flex items-center gap-3 text-xs font-bold text-[var(--text-primary)]/40">
              <span className="text-[#FF5211]">{article.author}</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {article.date}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {article.readTime}
              </span>
            </div>
            <button
              onClick={undefined} // Server Component, can be hooked on client
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)]/50 hover:text-[#FF5211] transition-colors cursor-pointer"
            >
              <Share2 size={13} />
              <span>Share Article</span>
            </button>
          </div>
        </header>

        {/* Hero Image */}
        <div className="relative aspect-[21/10] w-full rounded-3xl overflow-hidden mb-10 shadow-lg border border-[var(--glass-border)] bg-slate-100 dark:bg-zinc-800">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body Content */}
        <article className="prose dark:prose-invert max-w-none mb-16">
          <div className="space-y-6 text-base md:text-[17px] font-medium text-[var(--text-primary)]/80 leading-relaxed">
            {article.content.map((paragraph, index) => (
              <p key={index} className="first-letter:font-sans">
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        {/* Related Tags */}
        <div className="flex flex-wrap gap-2.5 mb-12 pb-8 border-b border-[var(--glass-border)]">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[var(--bg-surface-elevated)] text-[var(--text-primary)]/60 border border-[var(--glass-border)]"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Bottom Call to Action Card */}
        <div className="p-8 rounded-[32px] bg-gradient-to-r from-[#FF6B35]/10 to-[#E84300]/10 border border-[#FF5211]/20 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl md:text-2xl font-sans font-black text-[var(--text-primary)] mb-2">
              Ready to find your next home?
            </h3>
            <p className="text-[var(--text-primary)]/70 text-sm font-medium max-w-md mx-auto mb-6">
              Browse thousands of verified, zero-brokerage rooms and apartments in India's top cities today.
            </p>
            <Link
              href="/listing"
              className="inline-flex items-center gap-2 px-6 py-3 font-bold text-white bg-gradient-to-r from-[#FF6B35] to-[#E84300] rounded-2xl hover:shadow-lg active:scale-95 transition-all duration-300"
            >
              <span>Explore Listings</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
