import PetAdoptionApp from "@/components/pet-adoption-app"
import ConfigNotice from "@/components/config-notice"

// Mock data for when Supabase isn't configured
const mockPets = [
  {
    id: 1,
    name: "Buddy",
    type: "dog",
    breed: "Golden Retriever",
    age: "3 years",
    gender: "male",
    size: "large",
    color: "Golden",
    weight: "65 lbs",
    description:
      "Buddy is a friendly and energetic Golden Retriever who loves playing fetch and swimming. He's great with kids and other dogs!",
    personality: "Friendly, Energetic, Loyal, Good with kids",
    medical_info: "Up to date on vaccinations, neutered, microchipped",
    adoption_fee: 250.0,
    image_url: "/placeholder.svg?height=300&width=400",
    adopted: false,
    available_date: new Date().toISOString().split("T")[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Luna",
    type: "cat",
    breed: "Persian",
    age: "2 years",
    gender: "female",
    size: "medium",
    color: "White",
    weight: "8 lbs",
    description:
      "Luna is a beautiful Persian cat with a calm and gentle personality. She loves to be pampered and enjoys quiet afternoons.",
    personality: "Calm, Gentle, Affectionate, Indoor cat",
    medical_info: "Spayed, vaccinated, litter trained",
    adoption_fee: 150.0,
    image_url: "/placeholder.svg?height=300&width=400",
    adopted: false,
    available_date: new Date().toISOString().split("T")[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Charlie",
    type: "dog",
    breed: "Beagle",
    age: "5 years",
    gender: "male",
    size: "medium",
    color: "Tri-color",
    weight: "30 lbs",
    description:
      "Charlie is a loyal Beagle with a great nose for adventure. He's well-trained and perfect for an active family.",
    personality: "Loyal, Active, Well-trained, Good with children",
    medical_info: "Neutered, vaccinated, heartworm negative",
    adoption_fee: 200.0,
    image_url: "/placeholder.svg?height=300&width=400",
    adopted: true,
    available_date: "2024-01-15",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Bella",
    type: "cat",
    breed: "Siamese",
    age: "1 year",
    gender: "female",
    size: "small",
    color: "Seal Point",
    weight: "6 lbs",
    description:
      "Bella is a playful Siamese kitten who loves toys and attention. She's very social and would do well in a loving home.",
    personality: "Playful, Social, Intelligent, Vocal",
    medical_info: "Spayed, vaccinated, microchipped",
    adoption_fee: 175.0,
    image_url: "/placeholder.svg?height=300&width=400",
    adopted: false,
    available_date: new Date().toISOString().split("T")[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Max",
    type: "dog",
    breed: "German Shepherd",
    age: "4 years",
    gender: "male",
    size: "large",
    color: "Black and Tan",
    weight: "75 lbs",
    description:
      "Max is a protective and intelligent German Shepherd. He's well-trained and would make an excellent guard dog and companion.",
    personality: "Protective, Intelligent, Loyal, Well-trained",
    medical_info: "Neutered, vaccinated, obedience trained",
    adoption_fee: 300.0,
    image_url: "/placeholder.svg?height=300&width=400",
    adopted: false,
    available_date: new Date().toISOString().split("T")[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export default async function Home() {
  return (
    <div>
      <ConfigNotice />
      <PetAdoptionApp initialPets={mockPets} />
    </div>
  )
}
