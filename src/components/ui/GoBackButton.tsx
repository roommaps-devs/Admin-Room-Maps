'use client';

import { ArrowLeft } from 'lucide-react';

export default function GoBackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[#0A0A0A]/30 text-sm font-medium hover:text-[#0A0A0A]/60 transition-colors cursor-pointer border-none bg-transparent"
    >
      <ArrowLeft size={14} />
      Go back
    </button>
  );
}
