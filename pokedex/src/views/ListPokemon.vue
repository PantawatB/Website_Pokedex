<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navbar -->
    <MainWeb></MainWeb>

    <!-- Search and Filter -->
    <div class="max-w-7xl mx-auto p-6">
      <div class="flex items-center gap-4">
        <input
          type="text"
          v-model="searchkey"
          placeholder="Search your Pokémon!"
          class="flex-1 p-3 rounded-md shadow-md border border-gray-300"
        />
        <!-- ถ้ามีการ search ให้โชว์ปุ่มขึ้นมา -->
        <!-- ปุ่มสำหรับ clear search X -->
        <button
          @click="searchkey = ''"
          v-if="searchkey"
          class="p-3 bg-gray-500 rounded-full text-white"
          title="Clear search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <div class="p-3 bg-red-500 rounded-full text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>

      <!-- ตัวนับว่าเจอกี่ตัว Trim()<ตัวลบช่องว่าง> -->
      <div v-if="searchkey.trim()" class="mt-4 text-gray-600">
        Found {{ filteredPokemonList.length }} Pokémon matching "{{ searchkey }}"
      </div>

      <!-- Filters -->
      <div class="flex items-center gap-4 mt-6">
        <div class="flex items-center">
          <label class="font-semibold">Sorting by:</label>
        </div>
        <div class="flex gap-2">
          <select class="p-2 border border-gray-300 rounded-md">
            <option>Type</option>
          </select>
          <select class="p-2 border border-gray-300 rounded-md">
            <option>Weaknesses</option>
          </select>
          <select class="p-2 border border-gray-300 rounded-md">
            <option>Ability</option>
          </select>
          <select class="p-2 border border-gray-300 rounded-md">
            <option>Height</option>
          </select>
          <select class="p-2 border border-gray-300 rounded-md">
            <option>Weight</option>
          </select>
        </div>
      </div>

      <!-- Pokémon Grid -->
      <div class="flex gap-8 mt-10">
        <!-- Left Grid -->
        <div class="flex-1 grid grid-cols-3 gap-6">
          <div
            v-if="filteredPokemonList.length === 0 && searchkey.trim()"
            class="col-span-3 text-center py-10"
          >
            <div class="text-xl font-semibold text-gray-500">
              No Pokémon found matching "{{ searchkey }}"
            </div>
            <button @click="searchkey = ''" class="mt-4 px-4 py-2 bg-red-500 text-white rounded-md">
              Clear Search
            </button>
          </div>
          <div
            v-for="item in filteredPokemonList"
            :key="item.id"
            class="bg-white p-4 rounded-lg shadow-md flex flex-col items-center relative cursor-pointer transform transition-transform duration-300 hover:scale-105"
            @click="selectPokemon(item)"
          >
            <img
              :src="getPokemonImageUrl(item)"
              :alt="item.name"
              class="w-24 h-24 object-contain"
              @error="(e) => handleImageError(e, item.id)"
            />
            <div class="capitalize font-bold mb-2">{{ item.name }}</div>
            <div class="flex gap-2 justify-center">
              <span
                v-for="(typeObj, index) in item.types"
                :key="index"
                class="text-xs px-2 py-1 rounded-full font-semibold capitalize"
                :class="getTypeClass(typeObj.type.name)"
              >
                {{ typeObj.type.name }}
              </span>
            </div>
          </div>
        </div>

        <!-- Right Sidebar -->
        <div class="w-[320px] bg-white p-6 rounded-lg shadow-md">
          <div class="relative mb-4">
            <button
              v-if="selectedPokemon"
              @click="toggleShiny"
              class="absolute top-0 right-0 bg-slate-800 text-xs px-2 py-1 rounded text-white"
            >
              {{ isShiny ? 'Toggle to Normal' : 'Toggle to Shiny' }}
            </button>
          </div>
          <div v-if="!selectedPokemon" class="flex flex-col items-center">
            <div class="h-20 w-20 bg-gray-200 rounded-full mb-4"></div>
            <div class="text-2xl text-center font-bold mb-2">Please select any Pokémon</div>
            <div class="text-gray-500 text-sm mb-4">Click on a Pokémon card to view details</div>
            <div class="flex gap-2 mb-4 justify-center">
              <span class="px-3 py-1 bg-gray-300 text-gray-700 rounded-full text-xs"
                >Select a Pokémon</span
              >
            </div>
          </div>

          <div v-else class="flex flex-col items-center">
            <!-- Pokemon Image with Shiny Toggle -->
            <div class="relative mb-4">
              <img
                :src="getSelectedPokemonImageUrl()"
                :alt="selectedPokemon.name"
                class="w-40 h-40 object-contain"
                @error="(e) => selectedPokemon && handleImageError(e, selectedPokemon.id)"
              />
            </div>

            <!-- Pokemon ID and Name -->
            <div class="text-gray-500 text-sm mb-1">#{{ selectedPokemon.id }}</div>
            <div class="text-2xl text-center font-bold mb-2 capitalize">
              {{ selectedPokemon.name }}
            </div>

            <!-- Pokemon Types -->
            <div class="flex gap-2 mb-4 justify-center">
              <span
                v-for="(typeObj, index) in selectedPokemon.types"
                :key="index"
                class="px-3 py-1 rounded-full text-xs font-semibold capitalize"
                :class="getTypeClass(typeObj.type.name)"
              >
                {{ typeObj.type.name }}
              </span>
            </div>

            <!-- Pokemon Description -->
            <p v-if="pokemonSpecies" class="text-gray-600 text-center text-sm mb-6">
              {{ getPokemonDescription() }}
            </p>

            <!-- Pokemon Abilities -->
            <div
              v-if="selectedPokemon.abilities && selectedPokemon.abilities.length > 0"
              class="w-full mb-6"
            >
              <div class="text-sm mb-2 font-semibold">Abilities</div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(abilityObj, index) in selectedPokemon.abilities"
                  :key="index"
                  class="px-2 py-1 bg-gray-300 rounded capitalize"
                  :class="{
                    ' bg-slate-800 text-white  border-red-600 border-[px]': abilityObj.is_hidden,
                  }"
                >
                  {{ abilityObj.ability.name }}
                  <span v-if="abilityObj.is_hidden" class="text-xs text-purple-300 ml-1"
                    >(hidden)</span
                  >
                </span>
              </div>
            </div>

            <!-- Height and Weight -->
            <div class="flex justify-between w-full text-xs text-gray-500 mb-4">
              <div>
                <div class="font-bold text-gray-800">Height</div>
                <div>{{ (selectedPokemon.height / 10).toFixed(1) }}m</div>
              </div>
              <div>
                <div class="font-bold text-gray-800">Weight</div>
                <div>{{ (selectedPokemon.weight / 10).toFixed(1) }}kg</div>
              </div>
              <div v-if="pokemonSpecies">
                <div class="font-bold text-gray-800">Gender</div>
                <div>{{ getGenderRatio() }}</div>
              </div>
            </div>

            <!-- Type Relationships -->
            <div class="w-full mb-6">
              <!-- Weaknesses -->
              <div v-if="typeWeaknesses.length > 0" class="mb-4">
                <div class="text-sm font-semibold mb-2">Weaknesses</div>

                <!-- 4x Weaknesses -->
                <div v-if="typeWeaknesses.some((item) => item.effectiveness === 4)" class="mb-2">
                  <div class="text-xs font-medium mb-1 text-black">Takes 4× more damage with:</div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(item, index) in typeWeaknesses.filter(
                        (item) => item.effectiveness === 4,
                      )"
                      :key="index"
                      class="px-2 py-1 rounded-full text-xs font-semibold capitalize"
                      :class="getTypeClass(item.type)"
                    >
                      {{ item.type }}
                    </span>
                  </div>
                </div>

                <!-- 2x Weaknesses -->
                <div v-if="typeWeaknesses.some((item) => item.effectiveness === 2)">
                  <div class="text-xs font-medium mb-1 text-black">Takes 2× more damage with:</div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(item, index) in typeWeaknesses.filter(
                        (item) => item.effectiveness === 2,
                      )"
                      :key="index"
                      class="px-2 py-1 rounded-full text-xs font-semibold capitalize"
                      :class="getTypeClass(item.type)"
                    >
                      {{ item.type }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Resistances -->
              <div v-if="typeResistances.length > 0">
                <div class="text-sm font-semibold mb-2">Resistances</div>

                <!-- Immune -->
                <div v-if="typeResistances.some((item) => item.effectiveness === 0)" class="mb-2">
                  <div class="text-xs font-medium mb-1 text-black">Immune to:</div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(item, index) in typeResistances.filter(
                        (item) => item.effectiveness === 0,
                      )"
                      :key="index"
                      class="px-2 py-1 rounded-full text-xs font-semibold capitalize"
                      :class="getTypeClass(item.type)"
                    >
                      {{ item.type }}
                    </span>
                  </div>
                </div>

                <!-- 1/4x Resistance -->
                <div
                  v-if="typeResistances.some((item) => item.effectiveness === 0.25)"
                  class="mb-2"
                >
                  <div class="text-xs font-medium mb-1 text-black">Takes ¼× less damage with:</div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(item, index) in typeResistances.filter(
                        (item) => item.effectiveness === 0.25,
                      )"
                      :key="index"
                      class="px-2 py-1 rounded-full text-xs font-semibold capitalize"
                      :class="getTypeClass(item.type)"
                    >
                      {{ item.type }}
                    </span>
                  </div>
                </div>

                <!-- 1/2x Resistance -->
                <div v-if="typeResistances.some((item) => item.effectiveness === 0.5)">
                  <div class="text-xs font-medium mb-1 text-black">Takes ½× less damage with:</div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(item, index) in typeResistances.filter(
                        (item) => item.effectiveness === 0.5,
                      )"
                      :key="index"
                      class="px-2 py-1 rounded-full text-xs font-semibold capitalize"
                      :class="getTypeClass(item.type)"
                    >
                      {{ item.type }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Evolution Chain -->
            <div v-if="evolutionChain" class="w-full mb-6">
              <div class="text-sm font-semibold mb-2">Evolution Chain</div>
              <div class="flex items-center justify-center gap-2">
                <div
                  v-for="(evo, index) in getEvolutionChainData()"
                  :key="evo.id"
                  class="flex items-center"
                >
                  <!-- Pokemon in evolution chain -->
                  <div class="flex flex-col items-center">
                    <img
                      :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`"
                      :alt="evo.name"
                      class="w-16 h-16 object-contain"
                    />
                    <div class="text-xs capitalize">{{ evo.name }}</div>
                    <div v-if="evo.minLevel" class="text-xs text-gray-500">
                      Lv.{{ evo.minLevel }}
                    </div>
                  </div>

                  <!-- Arrow between evolutions -->
                  <div v-if="index < getEvolutionChainData().length - 1" class="mx-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex justify-between w-full mt-4">
              <button
                @click="goToPreviousPokemon"
                class="px-4 py-2 bg-slate-800 text-white rounded-md disabled:opacity-50"
                :disabled="!selectedPokemon || selectedPokemon.id <= 1"
              >
                Previous
              </button>
              <button
                @click="goToNextPokemon"
                class="px-4 py-2 bg-slate-800 text-white rounded-md disabled:opacity-50"
                :disabled="!selectedPokemon || selectedPokemon.id >= fullPokemonList.length"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MainWeb from '@/components/MainWeb.vue'
import axios from 'axios'
import { ref, onMounted, computed } from 'vue'
import type {
  PokemonDetail,
  PokemonSpecies,
  EvolutionChain,
  DamageRelations,
} from '@/models/pokemon.model'
const fullPokemonList = ref<PokemonDetail[]>([]) //fullPokemonList เป็น PokemonDetail ที่เป็น array
const searchkey = ref('')

// ตัวแปรสำหรับเก็บข้อมูล Pokemon ที่เลือก
const selectedPokemon = ref<PokemonDetail | null>(null)
const isShiny = ref(false) // สถานะการแสดงรูป Shiny
const pokemonSpecies = ref<PokemonSpecies | null>(null) // ข้อมูลเพิ่มเติมของ Pokemon (คำอธิบาย, เพศ, ฯลฯ)
const evolutionChain = ref<EvolutionChain | null>(null) // ข้อมูล evolution chain
// ข้อมูลความสัมพันธ์ของธาตุ
interface TypeEffectiveness {
  type: string
  effectiveness: number // 0 = immune, 0.25 = very resistant, 0.5 = resistant, 1 = normal, 2 = weak, 4 = very weak
}

const typeWeaknesses = ref<TypeEffectiveness[]>([]) // ประเภทที่ Pokemon นี้แพ้ (effectiveness > 1)
const typeResistances = ref<TypeEffectiveness[]>([]) // ประเภทที่ Pokemon ต้านทาน (effectiveness < 1)

// Computed
const filteredPokemonList = computed(() => {
  if (!searchkey.value.trim()) {
    return fullPokemonList.value // ไม่มี search ให้โชว์ทั้งหมด
  }

  const keyword = searchkey.value.toLowerCase().trim() //ปรับเป็นตัวเล็กเอาช่องว่างออก
  return fullPokemonList.value.filter(
    (pokemon) =>
      pokemon.name.toLowerCase().includes(keyword) || pokemon.id.toString().includes(keyword),
  )
})

const all1025Pokemon = async () => {
  // ฟังก์ชั่นใหญ่ที่ต้องใส่ await first150Pokemon() เพื่อรอให้เสร็จ
  const limit = 150 //จํานวน pokemon ที่ต้องการสูงสุด 150 ตัว max 1025
  const allPokemon = []

  for (let id = 1; id <= limit; id++) {
    allPokemon.push(axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`))
  }
  const finish150PokemonList = await Promise.all(allPokemon) //รอให้ดึง pokemon ทั้งหมดเสร็จ
  fullPokemonList.value = finish150PokemonList.map((res) => ({
    //เอาค่าที่อยากใช้ไปไว้ใน fullPokemonList
    id: res.data.id,
    name: res.data.name,
    base_experience: res.data.base_experience, //ข้อมูลที่ดึงมาจะอยู่ใน res.data
    height: res.data.height,
    weight: res.data.weight,
    sprites: res.data.sprites, // เพิ่มข้อมูลรูปภาพ
    types: res.data.types, // เพิ่มข้อมูลประเภทของโปเกมอน
    abilities: res.data.abilities, // เพิ่มข้อมูลความสามารถของโปเกมอน
  }))
}
// ตัวแปรเก็บข้อมูลว่าได้ลองใช้รูปภาพใดแล้วบ้างสำหรับแต่ละ Pokemon
const imageAttempts = ref<Record<number, string[]>>({})

