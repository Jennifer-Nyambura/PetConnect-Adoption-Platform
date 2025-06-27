// Pet data storage
let pets = []
let currentEditingId = null

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  loadSampleData()
  renderPets()
  setupEventListeners()
})

// Sample data for demonstration
function loadSampleData() {
  const samplePets = [
    {
      id: 1,
      name: "Buddy",
      type: "dog",
      breed: "Golden Retriever",
      age: "3 years",
      gender: "male",
      size: "large",
      description:
        "Buddy is a friendly and energetic Golden Retriever who loves playing fetch and swimming. He's great with kids and other dogs!",
      image: "/placeholder.svg?height=250&width=300",
      adopted: false,
      dateAdded: new Date().toISOString(),
    },
    {
      id: 2,
      name: "Luna",
      type: "cat",
      breed: "Persian",
      age: "2 years",
      gender: "female",
      size: "medium",
      description:
        "Luna is a beautiful Persian cat with a calm and gentle personality. She loves to be pampered and enjoys quiet afternoons.",
      image: "/placeholder.svg?height=250&width=300",
      adopted: false,
      dateAdded: new Date().toISOString(),
    },
    {
      id: 3,
      name: "Charlie",
      type: "dog",
      breed: "Beagle",
      age: "5 years",
      gender: "male",
      size: "medium",
      description:
        "Charlie is a loyal Beagle with a great nose for adventure. He's well-trained and perfect for an active family.",
      image: "/placeholder.svg?height=250&width=300",
      adopted: true,
      dateAdded: new Date().toISOString(),
    },
    {
      id: 4,
      name: "Bella",
      type: "cat",
      breed: "Siamese",
      age: "1 year",
      gender: "female",
      size: "small",
      description:
        "Bella is a playful Siamese kitten who loves toys and attention. She's very social and would do well in a loving home.",
      image: "/placeholder.svg?height=250&width=300",
      adopted: false,
      dateAdded: new Date().toISOString(),
    },
    {
      id: 5,
      name: "Max",
      type: "dog",
      breed: "German Shepherd",
      age: "4 years",
      gender: "male",
      size: "large",
      description:
        "Max is a protective and intelligent German Shepherd. He's well-trained and would make an excellent guard dog and companion.",
      image: "/placeholder.svg?height=250&width=300",
      adopted: false,
      dateAdded: new Date().toISOString(),
    },
    {
      id: 6,
      name: "Tweety",
      type: "bird",
      breed: "Canary",
      age: "6 months",
      gender: "female",
      size: "small",
      description:
        "Tweety is a cheerful canary with a beautiful singing voice. She's perfect for someone who enjoys the company of birds.",
      image: "/placeholder.svg?height=250&width=300",
      adopted: false,
      dateAdded: new Date().toISOString(),
    },
  ]

  // Load from localStorage or use sample data
  const savedPets = localStorage.getItem("pawconnect-pets")
  if (savedPets) {
    pets = JSON.parse(savedPets)
  } else {
    pets = samplePets
    savePets()
  }
}

// Save pets to localStorage
function savePets() {
  localStorage.setItem("pawconnect-pets", JSON.stringify(pets))
}

// Setup event listeners
function setupEventListeners() {
  // Search functionality
  document.getElementById("searchInput").addEventListener("input", handleSearch)

  // Filter functionality
  document.getElementById("filterSelect").addEventListener("change", handleFilter)

  // Form submission
  document.getElementById("petForm").addEventListener("submit", handleFormSubmit)

  // Modal close on outside click
  window.addEventListener("click", (event) => {
    const petModal = document.getElementById("petModal")
    const addPetModal = document.getElementById("addPetModal")

    if (event.target === petModal) {
      closePetModal()
    }
    if (event.target === addPetModal) {
      closeAddPetModal()
    }
  })
}

