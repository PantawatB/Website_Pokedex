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
        <!-- Tester Only Deverloper
        <div class="flex justify-center mb-4">
          <button
            v-if="!revealed && !gameOver"
            @click="getNewPokemon"
            class="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Next Pokémon
          </button>
        </div> -->

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
            class="w-48 h-48 object-contain transition-all duration-300 pokemon-image"
            :class="{
              'pokemon-silhouette': !revealed,
              'pokemon-revealed': revealed,
              'correct-animation': correctAnimation,
            }"
            @error="handleImageError"
          />
          <!-- มีการเพิ่มการ handleImageError เพื่อป้องกันภาพไม่โหลด -->
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
            <!-- แสดง <div> นี้ เฉพาะเมื่อโปเกมอนถูกเปิดแล้ว -->
            <!-- วนลูปแสดงประเภทของโปเกมอนที่มีหลาย type -->
            <!-- คลาส CSS เฉพาะสำหรับแต่ละ type -->
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
        <!-- แสดง <div> นี้ เฉพาะเมื่อได้รับแแจ้งว่ามี feedbackMessage -->
        <div v-if="feedbackMessage" class="mb-4 text-center p-2 rounded-lg" :class="feedbackClass">
          {{ feedbackMessage }}
        </div>

        <!-- ปุ่มตัวเลือกคำตอบแบบหลายตัวเลือก -->
        <!-- แสดง <div> นี้เฉพาะเมื่อยังไม่เฉลยและยังไม่จบเกม -->
        <div v-if="!revealed && !gameOver" class="grid grid-cols-2 gap-3 mb-4">
          <button
            v-for="(option, index) in pokemonOptions"
            :key="index"
            @click="checkAnswer(option)"
            class="bg-white border border-gray-400 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors text-center capitalize font-medium"
            :class="{ 'opacity-50 cursor-not-allowed': revealed }"
            :disabled="revealed"
          >
            <!-- เฉลยแล้วจะปิดปุ่ม -->
            {{ option }}
          </button>
        </div>

        <!-- ปุ่มเพื่อเล่นรอบถัดไป -->
        <!-- แสดง <div> นี้ตอน เฉลยแล้วและไม่จบเกม -->
        <div class="flex justify-center mb-4">
          <button
            v-if="revealed && !gameOver"
            @click="getNewPokemon"
            class="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Next Pokémon
          </button>
        </div>

        <div class="flex justify-center mb-4">
          <button
            v-if="!revealed && !gameOver"
            @click="reloadPokemonImage"
            class="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Change image if image doesn't load!
          </button>
        </div>

        <!-- หน้าจอ Game Over -->
        <!-- แสดง <div> นี้ตอน จบเกม -->
        <div v-if="gameOver" class="text-center mb-4">
          <div class="text-3xl font-bold text-red-500 mb-3">Game Over!</div>
          <div class="mb-4">Final Score: {{ score }}</div>
          <button
            @click="resetGame"
            class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-500 transition-colors"
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
          <li>Choose the correct Pokémon name from 4 options</li>
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
    other?: {
      'official-artwork'?: {
        front_default?: string
      }
      home?: {
        front_default?: string
      }
      'dream-world'?: {
        front_default?: string
        front_female?: string
      }
    }
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
const currentImageSourceIndex = ref(0) // ดัชนีของแหล่งรูปภาพปัจจุบัน (ใช้สำหรับการเปลี่ยนรูปภาพ)

