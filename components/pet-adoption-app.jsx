"use client"

import { useState, useEffect } from "react"
import type { Pet } from "@/lib/supabase"
import { searchPets, deletePet, toggleAdoption, createPet, updatePet } from "@/lib/actions"
import PetCard from "./pet-card"
import PetModal from "./pet-modal"
import PetForm from "./pet-form"

interface PetAdoptionAppProps {
  initialPets: Pet[]
}

export default function PetAdoptionApp({ initialPets }: PetAdoptionAppProps) {
  const [pets, setPets] = useState<Pet[]>(initialPets)
  const [filteredPets, setFilteredPets] = useState<Pet[]>(initialPets)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [showPetModal, setShowPetModal] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingPet, setEditingPet] = useState<Pet | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    handleSearch()
  }, [searchTerm, filterType])

  const handleSearch = async () => {
    setLoading(true)
    try {
      const results = await searchPets(searchTerm, filterType)
      setFilteredPets(results)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePet = async (id: number) => {
    if (confirm("Are you sure you want to delete this pet?")) {
      try {
        await deletePet(id)
        const updatedPets = pets.filter((pet) => pet.id !== id)
        setPets(updatedPets)
        setFilteredPets(
          updatedPets.filter(
            (pet) =>
              (filterType === "all" || pet.type === filterType) &&
              (searchTerm === "" ||
                pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pet.description.toLowerCase().includes(searchTerm.toLowerCase())),
          ),
        )
      } catch (error) {
        alert("Failed to delete pet")
      }
    }
  }

  const handleToggleAdoption = async (pet: Pet) => {
    try {
      const updatedPet = await toggleAdoption(pet.id, pet.adopted)
      const updatedPets = pets.map((p) => (p.id === pet.id ? updatedPet : p))
      setPets(updatedPets)
      setFilteredPets(
        updatedPets.filter(
          (pet) =>
            (filterType === "all" || pet.type === filterType) &&
            (searchTerm === "" ||
              pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
              pet.description.toLowerCase().includes(searchTerm.toLowerCase())),
        ),
      )
    } catch (error) {
      alert("Failed to update adoption status")
    }
  }

  const handleFormSubmit = async (formData: FormData) => {
    try {
      let updatedPet: Pet

      if (editingPet) {
        updatedPet = await updatePet(editingPet.id, formData)
        const updatedPets = pets.map((p) => (p.id === editingPet.id ? updatedPet : p))
        setPets(updatedPets)
      } else {
        updatedPet = await createPet(formData)
        const updatedPets = [updatedPet, ...pets]
        setPets(updatedPets)
      }

      handleSearch()
      setShowFormModal(false)
      setEditingPet(null)
    } catch (error) {
      alert("Failed to save pet")
    }
  }

  const openPetModal = (pet: Pet) => {
    setSelectedPet(pet)
    setShowPetModal(true)
  }

  const openFormModal = (pet?: Pet) => {
    setEditingPet(pet || null)
    setShowFormModal(true)
  }

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">🐾 PawConnect</h1>
            <nav className="hidden md:flex space-x-6">
              <button onClick={() => scrollToSection("home")} className="hover:text-purple-200 transition-colors">
                Home
              </button>
              <button onClick={() => scrollToSection("pets")} className="hover:text-purple-200 transition-colors">
                Pets
              </button>
              <a href="#about" className="hover:text-purple-200 transition-colors">
                About
              </a>
              <a href="#contact" className="hover:text-purple-200 transition-colors">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-4">Find Your Perfect Companion</h2>
          <p className="text-xl mb-8 opacity-90">Connect with loving pets looking for their forever homes</p>
          <button
            onClick={() => scrollToSection("pets")}
            className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
          >
            Browse Pets
          </button>
        </div>
      </section>

      {/* Pets Section */}
      <section id="pets" className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-4xl font-bold text-gray-800">Available Pets</h2>
            <div className="flex flex-wrap gap-4 items-center">
              <input
                type="text"
                placeholder="Search pets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Pets</option>
                <option value="dog">Dogs</option>
                <option value="cat">Cats</option>
                <option value="bird">Birds</option>
                <option value="rabbit">Rabbits</option>
              </select>
              <button
                onClick={() => openFormModal()}
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Add New Pet
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredPets.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">No pets found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  onView={() => openPetModal(pet)}
                  onEdit={() => openFormModal(pet)}
                  onDelete={() => handleDeletePet(pet.id)}
                  onToggleAdoption={() => handleToggleAdoption(pet)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-xl font-semibold mb-4 text-teal-400">PawConnect</h4>
              <p className="text-gray-300">Connecting hearts with paws since 2024</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4 text-teal-400">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection("home")}
                    className="text-gray-300 hover:text-teal-400 transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("pets")}
                    className="text-gray-300 hover:text-teal-400 transition-colors"
                  >
                    Adopt
                  </button>
                </li>
                <li>
                  <a href="#about" className="text-gray-300 hover:text-teal-400 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-300 hover:text-teal-400 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4 text-teal-400">Contact Info</h4>
              <p className="text-gray-300">📧 info@pawconnect.com</p>
              <p className="text-gray-300">📞 (555) 123-4567</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 PawConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showPetModal && selectedPet && (
        <PetModal
          pet={selectedPet}
          onClose={() => setShowPetModal(false)}
          onEdit={() => {
            setShowPetModal(false)
            openFormModal(selectedPet)
          }}
          onDelete={() => {
            setShowPetModal(false)
            handleDeletePet(selectedPet.id)
          }}
          onToggleAdoption={() => {
            handleToggleAdoption(selectedPet)
            setShowPetModal(false)
          }}
        />
      )}

      {showFormModal && (
        <PetForm
          pet={editingPet}
          onClose={() => {
            setShowFormModal(false)
            setEditingPet(null)
          }}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  )
}
