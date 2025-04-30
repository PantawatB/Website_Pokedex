<template>
  <div class="min-h-screen bg-gray-100">
    <MainWeb></MainWeb>

    <div class="container mx-auto px-4 py-8">
      <!-- ส่วนหัวของเกม -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-4">Who is this Pokémon?</h1>
        <p class="text-lg text-gray-700">Guess the name of the Pokémon shown.</p>
      </div>

      <!-- กล่องเกมหลัก -->
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <!-- แสดงคะแนนและจำนวนชีวิต -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <div class="text-lg font-semibold">Score: {{ score }}</div>
            <div class="text-sm text-gray-600">Streak: {{ streak }}</div>
          </div>

          <!-- แสดงหัวใจแทนจำนวนชีวิตที่เหลือ (จากขวาไปซ้าย) -->
          <!-- แสดงการหลอกตาหัวใจ 1 จะเริ่มที่ขวาแทน -->
          <div class="flex flex-row-reverse gap-2">
            <span v-for="n in 3" :key="n" class="text-2xl">
              <!-- n เป็น 1,2,3 -->
              <!-- สมมุติ n เป็น 2 เสียชีวิต lostLives 2 ก็จะ false เปลี่ยนหัวใจเป็น 🖤 -->
              <span v-if="n > lostLives" class="text-red-500">❤️</span>
              <span v-else class="text-gray-800">🖤</span>
            </span>
          </div>
        </div>

        <!-- Soreboard -->
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

        <!-- ส่วนแสดงโปเกมอน -->
        <div class="relative flex flex-col items-center mb-6">
          <!-- แสดงทุกอย่างตรงกลาง -->
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
          <!-- ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ -->
          <!-- ดึงข้อมูลโปเกมอน และ รูปภาพ หน้าหลัง "ถ้ามีโปเกมอนให้แสดงรูปภาพ" -->
          <!--  -->
          <!--ถ้า revealed == false(ยังไม่เฉลย) จะโชว์เป็น ภาพเงา
              ถ้า revealed == true(เฉลยแล้ว) จะโชว์ภาพโปเกมอนเต็ม
              ถ้า correctAnimation == true(ตอบถูก) จะมีแอนิเมชันเด้งเมื่อผู้เล่นตอบถูก -->
          <!-- ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ -->

          <!-- ถ้ายังโหลดไม่มาก็ให้ Loading ไปก่อน -->
          <div v-else class="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <p class="text-gray-700 font-bold">Loading...</p>
          </div>

          <!-- แสดงประเภทของโปเกมอน เมื่อเฉลยแล้ว -->
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

        <!-- ข้อความแจ้งว่า (ถูก/ผิด) -->
        <div v-if="feedbackMessage" class="mb-4 text-center p-2 rounded-lg" :class="feedbackClass">
          {{ feedbackMessage }}
        </div>

        <!-- ปุ่มตัวเลือกคำตอบแบบหลายตัวเลือก -->
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

        <!-- ปุ่มเพื่อเล่นรอบถัดไป -->
        <div class="flex justify-center mb-4">
          <button
            v-if="revealed && !gameOver"
            @click="getNewPokemon"
            class="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Next Pokémon
          </button>
        </div>

        <!-- หน้าจอ Game Over -->
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
      <!-- ////////////////////////////////  Game  Rule   ///////////////////////////////////// -->
      <!-- กฎของเกม -->
      <div class="max-w-md mx-auto mt-8 bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h2 class="text-xl font-bold mb-2">How to Play</h2>
        <ul class="list-disc pl-5 space-y-1">
          <li>A silhouette of a Pokémon will be shown</li>
          <li>Choose the correct Pokémon name from the four options</li>
          <li>Earn 10 points for each correct answer</li>
          <li>You have 3 lives (❤️) - lose one for each wrong answer</li>
          <li>Game ends when you lose all lives (🖤)</li>
          <li>Try to get the highest score possible!</li>
        </ul>
      </div>
      <!-- ////////////////////////////////  Game  Rule   ///////////////////////////////////// -->
    </div>
  </div>
</template>

