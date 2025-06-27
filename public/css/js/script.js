// Global variables
let pets = []
let filteredPets = []
let currentEditingPet = null

// API base URL - adjust this to match your deployment
const API_BASE_URL = "/api"

// DOM elements
const petsGrid = document.getElementById("petsGrid")
const searchInput = document.getElementById("searchInput")
const typeFilter = document.getElementById("typeFilter")
const statusFilter = document.getElementById("statusFilter")
const loadingSpinner = document.getElementById("loadingSpinner")
const emptyState = document.getElementById("emptyState")
const petModal = document.getElementById("petModal")
const petFormModal = document.getElementById("petFormModal")
const petForm = document.getElementById("petForm")

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  setupEventListeners()
})

// Initialize the application
async function initializeApp() {
  try {
    showLoading(true)
    await loadPets()
    renderPets()
  } catch (error) {
    console.error("Failed to initialize app:", error)
    showToast("Failed to load pets. Please refresh the page.", "error")
  } finally {
    showLoading(false)
  }
}

// Setup event listeners
function setupEventListeners() {
  // Search and filter
  searchInput.addEventListener("input", debounce(handleSearch, 300))
  typeFilter.addEventListener("change", handleFilter)
  statusFilter.addEventListener("change", handleFilter)

  // Form submission
  petForm.addEventListener("submit", handleFormSubmit)

  // Modal close on outside click
  window.addEventListener("click", (event) => {
    if (event.target === petModal) {
      closePetModal()
    }
    if (event.target === petFormModal) {
      closePetFormModal()
    }
  })

  // Smooth scrolling for navigation
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// API Functions
async function loadPets() {
  try {
    const searchTerm = searchInput.value
    const type = typeFilter.value
    const adopted = statusFilter.value === "all" ? null : statusFilter.value === "adopted"

    const params = new URLSearchParams()
    if (searchTerm) params.append("search", searchTerm)
    if (type && type !== "all") params.append("type", type)
    if (adopted !== null) params.append("adopted", adopted.toString())

    const response = await fetch(`${API_BASE_URL}/pets?${params}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    pets = await response.json()
    filteredPets = [...pets]
    return pets
  } catch (error) {
    console.error("Error loading pets:", error)
    throw error
  }
}

async function createPet(petData) {
  try {
    const response = await fetch(`${API_BASE_URL}/pets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(petData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating pet:", error)
    throw error
  }
}

async function updatePet(id, petData) {
  try {
    const response = await fetch(`${API_BASE_URL}/pets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(petData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating pet:", error)
    throw error
  }
}

async function deletePet(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/pets/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error("Error deleting pet:", error)
    throw error
  }
}

// UI Functions
function showLoading(show) {
  loadingSpinner.style.display = show ? "block" : "none"
  petsGrid.style.display = show ? "none" : "grid"
}

function renderPets() {
  if (filteredPets.length === 0) {
    petsGrid.style.display = "none"
    emptyState.style.display = "block"
    return
  }

  emptyState.style.display = "none"
  petsGrid.style.display = "grid"

  petsGrid.innerHTML = filteredPets.map((pet) => createPetCard(pet)).join("")
}

function createPetCard(pet) {
  const adoptionFee = pet.adoption_fee ? `$${Number.parseFloat(pet.adoption_fee).toFixed(2)}` : "Contact for price"
  const imageUrl = pet.image_url || "/placeholder.svg?height=280&width=350"

  return `
        <div class="pet-card slide-up">
            <div class="pet-image-container">
                <img src="${imageUrl}" alt="${pet.name}" class="pet-image" onclick="openPetModal(${pet.id})">
                <div class="pet-status-badge ${pet.adopted ? "status-adopted" : "status-available"}">
                    ${pet.adopted ? "Adopted" : "Available"}
                </div>
            </div>
            <div class="pet-info">
                <h3 class="pet-name">${pet.name}</h3>
                <div class="pet-details">
                    ${pet.breed} • ${pet.age} • ${capitalizeFirst(pet.gender)} • ${capitalizeFirst(pet.size)}
                    ${pet.color ? ` • ${pet.color}` : ""}
                </div>
                <p class="pet-description">${truncateText(pet.description, 120)}</p>
                <div class="pet-price">Adoption Fee: ${adoptionFee}</div>
                <div class="pet-actions">
                    <button class="btn btn-primary" onclick="openPetModal(${pet.id})">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="btn btn-secondary" onclick="editPet(${pet.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn ${pet.adopted ? "btn-danger" : "btn-success"}" onclick="toggleAdoption(${pet.id})">
                        <i class="fas ${pet.adopted ? "fa-undo" : "fa-heart"}"></i>
                        ${pet.adopted ? "Mark Available" : "Mark Adopted"}
                    </button>
                    <button class="btn btn-danger" onclick="confirmDeletePet(${pet.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `
}

// Modal Functions
function openPetModal(petId) {
  const pet = pets.find((p) => p.id === petId)
  if (!pet) return

  const modalTitle = document.getElementById("petModalTitle")
  const modalBody = document.getElementById("petModalBody")

  modalTitle.textContent = `${pet.name} - Pet Details`

  const adoptionFee = pet.adoption_fee ? `$${Number.parseFloat(pet.adoption_fee).toFixed(2)}` : "Contact for price"
  const imageUrl = pet.image_url || "/placeholder.svg?height=300&width=600"

  modalBody.innerHTML = `
        <img src="${imageUrl}" alt="${pet.name}" class="pet-detail-image">
        <div class="pet-detail-header">
            <h3 class="pet-detail-name">${pet.name} ${pet.adopted ? "(Adopted)" : "(Available)"}</h3>
            <div class="pet-price">Adoption Fee: ${adoptionFee}</div>
        </div>
        
        <div class="pet-characteristics">
            <div class="characteristic">
                <div class="characteristic-label">Type</div>
                <div class="characteristic-value">${capitalizeFirst(pet.type)}</div>
            </div>
            <div class="characteristic">
                <div class="characteristic-label">Breed</div>
                <div class="characteristic-value">${pet.breed}</div>
            </div>
            <div class="characteristic">
                <div class="characteristic-label">Age</div>
                <div class="characteristic-value">${pet.age}</div>
            </div>
            <div class="characteristic">
                <div class="characteristic-label">Gender</div>
                <div class="characteristic-value">${capitalizeFirst(pet.gender)}</div>
            </div>
            <div class="characteristic">
                <div class="characteristic-label">Size</div>
                <div class="characteristic-value">${capitalizeFirst(pet.size)}</div>
            </div>
            ${
              pet.color
                ? `
                <div class="characteristic">
                    <div class="characteristic-label">Color</div>
                    <div class="characteristic-value">${pet.color}</div>
                </div>
            `
                : ""
            }
            ${
              pet.weight
                ? `
                <div class="characteristic">
                    <div class="characteristic-label">Weight</div>
                    <div class="characteristic-value">${pet.weight}</div>
                </div>
            `
                : ""
            }
        </div>
        
        <div class="pet-detail-section">
            <h4>Description</h4>
            <p>${pet.description}</p>
        </div>
        
        ${
          pet.personality
            ? `
            <div class="pet-detail-section">
                <h4>Personality</h4>
                <p>${pet.personality}</p>
            </div>
        `
            : ""
        }
        
        ${
          pet.medical_info
            ? `
            <div class="pet-detail-section">
                <h4>Medical Information</h4>
                <p>${pet.medical_info}</p>
            </div>
        `
            : ""
        }
        
        <div class="pet-actions" style="margin-top: 2rem;">
            <button class="btn btn-secondary" onclick="editPet(${pet.id}); closePetModal();">
                <i class="fas fa-edit"></i> Edit Pet
            </button>
            <button class="btn ${pet.adopted ? "btn-danger" : "btn-success"}" onclick="toggleAdoption(${pet.id}); closePetModal();">
                <i class="fas ${pet.adopted ? "fa-undo" : "fa-heart"}"></i>
                ${pet.adopted ? "Mark Available" : "Mark Adopted"}
            </button>
            <button class="btn btn-danger" onclick="confirmDeletePet(${pet.id}); closePetModal();">
                <i class="fas fa-trash"></i> Delete Pet
            </button>
        </div>
    `

  petModal.style.display = "block"
}

function closePetModal() {
  petModal.style.display = "none"
}

function openAddPetModal() {
  currentEditingPet = null
  document.getElementById("formModalTitle").textContent = "Add New Pet"
  petForm.reset()
  petFormModal.style.display = "block"
}

function closePetFormModal() {
  petFormModal.style.display = "none"
  currentEditingPet = null
  petForm.reset()
}

function editPet(petId) {
  const pet = pets.find((p) => p.id === petId)
  if (!pet) return

  currentEditingPet = pet
  document.getElementById("formModalTitle").textContent = "Edit Pet"

  // Populate form with pet data
  document.getElementById("petName").value = pet.name || ""
  document.getElementById("petType").value = pet.type || ""
  document.getElementById("petBreed").value = pet.breed || ""
  document.getElementById("petAge").value = pet.age || ""
  document.getElementById("petGender").value = pet.gender || ""
  document.getElementById("petSize").value = pet.size || ""
  document.getElementById("petColor").value = pet.color || ""
  document.getElementById("petWeight").value = pet.weight || ""
  document.getElementById("petDescription").value = pet.description || ""
  document.getElementById("petPersonality").value = pet.personality || ""
  document.getElementById("petMedicalInfo").value = pet.medical_info || ""
  document.getElementById("petAdoptionFee").value = pet.adoption_fee || ""
  document.getElementById("petImageUrl").value = pet.image_url || ""

  petFormModal.style.display = "block"
}

// Form handling
async function handleFormSubmit(event) {
  event.preventDefault()

  const formData = new FormData(event.target)
  const petData = {
    name: formData.get("name"),
    type: formData.get("type"),
    breed: formData.get("breed"),
    age: formData.get("age"),
    gender: formData.get("gender"),
    size: formData.get("size"),
    color: formData.get("color") || null,
    weight: formData.get("weight") || null,
    description: formData.get("description"),
    personality: formData.get("personality") || null,
    medical_info: formData.get("medical_info") || null,
    adoption_fee: formData.get("adoption_fee") ? Number.parseFloat(formData.get("adoption_fee")) : null,
    image_url: formData.get("image_url") || null,
  }

  try {
    showLoading(true)

    if (currentEditingPet) {
      // Update existing pet
      petData.adopted = currentEditingPet.adopted // Preserve adoption status
      await updatePet(currentEditingPet.id, petData)
      showToast("Pet updated successfully!", "success")
    } else {
      // Create new pet
      await createPet(petData)
      showToast("Pet added successfully!", "success")
    }

    await loadPets()
    renderPets()
    closePetFormModal()
  } catch (error) {
    console.error("Error saving pet:", error)
    showToast("Failed to save pet. Please try again.", "error")
  } finally {
    showLoading(false)
  }
}

// Pet actions
async function toggleAdoption(petId) {
  const pet = pets.find((p) => p.id === petId)
  if (!pet) return

  try {
    showLoading(true)

    const updatedData = {
      ...pet,
      adopted: !pet.adopted,
    }

    await updatePet(petId, updatedData)

    const action = pet.adopted ? "marked as available" : "marked as adopted"
    showToast(`${pet.name} has been ${action}!`, "success")

    await loadPets()
    renderPets()
  } catch (error) {
    console.error("Error toggling adoption status:", error)
    showToast("Failed to update adoption status. Please try again.", "error")
  } finally {
    showLoading(false)
  }
}

async function confirmDeletePet(petId) {
  const pet = pets.find((p) => p.id === petId)
  if (!pet) return

  if (confirm(`Are you sure you want to delete ${pet.name}? This action cannot be undone.`)) {
    try {
      showLoading(true)

      await deletePet(petId)
      showToast(`${pet.name} has been deleted.`, "success")

      await loadPets()
      renderPets()
    } catch (error) {
      console.error("Error deleting pet:", error)
      showToast("Failed to delete pet. Please try again.", "error")
    } finally {
      showLoading(false)
    }
  }
}

// Search and filter functions
async function handleSearch() {
  try {
    showLoading(true)
    await loadPets()
    renderPets()
  } catch (error) {
    console.error("Search failed:", error)
    showToast("Search failed. Please try again.", "error")
  } finally {
    showLoading(false)
  }
}

async function handleFilter() {
  try {
    showLoading(true)
    await loadPets()
    renderPets()
  } catch (error) {
    console.error("Filter failed:", error)
    showToast("Filter failed. Please try again.", "error")
  } finally {
    showLoading(false)
  }
}

// Utility functions
function capitalizeFirst(str) {
  if (!str) return ""
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function truncateText(text, maxLength) {
  if (!text) return ""
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
}

function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: "smooth" })
  }
}

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Toast notification system
function showToast(message, type = "success") {
  const toast = document.getElementById("toast")
  const toastIcon = toast.querySelector(".toast-icon")
  const toastMessage = toast.querySelector(".toast-message")

  // Set icon based on type
  const icons = {
    success: "fas fa-check-circle",
    error: "fas fa-exclamation-circle",
    warning: "fas fa-exclamation-triangle",
    info: "fas fa-info-circle",
  }

  toastIcon.className = `toast-icon ${icons[type] || icons.success}`
  toastMessage.textContent = message

  // Remove existing type classes and add new one
  toast.className = `toast ${type}`

  // Show toast
  toast.classList.add("show")

  // Hide toast after 4 seconds
  setTimeout(() => {
    toast.classList.remove("show")
  }, 4000)
}

// Mobile navigation toggle
function toggleMobileNav() {
  const navMenu = document.querySelector(".nav-menu")
  navMenu.classList.toggle("active")
}

// Add click event to nav toggle
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle")
  if (navToggle) {
    navToggle.addEventListener("click", toggleMobileNav)
  }
})

