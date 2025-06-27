// Pet image utilities
export const getPetImageUrl = (type: string, name: string) => {
  const imageApis = {
    dog: [
      "https://dog.ceo/api/breeds/image/random",
      "https://random.dog/woof.json",
      "https://api.thedogapi.com/v1/images/search",
    ],
    cat: [
      "https://api.thecatapi.com/v1/images/search",
      "https://cataas.com/cat?json=true",
      "https://aws.random.cat/meow",
    ],
  }

  // For demo purposes, we'll use placeholder images with pet-specific themes
  const placeholders = {
    dog: [
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400&h=300&fit=crop&crop=face",
    ],
    cat: [
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&h=300&fit=crop&crop=face",
    ],
    bird: [
      "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&h=300&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=400&h=300&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=center",
    ],
    rabbit: [
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=300&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop&crop=center",
    ],
  }

  // Get a consistent image based on pet name (so same pet always gets same image)
  const images = placeholders[type as keyof typeof placeholders] || placeholders.dog
  const index = name.length % images.length
  return images[index]
}

// Fallback image if main image fails to load
export const getFallbackImage = (type: string) => {
  const fallbacks = {
    dog: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=face",
    cat: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop&crop=face",
    bird: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&h=300&fit=crop&crop=center",
    rabbit: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=300&fit=crop&crop=center",
  }

  return fallbacks[type as keyof typeof fallbacks] || fallbacks.dog
}
