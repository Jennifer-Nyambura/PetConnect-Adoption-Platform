import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// Mock data storage (in a real app, this would be in a database or cache)
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

// GET - Fetch a single pet by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const petId = Number.parseInt(params.id)

    if (!isSupabaseConfigured()) {
      // Use mock data when Supabase isn't configured
      const pet = mockPets.find((p) => p.id === petId)
      if (!pet) {
        return NextResponse.json({ error: "Pet not found" }, { status: 404 })
      }
      return NextResponse.json(pet)
    }

    const { data, error } = await supabase.from("pets").select("*").eq("id", params.id).single()

    if (error) {
      console.error("Error fetching pet:", error)
      return NextResponse.json({ error: "Pet not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Update a pet
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const petId = Number.parseInt(params.id)

    if (!isSupabaseConfigured()) {
      // Use mock data when Supabase isn't configured
      const petIndex = mockPets.findIndex((p) => p.id === petId)
      if (petIndex === -1) {
        return NextResponse.json({ error: "Pet not found" }, { status: 404 })
      }

      mockPets[petIndex] = {
        ...mockPets[petIndex],
        ...body,
        updated_at: new Date().toISOString(),
      }

      return NextResponse.json(mockPets[petIndex])
    }

    const { data, error } = await supabase
      .from("pets")
      .update({
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
        image_url: body.image_url,
        adopted: body.adopted,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()

    if (error) {
      console.error("Error updating pet:", error)
      return NextResponse.json({ error: "Failed to update pet" }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Pet not found" }, { status: 404 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete a pet
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const petId = Number.parseInt(params.id)

    if (!isSupabaseConfigured()) {
      // Use mock data when Supabase isn't configured
      const petIndex = mockPets.findIndex((p) => p.id === petId)
      if (petIndex === -1) {
        return NextResponse.json({ error: "Pet not found" }, { status: 404 })
      }

      mockPets.splice(petIndex, 1)
      return NextResponse.json({ message: "Pet deleted successfully" })
    }

    const { error } = await supabase.from("pets").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting pet:", error)
      return NextResponse.json({ error: "Failed to delete pet" }, { status: 500 })
    }

    return NextResponse.json({ message: "Pet deleted successfully" })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
