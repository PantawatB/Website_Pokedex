<template>
  <div class="min-h-screen bg-gray-100">
    <MainWeb></MainWeb>

    <div class="container mx-auto px-4 py-8">
      <!-- Game Title and Instructions -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-4">Who is this Pokémon?</h1>
        <p class="text-lg text-gray-700">Guess the name of the Pokémon shown.</p>
      </div>

      <!-- Game Container -->
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <!-- Score Display and Lives -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <div class="text-lg font-semibold">Score: {{ score }}</div>
            <div class="text-sm text-gray-600">Streak: {{ streak }}</div>
          </div>

          <!-- Lives Display (Right Top) - Hearts change from right to left -->
          <div class="flex flex-row-reverse gap-2">
            <span v-for="n in 3" :key="n" class="text-2xl">
              <span v-if="n > lostLives" class="text-red-500">❤️</span>
              <span v-else class="text-gray-800">🖤</span>
            </span>
          </div>
        </div>

        <!-- Scoreboard (Right Side) -->
        <div class="bg-gray-100 rounded-lg p-3 mb-4 border border-gray-200">
          <h3 class="text-center font-semibold mb-2 text-gray-700">Scoreboard</h3>
          <div class="flex justify-between">
            <div class="text-sm">High Score:</div>
            <div class="text-sm font-semibold">{{ highScore }}</div>
          </div>
          <div class="flex justify-between">
            <div class="text-sm">Best Streak:</div>
            <div class="text-sm font-semibold">{{ bestStreak }}</div>
          </div>
        </div>

        <!-- Pokemon Display Area -->
        <div class="relative flex flex-col items-center mb-6">
          <img
            v-if="currentPokemon"
            :src="pokemonImageUrl"
            alt="Pokemon"
            class="w-48 h-48 object-contain transition-all duration-300"
            :class="{
              'pokemon-silhouette': !revealed,
              'pokemon-revealed': revealed,
              'correct-animation': correctAnimation,
            }"
          />
          <div v-else class="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
            <p class="text-gray-500">Loading...</p>
          </div>

          <!-- Pokemon Type Tags (only shown when revealed) -->
          <div v-if="revealed && currentPokemon" class="flex gap-2 mt-3">
            <span
              v-for="(typeObj, index) in currentPokemon.types"
              :key="index"
              class="px-3 py-1 rounded-full text-xs font-semibold capitalize"
              :class="getTypeClass(typeObj.type.name)"
            >
              {{ typeObj.type.name }}
            </span>
          </div>
        </div>

        <!-- Feedback Message -->
        <div v-if="feedbackMessage" class="mb-4 text-center p-2 rounded-lg" :class="feedbackClass">
          {{ feedbackMessage }}
        </div>

        <!-- Multiple Choice Options -->
        <div v-if="!revealed && !gameOver" class="grid grid-cols-2 gap-3 mb-4">
          <button
            v-for="(option, index) in pokemonOptions"
            :key="index"
            @click="checkAnswer(option)"
            class="bg-white border border-gray-300 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors text-center capitalize font-medium"
            :class="{ 'opacity-50 cursor-not-allowed': revealed }"
            :disabled="revealed"
          >
            {{ option }}
          </button>
        </div>

        <!-- Next Pokemon Button -->
        <div class="flex justify-center mb-4">
          <button
            v-if="revealed && !gameOver"
            @click="getNewPokemon"
            class="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Next Pokémon
          </button>
        </div>

        <!-- Game Over Screen -->
        <div v-if="gameOver" class="text-center mb-4">
          <div class="text-xl font-bold text-red-500 mb-3">Game Over!</div>
          <div class="mb-4">Final Score: {{ score }}</div>
          <button
            @click="resetGame"
            class="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>

      <!-- Game Rules -->
      <div class="max-w-md mx-auto mt-8 bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h2 class="text-xl font-bold mb-2">How to Play</h2>
        <ul class="list-disc pl-5 space-y-1">
          <li>A silhouette of a Pokémon will be shown</li>
          <li>Choose the correct Pokémon name from the four options</li>
          <li>Earn 10 points for each correct answer</li>
          <li>You have 3 lives (❤️) - lose one for each wrong answer</li>
          <li>Game ends when you lose all lives</li>
          <li>Try to get the highest score possible!</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MainWeb from '@/components/MainWeb.vue'
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// Define a more complete Pokemon interface for the API response
interface PokemonApiResponse {
  id: number
  name: string
  base_experience: number
  height: number
  weight: number
  sprites: {
    front_default: string
    back_default: string
  }
  types: Array<{
    type: {
      name: string
    }
  }>
}

