"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Mail, ArrowUpRight, Navigation } from 'lucide-react';

// Inline SVG social icons
const InstagramIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
);
const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" />
  </svg>
);

const quickLinks = [
  { label: 'Browse Rooms', href: '/listing' },
  { label: 'Map Search', href: '/map' },
  { label: 'Post a Room', href: '/post' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Sitemap', href: '/sitemap.xml' },
];

const socials = [
  { Icon: InstagramIcon, href: 'https://instagram.com/roommaps', label: 'Instagram' },
  { Icon: TwitterIcon, href: 'https://twitter.com/roommaps', label: 'Twitter' },
  { Icon: LinkedInIcon, href: 'https://linkedin.com/company/roommaps', label: 'LinkedIn' },
];

const topCities = ['Delhi NCR', 'Mumbai', 'Bangalore', 'Pune', 'Chandigarh', 'Hyderabad', 'Chennai', 'Kolkata'];

export default function Footer() {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  if (pathname === "/map" || pathname === "/login" || pathname === "/register" || pathname === "/forgot-password") return null;

  return (
    <footer aria-label="Site footer" className="relative bg-[#080809] text-white overflow-hidden">

      {/* Radial ambient glow background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#FF5211]/6 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF5211]/3 rounded-full blur-[140px]" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Animated gradient top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#FF5211]/60 to-transparent" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-0">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-14">

          {/* Brand column — spans 4 cols */}
          <div className="md:col-span-4 flex flex-col gap-5">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-3 group w-fit" aria-label="RoomMaps Home">
              <div className="relative w-10 h-10 rounded-2xl overflow-hidden ring-1 ring-white/10 group-hover:ring-[#FF5211]/50 transition-all duration-300 shadow-[0_0_20px_rgba(255,82,17,0.15)]">
                <img src="/roommaps-logo.png" alt="RoomMaps logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-[22px] font-black tracking-tight leading-none">
                <span className="text-white">Room</span><span className="text-[#FF5211]">Maps</span>
                <span className="block text-[9px] font-bold text-white/25 tracking-[0.2em] uppercase mt-0.5">Find Your Perfect Stay</span>
              </span>
            </Link>

            {/* Description */}
            <p className="text-[13.5px] text-white/35 leading-relaxed max-w-[260px]">
              Zero brokerage. Verified rooms. Direct owner contact across India — 50+ cities and growing.
            </p>

            {/* Contact info */}
            <div className="flex flex-col gap-2.5">
              <a
                href="mailto:hello@roommaps.in"
                className="group/mail flex items-center gap-2.5 text-white/35 hover:text-[#FF5211] transition-all duration-300 text-[13px] font-medium w-fit"
              >
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 border border-white/8 group-hover/mail:bg-[#FF5211]/15 group-hover/mail:border-[#FF5211]/30 transition-all duration-300">
                  <Mail size={12} />
                </span>
                hello@roommaps.in
              </a>
              <div className="flex items-center gap-2.5 text-white/25 text-[13px]">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 border border-white/8">
                  <Navigation size={12} />
                </span>
                Pan India · 50+ Cities
              </div>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2 mt-1">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group/social w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/30 hover:bg-[#FF5211] hover:text-white hover:border-[#FF5211] hover:shadow-[0_0_20px_rgba(255,82,17,0.4)] transition-all duration-300 hover:scale-110"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden md:block md:col-span-1" />

          {/* Quick Links — spans 2 cols */}
          <nav aria-label="Quick links" className="md:col-span-2">
            <h3 className="text-[9px] font-black tracking-[0.25em] uppercase text-white/20 mb-5 flex items-center gap-2">
              <span className="w-4 h-px bg-[#FF5211]/50" />
              Navigation
            </h3>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group/link flex items-center gap-1.5 text-[13.5px] font-medium text-white/40 hover:text-white transition-all duration-200"
                  >
                    <span className="w-0 group-hover/link:w-3 h-px bg-[#FF5211] transition-all duration-300 overflow-hidden" />
                    {label}
                    <ArrowUpRight size={11} className="opacity-0 group-hover/link:opacity-50 transition-opacity ml-auto" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal Links — spans 2 cols */}
          <nav aria-label="Legal links" className="md:col-span-2">
            <h3 className="text-[9px] font-black tracking-[0.25em] uppercase text-white/20 mb-5 flex items-center gap-2">
              <span className="w-4 h-px bg-[#FF5211]/50" />
              Legal
            </h3>
            <ul className="flex flex-col gap-2.5">
              {legalLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group/link flex items-center gap-1.5 text-[13.5px] font-medium text-white/40 hover:text-white transition-all duration-200"
                  >
                    <span className="w-0 group-hover/link:w-3 h-px bg-[#FF5211] transition-all duration-300 overflow-hidden" />
                    {label}
                    <ArrowUpRight size={11} className="opacity-0 group-hover/link:opacity-50 transition-opacity ml-auto" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Cities — spans 3 cols */}
          <div className="md:col-span-3">
            <h3 className="text-[9px] font-black tracking-[0.25em] uppercase text-white/20 mb-5 flex items-center gap-2">
              <span className="w-4 h-px bg-[#FF5211]/50" />
              Top Cities
            </h3>
            <div className="flex flex-wrap gap-2">
              {topCities.map((city) => (
                <Link
                  key={city}
                  href={`/map?q=${encodeURIComponent(city)}`}
                  className="group/city flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-semibold text-white/30 border border-white/8 bg-white/3 hover:bg-[#FF5211]/10 hover:border-[#FF5211]/30 hover:text-[#FF5211] transition-all duration-300"
                >
                  <MapPin size={9} className="opacity-0 group-hover/city:opacity-80 transition-opacity -ml-0.5" />
                  {city}
                </Link>
              ))}
            </div>

            {/* CTA Card */}
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-[#FF5211]/12 to-[#FF5211]/5 border border-[#FF5211]/15 backdrop-blur-sm">
              <p className="text-[12px] font-bold text-white/70 mb-1">Have a room to rent?</p>
              <p className="text-[11px] text-white/35 mb-3 leading-relaxed">List for free. Reach thousands of verified seekers.</p>
              <Link
                href="/post"
                className="inline-flex items-center gap-1.5 text-[11px] font-black text-[#FF5211] hover:text-white transition-colors group/cta"
              >
                Post Your Room
                <ArrowUpRight size={11} className="group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-white/[0.06] py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/20 text-[11.5px] tracking-wide">
            © {year} RoomMaps Technologies. All rights reserved.
          </p>

          <div className="flex items-center gap-1.5 order-first sm:order-none">
            <div className="relative flex items-center justify-center w-4 h-4">
              <div className="absolute w-full h-full rounded-full bg-emerald-500/20 animate-ping" />
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </div>
            <span className="text-[10px] font-bold text-white/25 uppercase tracking-[0.15em]">All systems live</span>
          </div>

          <p className="text-white/12 text-[10.5px]">
            Made with <span className="text-[#FF5211]/60">♥</span> in India
          </p>
        </div>
      </div>

      {/* JSON-LD Organization schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'RoomMaps',
            url: 'https://www.roommaps.in',
            logo: 'https://www.roommaps.in/roommaps-logo.png',
            email: 'hello@roommaps.in',
            areaServed: 'IN',
            sameAs: [
              'https://instagram.com/roommaps',
              'https://twitter.com/roommaps',
              'https://linkedin.com/company/roommaps',
            ],
          }),
        }}
      />
    </footer>
  );
}
