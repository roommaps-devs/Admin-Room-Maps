"use client";

import React, { useMemo } from "react";
import { Room } from "@/lib/types";

interface AnalyticsTabProps {
  rooms: Room[];
}

export default function AnalyticsTab({ rooms }: AnalyticsTabProps) {
  // Analytics Math (City Distribution)
  const cityAnalytics = useMemo(() => {
    const counts: Record<string, number> = {};
    rooms.forEach(r => {
      const city = r.city || "Other";
      counts[city] = (counts[city] || 0) + 1;
    });
    
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // top 5 cities
  }, [rooms]);

  // Analytics Math (Category split)
  const categoryAnalytics = useMemo(() => {
    let rent = 0;
    let pg = 0;
    let other = 0;
    
    rooms.forEach(r => {
      const cat = r.category?.toLowerCase() || "rent";
      if (cat.includes("rent")) rent++;
      else if (cat.includes("pg") || cat.includes("stay") || cat.includes("hostel")) pg++;
      else other++;
    });
    
    const total = rooms.length || 1;
    return [
      { name: "Rent / Flat", count: rent, pct: Math.round((rent / total) * 100) },
      { name: "PG / Coliving", count: pg, pct: Math.round((pg / total) * 100) },
      { name: "Shared / Other", count: other, pct: Math.round((other / total) * 100) }
    ];
  }, [rooms]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
      
      {/* Graphical distribution card */}
      <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-[32px] p-6 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="font-black text-lg">Top Cities Distribution</h3>
          <span className="text-[11px] opacity-50 font-medium">Room count records categorized by municipality areas</span>
        </div>
        
        <div className="flex flex-col gap-5 py-6">
          {cityAnalytics.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 font-bold">No city records found.</div>
          ) : (
            cityAnalytics.map((item, idx) => {
              const maxVal = cityAnalytics[0]?.value || 1;
              const pct = Math.round((item.value / maxVal) * 100);
              
              return (
                <div key={item.name} className="flex items-center gap-4">
                  <span className="w-24 text-xs font-bold truncate capitalize">{item.name}</span>
                  <div className="flex-1 h-4 bg-[#F3F4F6] dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#FF5211] rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-xs font-black">{item.value}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Category distribution pie card */}
      <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-[32px] p-6 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="font-black text-lg">Category Split Summary</h3>
          <span className="text-[11px] opacity-50 font-medium">Proportion of flat rents vs coliving stay list types</span>
        </div>

        <div className="flex flex-col gap-5 py-4">
          {categoryAnalytics.map((cat, idx) => {
            const gradients = [
              "from-emerald-500 to-teal-400",
              "from-blue-500 to-indigo-400",
              "from-purple-500 to-rose-400"
            ];
            const grad = gradients[idx % gradients.length];
            
            return (
              <div key={cat.name} className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>{cat.name}</span>
                  <span>{cat.count} listings ({cat.pct}%)</span>
                </div>
                <div className="w-full h-3.5 bg-[#F3F4F6] dark:bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${grad} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