// ฟังก์ชันจัดการเมื่อรูปภาพโหลดไม่สำเร็จ
const handleImageError = (event: Event, pokemonId: number) => {
  // ลองใช้รูปภาพสำรองจากแหล่งอื่น
  const imgElement = event.target as HTMLImageElement
  const currentSrc = imgElement.src

  // ตรวจสอบว่าเป็นรูป no-image.png หรือไม่ ถ้าใช่ให้หยุดการทำงาน
  if (currentSrc.includes('/no-image.png')) {
    console.log(`Stopped trying to load image for Pokemon #${pokemonId} to prevent infinite loop`)
    return
  }

  // สร้าง array เก็บประวัติการลองใช้รูปภาพสำหรับ Pokemon นี้ ถ้ายังไม่มี
  if (!imageAttempts.value[pokemonId]) {
    imageAttempts.value[pokemonId] = []
  }

  // เพิ่ม URL ปัจจุบันเข้าไปในประวัติ
  imageAttempts.value[pokemonId].push(currentSrc)

  // ตรวจสอบว่าเป็นรูป Shiny หรือไม่
  const isShinyImage = currentSrc.includes('/shiny/') || currentSrc.includes('shiny')

  // ลองใช้รูปภาพสำรองตามลำดับความสำคัญ
  const fallbackUrls = isShinyImage
    ? [
        // 0. ใช้รูปหน้า Shiny (GitHub)
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemonId}.png`,

        // 1. ใช้รูป official artwork Shiny
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${pokemonId}.png`,

        // 2. ใช้รูปจาก Pokemon Home Shiny
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${pokemonId}.png`,

        // 3. ใช้รูปหลัง Shiny (GitHub)
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/${pokemonId}.png`,

        // 4. ถ้าไม่มีรูป Shiny ให้ลองใช้รูปปกติ
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`,
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,

        // ถ้าไม่มีรูปไหนเลย ให้ใช้รูปว่าง (เพื่อป้องกัน loop)
        '/no-image.png',
      ]
    : [
        // 0. ใช้รูปหน้า (GitHub)
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`,

        // 1. ใช้รูป official artwork
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,

        // 2. ใช้รูปจาก Dream World
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg`,

        // 3. ใช้รูปจาก Pokemon Home
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemonId}.png`,

        // 4. ใช้รูปหลัง (GitHub)
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokemonId}.png`,

        // ถ้าไม่มีรูปไหนเลย ให้ใช้รูปว่าง (เพื่อป้องกัน loop)
        '/no-image.png',
      ]

  // หา URL ถัดไปที่ยังไม่เคยลองใช้
  for (const url of fallbackUrls) {
    // ข้ามถ้า URL เป็น undefined หรือเป็น URL เดิม
    if (!url || url === currentSrc) {
      continue
    }

    // ข้ามถ้าเคยลองใช้ URL นี้แล้ว
    if (imageAttempts.value[pokemonId].includes(url)) {
      continue
    }

    // ใช้ URL นี้
    console.log(`Trying next image source for Pokemon #${pokemonId}: ${url}`)
    imgElement.src = url
    return
  }

  // ถ้าลองทุก URL แล้วยังไม่สำเร็จ ให้ใช้รูป no-image.png
  console.log(`All image sources failed for Pokemon #${pokemonId}, using no-image placeholder`)
  imgElement.src = '/no-image.png'
}