// Smooth scroll for anchor links
function smoothScroll(target) {
  const element = document.querySelector(target)
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
}

// Add loading states to buttons
function setButtonLoading(button, loading) {
  if (loading) {
    button.disabled = true
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...'
  } else {
    button.disabled = false
    // Restore original content - you might want to store this
  }
}

// Error handling for images
document.addEventListener("DOMContentLoaded", () => {
  // Handle image loading errors
  document.addEventListener(
    "error",
    (e) => {
      if (e.target.tagName === "IMG") {
        e.target.src = "/placeholder.svg?height=280&width=350"
      }
    },
    true,
  )
})

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // ESC key to close modals
  if (e.key === "Escape") {
    if (petModal.style.display === "block") {
      closePetModal()
    }
    if (petFormModal.style.display === "block") {
      closePetFormModal()
    }
  }

  // Ctrl/Cmd + K to focus search
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault()
    searchInput.focus()
  }
})

// Auto-refresh data every 5 minutes
setInterval(
  async () => {
    try {
      await loadPets()
      renderPets()
    } catch (error) {
      console.error("Auto-refresh failed:", error)
    }
  },
  5 * 60 * 1000,
)

// Service worker registration for offline support (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("ServiceWorker registration successful")
      })
      .catch((err) => {
        console.log("ServiceWorker registration failed")
      })
  })
}