// Game state
const score = ref(0)
const highScore = ref(0)
const streak = ref(0)
const bestStreak = ref(0)
const lives = ref(3)
const lostLives = ref(0) // Track lost lives separately for right-to-left display
const gameOver = ref(false)
const currentPokemon = ref<PokemonApiResponse | null>(null)
const revealed = ref(false)
const feedbackMessage = ref('')
const correctAnimation = ref(false)
const pokemonOptions = ref<string[]>([])
const allPokemonNames = ref<string[]>([])

// Computed properties
const pokemonImageUrl = computed(() => {
  if (!currentPokemon.value) return ''
  // Use front sprite by default, fallback to back sprite if available
  return (
    currentPokemon.value.sprites.front_default ||
    currentPokemon.value.sprites.back_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${currentPokemon.value.id}.png`
  )
})

const feedbackClass = computed(() => {
  if (feedbackMessage.value.includes('Correct')) {
    return 'bg-green-100 text-green-800'
  } else if (feedbackMessage.value.includes('Wrong')) {
    return 'bg-red-100 text-red-800'
  }
  return ''
})

// Methods
// Get a random Pokemon ID (limited to first 151 for better recognition)
const getRandomPokemonId = () => {
  return Math.floor(Math.random() * 151) + 1
}

// Define interface for Pokemon API list response
interface PokemonListItem {
  name: string
  url: string
}

interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: PokemonListItem[]
}

// Get random Pokemon names for options
const getRandomPokemonNames = async (correctName: string, count: number = 3) => {
  // If we already have a list of Pokemon names, use it
  if (allPokemonNames.value.length > 0) {
    const options: string[] = []

    // Add random names that are not the correct answer
    while (options.length < count) {
      const randomIndex = Math.floor(Math.random() * allPokemonNames.value.length)
      const name = allPokemonNames.value[randomIndex]

      if (name !== correctName && !options.includes(name)) {
        options.push(name)
      }
    }

    return options
  } else {
    // Fetch first 151 Pokemon to get their names
    try {
      const response = await axios.get<PokemonListResponse>(
        'https://pokeapi.co/api/v2/pokemon?limit=151',
      )
      allPokemonNames.value = response.data.results.map((p) => p.name)

      return getRandomPokemonNames(correctName, count)
    } catch (error) {
      console.error('Error fetching Pokemon names:', error)
      return ['bulbasaur', 'charmander', 'squirtle'].filter((name) => name !== correctName)
    }
  }
}

// Create multiple choice options
const createOptions = async (correctName: string) => {
  // Get 3 random Pokemon names
  const wrongOptions = await getRandomPokemonNames(correctName)

  // Add the correct name and shuffle
  const options = [...wrongOptions, correctName]

  // Shuffle the options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[options[i], options[j]] = [options[j], options[i]]
  }

  pokemonOptions.value = options
}

// Get a new Pokemon for the game
const getNewPokemon = async () => {
  try {
    // Reset state for new question
    revealed.value = false
    feedbackMessage.value = ''
    correctAnimation.value = false

    // Clear current Pokemon first to prevent flash of colored Pokemon
    currentPokemon.value = null

    // Check if game is over
    if (lives.value <= 0) {
      gameOver.value = true
      return
    }

    // Get a random Pokémon
    const id = getRandomPokemonId()
    const response = await axios.get<PokemonApiResponse>(`https://pokeapi.co/api/v2/pokemon/${id}`)

    // Create multiple choice options before setting currentPokemon
    const pokemonData = response.data
    await createOptions(pokemonData.name)

    // Now set the current Pokemon after options are ready
    currentPokemon.value = pokemonData
  } catch (error) {
    console.error('Error fetching Pokémon:', error)
    feedbackMessage.value = 'Error loading Pokémon. Please try again.'
  }
}

// Check the player's answer
const checkAnswer = (selectedOption: string) => {
  if (!currentPokemon.value || revealed.value || gameOver.value) return

  const correctName = currentPokemon.value.name.toLowerCase()
  const userAnswer = selectedOption.toLowerCase()

  if (userAnswer === correctName) {
    // Correct answer
    revealed.value = true
    feedbackMessage.value = 'Correct! Well done!'

    // Add points
    score.value += 10

    // Increment streak
    streak.value++

    // Update best streak if needed
    if (streak.value > bestStreak.value) {
      bestStreak.value = streak.value
      localStorage.setItem('pokemonGameBestStreak', bestStreak.value.toString())
    }

    // Update high score if needed
    if (score.value > highScore.value) {
      highScore.value = score.value
      localStorage.setItem('pokemonGameHighScore', highScore.value.toString())
    }

    // Trigger correct answer animation
    correctAnimation.value = true
    setTimeout(() => {
      correctAnimation.value = false
    }, 1000)
  } else {
    // Wrong answer
    revealed.value = true
    feedbackMessage.value = `Wrong! The correct answer is ${correctName}.`

    // Lose a life (from right to left)
    lostLives.value++
    lives.value--

    // Reset streak on wrong answer
    streak.value = 0

    // Check if game over
    if (lives.value <= 0 || lostLives.value >= 3) {
      gameOver.value = true
    }
  }
}

// Reset the game after game over
const resetGame = () => {
  // Reset all game state
  score.value = 0
  streak.value = 0
  lives.value = 3
  lostLives.value = 0
  gameOver.value = false
  revealed.value = false
  feedbackMessage.value = ''

  // Get a new Pokemon
  getNewPokemon()
}

// Function to get CSS classes for Pokemon type badges
const getTypeClass = (type: string) => {
  const typeClasses: Record<string, string> = {
    normal: 'bg-gray-300 text-gray-800',
    fire: 'bg-red-400 text-white',
    water: 'bg-blue-400 text-white',
    electric: 'bg-yellow-300 text-yellow-800',
    grass: 'bg-green-400 text-white',
    ice: 'bg-blue-200 text-blue-800',
    fighting: 'bg-red-600 text-white',
    poison: 'bg-purple-500 text-white',
    ground: 'bg-yellow-600 text-white',
    flying: 'bg-indigo-300 text-indigo-800',
    psychic: 'bg-pink-400 text-white',
    bug: 'bg-lime-400 text-lime-800',
    rock: 'bg-yellow-700 text-white',
    ghost: 'bg-purple-700 text-white',
    dragon: 'bg-indigo-600 text-white',
    dark: 'bg-gray-700 text-white',
    steel: 'bg-gray-400 text-white',
    fairy: 'bg-pink-300 text-pink-800',
  }

  return typeClasses[type] || 'bg-gray-200 text-gray-800'
}

// Initialize game
onMounted(async () => {
  // Load high score from localStorage if available
  const savedHighScore = localStorage.getItem('pokemonGameHighScore')
  if (savedHighScore) {
    highScore.value = parseInt(savedHighScore)
  }

  // Load best streak from localStorage if available
  const savedBestStreak = localStorage.getItem('pokemonGameBestStreak')
  if (savedBestStreak) {
    bestStreak.value = parseInt(savedBestStreak)
  }

  // Preload Pokemon names list
  try {
    const response = await axios.get<PokemonListResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=151',
    )
    allPokemonNames.value = response.data.results.map((p) => p.name)
  } catch (error) {
    console.error('Error preloading Pokemon names:', error)
  }

  // Get first Pokémon
  await getNewPokemon()
})
</script>

<style scoped>
.pokemon-silhouette {
  filter: brightness(0);
  transform: scale(1.1);
}

.pokemon-revealed {
  filter: brightness(1);
  transform: scale(1);
}

/* Animation for correct answers */
@keyframes bounce {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.correct-animation {
  animation: bounce 0.5s ease-in-out;
}

/* Animation for feedback messages */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bg-green-100,
.bg-red-100 {
  animation: fadeIn 0.3s ease-out;
}
</style>