// ฟังก์ชันสำหรับเลือก URL รูปภาพที่เหมาะสม
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

const getPokemonImageUrl = (pokemon: PokemonDetail) => {
  // ถ้ามีข้อมูล sprites ให้ใช้ตามลำดับความสำคัญ
  if (pokemon.sprites) {
    // สร้าง array ของ URL ที่เป็นไปได้ตามลำดับความสำคัญ
    const possibleUrls = [
      // 0. ใช้รูปหน้า (API หรือ GitHub)
      pokemon.sprites.front_default,
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,

      // 1. ใช้รูป official artwork
      pokemon.sprites.other?.['official-artwork']?.front_default,

      // 2. ใช้รูปจาก Dream World
      pokemon.sprites.other?.['dream-world']?.front_default,

      // 3. ใช้รูปจาก Pokemon Home
      pokemon.sprites.other?.home?.front_default,

      // 4. ใช้รูปหลัง (API หรือ GitHub)
      pokemon.sprites.back_default,
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokemon.id}.png`,
    ]

    // ใช้ URL แรกที่ไม่เป็น undefined หรือ null
    for (const url of possibleUrls) {
      if (url) {
        return url
      }
    }

    // ถ้าไม่มี URL ไหนใช้ได้เลย ให้ใช้รูปว่าง
    return '/no-image.png'
  }

  // ถ้าไม่มีข้อมูล sprites ให้ใช้ URL เริ่มต้น
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
}

// ฟังก์ชันสำหรับเลือก Pokemon
const selectPokemon = async (pokemon: PokemonDetail) => {
  selectedPokemon.value = pokemon
  isShiny.value = false // รีเซ็ตสถานะ Shiny เมื่อเลือก Pokemon ใหม่

  // ดึงข้อมูลเพิ่มเติมของ Pokemon
  await fetchPokemonSpecies(pokemon.id)
  await fetchTypeWeaknesses(pokemon.types?.map((t) => t.type.name) || [])
}

// ฟังก์ชันสำหรับดึงข้อมูลเพิ่มเติมของ Pokemon (คำอธิบาย, เพศ, ฯลฯ)
const fetchPokemonSpecies = async (pokemonId: number) => {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`)
    pokemonSpecies.value = response.data

    // ดึงข้อมูล evolution chain
    if (response.data.evolution_chain?.url) {
      await fetchEvolutionChain(response.data.evolution_chain.url)
    }
  } catch (error) {
    console.error('Error fetching Pokemon species:', error)
    pokemonSpecies.value = null
  }
}

