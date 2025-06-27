"use client"

import type { Pet } from "@/lib/supabase"

interface PetModalProps {
  pet: Pet
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
  onToggleAdoption: () => void
}

export default function PetModal({ pet, onClose, onEdit, onDelete, onToggleAdoption }: PetModalProps) {
  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10 bg-white rounded-full w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>

          <img
            src={pet.image_url || "/placeholder.svg?height=300&width=600"}
            alt={pet.name}
            className="w-full h-80 object-cover rounded-t-xl"
          />
        </div>

        <div className="p-6">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            {pet.name} {pet.adopted ? "(Adopted)" : "(Available)"}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-sm font-semibold text-gray-600 uppercase mb-1">Type</div>
              <div className="text-lg text-gray-800">{capitalizeFirst(pet.type)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-sm font-semibold text-gray-600 uppercase mb-1">Breed</div>
              <div className="text-lg text-gray-800">{pet.breed}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-sm font-semibold text-gray-600 uppercase mb-1">Age</div>
              <div className="text-lg text-gray-800">{pet.age}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-sm font-semibold text-gray-600 uppercase mb-1">Gender</div>
              <div className="text-lg text-gray-800">{capitalizeFirst(pet.gender)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-sm font-semibold text-gray-600 uppercase mb-1">Size</div>
              <div className="text-lg text-gray-800">{capitalizeFirst(pet.size)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-sm font-semibold text-gray-600 uppercase mb-1">Status</div>
              <div className="text-lg text-gray-800">{pet.adopted ? "Adopted" : "Available"}</div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Description:</h4>
            <p className="text-gray-700 leading-relaxed">{pet.description}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onEdit}
              className="flex-1 bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Edit Pet
            </button>
            <button
              onClick={onToggleAdoption}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                pet.adopted ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {pet.adopted ? "Mark Available" : "Mark Adopted"}
            </button>
            <button
              onClick={onDelete}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Delete Pet
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
// This component is a modal for displaying pet details, allowing editing, adoption status toggling, and deletion.
