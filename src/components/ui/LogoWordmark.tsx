import React from 'react';
import Link from 'next/link';

export default function LogoWordmark({ variant = 'nav', themeColor = 'var(--primary)', href = '/', className = '' }: any) {
  const isNav = variant === 'nav';

  return (
    <Link href={href} className={`${isNav ? 'flex items-center gap-3' : ''} group transition-all duration-500 ${className}`}>
      <div className="flex items-center gap-2.5">
        <div className={`relative overflow-hidden ${isNav ? 'w-10 h-10' : 'w-14 h-14'} rounded-[12px] group-hover:scale-105 transition-all`}>
          <img src="/roommaps-logo.png" alt="Logo" className="w-full h-full object-contain" />
        </div>
        <div className={`flex flex-col items-start leading-none ${isNav ? 'gap-0' : 'gap-1'}`}>
          <div className={`${isNav ? 'text-[24px]' : 'text-[25px]'} font-sans font-black tracking-tighter leading-none`}>
            <span className="text-[#0f172a]">Room</span>
            <span className="text-[#ff5211]">Maps</span>
          </div>
          {isNav && <span className="text-[7.5px] font-bold text-[#64748b] tracking-[0.15em] uppercase mt-0.5">Find Your Perfect Stay</span>}
        </div>
      </div>
    </Link>
  );
}
