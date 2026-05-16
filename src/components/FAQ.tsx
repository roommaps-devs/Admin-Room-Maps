"use client";

import { useState } from 'react';
import { ChevronDown, ShieldCheck, BadgeCheck, HelpCircle, CreditCard, MapPin, Key } from 'lucide-react';

const faqData = [
  {
    question: "Is RoomMaps really zero brokerage?",
    answer: "Yes, absolutely! We connect you directly with homeowners. We don't act as middlemen, and we never charge any brokerage or commission from tenants.",
    icon: <ShieldCheck size={20} className="text-[#FF5733]" />,
  },
  {
    question: "How do you verify the listings?",
    answer: "We use a multi-step verification process including phone verification, property photo checks, and community reporting. Verified listings carry a 'Verified' badge for your peace of mind.",
    icon: <BadgeCheck size={20} className="text-[#FF5733]" />,
  },
  {
    question: "Is it safe to visit rooms alone?",
    answer: "We always recommend visiting during daylight hours and informing a friend or family member about your location. Our safety guide provides more tips on secure property visits.",
    icon: <HelpCircle size={20} className="text-[#FF5733]" />,
  },
  {
    question: "What are the common payment terms?",
    answer: "Typically, owners ask for 1 month's rent as a security deposit and 1 month's advance rent. However, terms are negotiated directly between you and the owner — no platform fees.",
    icon: <CreditCard size={20} className="text-[#FF5733]" />,
  },
  {
    question: "Which cities is RoomMaps available in?",
    answer: "RoomMaps is live across 50+ cities in India including Delhi NCR, Mumbai, Bangalore, Hyderabad, Pune, Chandigarh, Chennai, Kolkata and more. We're expanding fast!",
    icon: <MapPin size={20} className="text-[#FF5733]" />,
  },
  {
    question: "How do I list my property on RoomMaps?",
    answer: "Simply click 'Post a Room', fill in the property details, add photos, and publish. Listing is free. Verified owners get priority placement in search results.",
    icon: <Key size={20} className="text-[#FF5733]" />,
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="px-6 py-24 md:py-32 max-w-[860px] mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-14">
        <span className="inline-block text-[10px] font-black tracking-[0.22em] text-[#FF5733] uppercase bg-[#FF5733]/8 px-4 py-2 rounded-full mb-6">
          Support
        </span>
        <h2
          id="faq-heading"
          className="text-[clamp(30px,5vw,48px)] font-black tracking-tighter leading-[1.08] text-[#0A0A0A]"
        >
          Frequently Asked{' '}
          <span className="text-[#FF5733]">Questions.</span>
        </h2>
        <p className="text-[#6B6B6B] font-medium text-lg mt-4 max-w-[480px] mx-auto">
          Everything you need to know about finding your perfect room.
        </p>
      </div>

      {/* FAQ Items */}
      <div className="flex flex-col gap-3">
        {faqData.map((item, index) => {
          const isOpen = activeIndex === index;
          return (
            <div
              key={index}
              className={`group bg-white border rounded-[28px] cursor-pointer transition-all duration-500 overflow-hidden
                ${isOpen
                  ? 'border-[#FF5733]/25 shadow-[0_20px_50px_rgba(255,87,51,0.08)]'
                  : 'border-[#0A0A0A]/6 hover:border-[#0A0A0A]/12 hover:shadow-[0_8px_25px_rgba(0,0,0,0.05)]'
                }`}
              onClick={() => setActiveIndex(isOpen ? null : index)}
            >
              {/* Question row */}
              <div className="p-5 md:p-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500
                      ${isOpen
                        ? 'bg-[#FF5733]/10 scale-105'
                        : 'bg-[#0A0A0A]/3 group-hover:bg-[#FF5733]/8 group-hover:scale-105'
                      }`}
                  >
                    {item.icon}
                  </div>
                  <span
                    className={`text-base md:text-[17px] font-bold tracking-tight transition-colors duration-300
                      ${isOpen ? 'text-[#0A0A0A]' : 'text-[#0A0A0A]/80 group-hover:text-[#0A0A0A]'}`}
                  >
                    {item.question}
                  </span>
                </div>
                <div
                  className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center transition-all duration-500
                    ${isOpen
                      ? 'bg-[#FF5733] rotate-180'
                      : 'bg-[#0A0A0A]/5 group-hover:bg-[#0A0A0A]/8'
                    }`}
                >
                  <ChevronDown
                    size={16}
                    className={`transition-colors duration-300 ${isOpen ? 'text-white' : 'text-[#0A0A0A]/40'}`}
                  />
                </div>
              </div>

              {/* Answer — CSS grid trick for smooth height animation */}
              <div
                className={`grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                  ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-7 md:px-7 md:pb-8 pt-1 text-[15px] md:text-[16px] text-[#6B6B6B] leading-relaxed font-medium">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <p className="text-center text-[#6B6B6B] text-sm font-medium mt-10">
        Still have questions?{' '}
        <a href="mailto:hello@roommaps.in" className="text-[#FF5733] font-bold hover:underline">
          hello@roommaps.in
        </a>
      </p>
    </section>
  );
}