// ฟังก์ชันสำหรับดึงข้อมูล evolution chain
const fetchEvolutionChain = async (url: string) => {
  try {
    const response = await axios.get(url)
    evolutionChain.value = response.data
  } catch (error) {
    console.error('Error fetching evolution chain:', error)
    evolutionChain.value = null
  }
}

// ฟังก์ชันสำหรับคำนวณความสัมพันธ์ของธาตุ (ทั้งแพ้และชนะ)
const fetchTypeWeaknesses = async (types: string[]) => {
  try {
    // รีเซ็ตค่า
    typeWeaknesses.value = []
    typeResistances.value = []

    // ดึงข้อมูลความสัมพันธ์ของแต่ละประเภท
    const typePromises = types.map((type) => axios.get(`https://pokeapi.co/api/v2/type/${type}`))
    const typeResponses = await Promise.all(typePromises)

    // สร้าง Map เก็บค่าความอ่อนแอต่อแต่ละประเภท (2 = double damage, 0.5 = half damage, 0 = no damage)
    const effectivenessMap = new Map<string, number>()

    // วนลูปผ่านแต่ละประเภทของ Pokemon
    typeResponses.forEach((response) => {
      const damageRelations = response.data.damage_relations as DamageRelations

      // ประเภทที่ทำให้ Pokemon รับ double damage
      damageRelations.double_damage_from.forEach((type) => {
        const typeName = type.name
        effectivenessMap.set(typeName, (effectivenessMap.get(typeName) || 1) * 2)
      })

      // ประเภทที่ทำให้ Pokemon รับ half damage
      damageRelations.half_damage_from.forEach((type) => {
        const typeName = type.name
        effectivenessMap.set(typeName, (effectivenessMap.get(typeName) || 1) * 0.5)
      })

      // ประเภทที่ทำให้ Pokemon รับ no damage
      damageRelations.no_damage_from.forEach((type) => {
        const typeName = type.name
        effectivenessMap.set(typeName, 0)
      })
    })

    // แปลงข้อมูลจาก Map เป็น Array ของ TypeEffectiveness
    const typeEffectiveness = Array.from(effectivenessMap.entries()).map(
      ([type, effectiveness]) => ({
        type,
        effectiveness,
      }),
    )

    // แยกประเภทที่ Pokemon แพ้ (รับ damage มากกว่าปกติ)
    typeWeaknesses.value = typeEffectiveness
      .filter((item) => item.effectiveness > 1)
      .sort((a, b) => b.effectiveness - a.effectiveness) // เรียงจากแพ้มากไปน้อย

    // แยกประเภทที่ Pokemon ต้านทาน (รับ damage น้อยกว่าปกติ)
    typeResistances.value = typeEffectiveness
      .filter((item) => item.effectiveness < 1 && item.effectiveness > 0)
      .sort((a, b) => a.effectiveness - b.effectiveness) // เรียงจากต้านทานมากไปน้อย
  } catch (error) {
    console.error('Error calculating type relationships:', error)
    typeWeaknesses.value = []
    typeResistances.value = []
  }
}

