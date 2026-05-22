"use client";

import React, { useState, useMemo } from "react";
import { Plus, Search, MapPin, Building2, ListFilter, RefreshCw, Star, Edit3, Trash2, Phone } from "lucide-react";
import { Room } from "@/lib/types";

interface ListingsTabProps {
  rooms: Room[];
  loadingRooms: boolean;
  onAddListingClick: () => void;
  onEditListingClick: (room: Room) => void;
  onDeleteListingClick: (room: Room) => void;
  onToggleTrendingClick: (room: Room) => void;
}

export default function ListingsTab({
  rooms,
  loadingRooms,
  onAddListingClick,
  onEditListingClick,
  onDeleteListingClick,
  onToggleTrendingClick
}: ListingsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBhk, setSelectedBhk] = useState("all");

  // Unique cities derived from rooms
  const uniqueCities = useMemo(() => {
    const cities = new Set(rooms.map(r => r.city).filter(Boolean));
    return Array.from(cities);
  }, [rooms]);

  // Filtering Logic
  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesSearch = 
        room.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.owner?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.id?.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesCity = selectedCity === "all" || room.city?.toLowerCase() === selectedCity.toLowerCase();
      
      const matchesCategory = 
        selectedCategory === "all" || 
        room.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === "rent" && !room.category); // Default category fallback is rent
        
      const matchesBhk = selectedBhk === "all" || room.bhk?.toLowerCase() === selectedBhk.toLowerCase();
      
      return matchesSearch && matchesCity && matchesCategory && matchesBhk;
    });
  }, [rooms, searchTerm, selectedCity, selectedCategory, selectedBhk]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Toolbar & Filter drawer */}
      <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-[32px] p-6 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="font-black text-[20px] tracking-tight">Stay Inventory Databases</h2>
            <span className="text-[11px] opacity-50 font-medium">Manage and audit listing details, pricing, and statuses</span>
          </div>
          
          <button 
            onClick={onAddListingClick}
            className="h-12 px-6 bg-[#FF5211] text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all shadow-md shadow-orange-500/10 cursor-pointer"
          >
            <Plus size={16} />
            Add Listing
          </button>
        </div>

        {/* Filter and Search grid row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-35 text-slate-500" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search title, city or owner..."
              className="w-full h-12 pl-11 pr-4 rounded-2xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 text-xs font-bold placeholder:opacity-50 focus:outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2 px-4 rounded-2xl bg-[#F3F4F6] dark:bg-white/5 h-12">
            <MapPin size={14} className="opacity-40 text-slate-500" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-transparent border-none text-xs font-black capitalize outline-none cursor-pointer text-slate-700 dark:text-slate-300"
            >
              <option className="dark:bg-[#121214]" value="all">All Cities</option>
              {uniqueCities.map(city => (
                <option className="dark:bg-[#121214]" key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 px-4 rounded-2xl bg-[#F3F4F6] dark:bg-white/5 h-12">
            <Building2 size={14} className="opacity-40 text-slate-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-transparent border-none text-xs font-black outline-none cursor-pointer text-slate-700 dark:text-slate-300"
            >
              <option className="dark:bg-[#121214]" value="all">All Categories</option>
              <option className="dark:bg-[#121214]" value="rent">Rent / Flats</option>
              <option className="dark:bg-[#121214]" value="pg">PG / Coliving</option>
              <option className="dark:bg-[#121214]" value="stay">Stays</option>
            </select>
          </div>

          <div className="flex items-center gap-2 px-4 rounded-2xl bg-[#F3F4F6] dark:bg-white/5 h-12">
            <ListFilter size={14} className="opacity-40 text-slate-500" />
            <select
              value={selectedBhk}
              onChange={(e) => setSelectedBhk(e.target.value)}
              className="w-full bg-transparent border-none text-xs font-black outline-none cursor-pointer text-slate-700 dark:text-slate-300"
            >
              <option className="dark:bg-[#121214]" value="all">All Configurations</option>
              <option className="dark:bg-[#121214]" value="1 BHK">1 BHK</option>
              <option className="dark:bg-[#121214]" value="2 BHK">2 BHK</option>
              <option className="dark:bg-[#121214]" value="3 BHK">3 BHK</option>
              <option className="dark:bg-[#121214]" value="4 BHK+">4 BHK+</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table listing card container */}
      <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-[32px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#0A0A0A]/5 dark:border-white/10 bg-[#FAFAF8] dark:bg-white/[0.01]">
                <th className="py-4.5 px-6 text-[10px] font-black tracking-wider uppercase text-slate-500">Stay info</th>
                <th className="py-4.5 px-6 text-[10px] font-black tracking-wider uppercase text-slate-500">Location</th>
                <th className="py-4.5 px-6 text-[10px] font-black tracking-wider uppercase text-slate-500">Category</th>
                <th className="py-4.5 px-6 text-[10px] font-black tracking-wider uppercase text-slate-500">Rent price</th>
                <th className="py-4.5 px-6 text-[10px] font-black tracking-wider uppercase text-slate-500">Owner</th>
                <th className="py-4.5 px-6 text-[10px] font-black tracking-wider uppercase text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0A0A0A]/5 dark:divide-white/10">
              {loadingRooms ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col gap-2 items-center">
                      <RefreshCw className="animate-spin text-[#FF5211]" size={24} />
                      <span className="text-xs font-bold uppercase tracking-wider">Loading listings record database...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredRooms.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-black text-xs uppercase tracking-wide">
                    No listings match the filter settings.
                  </td>
                </tr>
              ) : (
                filteredRooms.map((room) => {
                  const imageSrc = room.image || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80";
                  const categoryName = room.category || "Rent";
                  const formattedPrice = room.rent?.toLocaleString("en-IN") || "—";
                  
                  return (
                    <tr key={room.id} className="hover:bg-[#FBFBFA] dark:hover:bg-white/[0.01] transition-colors">
                      
                      {/* Photo + Detail Cell */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-[#0A0A0A]/5 dark:border-white/10 shrink-0 bg-neutral-100">
                            <img src={imageSrc} alt={room.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="font-bold text-[14px] truncate max-w-[200px]">{room.name}</span>
                            <div className="flex items-center gap-2 text-[10px] font-black text-[#64748b] dark:text-[#94a3b8] uppercase">
                              <span>{room.bhk || "BHK Info"}</span>
                              <span>•</span>
                              <span>{room.furnished || "Unfurnished"}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Location Cell */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="font-bold text-xs capitalize">{room.city || "Chandigarh"}</span>
                          <span className="text-[10px] opacity-40 font-semibold truncate max-w-[150px]">{room.location || "Sector Area"}</span>
                        </div>
                      </td>

                      {/* Category badge */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          categoryName.toLowerCase().includes("pg") 
                            ? "bg-blue-500/10 text-blue-600" 
                            : categoryName.toLowerCase().includes("stay")
                              ? "bg-purple-500/10 text-purple-600"
                              : "bg-emerald-500/10 text-emerald-600"
                        }`}>
                          {categoryName}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-6 font-black text-[13px] text-[#0A0A0A] dark:text-white">
                        ₹{formattedPrice}
                      </td>

                      {/* Owner */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold">{room.owner || "Anonymous"}</span>
                          {room.phone && (
                            <span className="text-[10px] text-slate-500 flex items-center gap-1">
                              <Phone size={10} />
                              {room.phone}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions Button Cells */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            onClick={() => onToggleTrendingClick(room)}
                            title={room.isTrending ? "Mark Standard" : "Mark Trending"}
                            className={`p-2 rounded-xl border transition-all cursor-pointer ${
                              room.isTrending 
                                ? "bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20" 
                                : "bg-[#F3F4F6] dark:bg-white/5 border-transparent text-[#64748b] hover:text-[#FF5211]"
                            }`}
                          >
                            <Star size={14} fill={room.isTrending ? "currentColor" : "none"} />
                          </button>
                          <button
                            onClick={() => onEditListingClick(room)}
                            title="Edit stay Details"
                            className="p-2 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent hover:border-blue-500/20 text-[#64748b] hover:text-blue-500 transition-all cursor-pointer"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => onDeleteListingClick(room)}
                            title="Delete listing Stay"
                            className="p-2 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent hover:border-red-500/20 text-[#64748b] hover:text-red-500 transition-all cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
