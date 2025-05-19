<template>
  <div class="min-h-screen bg-white">
    <MainWeb></MainWeb>

    <!-- Hero Section -->
    <div class="relative overflow-hidden text-black">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
        <div class="text-center fade-in">
          <h1 class="text-5xl md:text-6xl font-extrabold mb-6">Pokémon</h1>
        </div>
        <div class="mt-12 flex justify-center space-x-10">
          <div
            v-for="id in [25, 1, 4, 7]"
            :key="id"
            class="transform transition-all duration-300 hover:scale-110 cursor-pointer"
            @click="showDetails(id)"
          >
            <img
              :src="getPokemonImageUrl(id)"
              :alt="getPokemonName(id)"
              class="w-28 h-28 md:w-36 md:h-36 object-contain hover-bounce"
              @error="(e) => handleImageError(e, id)"
            />
          </div>
        </div>
      </div>
      <div class="absolute inset-0 opacity-5">
        <div class="absolute inset-0 bg-pattern"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Introduction Section -->
      <div class="mb-16 fade-in">
        <h2 class="text-3xl font-bold mb-8 text-center text-black">What Are Pokémon?</h2>
        <div
          class="bg-white rounded-xl shadow-md p-8 border flex flex-col md:flex-row items-center gap-8"
        >
          <div class="md:w-1/2 space-y-6">
            <p class="text-lg text-gray-800">
              Mysterious creatures with special powers that coexist with humans. Each with unique
              abilities and characteristics.
            </p>
            <div class="flex flex-wrap gap-3 mt-4">
              <span
                v-for="type in ['fire', 'water', 'grass', 'electric', 'psychic', 'fighting']"
                :key="type"
                class="px-3 py-1 rounded-full text-sm font-medium transform transition-all duration-300 hover:scale-110 cursor-pointer capitalize"
                :class="getTypeClass(type)"
              >
                {{ type }}
              </span>
            </div>
          </div>
          <div class="md:w-1/2 flex justify-center">
            <div class="relative group">
              <img
                :src="getPokemonImageUrl(25)"
                alt="Pikachu"
                class="w-40 h-40 object-contain transform transition-all duration-500 group-hover:scale-110"
                @error="(e) => handleImageError(e, 25)"
              />
              <div
                class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <button
                  @click="showDetails(25)"
                  class="bg-slate-600 text-white px-3 py-1 rounded-full text-sm"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- History Timeline -->
      <div class="mb-16 fade-in">
        <h2 class="text-3xl font-bold mb-8 text-center text-black">The Pokémon Legacy</h2>
        <div class="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-300">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              class="bg-gray-50 rounded-lg p-5 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            >
              <div class="font-bold text-2xl text-black mb-2">1996</div>
              <div class="text-sm text-gray-700 mb-3">
                Pokémon Red and Green released in Japan for the Game Boy.
              </div>
              <div class="w-full h-1 rounded-full"></div>
            </div>

            <div
              class="bg-gray-50 rounded-lg p-5 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            >
              <div class="font-bold text-2xl text-black mb-2">1998</div>
              <div class="text-sm text-gray-700 mb-3">
                International debut in the United States, becoming a global phenomenon.
              </div>
              <div class="w-full h-1 rounded-full"></div>
            </div>

            <div
              class="bg-gray-50 rounded-lg p-5 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            >
              <div class="font-bold text-2xl text-black mb-2">2006</div>
              <div class="text-sm text-gray-700 mb-3">
                Pokémon Diamond and Pearl launch, introducing online play.
              </div>
              <div class="w-full h-1 rounded-full"></div>
            </div>

            <div
              class="bg-gray-50 rounded-lg p-5 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            >
              <div class="font-bold text-2xl text-black mb-2">2016</div>
              <div class="text-sm text-gray-700 mb-3">
                Pokémon GO launches with augmented reality technology.
              </div>
              <div class="w-full h-1 rounded-full"></div>
            </div>

            <div
              class="bg-gray-50 rounded-lg p-5 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            >
              <div class="font-bold text-2xl text-black mb-2">2019</div>
              <div class="text-sm text-gray-700 mb-3">
                Pokémon Sword and Shield release for Nintendo Switch.
              </div>
              <div class="w-full h-1 rounded-full"></div>
            </div>

            <div
              class="bg-gray-50 rounded-lg p-5 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            >
              <div class="font-bold text-2xl text-black mb-2">2022</div>
              <div class="text-sm text-gray-700 mb-3">
                Pokémon Scarlet and Violet introduce open-world gameplay.
              </div>
              <div class="w-full h-1 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pokémon Types Section -->
      <div class="mb-16 fade-in">
        <h2 class="text-3xl font-bold mb-8 text-center text-black">The Pokémon Types</h2>
        <div class="flex justify-center">
          <!-- Types Card -->
          <div
            class="bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-red-600 transform transition-all duration-300 hover:shadow-xl max-w-2xl w-full"
          >
            <div class="p-6">
              <h3 class="text-xl font-bold mb-6 text-center text-black">18 Different Types</h3>
              <div class="grid-cols-3 sm:grid-cols-6 gap-3 mt-4 flex flex-wrap justify-center">
                <div
                  v-for="type in [
                    'normal',
                    'fire',
                    'water',
                    'electric',
                    'grass',
                    'ice',
                    'fighting',
                    'poison',
                    'ground',
                    'flying',
                    'psychic',
                    'bug',
                    'rock',
                    'ghost',
                    'dragon',
                    'dark',
                    'steel',
                    'fairy',
                  ]"
                  :key="type"
                  class="px-2 py-1 rounded text-xs text-center transform transition-all duration-300 hover:scale-110 cursor-pointer capitalize"
                  :class="getTypeClass(type)"
                  @click="changeTypePokemon(type)"
                >
                  {{ type }}
                </div>
              </div>
              <div class="mt-8 flex flex-col items-center justify-center">
                <img
                  :src="getPokemonImageUrl(selectedTypePokemon)"
                  :alt="getPokemonName(selectedTypePokemon)"
                  class="w-32 h-32 object-contain transition-all duration-500 hover:scale-110"
                  @error="(e) => handleImageError(e, selectedTypePokemon)"
                />
                <div class="mt-2 text-sm font-medium capitalize text-gray-700">
                  {{ getPokemonName(selectedTypePokemon) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Fan Favorites Section -->
      <div class="mb-16 fade-in">
        <h2 class="text-3xl font-bold mb-8 text-center text-black">Fan Favorites</h2>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          <div
            v-for="id in [25, 1, 6, 150, 151]"
            :key="id"
            class="bg-white rounded-xl p-6 shadow-md transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group cursor-pointer"
            @click="showDetails(id)"
          >
            <div class="relative">
              <img
                :src="getPokemonImageUrl(id)"
                class="mx-auto w-24 h-24 transition-all duration-500 group-hover:scale-110"
                alt="Popular Pokémon"
                @error="(e) => handleImageError(e, id)"
              />
              <div
                class="absolute inset-0 bg-black bg-opacity-0 rounded-full transition-all duration-300"
              ></div>
            </div>
            <div class="capitalize text-lg font-bold text-black mt-4">{{ getPokemonName(id) }}</div>
            <div class="text-xs text-gray-600 mt-1" v-if="pokemonDetails[id]">
              {{ pokemonDetails[id].type.join(' / ') }}
            </div>
          </div>
        </div>
      </div>

      <!-- Did You Know Section -->
      <div class="mb-16 fade-in">
        <h2 class="text-3xl font-bold mb-8 text-center text-black">Fun Facts</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            class="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
          >
            <div class="bg-red-600"></div>
            <div class="p-6">
              <div class="flex items-center mb-4">
                <div
                  class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3"
                >
                  <span class="text-red-600 text-xl font-bold">?</span>
                </div>
                <h3 class="font-bold text-lg text-black group-hover:text-red-600 transition-colors">
                  Pokémon Origins
                </h3>
              </div>
              <p class="text-gray-700 text-sm">
                Inspired by creator Satoshi Tajiri's childhood hobby of collecting insects.
              </p>
            </div>
          </div>

          <div
            class="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
          >
            <div class="bg-red-600"></div>
            <div class="p-6">
              <div class="flex items-center mb-4">
                <div
                  class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3"
                >
                  <span class="text-red-600 text-xl font-bold">?</span>
                </div>
                <h3 class="font-bold text-lg text-black group-hover:text-red-600 transition-colors">
                  Original Mascot
                </h3>
              </div>
              <p class="text-gray-700 text-sm">
                Clefairy was originally planned to be the mascot before Pikachu was chosen.
              </p>
            </div>
          </div>

          <div
            class="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
          >
            <div class="bg-red-600"></div>
            <div class="p-6">
              <div class="flex items-center mb-4">
                <div
                  class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3"
                >
                  <span class="text-red-600 text-xl font-bold">?</span>
                </div>
                <h3 class="font-bold text-lg text-black group-hover:text-red-600 transition-colors">
                  Pokémon Count
                </h3>
              </div>
              <p class="text-gray-700 text-sm">
                As of 2023, there are over 1,000 different Pokémon species.
              </p>
            </div>
          </div>

          <div
            class="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
          >
            <div class="bg-red-600"></div>
            <div class="p-6">
              <div class="flex items-center mb-4">
                <div
                  class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3"
                >
                  <span class="text-red-600 text-xl font-bold">?</span>
                </div>
                <h3 class="font-bold text-lg text-black group-hover:text-red-600 transition-colors">
                  Global Success
                </h3>
              </div>
              <p class="text-gray-700 text-sm">
                Highest-grossing media franchise of all time with over $100 billion in revenue.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Pokémon Showcase -->
      <div class="fade-in mb-16">
        <h2 class="text-3xl font-bold mb-8 text-center text-black">Explore Pokémon</h2>
        <div class="bg-white rounded-xl shadow-md overflow-hidden border border-slate-600">
          <div class="flex overflow-x-auto gap-6 p-6 pb-8 scrollbar-hide">
            <div
              v-for="id in [4, 7, 1, 25, 39, 150, 151, 6, 9, 3]"
              :key="id"
              class="flex-shrink-0 bg-black bg-opacity-5 p-6 w-40 h-40 rounded-xl flex flex-col items-center justify-center transition-all duration-500 ease-in-out transform hover:scale-110 hover:shadow-lg hover:bg-red-50 cursor-pointer"
              @click="showDetails(id)"
            >
              <img
                :src="getPokemonImageUrl(id)"
                class="w-24 h-24 transition-all duration-300"
                alt="Pokémon Showcase"
                @error="(e) => handleImageError(e, id)"
              />
              <div class="mt-3 text-sm font-bold capitalize text-black">
                {{ getPokemonName(id) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="fade-in mb-16">
        <div class="bg-gray-100 text-black rounded-xl shadow-lg p-8 text-center">
          <h2 class="text-3xl font-bold mb-4">Ready to Catch ?</h2>
          <p class="text-lg mb-6">
            Explore our complete Pokémon database and start your journey today!
          </p>
          <router-link
            to="/list-pokemon"
            class="inline-block bg-red-600 text-white px-6 py-3 rounded-full font-bold text-lg hover:bg-red-700 transform hover:scale-105 transition-all duration-300"
          >
            View All Pokémon
          </router-link>
        </div>
      </div>
    </div>

    <!-- Pokémon Details Modal -->
    <div
      v-if="selectedPokemon"
      class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      @click.self="selectedPokemon = null"
    >
      <div
        class="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-slate-600 transform transition-all duration-300 scale-100"
      >
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold capitalize text-black">
            {{ getPokemonName(selectedPokemon) }}
          </h2>
          <button
            @click="selectedPokemon = null"
            class="text-gray-500 hover:text-red-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="flex flex-col items-center mb-6">
          <img
            :src="selectedPokemon ? getPokemonImageUrl(selectedPokemon) : ''"
            alt="Pokemon"
            class="w-40 h-40 mb-4 transition-all duration-500 hover:scale-110"
            @error="(e) => selectedPokemon && handleImageError(e, selectedPokemon)"
          />

          <div v-if="pokemonDetails[selectedPokemon]" class="w-full">
            <div class="flex justify-center gap-3 mb-4">
              <span
                v-for="type in pokemonDetails[selectedPokemon].type"
                :key="type"
                class="px-4 py-1 rounded-full text-sm font-medium capitalize"
                :class="getTypeClass(type)"
              >
                {{ type }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
              <div class="text-center">
                <span class="text-sm text-gray-500">Height</span>
                <p class="font-bold text-black">{{ pokemonDetails[selectedPokemon].height }} m</p>
              </div>
              <div class="text-center">
                <span class="text-sm text-gray-500">Weight</span>
                <p class="font-bold text-black">{{ pokemonDetails[selectedPokemon].weight }} kg</p>
              </div>
            </div>
          </div>
        </div>

        <div class="text-gray-700 mb-6">
          <h3 class="font-bold text-lg mb-2 text-black">About</h3>
          <p class="text-gray-600">{{ getPokemonDescription(selectedPokemon) }}</p>
        </div>

        <button
          @click="selectedPokemon = null"
          class="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-all font-bold"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MainWeb from '@/components/MainWeb.vue'
import { ref } from 'vue'

const pokemonNames: Record<number, string> = {
  1: 'bulbasaur',
  3: 'venusaur',
  4: 'charmander',
  6: 'charizard',
  7: 'squirtle',
  9: 'blastoise',
  12: 'butterfree',
  18: 'pidgeot',
  25: 'pikachu',
  28: 'sandslash',
  39: 'jigglypuff',
  76: 'golem',
  94: 'gengar',
  107: 'hitmonchan',
  110: 'weezing',
  143: 'snorlax',
  144: 'articuno',
  149: 'dragonite',
  150: 'mewtwo',
  151: 'mew',
  208: 'steelix',
  248: 'tyranitar',
}

const selectedPokemon = ref<number | null>(null)
const selectedTypePokemon = ref<number>(6) // Default to Charizard

const pokemonDetails: Record<number, { type: string[]; height: number; weight: number }> = {
  1: { type: ['grass', 'poison'], height: 0.7, weight: 6.9 },
  3: { type: ['grass', 'poison'], height: 2.0, weight: 100.0 },
  4: { type: ['fire'], height: 0.6, weight: 8.5 },
  6: { type: ['fire', 'flying'], height: 1.7, weight: 90.5 },
  7: { type: ['water'], height: 0.5, weight: 9.0 },
  9: { type: ['water'], height: 1.6, weight: 85.5 },
  25: { type: ['electric'], height: 0.4, weight: 6.0 },
  39: { type: ['fairy'], height: 0.5, weight: 5.5 },
  150: { type: ['psychic'], height: 2.0, weight: 122.0 },
  151: { type: ['psychic'], height: 0.4, weight: 4.0 },
}

// Pokemon descriptions
const pokemonDescriptions: Record<number, string> = {
  1: 'Bulbasaur is a small, quadruped Pokémon with a plant bulb on its back. This bulb grows as Bulbasaur matures, eventually blooming into a large flower when it evolves into Venusaur.',
  3: 'Venusaur is the final evolution of Bulbasaur. The flower on its back has bloomed, and it uses the flower to catch sunlight to convert into energy.',
  4: 'Charmander is a bipedal, reptilian Pokémon with a flame burning at the tip of its tail. The flame is a measure of its life force - if it goes out, Charmander would die.',
  6: "Charizard is the final evolution of Charmander. It can fly and breathe powerful flames. It's known for its fierce competitive spirit and tendency to seek out strong opponents.",
  7: 'Squirtle is a small, turtle-like Pokémon that can spray water from its mouth with great accuracy. Its shell is not just for protection but also helps reduce water resistance when swimming.',
  9: 'Blastoise is the final evolution of Squirtle. It has water spouts that protrude from its shell, which it can use to fire powerful jets of water with incredible accuracy.',
  25: "Pikachu is an Electric-type Pokémon known for storing electricity in its cheeks. When threatened, it discharges this electricity as a defensive measure. It's the most recognizable Pokémon and the franchise mascot.",
  39: "Jigglypuff is a round, balloon-like Pokémon with large blue eyes and a tuft of hair on its head. It's known for its ability to sing a soothing lullaby that puts listeners to sleep.",
  150: "Mewtwo is a Psychic-type Legendary Pokémon created by genetic manipulation of Mew's DNA. It's known for its exceptional intelligence and powerful psychic abilities.",
  151: "Mew is a Mythical Pokémon said to possess the genetic composition of all Pokémon. It's extremely rare and elusive, with the ability to learn any move.",
}

// Variable to store image attempt history for each Pokemon
const imageAttempts = ref<Record<number, string[]>>({})

// Function to handle image loading errors
const handleImageError = (event: Event, pokemonId: number) => {
  // Try alternative image sources
  const imgElement = event.target as HTMLImageElement
  const currentSrc = imgElement.src

  // Check if it's already the no-image placeholder to prevent infinite loops
  if (currentSrc.includes('/no-image.png')) {
    console.log(`Stopped trying to load image for Pokemon #${pokemonId} to prevent infinite loop`)
    return
  }

  // Create an array to store image attempt history for this Pokemon if it doesn't exist
  if (!imageAttempts.value[pokemonId]) {
    imageAttempts.value[pokemonId] = []
  }

  // Add the current URL to the history
  imageAttempts.value[pokemonId].push(currentSrc)

  // Try fallback images in order of priority
  const fallbackUrls = [
    // 0. Front sprite (GitHub)
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`,

    // 1. Official artwork
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,

    // 2. Dream World
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg`,

    // 3. Pokemon Home
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemonId}.png`,

    // 4. Back sprite (GitHub)
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokemonId}.png`,

    // If all else fails, use a placeholder (to prevent loops)
    '/no-image.png',
  ]

  // Find the next URL that hasn't been tried yet
  for (const url of fallbackUrls) {
    // Skip if URL is undefined or is the current URL
    if (!url || url === currentSrc) {
      continue
    }

    // Skip if this URL has already been tried
    if (imageAttempts.value[pokemonId].includes(url)) {
      continue
    }

    // Use this URL
    console.log(`Trying next image source for Pokemon #${pokemonId}: ${url}`)
    imgElement.src = url
    return
  }

  // If all URLs have been tried and failed, use the no-image placeholder
  console.log(`All image sources failed for Pokemon #${pokemonId}, using no-image placeholder`)
  imgElement.src = '/no-image.png'
}

// Function to select the appropriate image URL
const getPokemonImageUrl = (pokemonId: number) => {
  // Create an array of possible URLs in order of priority
  const possibleUrls = [
    // 0. Front sprite (GitHub)
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`,

    // 1. Official artwork
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,

    // 2. Dream World
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg`,

    // 3. Pokemon Home
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemonId}.png`,

    // 4. Back sprite (GitHub)
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokemonId}.png`,
  ]

  // Use the first URL in the priority list (since we don't have sprite data from the API on this page)
  return possibleUrls[1] // Using official artwork as default
}

// Function to get Pokemon name
const getPokemonName = (id: number) => {
  return pokemonNames[id] || 'unknown'
}

// Function to get Pokemon description
const getPokemonDescription = (id: number) => {
  return pokemonDescriptions[id] || 'No information available for this Pokémon.'
}

// Function to show Pokemon details
const showDetails = (id: number) => {
  selectedPokemon.value = id
}

// Function to get type class for styling
const getTypeClass = (type: string) => {
  const typeClasses: Record<string, string> = {
    normal: 'bg-gray-500 text-white',
    fire: 'bg-red-400 text-white',
    water: 'bg-blue-500 text-white',
    electric: 'bg-yellow-400 text-white',
    grass: 'bg-green-500 text-white',
    ice: 'bg-cyan-400 text-white',
    fighting: 'bg-orange-400 text-white',
    poison: 'bg-purple-400 text-white',
    ground: 'bg-amber-700 text-white',
    flying: 'bg-indigo-600 text-white',
    psychic: 'bg-pink-400 text-white',
    bug: 'bg-lime-500 text-white',
    rock: 'bg-yellow-600 text-white',
    ghost: 'bg-violet-500 text-white',
    dragon: 'bg-indigo-400 text-white',
    dark: 'bg-gray-800 text-white',
    steel: 'bg-slate-400 text-white',
    fairy: 'bg-rose-400 text-white',
  }

  return typeClasses[type] || 'bg-gray-300 text-white'
}

// Map of Pokémon types to representative Pokémon IDs
const typeToPokemonMap: Record<string, number> = {
  normal: 143, // Snorlax
  fire: 6, // Charizard
  water: 9, // Blastoise
  electric: 25, // Pikachu
  grass: 3, // Venusaur
  ice: 144, // Articuno
  fighting: 107, // Hitmonchan
  poison: 110, // Weezing
  ground: 28, // Sandslash
  flying: 18, // Pidgeot
  psychic: 150, // Mewtwo
  bug: 12, // Butterfree
  rock: 76, // Golem
  ghost: 94, // Gengar
  dragon: 149, // Dragonite
  dark: 248, // Tyranitar
  steel: 208, // Steelix
  fairy: 39, // Jigglypuff
}

// Function to change the displayed Pokémon based on type
const changeTypePokemon = (type: string) => {
  // If we have a mapping for this type, use it
  if (typeToPokemonMap[type]) {
    selectedTypePokemon.value = typeToPokemonMap[type]
  } else {
    // Default to Charizard if no mapping exists
    selectedTypePokemon.value = 6
  }
}
</script>

<style scoped>
/* Animation Effects */
.fade-in {
  opacity: 0;
  animation: fadeIn 1s forwards;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

/* Hover bounce animation */
.hover-bounce {
  transition: transform 0.3s ease;
}

.hover-bounce:hover {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Background pattern */
.bg-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

/* Card hover effects */
.hover\:shadow-xl:hover {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.hover\:-translate-y-1:hover {
  transform: translateY(-0.25rem);
}

.hover\:-translate-y-2:hover {
  transform: translateY(-0.5rem);
}
</style>
