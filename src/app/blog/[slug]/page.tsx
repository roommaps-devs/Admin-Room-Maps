import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ARTICLES } from "@/lib/articles";
import BlogDetailsClient from "./BlogDetailsClient";

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

      <div className="max-w-6xl mx-auto mt-6">
        <BlogDetailsClient article={article} allArticles={ARTICLES} />
      </div>
    </div>
  );
}

