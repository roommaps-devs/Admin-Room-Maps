import Hero from "@/components/Hero";
import FAQ from "@/components/FAQ";
import { Search, MapPin, Star, Shield } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "RoomMaps | Find Rooms & Stays Across India — Zero Brokerage",
  description:
    "RoomMaps is India's #1 zero-brokerage platform to find verified rooms, apartments & short-term stays in Delhi NCR, Mumbai, Bangalore, Hyderabad, Pune & more. Direct owner contact. No middleman.",
  keywords: [
    "room for rent in India",
    "zero brokerage rooms",
    "rooms near me",
    "PG accommodation India",
    "short term stay India",
    "verified rooms Delhi NCR",
    "rooms for rent Bangalore",
    "apartments for rent Mumbai",
    "RoomMaps",
    "find rooms India",
  ],
  authors: [{ name: "RoomMaps", url: "https://www.roommaps.in" }],
  metadataBase: new URL("https://www.roommaps.in"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "RoomMaps — Find Your Perfect Room Across India",
    description:
      "Discover verified rooms, apartments & short-term stays with zero brokerage. Direct owner contact across all major Indian cities.",
    url: "https://www.roommaps.in",
    siteName: "RoomMaps",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RoomMaps — Find Your Perfect Room in India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RoomMaps — Zero Brokerage Rooms Across India",
    description:
      "Find verified rooms & stays across India. Zero brokerage, direct owner contact.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF8]">
      {/* JSON-LD Structured Data for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "RoomMaps",
            url: "https://www.roommaps.in",
            description:
              "India's zero-brokerage platform to find verified rooms, apartments & short-term stays.",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate:
                  "https://www.roommaps.in/map?q={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      {/* Premium Hero Section */}
      <Hero />

      {/* Features - High Fidelity Style */}
      <section className="py-24 md:py-32 px-6 bg-white border-t border-[#0A0A0A]/5 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-sans font-black text-[#0A0A0A] mb-4 tracking-tight">
              Why RoomMaps?
            </h2>
            <p className="text-[#6B6B6B] font-medium text-lg">The smartest way to find your next home or stay.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
            <div className="flex flex-col gap-6 group hover:translate-y-[-8px] transition-all duration-500">
              <div className="w-16 h-16 rounded-3xl bg-[#FF5733]/5 flex items-center justify-center text-[#FF5733] shadow-[0_15px_30px_rgba(255,87,51,0.1)] group-hover:bg-[#FF5733] group-hover:text-white transition-all duration-500">
                <Shield size={32} />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-[#0A0A0A]">Verified Listings</h3>
                <p className="text-[#6B6B6B] leading-relaxed font-medium">Every property on our platform is manually verified for your safety and peace of mind.</p>
              </div>
            </div>

            <div className="flex flex-col gap-6 group hover:translate-y-[-8px] transition-all duration-500">
              <div className="w-16 h-16 rounded-3xl bg-blue-500/5 flex items-center justify-center text-blue-600 shadow-[0_15px_30px_rgba(37,99,235,0.1)] group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                <Search size={32} />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-[#0A0A0A]">Smart Search</h3>
                <p className="text-[#6B6B6B] leading-relaxed font-medium">Find exactly what you need with filters for price, amenities, and location proximity.</p>
              </div>
            </div>

            <div className="flex flex-col gap-6 group hover:translate-y-[-8px] transition-all duration-500">
              <div className="w-16 h-16 rounded-3xl bg-green-500/5 flex items-center justify-center text-green-600 shadow-[0_15px_30px_rgba(22,163,74,0.1)] group-hover:bg-green-600 group-hover:text-white transition-all duration-500">
                <Star size={32} />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-[#0A0A0A]">Premium Quality</h3>
                <p className="text-[#6B6B6B] leading-relaxed font-medium">We prioritize comfort and quality, ensuring your stay feels like home from day one.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Social Proof / Trust Section */}
      <section className="py-20 bg-[#FAFAF8] border-t border-[#0A0A0A]/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="text-[20px] font-black tracking-widest text-[#0A0A0A]">TRUSTED BY THOUSANDS</div>
          <div className="flex flex-wrap justify-center gap-10 md:gap-16">
            {/* Placeholders for partner logos */}
            <div className="text-xl font-bold">LIVING-CO</div>
            <div className="text-xl font-bold">STAY-HUB</div>
            <div className="text-xl font-bold">ROOMS-IND</div>
            <div className="text-xl font-bold">URBAN-NEST</div>
          </div>
        </div>
      </section>
    </div>
  );
}