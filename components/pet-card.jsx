"use client"

import type { Pet } from "@/lib/supabase"

interface PetCardProps {
  pet: Pet
  onView: () => void
  onEdit: () => void
  onDelete: () => void
  onToggleAdoption: () => void
}

export default function PetCard({ pet, onView, onEdit, onDelete, onToggleAdoption }: PetCardProps) {
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img
          src={pet.image_url || "/placeholder.svg?height=250&width=300"}
          alt={pet.name}
          className="w-full h-64 object-cover cursor-pointer"
          onClick={onView}
        />
        <div
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
            pet.adopted ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {pet.adopted ? "ADOPTED" : "AVAILABLE"}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{pet.name}</h3>
        <div className="text-gray-600 mb-3">
          {pet.breed} • {pet.age} • {capitalizeFirst(pet.gender)} • {capitalizeFirst(pet.size)}
        </div>
        <p className="text-gray-700 mb-4 leading-relaxed">{truncateText(pet.description, 100)}</p>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={onView}
            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            View Details
          </button>
          <button
            onClick={onEdit}
            className="flex-1 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onToggleAdoption}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
              pet.adopted ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {pet.adopted ? "Mark Available" : "Mark Adopted"}
          </button>
          <button
            onClick={onDelete}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