// Render pets grid
function renderPets(petsToRender = pets) {
  const petsGrid = document.getElementById("petsGrid")

  if (petsToRender.length === 0) {
    petsGrid.innerHTML = `
            <div class="empty-state">
                <h3>No pets found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `
    return
  }

  petsGrid.innerHTML = petsToRender
    .map(
      (pet) => `
        <div class="pet-card">
            <img src="${pet.image}" alt="${pet.name}" class="pet-image" onclick="openPetModal(${pet.id})">
            <div class="${pet.adopted ? "adopted-badge" : "available-badge"}">
                ${pet.adopted ? "Adopted" : "Available"}
            </div>
            <div class="pet-info">
                <h3 class="pet-name">${pet.name}</h3>
                <div class="pet-details">
                    ${pet.breed} • ${pet.age} • ${capitalizeFirst(pet.gender)} • ${capitalizeFirst(pet.size)}
                </div>
                <p class="pet-description">${truncateText(pet.description, 100)}</p>
                <div class="pet-actions">
                    <button class="btn btn-primary" onclick="openPetModal(${pet.id})">View Details</button>
                    <button class="btn btn-secondary" onclick="editPet(${pet.id})">Edit</button>
                    <button class="btn ${pet.adopted ? "btn-danger" : "btn-success"}" onclick="toggleAdoption(${pet.id})">
                        ${pet.adopted ? "Mark Available" : "Mark Adopted"}
                    </button>
                    <button class="btn btn-danger" onclick="deletePet(${pet.id})">Delete</button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

// Search functionality
function handleSearch(event) {
  const searchTerm = event.target.value.toLowerCase()
  const filteredPets = pets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(searchTerm) ||
      pet.breed.toLowerCase().includes(searchTerm) ||
      pet.description.toLowerCase().includes(searchTerm),
  )
  renderPets(filteredPets)
}

// Filter functionality
function handleFilter(event) {
  const filterValue = event.target.value
  const filteredPets = filterValue === "all" ? pets : pets.filter((pet) => pet.type === filterValue)
  renderPets(filteredPets)
}

// Open pet detail modal
function openPetModal(petId) {
  const pet = pets.find((p) => p.id === petId)
  if (!pet) return

  const modal = document.getElementById("petModal")
  const modalContent = document.getElementById("petModalContent")

  modalContent.innerHTML = `
        <img src="${pet.image}" alt="${pet.name}" class="pet-modal-image">
        <div class="pet-modal-info">
            <h3>${pet.name} ${pet.adopted ? "(Adopted)" : "(Available)"}</h3>
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
                <div class="characteristic">
                    <div class="characteristic-label">Status</div>
                    <div class="characteristic-value">${pet.adopted ? "Adopted" : "Available"}</div>
                </div>
            </div>
            <p><strong>Description:</strong></p>
            <p>${pet.description}</p>
            <div class="pet-actions" style="margin-top: 2rem;">
                <button class="btn btn-secondary" onclick="editPet(${pet.id}); closePetModal();">Edit Pet</button>
                <button class="btn ${pet.adopted ? "btn-danger" : "btn-success"}" onclick="toggleAdoption(${pet.id}); closePetModal();">
                    ${pet.adopted ? "Mark Available" : "Mark Adopted"}
                </button>
                <button class="btn btn-danger" onclick="deletePet(${pet.id}); closePetModal();">Delete Pet</button>
            </div>
        </div>
    `

  modal.style.display = "block"
}

// Close pet detail modal
function closePetModal() {
  document.getElementById("petModal").style.display = "none"
}

// Open add/edit pet modal
function openAddPetModal() {
  currentEditingId = null
  document.getElementById("modalTitle").textContent = "Add New Pet"
  document.getElementById("petForm").reset()
  document.getElementById("addPetModal").style.display = "block"
}

// Close add/edit pet modal
function closeAddPetModal() {
  document.getElementById("addPetModal").style.display = "none"
  currentEditingId = null
}

// Edit pet
function editPet(petId) {
  const pet = pets.find((p) => p.id === petId)
  if (!pet) return

  currentEditingId = petId
  document.getElementById("modalTitle").textContent = "Edit Pet"

  // Populate form with pet data
  document.getElementById("petName").value = pet.name
  document.getElementById("petType").value = pet.type
  document.getElementById("petBreed").value = pet.breed
  document.getElementById("petAge").value = pet.age
  document.getElementById("petGender").value = pet.gender
  document.getElementById("petSize").value = pet.size
  document.getElementById("petDescription").value = pet.description
  document.getElementById("petImage").value = pet.image

  document.getElementById("addPetModal").style.display = "block"
}

// Handle form submission
function handleFormSubmit(event) {
  event.preventDefault()

  const formData = {
    name: document.getElementById("petName").value,
    type: document.getElementById("petType").value,
    breed: document.getElementById("petBreed").value,
    age: document.getElementById("petAge").value,
    gender: document.getElementById("petGender").value,
    size: document.getElementById("petSize").value,
    description: document.getElementById("petDescription").value,
    image: document.getElementById("petImage").value || "/placeholder.svg?height=250&width=300",
  }

  if (currentEditingId) {
    // Update existing pet
    const petIndex = pets.findIndex((p) => p.id === currentEditingId)
    if (petIndex !== -1) {
      pets[petIndex] = { ...pets[petIndex], ...formData }
    }
  } else {
    // Add new pet
    const newPet = {
      id: Date.now(),
      ...formData,
      adopted: false,
      dateAdded: new Date().toISOString(),
    }
    pets.push(newPet)
  }

  savePets()
  renderPets()
  closeAddPetModal()
}

// Toggle adoption status
function toggleAdoption(petId) {
  const pet = pets.find((p) => p.id === petId)
  if (pet) {
    pet.adopted = !pet.adopted
    savePets()
    renderPets()
  }
}

// Delete pet
function deletePet(petId) {
  if (confirm("Are you sure you want to delete this pet?")) {
    pets = pets.filter((p) => p.id !== petId)
    savePets()
    renderPets()
  }
}

// Utility functions
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
}

function scrollToSection(sectionId) {
  document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" })
}

// Add some sample interactions
function showNotification(message, type = "success") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.textContent = message
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === "success" ? "#2ed573" : "#ff4757"};
        color: white;
        border-radius: 8px;
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
    `

  document.body.appendChild(notification)

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.remove()
  }, 3000)
}

// Add CSS for notification animation
const style = document.createElement("style")
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`
document.head.appendChild(style)
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('.'));

// Serve index.html on root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});