"use server"

import { supabase } from "./supabase"
import { revalidatePath } from "next/cache"

export async function getPets() {
  const { data, error } = await supabase.from("pets").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching pets:", error)
    throw new Error("Failed to fetch pets")
  }

  return data
}

export async function getPetById(id: number) {
  const { data, error } = await supabase.from("pets").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching pet:", error)
    throw new Error("Failed to fetch pet")
  }

  return data
}

export async function createPet(formData: FormData) {
  const petData = {
    name: formData.get("name") as string,
    type: formData.get("type") as string,
    breed: formData.get("breed") as string,
    age: formData.get("age") as string,
    gender: formData.get("gender") as string,
    size: formData.get("size") as string,
    description: formData.get("description") as string,
    image_url: (formData.get("image_url") as string) || "/placeholder.svg?height=250&width=300",
  }

  const { data, error } = await supabase.from("pets").insert([petData]).select()

  if (error) {
    console.error("Error creating pet:", error)
    throw new Error("Failed to create pet")
  }

  revalidatePath("/")
  return data[0]
}

export async function updatePet(id: number, formData: FormData) {
  const petData = {
    name: formData.get("name") as string,
    type: formData.get("type") as string,
    breed: formData.get("breed") as string,
    age: formData.get("age") as string,
    gender: formData.get("gender") as string,
    size: formData.get("size") as string,
    description: formData.get("description") as string,
    image_url: (formData.get("image_url") as string) || "/placeholder.svg?height=250&width=300",
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("pets").update(petData).eq("id", id).select()

  if (error) {
    console.error("Error updating pet:", error)
    throw new Error("Failed to update pet")
  }

  revalidatePath("/")
  return data[0]
}

export async function deletePet(id: number) {
  const { error } = await supabase.from("pets").delete().eq("id", id)

  if (error) {
    console.error("Error deleting pet:", error)
    throw new Error("Failed to delete pet")
  }

  revalidatePath("/")
}

export async function toggleAdoption(id: number, adopted: boolean) {
  const { data, error } = await supabase
    .from("pets")
    .update({
      adopted: !adopted,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error toggling adoption:", error)
    throw new Error("Failed to update adoption status")
  }

  revalidatePath("/")
  return data[0]
}

export async function searchPets(searchTerm: string, filterType: string) {
  let query = supabase.from("pets").select("*").order("created_at", { ascending: false })

  if (searchTerm) {
    query = query.or(`name.ilike.%${searchTerm}%,breed.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
  }

  if (filterType && filterType !== "all") {
    query = query.eq("type", filterType)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error searching pets:", error)
    throw new Error("Failed to search pets")
  }

  return data
}
