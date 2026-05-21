"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Share2,
  Send,
  Check,
  Mail,
  BookOpen,
  TrendingUp,
  Tag,
} from "lucide-react";
import { Article } from "@/lib/articles";

interface BlogDetailsClientProps {
  article: Article;
  allArticles: Article[];
}

export default function BlogDetailsClient({ article, allArticles }: BlogDetailsClientProps) {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  // Dynamic Categories calculation with article counts
  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allArticles.forEach((a) => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [allArticles]);

  // Dynamic Related Articles in the same category
  const relatedArticles = useMemo(() => {
    let related = allArticles.filter((a) => a.category === article.category && a.id !== article.id);
    if (related.length < 3) {
      const others = allArticles.filter((a) => a.id !== article.id && !related.some((r) => r.id === a.id));
      related = [...related, ...others];
    }
    return related.slice(0, 3);
  }, [article, allArticles]);

  // Dynamic Tag cloud calculation
  const topTags = useMemo(() => {
    const tags = new Set<string>();
    allArticles.forEach((a) => {
      a.tags.forEach((t) => tags.add(t));
    });
    return Array.from(tags).slice(0, 8);
  }, [allArticles]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      if (navigator.share) {
        navigator
          .share({
            title: article.title,
            text: article.excerpt,
            url: url,
          })
          .catch(() => {
            navigator.clipboard.writeText(url);
            toast.success("Link copied to clipboard!");
          });
      } else {
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      }
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setSubscribing(true);
    setTimeout(() => {
      setSubscribing(false);
      setSubscribed(true);
      toast.success("Thank you! You are now subscribed to RoomMaps Journal.");
      setEmail("");
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
      
      {/* Primary Blog Content Column */}
      <div className="lg:col-span-8 space-y-8">
        
        {/* Back and Breadcrumbs Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[var(--glass-border)]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-black text-[#FF5211] hover:translate-x-[-3px] transition-transform cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Journal</span>
          </Link>

          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-black text-[var(--text-primary)]/40 uppercase tracking-widest">
            <Link href="/" className="hover:text-[#FF5211] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[#FF5211] transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-[var(--text-primary)]/70 max-w-[140px] truncate">{article.title}</span>
          </nav>
        </div>

        {/* Article Layout */}
        <article className="space-y-8">
          <header className="space-y-4">
            <span className="inline-block bg-[#FF5211]/10 dark:bg-[#FF5211]/20 text-[#FF5211] text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl">
              {article.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-[45px] font-sans font-black text-[var(--text-primary)] tracking-tight leading-tight">
              {article.title}
            </h1>

            {/* Author / Date / Share metadata */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[var(--glass-border)]">
              <div className="flex flex-wrap items-center gap-3 text-xs font-black text-[var(--text-primary)]/45">
                <span className="text-[#FF5211]">{article.author}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  {article.date}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} />
                  {article.readTime}
                </span>
              </div>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 text-xs font-black text-[var(--text-primary)]/50 hover:text-[#FF5211] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Share2 size={14} />
                <span>Share Article</span>
              </button>
            </div>
          </header>

          {/* Hero Aspect Image */}
          <div className="relative aspect-[21/10] w-full rounded-[32px] overflow-hidden shadow-lg border border-[var(--glass-border)] bg-slate-100 dark:bg-zinc-800">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Body Content Prose */}
          <div className="prose dark:prose-invert max-w-none">
            <div className="space-y-6 text-base md:text-lg font-medium text-[var(--text-primary)]/80 leading-relaxed">
              {article.content.map((paragraph, index) => (
                <p key={index} className="first-letter:font-sans">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Article Tags */}
          <div className="flex flex-wrap gap-2.5 pt-6 border-t border-[var(--glass-border)]">
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?search=${tag}`}
                className="text-xs font-black px-3.5 py-2 rounded-xl bg-[var(--bg-surface-elevated)] text-[var(--text-primary)]/60 border border-[var(--glass-border)] hover:border-[#FF5211] hover:text-[#FF5211] transition-all"
              >
                #{tag}
              </Link>
            ))}
          </div>

          {/* Bottom Call to Action Grid */}
          <div className="p-8 md:p-10 rounded-[36px] bg-gradient-to-r from-[#FF6B35]/10 to-[#E84300]/10 border border-[#FF5211]/20 text-center md:text-left relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 relative z-10 max-w-lg">
              <h3 className="text-xl md:text-2xl font-sans font-black text-[var(--text-primary)]">
                Ready to find your next home?
              </h3>
              <p className="text-[var(--text-primary)]/70 text-sm font-medium">
                Browse thousands of verified, zero-brokerage rooms and apartments in India's top tech hubs today with RoomMaps.
              </p>
            </div>
            <Link
              href="/listing"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 font-black text-sm text-white bg-gradient-to-r from-[#FF6B35] to-[#E84300] rounded-2xl hover:shadow-lg active:scale-95 transition-all shrink-0"
            >
              <span>Explore Listings</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </article>
      </div>

      {/* Categories and Content Sidebar */}
      <aside className="lg:col-span-4 space-y-8">
        <div className="sticky top-[104px] space-y-8">
          
          {/* Categories Quick Links */}
          <div className="p-6 bg-white dark:bg-[#1A1A1E] border border-[var(--glass-border)] rounded-[32px] shadow-[0_15px_30px_rgba(0,0,0,0.01)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.15)]">
            <div className="flex items-center gap-2 mb-5 font-sans font-black text-sm uppercase text-[var(--text-primary)] tracking-wide pb-3 border-b border-[var(--glass-border)]">
              <BookOpen size={16} className="text-[#FF5211]" />
              <span>Blog Categories</span>
            </div>
            <ul className="space-y-2.5">
              {categoriesWithCounts.map(({ name, count }) => (
                <li key={name}>
                  <Link
                    href={`/blog?category=${name}`}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-bold text-[var(--text-primary)]/70 hover:text-[#FF5211] hover:bg-[#FF5211]/5 dark:hover:bg-[#FF5211]/10 transition-all group"
                  >
                    <span>{name}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-primary)]/40 group-hover:bg-[#FF5211]/10 group-hover:text-[#FF5211] transition-all">
                      {count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Related Articles Panel */}
          <div className="p-6 bg-white dark:bg-[#1A1A1E] border border-[var(--glass-border)] rounded-[32px] shadow-[0_15px_30px_rgba(0,0,0,0.01)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.15)]">
            <div className="flex items-center gap-2 mb-5 font-sans font-black text-sm uppercase text-[var(--text-primary)] tracking-wide pb-3 border-b border-[var(--glass-border)]">
              <TrendingUp size={16} className="text-[#FF5211]" />
              <span>Related Articles</span>
            </div>
            <div className="space-y-4">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="flex gap-4 group cursor-pointer pb-4 border-b border-[var(--glass-border)] last:border-0 last:pb-0"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-zinc-800 border border-[var(--glass-border)]">
                    <img
                      src={rel.image}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-[#FF5211] tracking-wider">
                      {rel.category}
                    </span>
                    <h4 className="text-xs font-black text-[var(--text-primary)] leading-tight group-hover:text-[#FF5211] transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Premium Newsletter Sign-up Card */}
          <div className="p-6 bg-gradient-to-br from-white to-[var(--bg-surface)] dark:from-[#1A1A1E] dark:to-[#121214] border border-[var(--glass-border)] rounded-[32px] shadow-sm relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#FF5211]/5 rounded-full blur-2xl" />
            <div className="relative z-10 space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-[#FF5211]/10 flex items-center justify-center text-[#FF5211]">
                {subscribed ? <Check size={20} /> : <Mail size={20} />}
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black uppercase tracking-wider text-[var(--text-primary)]">
                  RoomMaps Journal
                </h4>
                <p className="text-xs text-[var(--text-primary)]/60 font-medium">
                  Stay updated with our zero-brokerage alerts, city survival guides, and tenant resources.
                </p>
              </div>

              {subscribed ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl text-xs font-bold text-center animate-fade-in">
                  Awesome! You've been subscribed successfully.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2.5">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={subscribing}
                    className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-[#1A1A1E] border border-[var(--glass-border)] text-xs font-bold text-[var(--text-primary)] placeholder-[var(--text-primary)]/30 focus:outline-none focus:border-[#FF5211] focus:ring-2 focus:ring-[#FF5211]/10 transition-all shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="w-full py-3 rounded-2xl font-black text-xs text-white bg-[#FF5211] hover:bg-[#E84300] active:scale-97 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/10 cursor-pointer"
                  >
                    <span>{subscribing ? "Subscribing..." : "Subscribe Now"}</span>
                    <Send size={12} />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Popular Tag Cloud */}
          <div className="p-6 bg-white dark:bg-[#1A1A1E] border border-[var(--glass-border)] rounded-[32px] shadow-[0_15px_30px_rgba(0,0,0,0.01)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.15)]">
            <div className="flex items-center gap-2 mb-5 font-sans font-black text-sm uppercase text-[var(--text-primary)] tracking-wide pb-3 border-b border-[var(--glass-border)]">
              <Tag size={16} className="text-[#FF5211]" />
              <span>Hub Tag Cloud</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {topTags.map((t) => (
                <Link
                  key={t}
                  href={`/blog?search=${t}`}
                  className="text-[11px] font-bold px-3 py-2 rounded-xl bg-[var(--bg-surface)] text-[var(--text-primary)]/60 border border-[var(--glass-border)] hover:border-[#FF5211] hover:text-[#FF5211] hover:scale-105 active:scale-95 transition-all"
                >
                  #{t}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </aside>

    </div>
  );
}