<script setup lang="ts">
import MainWeb from '@/components/MainWeb.vue'
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// interface สำหรับเก็บข้อมูลโปเกมอนจาก PokeAPI ที่อยากได้
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

// ตัวแปรสถานะ + การตั้งค่าของเกม
const score = ref(0) // คะแนน
const highScore = ref(0) // คะแนนสูงสุด (เก็บไว้ใน localStorage)
const streak = ref(0) // จำนวนคำตอบที่ถูกต่อเนื่อง
const bestStreak = ref(0) // สถิติ streak สูงสุด
const lives = ref(3) // ชีวิตคงเหลือ
const lostLives = ref(0) // ชีวิตที่เสียไป
const gameOver = ref(false) // เกมจบหรือยัง
const currentPokemon = ref<PokemonApiResponse | null>(null) // โปเกมอนปัจจุบัน หยิบข้อมูลเป็น PokemonApiResponse ตามข้อมูลที่อยากได้
const revealed = ref(false) // เฉลยแล้วหรือยัง
const feedbackMessage = ref('') // ข้อความตอบรับ
const correctAnimation = ref(false) // แอนิเมชันเมื่อคำตอบถูก
const pokemonOptions = ref<string[]>([]) // ตัวเลือกคำตอบ Array
const allPokemonNames = ref<string[]>([]) // รายชื่อโปเกมอนทั้งหมดที่โหลดมา

