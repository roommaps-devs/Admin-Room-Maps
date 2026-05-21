"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getRequest } from "@/lib/apiCall"
import { getCookie } from "cookies-next"
import { Post } from "@/app/listing/page"
import ListCard from "@/components/ListCard"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import {
  User, Mail, ShieldCheck, Home, Heart, Settings,
  MapPin, Calendar, ChevronRight, Building2, Bookmark,
} from "lucide-react"

/* =========================================================
   TYPES
========================================================= */

interface UserProfile {
  id: string
  email: string
  name: string
  image: string | null
  role: string
  createdAt: string
}

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) => (
  <div className="flex flex-col items-center gap-1.5 px-6 py-4 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm min-w-[90px]">
    <Icon className="w-4 h-4 text-white/70" />
    <span className="text-2xl font-black text-white leading-none">{value}</span>
    <span className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">{label}</span>
  </div>
)

/* =========================================================
   SKELETON CARD
========================================================= */

const SkeletonCard = () => (
  <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-100 p-4 flex flex-col gap-3">
    <Skeleton className="w-full h-52 rounded-2xl" />
    <Skeleton className="h-5 w-3/4 rounded-lg" />
    <Skeleton className="h-4 w-1/2 rounded-lg" />
    <div className="flex gap-2 pt-1">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  </div>
)

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  onAction,
  color = "orange",
}: {
  icon: React.ElementType
  title: string
  description: string
  action: string
  onAction: () => void
  color?: "orange" | "red"
}) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div className={cn(
      "w-24 h-24 rounded-[2rem] flex items-center justify-center mb-6",
      color === "orange" ? "bg-orange-50" : "bg-red-50"
    )}>
      <Icon className={cn("w-10 h-10", color === "orange" ? "text-orange-400" : "text-red-400")} />
    </div>
    <h3 className="text-xl font-black text-neutral-900 mb-2">{title}</h3>
    <p className="text-neutral-400 text-sm max-w-xs leading-relaxed mb-8">{description}</p>
    <Button
      onClick={onAction}
      className={cn(
        "rounded-2xl px-8 h-12 font-bold text-white shadow-lg",
        color === "orange"
          ? "bg-[#FF5211] hover:bg-orange-600 shadow-orange-200"
          : "bg-neutral-800 hover:bg-neutral-900"
      )}
    >
      {action}
    </Button>
  </div>
)

/* =========================================================
   PAGE
========================================================= */

type Tab = "listings" | "favorites"