// ฟังก์ชันสำหรับเปลี่ยนไปยัง Pokemon ก่อนหน้า
const goToPreviousPokemon = () => {
  if (selectedPokemon.value) {
    const currentIndex = fullPokemonList.value.findIndex((p) => p.id === selectedPokemon.value?.id)
    if (currentIndex > 0) {
      selectPokemon(fullPokemonList.value[currentIndex - 1])
    }
  }
}

// ฟังก์ชันสำหรับเปลี่ยนไปยัง Pokemon ถัดไป
const goToNextPokemon = () => {
  if (selectedPokemon.value) {
    const currentIndex = fullPokemonList.value.findIndex((p) => p.id === selectedPokemon.value?.id)
    if (currentIndex < fullPokemonList.value.length - 1) {
      selectPokemon(fullPokemonList.value[currentIndex + 1])
    }
  }
}

// ฟังก์ชันสำหรับสลับระหว่างรูปปกติและรูป Shiny
const toggleShiny = () => {
  isShiny.value = !isShiny.value
}

// ฟังก์ชันสำหรับดึง URL รูปภาพของ Pokemon ที่เลือก
const getSelectedPokemonImageUrl = () => {
  if (!selectedPokemon.value) return ''

  const pokemon = selectedPokemon.value
  const id = pokemon.id

  // ถ้าเป็นโหมด Shiny
  if (isShiny.value) {
    // ลำดับความสำคัญของรูป Shiny
    const shinyUrls = [
      // 1. Official artwork shiny
      pokemon.sprites?.other?.['official-artwork']?.front_shiny,

      // 2. Front shiny
      pokemon.sprites?.front_shiny,
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`,

      // 3. Home shiny
      pokemon.sprites?.other?.home?.front_shiny,

      // 4. Back shiny
      pokemon.sprites?.back_shiny,
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/${id}.png`,
    ]

    // ใช้ URL แรกที่ไม่เป็น undefined หรือ null
    for (const url of shinyUrls) {
      if (url) return url
    }

    // ถ้าไม่มีรูป Shiny ให้ใช้รูปปกติแทน
    return getPokemonImageUrl(pokemon)
  }

  // ถ้าเป็นโหมดปกติ ใช้ฟังก์ชัน getPokemonImageUrl ที่มีอยู่แล้ว
  return getPokemonImageUrl(pokemon)
}

