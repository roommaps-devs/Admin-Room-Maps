

"use client"

import { getRequest } from "@/lib/apiCall"
import { useEffect, useState } from "react"

import {
  Phone,
  MapPin,
  User,
  Heart,
  BadgeIndianRupee,
  ChevronDown,
} from "lucide-react"

import ImageSlider from "@/components/ImageSlider"
import PropertyFilters from "@/components/PropertyFilters"

/* =========================================================
   TYPES
========================================================= */

export interface PostImage {
  id?: string
  url: string
}

export interface Post {
  id: string
  name: string
  type: string
  rent: number
  owner: string
  phone: string
  furnished: string
  city: string
  state: string
  bhk: string
  gender: string
  isTrending: boolean
  availabilityStatus: string
  images: PostImage[]
}

export interface ApiResponse<T> {
  success: boolean
  statusCode: number
  message: string
  data: {
    posts: T
    totalPost: number
    totalPages: number
    currentPage: number
    pageLimit: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

/* =========================================================
   SKELETON LOADER CARD
========================================================= */

const SkeletonCard = () => (
  <div className="bg-white rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-sm border border-neutral-200 p-4 sm:p-5 flex flex-col h-full">
    {/* Image Skeleton */}
    <div className="w-full h-[220px] sm:h-[250px] lg:h-[280px] bg-neutral-100 animate-pulse rounded-2xl mb-4" />
    
    {/* Title & Badge */}
    <div className="flex justify-between items-start gap-4 mb-3">
      <div className="w-2/3">
        <div className="h-6 bg-neutral-100 animate-pulse rounded-lg w-full mb-2" />
        <div className="h-4 bg-neutral-100 animate-pulse rounded-lg w-3/4" />
      </div>
      <div className="w-16 h-6 bg-neutral-100 animate-pulse rounded-full animate-pulse" />
    </div>

    {/* Tags */}
    <div className="flex gap-2 my-4 flex-wrap">
      <div className="w-16 h-6 bg-neutral-100 animate-pulse rounded-full" />
      <div className="w-16 h-6 bg-neutral-100 animate-pulse rounded-full" />
      <div className="w-16 h-6 bg-neutral-100 animate-pulse rounded-full" />
    </div>

    {/* Location */}
    <div className="h-4 bg-neutral-100 animate-pulse rounded-lg w-1/2 mb-5" />

    {/* Footer */}
    <div className="flex items-center justify-between pt-5 border-t border-neutral-100 mt-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-neutral-100 animate-pulse" />
        <div>
          <div className="h-3 bg-neutral-100 animate-pulse rounded-md w-16 mb-1.5" />
          <div className="h-4 bg-neutral-100 animate-pulse rounded-md w-24" />
        </div>
      </div>
      <div className="w-24 h-10 bg-neutral-100 animate-pulse rounded-2xl" />
    </div>
  </div>
)

/* =========================================================
   PAGE
========================================================= */

const ListingPage = () => {

  /* =====================================================
     STATES
  ===================================================== */

  const [allPost, setAllPost] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [filters, setFilters] = useState({
    state: "",
    stateCode: "",
    city: "",
    bhk: "",
    furnished: "",
    gender: "",
    minPrice: "",
    maxPrice: "",
  })

  /* =====================================================
     FETCH POSTS
  ===================================================== */

  const getAllPost = async () => {
    try {

      setLoading(true)

      const params = new URLSearchParams()

      /* FILTERS */

      if (filters.state)
        params.append("state", filters.state)

      if (filters.city)
        params.append("city", filters.city)

      if (filters.bhk)
        params.append("bhk", filters.bhk)

      if (filters.gender)
        params.append("gender", filters.gender)

      if (filters.furnished)
        params.append("furnished", filters.furnished)

      if (filters.minPrice)
        params.append("minPrice", filters.minPrice)

      if (filters.maxPrice)
        params.append("maxPrice", filters.maxPrice)

      /* PAGINATION */

      params.append("page", currentPage.toString())
      params.append("limit", "9")

      const res = await getRequest(
        `/post/getAll?${params.toString()}`
      ) as ApiResponse<Post[]>

      if (res?.success) {

        setAllPost(res.data.posts)

        setTotalPages(res.data.totalPages)
      }

    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  /* =====================================================
     EFFECT
  ===================================================== */

  useEffect(() => {
    getAllPost()
  }, [filters, currentPage])

  /* =====================================================
     FORMAT RENT
  ===================================================== */

  const formatRent = (rent: number) => {
    return new Intl.NumberFormat("en-IN").format(rent)
  }

  /* =====================================================
     JSX
  ===================================================== */

  return (
    <div className="min-h-screen bg-[#fafafa] px-3 py-4 sm:px-5 sm:py-5 lg:px-8 xl:px-10">

      {/* MAIN LAYOUT */}
      <div className="flex flex-col xl:flex-row gap-5 lg:gap-6">

        {/* ===================================================
            FILTER SIDEBAR
        =================================================== */}

        <aside className="w-full xl:w-[320px] 2xl:w-[350px] shrink-0">

          {/* MOBILE FILTER */}
          <div className="xl:hidden">

            <details className="bg-white rounded-[28px] shadow-sm border border-neutral-200 overflow-hidden">

              <summary className="list-none cursor-pointer flex items-center justify-between px-5 py-4">

                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
                    Filters
                  </h2>

                  <p className="text-sm text-neutral-500 mt-1">
                    Refine your search
                  </p>
                </div>

                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <ChevronDown className="w-5 h-5 text-orange-500" />
                </div>
              </summary>

              <div className="p-4 sm:p-5 border-t border-neutral-100">

                <PropertyFilters
                  filters={filters}
                  setFilters={setFilters}
                />
              </div>
            </details>
          </div>

          {/* DESKTOP FILTER */}
          <div className="hidden xl:block sticky top-24">

            <PropertyFilters
              filters={filters}
              setFilters={setFilters}
            />
          </div>
        </aside>

        {/* ===================================================
            RIGHT CONTENT
        =================================================== */}

        <main className="flex-1 min-w-0">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-6 sm:mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>
              <h1 className="text-2xl sm:text-3xl xl:text-4xl font-black text-neutral-900 leading-tight">
                Explore Properties
              </h1>

              <p className="text-sm sm:text-base text-neutral-500 mt-1">
                Find your perfect stay near you
              </p>
            </div>

            <div className="bg-white border border-neutral-200 px-4 py-2 rounded-2xl shadow-sm w-fit">
              <span className="text-sm font-semibold text-neutral-700">
                {allPost.length} Listings
              </span>
            </div>
          </div>

          {/* =================================================
              GRID
          ================================================= */}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : allPost.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-[28px] p-10 text-center">
              <h2 className="text-2xl font-black text-neutral-900">
                No Property Found
              </h2>
              <p className="text-neutral-500 mt-2">
                Try changing your filters
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">

                {allPost.map((post) => (

                  <div
                    key={post.id}
                    className="group bg-white rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-sm border border-neutral-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
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
                      <button className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-md p-2 rounded-full shadow hover:scale-110 transition-all">
                        <Heart className="w-4 h-4 text-red-500" />
                      </button>

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
                      <div className="flex items-center gap-2 mt-5 text-neutral-500">

                        <MapPin className="w-4 h-4 shrink-0" />

                        <span className="text-xs sm:text-sm line-clamp-1">
                          {post.city}, {post.state}
                        </span>
                      </div>

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

                        {/* CALL BUTTON */}
                        <a
                          href={`tel:${post.phone}`}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-lg transition-all"
                        >
                          <Phone className="w-4 h-4" />
                          Call Now
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ===============================================
                  PAGINATION
              =============================================== */}

              <div className="flex items-center justify-center gap-3 mt-10 flex-wrap">

                {/* PREVIOUS */}
                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => prev - 1)
                  }
                  className={`px-5 py-3 rounded-2xl font-bold transition-all ${
                    currentPage === 1
                      ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
                >
                  Previous
                </button>

                {/* PAGE NUMBERS */}
                {Array.from({ length: totalPages }).map((_, index) => (

                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-12 h-12 rounded-2xl font-bold transition-all ${
                      currentPage === index + 1
                        ? "bg-orange-500 text-white"
                        : "bg-white border border-neutral-200 text-neutral-700 hover:bg-orange-50"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                {/* NEXT */}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => prev + 1)
                  }
                  className={`px-5 py-3 rounded-2xl font-bold transition-all ${
                    currentPage === totalPages
                      ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default ListingPage