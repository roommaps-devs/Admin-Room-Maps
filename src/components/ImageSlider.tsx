"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface ImageItem {
  url: string
}

interface ImageSliderProps {
  images: ImageItem[]
  alt: string
  className?: string
}

const ImageSlider = ({
  images,
  alt,
  className,
}: ImageSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const FULL_URL = process.env.NEXT_PUBLIC_IMAGE_URL || ""

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex(
      (prev) => (prev - 1 + images.length) % images.length
    )
  }

  if (!images || images.length === 0) {
    return (
      <div
        className={`bg-neutral-200 flex items-center justify-center ${className}`}
      >
        No Image
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden group ${className}`}>
      
      {/* IMAGE */}
      <Image
        src={`${FULL_URL}${images[currentIndex].url}`}
        alt={alt}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-700"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* BUTTONS */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* DOTS */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full ${
                  currentIndex === index
                    ? "w-5 bg-white"
                    : "w-2 bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default ImageSlider