// ฟังก์ชันสำหรับดึงคำอธิบาย Pokemon ในภาษาอังกฤษ
const getPokemonDescription = () => {
  if (!pokemonSpecies.value) return 'No description available.'

  // หาคำอธิบายในภาษาอังกฤษ
  const englishFlavorText = pokemonSpecies.value.flavor_text_entries.find(
    (entry) => entry.language.name === 'en',
  )

  return englishFlavorText
    ? englishFlavorText.flavor_text.replace(/\f/g, ' ')
    : 'No description available.'
}

// ฟังก์ชันสำหรับแปลงค่า gender_rate เป็นอัตราส่วนเพศ
const getGenderRatio = () => {
  if (!pokemonSpecies.value || pokemonSpecies.value.gender_rate === -1) {
    return 'Genderless'
  }

  const femaleRate = (pokemonSpecies.value.gender_rate / 8) * 100
  const maleRate = 100 - femaleRate

  return `♂ ${maleRate}% ♀ ${femaleRate}%`
}

// ฟังก์ชันสำหรับดึงข้อมูล evolution chain ในรูปแบบที่ใช้งานง่าย
const getEvolutionChainData = () => {
  if (!evolutionChain.value) return []

  const evoData: { id: number; name: string; minLevel?: number }[] = []
  let currentChain = evolutionChain.value.chain

  // เริ่มจาก base form
  if (currentChain.species) {
    // ดึง ID จาก URL
    const id = parseInt(currentChain.species.url.split('/').filter(Boolean).pop() || '0')
    evoData.push({ id, name: currentChain.species.name })

    // ตรวจสอบ evolution ถัดไป
    while (currentChain.evolves_to && currentChain.evolves_to.length > 0) {
      currentChain = currentChain.evolves_to[0] // เอาแค่สายวิวัฒนาการหลัก

      // ดึงข้อมูลเงื่อนไขการวิวัฒนาการ
      let minLevel
      if (currentChain.evolution_details && currentChain.evolution_details.length > 0) {
        minLevel = currentChain.evolution_details[0].min_level
      }

      // ดึง ID จาก URL
      const id = parseInt(currentChain.species.url.split('/').filter(Boolean).pop() || '0')
      evoData.push({ id, name: currentChain.species.name, minLevel })
    }
  }

  return evoData
}

onMounted(async () => {
  await all1025Pokemon() // ค้นหาโปเกมอน ID 1-150
  console.log('mounted')
})
</script>

<style scoped></style>
