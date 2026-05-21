"use client";

import { useState, useEffect } from "react"
import {
  Phone,
  MapPin,
  User,
  Heart,
  BadgeIndianRupee,
  ChevronDown,
} from "lucide-react"
import ImageSlider from "@/components/ImageSlider"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Post } from "@/app/listing/page"
import { postRequest, deleteRequest } from "@/lib/apiCall"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

interface ListCardProps {
  post: Post;
  onFavoriteToggle?: (postId: string, isFavorited: boolean) => void;
}

const ListCard = ({ post, onFavoriteToggle }: ListCardProps) => {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);
  const isOwnPost = user && (
    (post.userId && (user.id === post.userId || user.uid === post.userId)) ||
    (post.createdByEmail && user.email === post.createdByEmail)
  );
  const [isFavorited, setIsFavorited] = useState(post.isFavorite || false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsFavorited(post.isFavorite || false);
  }, [post.isFavorite]);

  const formatRent = (rent: number) => {
    return new Intl.NumberFormat("en-IN").format(rent)
  }

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push(`/login?redirect=${window.location.pathname + window.location.search}`);
      return;
    }
    if (isOwnPost) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (isFavorited) {
        const res = await deleteRequest<{ success: boolean }>(`/post/removeFavorite/${post.id}`);
        if (res?.success) {
          setIsFavorited(false);
          if (onFavoriteToggle) onFavoriteToggle(post.id, false);
          router.refresh();
        }
      } else {
        const res = await postRequest<{ success: boolean }>(`/post/addFavorite/${post.id}`);
        if (res?.success) {
          setIsFavorited(true);
          if (onFavoriteToggle) onFavoriteToggle(post.id, true);
        }
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCardClick = () => {
    router.push(`/map?id=${post.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-sm border border-neutral-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* =========================================
          IMAGE
      ========================================= */}
      <div className="relative">
        <ImageSlider
          images={post.images}
          alt={post.name}
          className="h-[220px] sm:h-[250px] lg:h-[280px]"
        />

        {/* BADGES */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-20">
          <span className="bg-white/90 backdrop-blur-md text-black text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow">
            {post.type}
          </span>

          {post.isTrending && (
            <span className="bg-orange-500 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow">
              🔥 Trending
            </span>
          )}
        </div>

        {/* HEART */}
        {!isOwnPost && (
          <button 
            onClick={toggleFavorite}
            disabled={isSubmitting}
            className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-md p-2 rounded-full shadow hover:scale-110 transition-all disabled:opacity-50"
          >
            <Heart className={`w-4 h-4 transition-colors ${isFavorited ? "text-red-500 fill-red-500" : "text-gray-400"}`} />
          </button>
        )}

        {/* PRICE */}
        <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-md px-3 sm:px-4 py-2 rounded-2xl shadow-xl">
          <div className="flex items-center gap-1">
            <BadgeIndianRupee className="w-4 h-4 text-orange-500" />
            <span className="font-black text-base sm:text-lg text-neutral-900">
              {formatRent(post.rent)}
            </span>
            <span className="text-[10px] sm:text-xs text-neutral-500">
              /month
            </span>
          </div>
        </div>
      </div>

      {/* =========================================
          BODY
      ========================================= */}
      <div className="p-4 sm:p-5">
        {/* TITLE */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900 leading-tight line-clamp-1">
              {post.bhk} {post.type}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 line-clamp-1">
              {post.name}
            </p>
          </div>

          <div
            className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap ${
              post.availabilityStatus === "Available"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {post.availabilityStatus}
          </div>
        </div>

        {/* TAGS */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="px-3 py-1 text-[10px] sm:text-xs font-semibold rounded-full bg-orange-100 text-orange-600">
            {post.furnished}
          </span>
          <span className="px-3 py-1 text-[10px] sm:text-xs font-semibold rounded-full bg-blue-100 text-blue-600">
            {post.gender}
          </span>
          <span className="px-3 py-1 text-[10px] sm:text-xs font-semibold rounded-full bg-purple-100 text-purple-600">
            {post.city}
          </span>
        </div>

        {/* LOCATION */}
        <a
          href={
            post.lat && post.lng
              ? `https://www.google.com/maps/search/?api=1&query=${post.lat},${post.lng}`
              : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${post.name}, ${post.city}, ${post.state || ""}`
                )}`
          }
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2 mt-5 text-neutral-500 hover:text-orange-500 transition-colors w-fit group/loc"
        >
          <MapPin className="w-4 h-4 shrink-0 text-neutral-400 group-hover/loc:text-orange-500 transition-colors" />
          <span className="text-xs sm:text-sm line-clamp-1 underline decoration-dotted underline-offset-2">
            {post.city}, {post.state}
          </span>
        </a>

        {/* FOOTER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-5 pt-5 border-t border-neutral-100">
          {/* OWNER */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center shadow-lg shrink-0">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-neutral-400 font-medium">
                Property Owner
              </p>
              <p className="font-bold text-sm sm:text-base text-neutral-800 capitalize truncate">
                {post.owner}
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto">
            {/* GOOGLE MAPS LINK */}
            <a
              href={
                post.lat && post.lng
                  ? `https://www.google.com/maps/search/?api=1&query=${post.lat},${post.lng}`
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${post.name}, ${post.city}, ${post.state || ""}`
                    )}`
              }
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-[#FF5211] hover:text-orange-600 active:scale-95 font-extrabold text-sm transition-all"
            >
              <span>view on map</span>
              <ChevronDown className="w-4.5 h-4.5 text-[#FF5211] shrink-0" />
            </a>

            {/* CALL BUTTON */}
            <Link
              href={`tel:${post.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-2 bg-[#FF5211] hover:bg-orange-600 active:scale-95 text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-lg transition-all"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListCard
