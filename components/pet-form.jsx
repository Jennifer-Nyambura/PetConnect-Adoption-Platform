"use client"

import type React from "react"

import type { Pet } from "@/lib/supabase"

interface PetFormProps {
  pet?: Pet | null
  onClose: () => void
  onSubmit: (formData: FormData) => void
}

export default function PetForm({ pet, onClose, onSubmit }: PetFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">{pet ? "Edit Pet" : "Add New Pet"}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={pet?.name || ""}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">
                Type:
              </label>
              <select
                id="type"
                name="type"
                defaultValue={pet?.type || ""}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select type</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="rabbit">Rabbit</option>
              </select>
            </div>

            <div>
              <label htmlFor="breed" className="block text-sm font-semibold text-gray-700 mb-2">
                Breed:
              </label>
              <input
                type="text"
                id="breed"
                name="breed"
                defaultValue={pet?.breed || ""}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
                Age:
              </label>
              <input
                type="text"
                id="age"
                name="age"
                defaultValue={pet?.age || ""}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2">
                  Gender:
                </label>
                <select
                  id="gender"
                  name="gender"
                  defaultValue={pet?.gender || ""}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label htmlFor="size" className="block text-sm font-semibold text-gray-700 mb-2">
                  Size:
                </label>
                <select
                  id="size"
                  name="size"
                  defaultValue={pet?.size || ""}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select size</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description:
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={pet?.description || ""}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="image_url" className="block text-sm font-semibold text-gray-700 mb-2">
                Image URL:
              </label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                defaultValue={pet?.image_url || ""}
                placeholder="https://example.com/pet-image.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {pet ? "Update Pet" : "Add Pet"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