export default function ProfilePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>("listings")
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [myListings, setMyListings] = useState<Post[]>([])
  const [favorites, setFavorites] = useState<Post[]>([])
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [loadingListings, setLoadingListings] = useState(true)
  const [loadingFavorites, setLoadingFavorites] = useState(true)

  const handleFavoriteToggle = (postId: string, isFavorited: boolean) => {
    if (!isFavorited) {
      setFavorites(prev => prev.filter(post => post.id !== postId));
    }
  };

  /* Fetchers */
  useEffect(() => {
    setMounted(true)
    
    // Immediate redirect if no token cookie exists
    const token = getCookie("drive_access_token") || getCookie("roommaps_auth")
    if (!token) {
      router.push("/login?redirect=/profile")
      return
    }

    const fetchProfile = async () => {
      try {
        const res = await getRequest<{ success: boolean; data: UserProfile }>("/user/profile")
        if (res?.success) {
          setProfile(res.data)
        } else {
          router.push("/login?redirect=/profile")
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error)
        router.push("/login?redirect=/profile")
      } finally {
        setLoadingProfile(false)
      }
    }
    const fetchMyListings = async () => {
      try {
        const res = await getRequest<{ success: boolean; data: any }>("/user/getUserPosts")
        if (res?.success) {
          const arr = Array.isArray(res.data) ? res.data : (res.data?.posts ?? [])
          setMyListings(arr)
        }
      } finally {
        setLoadingListings(false)
      }
    }
    const fetchFavorites = async () => {
      try {
        const res = await getRequest<{ success: boolean; data: any[] }>("/post/getFavorites")
        if (res?.success && Array.isArray(res.data)) {
          setFavorites(res.data.map(item => ({ ...item.post, isFavorite: true })))
        }
      } finally {
        setLoadingFavorites(false)
      }
    }
    fetchProfile()
    fetchMyListings()
    fetchFavorites()
  }, [router])

  /* Helpers */
  const initials = profile?.name
    ? profile.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "?"

  const joinedYear = profile?.createdAt
    ? new Date(profile.createdAt).getFullYear()
    : null

  const tabs: { id: Tab; label: string; icon: React.ElementType; count: number; loading: boolean }[] = [
    { id: "listings", label: "My Listings", icon: Building2, count: myListings.length, loading: loadingListings },
    { id: "favorites", label: "Saved", icon: Bookmark, count: favorites.length, loading: loadingFavorites },
  ]

  if (!mounted) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF5211]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">

      {/* ============================================================
          HERO
      ============================================================ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#FF5211] via-orange-500 to-orange-400">
        {/* Decorative blobs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-black/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.03] rounded-full pointer-events-none" />

        {/* Settings button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {}}
          className="absolute top-6 right-5 text-white/70 hover:text-white hover:bg-white/10 rounded-full w-10 h-10 z-10"
        >
          <Settings className="w-5 h-5" />
        </Button>

        <div className="relative max-w-3xl mx-auto px-5 pt-14 pb-28">
          {/* Avatar + name row */}
          <div className="flex flex-col items-center text-center gap-5">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-[1.75rem] bg-white/20 backdrop-blur-xl border-2 border-white/30 shadow-2xl overflow-hidden flex items-center justify-center">
                {profile?.image ? (
                  <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-black text-white">{initials}</span>
                )}
              </div>
              {/* Verified badge */}
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
                <ShieldCheck className="w-4 h-4 text-[#FF5211]" />
              </div>
            </div>

            {/* Name & meta */}
            {loadingProfile ? (
              <div className="flex flex-col items-center gap-2 w-full">
                <Skeleton className="h-8 w-48 bg-white/20 rounded-lg" />
                <Skeleton className="h-4 w-64 bg-white/10 rounded-full" />
              </div>
            ) : (
              <>
                <div>
                  <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight capitalize">
                    {profile?.name ?? "Guest User"}
                  </h1>
                  <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
                    <span className="flex items-center gap-1.5 text-white/75 text-sm font-medium">
                      <Mail className="w-3.5 h-3.5" />
                      {profile?.email}
                    </span>
                    {joinedYear && (
                      <span className="flex items-center gap-1.5 text-white/75 text-sm font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        Joined {joinedYear}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 bg-white/15 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                      <User className="w-3 h-3" />
                      {profile?.role ?? "USER"}
                    </span>
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex gap-3 flex-wrap justify-center mt-1">
                  <StatCard icon={Building2} label="Listings" value={loadingListings ? "—" : myListings.length} />
                  <StatCard icon={Heart} label="Saved" value={loadingFavorites ? "—" : favorites.length} />
                  <StatCard icon={MapPin} label="Cities" value={
                    loadingListings ? "—" :
                    new Set(myListings.map(p => p.city).filter(Boolean)).size || "0"
                  } />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================
          CONTENT CARD (floats up into hero)
      ============================================================ */}
      <div className="max-w-7xl mx-auto px-4 -mt-14 pb-24 relative z-10">
        <div className="bg-white rounded-[2rem] shadow-xl shadow-black/5 border border-neutral-100 overflow-hidden">

          {/* ---- TAB BAR ---- */}
          <div className="flex border-b border-neutral-100">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all relative",
                  activeTab === tab.id
                    ? "text-[#FF5211]"
                    : "text-neutral-400 hover:text-neutral-600"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {/* Count badge */}
                <span className={cn(
                  "text-[10px] font-black px-2 py-0.5 rounded-full transition-colors",
                  activeTab === tab.id
                    ? "bg-orange-100 text-[#FF5211]"
                    : "bg-neutral-100 text-neutral-500"
                )}>
                  {tab.loading ? "…" : tab.count}
                </span>
                {/* Active underline */}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5211] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* ---- LISTINGS TAB ---- */}
          {activeTab === "listings" && (
            <div className="p-5 md:p-8">
              {loadingListings ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : myListings.length === 0 ? (
                <EmptyState
                  icon={Home}
                  title="No listings yet"
                  description="You haven't posted any properties. Start listing to connect with thousands of seekers."
                  action="Post a Property"
                  onAction={() => router.push("/post")}
                  color="orange"
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {myListings.map(post => <ListCard key={post.id} post={post} />)}
                </div>
              )}
            </div>
          )}

          {/* ---- FAVORITES TAB ---- */}
          {activeTab === "favorites" && (
            <div className="p-5 md:p-8">
              {loadingFavorites ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : favorites.length === 0 ? (
                <EmptyState
                  icon={Heart}
                  title="Nothing saved yet"
                  description="Properties you favorite will appear here. Start exploring and save your top picks!"
                  action="Explore Properties"
                  onAction={() => router.push("/listing")}
                  color="red"
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {favorites.map(post => <ListCard key={post.id} post={post} onFavoriteToggle={handleFavoriteToggle} />)}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Quick links row */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            { icon: MapPin, label: "Explore on Map", href: "/map" },
            { icon: Settings, label: "Account Settings", href: "#" },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className="flex items-center justify-between gap-3 bg-white rounded-2xl px-5 py-4 border border-neutral-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center text-[#FF5211] group-hover:bg-orange-100 transition-colors">
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-neutral-700">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-[#FF5211] transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
