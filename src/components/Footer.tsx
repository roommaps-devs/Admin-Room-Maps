import Link from 'next/link';
import { MapPin, Mail, ArrowUpRight } from 'lucide-react';

// Inline SVG social icons (lucide-react v1 doesn't include socials)
const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
);
const TwitterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const LinkedInIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
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

const socials = [
  { Icon: InstagramIcon, href: 'https://instagram.com/roommaps', label: 'Instagram' },
  { Icon: TwitterIcon, href: 'https://twitter.com/roommaps', label: 'Twitter' },
  { Icon: LinkedInIcon, href: 'https://linkedin.com/company/roommaps', label: 'LinkedIn' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer aria-label="Site footer" className="bg-[#0A0A0A] text-white">
      {/* Gradient top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#FF5733]/50 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 py-14">
        {/* Main row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group w-fit" aria-label="RoomMaps Home">
              <div className="w-9 h-9 rounded-xl overflow-hidden group-hover:scale-105 transition-transform">
                <img src="/roommaps-logo.png" alt="RoomMaps logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-[20px] font-black tracking-tight leading-none">
                <span className="text-white">Room</span><span className="text-[#FF5733]">Maps</span>
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-[240px]">
              Zero brokerage. Verified rooms. Direct owner contact across India.
            </p>
            <a
              href="mailto:hello@roommaps.in"
              className="flex items-center gap-2 text-white/40 hover:text-[#FF5733] transition-colors text-sm font-medium"
            >
              <Mail size={13} />
              hello@roommaps.in
            </a>
            <div className="flex items-center gap-2 text-white/30 text-sm">
              <MapPin size={13} />
              Pan India · 50+ Cities
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick links">
            <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-white/25 mb-5">Quick Links</h3>
            <ul className="flex flex-col gap-3">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm font-medium text-white/50 hover:text-white transition-colors flex items-center gap-1 group/link"
                  >
                    {label}
                    <ArrowUpRight size={11} className="opacity-0 group-hover/link:opacity-60 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social + Cities */}
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-white/25 mb-4">Follow Us</h3>
              <div className="flex items-center gap-2.5">
                {socials.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-[#FF5733] hover:text-white hover:border-transparent transition-all duration-300 hover:scale-110"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-white/25 mb-4">Top Cities</h3>
              <div className="flex flex-wrap gap-2">
                {['Delhi NCR', 'Mumbai', 'Bangalore', 'Pune', 'Chandigarh', 'Hyderabad'].map((city) => (
                  <Link
                    key={city}
                    href={`/map?q=${encodeURIComponent(city)}`}
                    className="px-3 py-1 rounded-full text-[11px] font-semibold text-white/35 border border-white/10 hover:border-[#FF5733]/40 hover:text-[#FF5733] transition-all"
                  >
                    {city}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs">© {year} RoomMaps. All rights reserved.</p>
          <div className="flex items-center gap-5">
            {[['Privacy', '/privacy'], ['Terms', '/terms'], ['Sitemap', '/sitemap.xml']].map(([label, href]) => (
              <Link key={label} href={href} className="text-white/20 text-xs hover:text-white/50 transition-colors">
                {label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-white/20 text-[10px] font-semibold uppercase tracking-wider">All systems live</span>
          </div>
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
