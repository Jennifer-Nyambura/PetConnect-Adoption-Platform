import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

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

// Check if Supabase is properly configured
function isSupabaseConfigured() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co" &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "placeholder-key"
  )
}

// GET - Fetch all pets with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const type = searchParams.get("type")
    const adopted = searchParams.get("adopted")

    if (!isSupabaseConfigured()) {
      // Use mock data when Supabase isn't configured
      let filteredPets = [...mockPets]

      // Apply filters to mock data
      if (search) {
        const searchLower = search.toLowerCase()
        filteredPets = filteredPets.filter(
          (pet) =>
            pet.name.toLowerCase().includes(searchLower) ||
            pet.breed.toLowerCase().includes(searchLower) ||
            pet.description.toLowerCase().includes(searchLower),
        )
      }

      if (type && type !== "all") {
        filteredPets = filteredPets.filter((pet) => pet.type === type)
      }

      if (adopted !== null && adopted !== undefined) {
        filteredPets = filteredPets.filter((pet) => pet.adopted === (adopted === "true"))
      }

      return NextResponse.json(filteredPets)
    }

    let query = supabase.from("pets").select("*").order("created_at", { ascending: false })

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,breed.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (type && type !== "all") {
      query = query.eq("type", type)
    }

    if (adopted !== null && adopted !== undefined) {
      query = query.eq("adopted", adopted === "true")
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching pets:", error)
      return NextResponse.json({ error: "Failed to fetch pets" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create a new pet
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!isSupabaseConfigured()) {
      // Mock response when Supabase isn't configured
      const newPet = {
        id: Date.now(),
        ...body,
        image_url: body.image_url || "/placeholder.svg?height=300&width=400",
        adopted: false,
        available_date: new Date().toISOString().split("T")[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockPets.unshift(newPet)
      return NextResponse.json(newPet, { status: 201 })
    }

    const { data, error } = await supabase
      .from("pets")
      .insert([
        {
          name: body.name,
          type: body.type,
          breed: body.breed,
          age: body.age,
          gender: body.gender,
          size: body.size,
          color: body.color,
          weight: body.weight,
          description: body.description,
          personality: body.personality,
          medical_info: body.medical_info,
          adoption_fee: body.adoption_fee,
          image_url: body.image_url || "/placeholder.svg?height=300&width=400",
        },
      ])
      .select()

    if (error) {
      console.error("Error creating pet:", error)
      return NextResponse.json({ error: "Failed to create pet" }, { status: 500 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