// สร้างลิงก์รูปภาพโปเกมอน
// ดึงรูปภาพของตัวปัจจุบันมาเก็บ
const pokemonImageUrl = computed(() => {
  if (!currentPokemon.value) return ''
  return (
    currentPokemon.value.sprites.front_default ||
    currentPokemon.value.sprites.back_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${currentPokemon.value.id}.png`
  )
})

// การแสดงสีของข้อความตอบกลับ
const feedbackClass = computed(() => {
  if (feedbackMessage.value.includes('Correct')) {
    return 'bg-green-100 text-green-800'
    //มี Correct ก็พื้นหลังสีเขียว
  } else if (feedbackMessage.value.includes('Wrong')) {
    return 'bg-red-100 text-red-800'
    //มี Wrong ก็พื้นหลังสีแดง
  }
  return ''
  //กรณีผู้เล่นยังไม่ตอบคำถาม
})

// สุ่ม ID ของโปเกมอน (จาก 1 ถึง 151)
const getRandomPokemonId = () => {
  return Math.floor(Math.random() * 151) + 1
}

// interface สำหรับ response รายชื่อโปเกมอนจาก API
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

// ดึงชื่อโปเกมอนแบบสุ่ม (ไม่ซ้ำและไม่ซ้ำคำตอบที่ถูก)
const getRandomPokemonNames = async (correctName: string, count: number = 3) => {
  if (allPokemonNames.value.length > 0) {
    const options: string[] = []
    while (options.length < count) {
      const randomIndex = Math.floor(Math.random() * allPokemonNames.value.length)
      const name = allPokemonNames.value[randomIndex]
      if (name !== correctName && !options.includes(name)) {
        options.push(name)
      }
    }
    return options
  } else {
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

// สร้างตัวเลือกคำตอบ 4 ตัวเลือก
const createOptions = async (correctName: string) => {
  //รับ String เป็น parameter
  const wrongOptions = await getRandomPokemonNames(correctName) /////////////////////////////////

  const options = [...wrongOptions, correctName] //ทำการรวม 4 ตัวเลือกที่ผิดและถูกไว้ด้วยกัน (optioins)<-เป็นคนเก็บ
  //...wrongOptions = เอาค่าสมาชิกในอาร์เรย์ออกมาทีละตัว สมมุติ wrongOptions = ['pikachu', 'bulbasaur', 'charmander']
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)) // Fisher–Yates shuffle algorithm
    ;[options[i], options[j]] = [options[j], options[i]]
  }
  pokemonOptions.value = options // ได้ตัวเลือกสำหรับใช้จริงมาแล้ว
}

// ดึงข้อมูลโปเกมอนใหม่
const getNewPokemon = async () => {
  try {
    revealed.value = false // บังคับซ่อนภาพโปเกม่อน
    feedbackMessage.value = '' // ซ่อน feedbackMessage
    correctAnimation.value = false //พยายามปิด Animation เพื่อป้องกันการบัค
    currentPokemon.value = null // ล้างข้อมูล โปเกม่อน ที่นำมาเล่น

    if (lives.value <= 0) {
      //เหลือชีวิต 0 บังคับจบเกม
      gameOver.value = true
      return
    }

    const id = getRandomPokemonId() // สุ่มค่า ID ของโปเกม่อน ใน range ที่อยากได้

    const response = await axios.get<PokemonApiResponse>(`https://pokeapi.co/api/v2/pokemon/${id}`)
    //นำ PokemonApiResponse ไปจับค่าโปเกม่อน ตาม ID ที่สุ่มได้

    const pokemonData = response.data // สร้าง pokemonData เพื่อมาเก็บตัว response
    await createOptions(pokemonData.name) // เอา pokemonData(ตัวที่สุ่มได้) ไปสร้างตัวเลือกคำตอบ
    currentPokemon.value = pokemonData // pokemonData ไปไว้ใน currentPokemon เพื่อบอกโปรแกรมของเราว่า currentPokemon เป็นใคร
  } catch (error) {
    //โยน error ออก กรณี ทำอะไรพลาด
    console.error('Error fetching Pokémon:', error)
    feedbackMessage.value = 'Error loading Pokémon. Please try again.'
  }
}

// ตรวจสอบคำตอบของผู้เล่น
const checkAnswer = (selectedOption: string) => {
  if (!currentPokemon.value || revealed.value || gameOver.value) return

  const correctName = currentPokemon.value.name.toLowerCase()
  const userAnswer = selectedOption.toLowerCase()

  if (userAnswer === correctName) {
    revealed.value = true
    feedbackMessage.value = 'Correct! Well done!'
    score.value += 10
    streak.value++

    if (streak.value > bestStreak.value) {
      bestStreak.value = streak.value
      localStorage.setItem('pokemonGameBestStreak', bestStreak.value.toString())
    }

    if (score.value > highScore.value) {
      highScore.value = score.value
      localStorage.setItem('pokemonGameHighScore', highScore.value.toString())
    }

    correctAnimation.value = true
    setTimeout(() => {
      correctAnimation.value = false
    }, 1000)
  } else {
    revealed.value = true
    feedbackMessage.value = `Wrong! The correct answer is ${correctName}.`
    lostLives.value++
    lives.value--
    streak.value = 0
    if (lives.value <= 0 || lostLives.value >= 3) {
      gameOver.value = true
    }
  }
}

// รีเซ็ตเกมเมื่อ Game Over
const resetGame = () => {
  score.value = 0
  streak.value = 0
  lives.value = 3
  lostLives.value = 0
  gameOver.value = false
  revealed.value = false
  feedbackMessage.value = ''
  getNewPokemon()
}

// กำหนดสีของป้ายประเภทโปเกมอน
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

// โหลดข้อมูลตอนเริ่มต้น
onMounted(async () => {
  const savedHighScore = localStorage.getItem('pokemonGameHighScore')
  if (savedHighScore) {
    highScore.value = parseInt(savedHighScore)
  }

  const savedBestStreak = localStorage.getItem('pokemonGameBestStreak')
  if (savedBestStreak) {
    bestStreak.value = parseInt(savedBestStreak)
  }

  try {
    const response = await axios.get<PokemonListResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=151',
    )
    allPokemonNames.value = response.data.results.map((p) => p.name)
  } catch (error) {
    console.error('Error preloading Pokemon names:', error)
  }

  await getNewPokemon()
})
</script>

<style scoped>
/* ทำให้โปเกมอนเป็นภาพเงา */
.pokemon-silhouette {
  filter: brightness(0);
  transform: scale(1.1);
}
/* เฉลยโปเกมอน */
.pokemon-revealed {
  filter: brightness(1);
  transform: scale(1);
}
/* แอนิเมชันเมื่อคำตอบถูก มันจะเด้งนิดหน่อย*/
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
/* แอนิเมชันข้อความให้ไหลลงมา */
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
