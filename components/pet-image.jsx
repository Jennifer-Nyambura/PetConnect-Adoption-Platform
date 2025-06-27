"use client"

import { useState } from "react"
import { getPetImageUrl, getFallbackImage } from "@/lib/pet-images"

interface PetImageProps {
  pet: {
    name: string
    type: string
    image_url?: string | null
  }
  className?: string
  onClick?: () => void
}

export default function PetImage({ pet, className = "", onClick }: PetImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Determine which image to use
  const getImageSrc = () => {
    if (imageError) {
      return getFallbackImage(pet.type)
    }

    if (pet.image_url && pet.image_url !== "/placeholder.svg?height=250&width=300") {
      return pet.image_url
    }

    return getPetImageUrl(pet.type, pet.name)
  }

  const handleImageError = () => {
    setImageError(true)
    setIsLoading(false)
  }

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      )}

      <img
        src={getImageSrc() || "/placeholder.svg"}
        alt={`${pet.name} - ${pet.type}`}
        className={`w-full h-full object-cover transition-all duration-300 hover:scale-105 ${onClick ? "cursor-pointer" : ""}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        onClick={onClick}
        loading="lazy"
      />

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </div>
  )
}