// สร้างลิงก์รูปภาพโปเกมอน
// ดึงรูปภาพของตัวปัจจุบันมาเก็บ ไว้ใน pokemonImageUrl
const pokemonImageUrl = computed(() => {
  if (!currentPokemon.value) return ''

  // ลำดับการเลือกรูปภาพ (เรียงตามลำดับความสำคัญ)
  return (
    // 1. ใช้รูปหน้าจาก API หรือ GitHub
    currentPokemon.value.sprites.front_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${currentPokemon.value.id}.png` ||
    // 2. ใช้รูป official artwork ถ้ามี
    currentPokemon.value.sprites.other?.['official-artwork']?.front_default ||
    // 3. ใช้รูปจาก Dream World ถ้ามี
    currentPokemon.value.sprites.other?.['dream-world']?.front_default ||
    // 4. ใช้รูปจาก Pokemon Home ถ้ามี
    currentPokemon.value.sprites.other?.home?.front_default ||
    // 5. ใช้รูปหลังจาก API หรือ GitHub (ถ้าไม่มีรูปหน้า)
    currentPokemon.value.sprites.back_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${currentPokemon.value.id}.png`
  )
})

// การแสดงสีของข้อความตอบกลับ
const feedbackClass = computed(() => {
  if (
    feedbackMessage.value.includes('Correct') ||
    feedbackMessage.value.includes('reloaded successfully')
  ) {
    return 'bg-green-100 text-green-800'
    //มี Correct หรือ reloaded successfully ก็พื้นหลังสีเขียว
  } else if (
    feedbackMessage.value.includes('Wrong') ||
    feedbackMessage.value.includes('Error') ||
    feedbackMessage.value.includes('Loading issues')
  ) {
    return 'bg-red-100 text-red-800'
    //มี Wrong,Loading issues หรือ Error ก็พื้นหลังสีแดง
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

// สุ่มชื่อโปเกมอนตัวที่ผิด
const getRandomPokemonNames = async (correctName: string, count: number = 3) => {
  // รับชื่อที่ถูกต้องมาสำหรับการรันคำสั่งและ สุ่มคำตอบที่ผิดโดยกำหนดค่า count (โดยเริ่มต้นเป็น 3 )
  if (allPokemonNames.value.length > 0) {
    // ถ้ามีข้อมูลใน allPokemonNames (มีการดึงข้อมูลตอน onMounted สำเร็จแล้ว)
    const options: string[] = [] //สร้าง options เป็น array เพื่อสุ่มเก็บชื่อโปเกม่อนตัวที่ผิด
    while (options.length < count) {
      // ยังสุ่มไม่เต็ม options ก็ให้สุ่มอีก
      const randomIndex = Math.floor(Math.random() * allPokemonNames.value.length) // สุ่มตัวเลขจากใน length ของ allPokemonNames
      const name = allPokemonNames.value[randomIndex] // นำ randomIndex ไปไว้ใน name เอาชื่อโปเกม่อน
      if (name !== correctName && !options.includes(name)) {
        // ตรวจ name ต้องไม่ตรงกับชื่อที่ถูก และ ไม่ซ้ำกับ options ที่มีอยู่แล้ว
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
      return getRandomPokemonNames(correctName, count) //ถ้าไม่มีโปเกม่อนใน allPokemonNames ให้ไปโหลดข้อมูล
    } catch (error) {
      console.error('Error fetching Pokemon names:', error)
      return ['bulbasaur', 'charmander', 'squirtle'].filter((name) => name !== correctName)
      //ถ้าโหลด API ไม่ได้ จะ fallback ด้วยชื่อพื้นฐาน 3 ตัว (กันเกมพัง)
    }
  }
}

// สร้างตัวเลือกคำตอบแบบ 4 ตัว นำโปเกม่อนตัวที่ถูก กับ ตัวที่ผิดมาสุ่มวาง ว่าจะวางไว้ตรงไหน
const createOptions = async (correctName: string) => {
  //รับ String เป็น parameter
  const wrongOptions = await getRandomPokemonNames(correctName) /////////////////////////////////

  const options = [...wrongOptions, correctName] //ทำการรวม 4 ตัวเลือกที่ผิดและถูกไว้ด้วยกัน (optioins) <-เป็นคนเก็บ
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
    currentImageSourceIndex.value = 0 // รีเซ็ต index แหล่งรูปภาพกลับเป็น 0

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

// ฟังก์ชันจัดการเมื่อรูปภาพโหลดไม่สำเร็จ
const handleImageError = (event: Event) => {
  if (!currentPokemon.value) return

  // // แสดงข้อความแจ้งเตือน
  // feedbackMessage.value = 'Image failed to load. Try using the reload button.'

  // ลองใช้รูปภาพสำรองจากแหล่งอื่น
  const imgElement = event.target as HTMLImageElement //แปลงเเป็น Element รูปภาพ
  const pokemonId = currentPokemon.value.id // เก็บไอดีไว้ใช้หารูปภาพอื่น

  // ลองใช้รูปภาพสำรองตามลำดับ (ให้ความสำคัญกับรูปด้านหน้าก่อน)
  const fallbackUrls = [
    // 1. ใช้รูปหน้าจาก GitHub PokeAPI repository
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`,

    // 2. ใช้รูป official artwork
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,

    // 3. ใช้รูปจาก Dream World
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg`,

    // 4. ใช้รูปจาก Pokemon Home
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemonId}.png`,

    // 5. ใช้รูปหลังจาก API หรือ GitHub
    currentPokemon.value.sprites.back_default ||
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokemonId}.png`,
  ]

  // ใช้ URL สำรองแรกที่ไม่ใช่ URL ปัจจุบัน
  for (const url of fallbackUrls) {
    if (url && url !== imgElement.src) {
      imgElement.src = url
      return
    }
  }
}

// ฟังก์ชันสำหรับดึง URL รูปภาพตามดัชนีที่กำหนด
const getImageUrlByIndex = (pokemon: PokemonApiResponse, index: number): string => {
  // เก็บไอดีของ pokemon
  const id = pokemon.id

  // รายการแหล่งรูปภาพตามลำดับความสำคัญ
  const imageSources = [
    // 0. ใช้รูปหน้า (API หรือ GitHub)
    pokemon.sprites.front_default ||
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,

    // 1. ใช้รูป official artwork
    pokemon.sprites.other?.['official-artwork']?.front_default,

    // 2. ใช้รูปจาก Dream World
    pokemon.sprites.other?.['dream-world']?.front_default,

    // 3. ใช้รูปจาก Pokemon Home
    pokemon.sprites.other?.home?.front_default,

    // 4. ใช้รูปหลัง (API หรือ GitHub)
    pokemon.sprites.back_default ||
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${id}.png`,
  ]

  // ใช้ modulo เพื่อให้ดัชนีวนกลับมาเริ่มต้นใหม่เมื่อเกินขนาดของ array
  const normalizedIndex = index % imageSources.length

  // ถ้า URL ที่ได้เป็น undefined หรือ null ให้ลองใช้ URL ถัดไป
  for (let i = 0; i < imageSources.length; i++) {
    const sourceIndex = (normalizedIndex + i) % imageSources.length
    if (imageSources[sourceIndex]) {
      return imageSources[sourceIndex] as string
    }
  }

  // ถ้าไม่มี URL ที่ใช้ได้เลย ให้ใช้ URL เริ่มต้น
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}

// ฟังก์ชันสำหรับบังคับเปลี่ยนรูปภาพโปเกมอนตามลำดับความสำคัญ
const reloadPokemonImage = () => {
  try {
    if (!currentPokemon.value) return

    // เพิ่มดัชนีเพื่อเปลี่ยนไปใช้แหล่งรูปภาพถัดไป
    currentImageSourceIndex.value = (currentImageSourceIndex.value + 1) % 5 //5 แหล่งภาพ

    // ดึง URL รูปภาพตามดัชนีปัจจุบัน
    const newImageUrl = getImageUrlByIndex(currentPokemon.value, currentImageSourceIndex.value)

    // อัปเดตรูปภาพโดยตรงที่ DOM element
    const imgElement = document.querySelector('.pokemon-image') as HTMLImageElement
    if (imgElement) {
      imgElement.src = newImageUrl //แทนที่รูปภาพอันใหม่ทันที

      // แสดงชื่อแหล่งรูปภาพปัจจุบัน
      const sourceNames = [
        'Front view',
        'Official Artwork',
        'Dream World',
        'Pokemon Home',
        'Back view',
      ]

      // แสดงข้อความว่าเปลี่ยนรูปภาพสำเร็จ
      feedbackMessage.value = `ⓘ Loading issues, Changed img to ${sourceNames[currentImageSourceIndex.value]}`
      setTimeout(() => {
        feedbackMessage.value = ''
      }, 2000)
    }
  } catch (error) {
    console.error('Error changing Pokémon image:', error)
    feedbackMessage.value = 'ⓘ Error changing image. Please try again.'
    setTimeout(() => {
      feedbackMessage.value = ''
    }, 2000)
  }
}

// ตรวจสอบคำตอบของผู้เล่น
const checkAnswer = (selectedOption: string) => {
  // รับสิ่งที่ผู้เล่นเลือกมา
  if (!currentPokemon.value || revealed.value || gameOver.value) return
  // ถ้า currentPokemon ไม่มี หรือ เปิดเงาไปแล้ว หรือ gameOver ให้ return ไม่ต้องทำอะไร

  const correctName = currentPokemon.value.name.toLowerCase() //รับค่าตัวที่ถูกและเปลี่ยนเป็นตัวเล็ก
  const userAnswer = selectedOption.toLowerCase() //สิ่งที่คนเล่นเลือกเปลี่ยนเป็นตัวเล็กและ ตั้งชื่อว่า userAnswer

  if (userAnswer === correctName) {
    // ถ้าถูก
    revealed.value = true // เงา
    feedbackMessage.value = 'Correct! Well done!' // ข้อความ feedback
    score.value += 10 // เพิ่มคะแนน 10
    streak.value++ // ชนะต่อเนื่อง +1

    if (streak.value > bestStreak.value) {
      // ถ้าการชนะต่อเนื่อง > bestStreak ให้ เปลี่ยน HighScore
      bestStreak.value = streak.value
      localStorage.setItem('pokemonGameBestStreak', bestStreak.value.toString()) // บันทึก bestStreak ไว้ใน localStorage
    }

    if (score.value > highScore.value) {
      // ถ้า score > highScore ให้เปลี่ยน HighScore
      highScore.value = score.value
      localStorage.setItem('pokemonGameHighScore', highScore.value.toString()) // บันทึก highScore ไว้ใน localStorage
    }

    correctAnimation.value = true
    setTimeout(() => {
      // บังคับปิด animation กันพลาด
      correctAnimation.value = false
    }, 1000)
  } else {
    //   ในกรณีถ้าตอบผิด
    revealed.value = true // เปิดภาพ
    feedbackMessage.value = `Wrong! The correct answer is ${correctName}.` //บอกว่าตอบผิด
    lostLives.value++ // เพิ่มค่าชีวิตที่ต้องเสีย
    lives.value-- // ลดชีวิต
    streak.value = 0 // reset ชนะต่อเนื่อง
    if (lives.value <= 0 || lostLives.value >= 3) {
      gameOver.value = true // จบเกมตอนไหน
    }
  }
}

// รีเซ็ตเกมเมื่อ Game Over
const resetGame = () => {
  // เอาไว้ใช้ reset game
  score.value = 0 // score เริ่มต้องไม่มี
  streak.value = 0 // การชนะเกมต่อเนื่องต้องไม่มี
  lives.value = 3 // ชีวิตเต็ม
  lostLives.value = 0 // ยังไม่มีการสูญเสียชีวิต
  gameOver.value = false // หยุดการจบเกม
  revealed.value = false // ปิดการเฉลย
  feedbackMessage.value = '' // ปิด feedbackMessage
  getNewPokemon() // สุ่มตัวใหม่มาเล่น
}

// กำหนดสีของป้ายประเภทโปเกมอน
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
  // ดึงประวัติ ScoreBoard
  try {
    const response = await axios.get<PokemonListResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=151',
    ) //ดึง pokemon 151 ตัว
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
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.bg-green-100,
.bg-red-100 {
  animation: fadeIn 0.5s ease-out;
}
</style>
