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
            class="bg-white p-4 rounded-lg shadow-md flex flex-col items-center relative"
          >
            <img
              :src="getPokemonImageUrl(item)"
              :alt="item.name"
              class="w-24 h-24 object-contain"
              @error="(e) => handleImageError(e, item.id)"
            />
            <div class="capitalize font-bold mb-2">{{ item.name }}</div>
            <div class="text-xs px-2 py-1 rounded-full bg-green-200 text-gray-900 font-normal">
              GRASS
            </div>
          </div>
        </div>

        <!-- Right Sidebar -->
        <div class="w-[320px] bg-white p-6 rounded-lg shadow-md">
          <div class="flex flex-col items-center">
            <div class="h-20 w-20 bg-gray-200 rounded-full mb-4"></div>
            <!-- Placeholder for big Pokémon image -->
            <div class="text-2xl font-bold mb-2">Empoleon</div>
            <div class="text-gray-500 text-sm mb-4">Emperor Pokémon</div>

            <div class="flex gap-2 mb-4">
              <span class="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs">WATER</span>
              <span class="px-3 py-1 bg-gray-300 text-gray-700 rounded-full text-xs">STEEL</span>
            </div>

            <!-- <p class="text-gray-600 text-center text-sm mb-6">
              It swims as fast as a jet boat. The edges of its wings are sharp and can slice apart
              drifting ice.
            </p> -->

            <!-- <div class="w-full text-sm mb-2 font-semibold">Abilities</div>
            <div class="flex gap-2 mb-6">
              <span class="px-2 py-1 bg-gray-100 rounded">Torrent</span>
              <span class="px-2 py-1 bg-gray-100 rounded">Defiant</span>
            </div> -->

            <!-- <div class="flex justify-between w-full text-xs text-gray-500 mb-4">
              <div>
                <div class="font-bold text-gray-800">Height</div>
                <div>1.7m</div>
              </div>
              <div>
                <div class="font-bold text-gray-800">Weight</div>
                <div>84.5kg</div>
              </div>
            </div> -->

            <!-- <div class="text-sm font-semibold mb-2">Weaknesses</div>
            <div class="flex gap-2 mb-6">
              <div class="w-6 h-6 bg-red-200 rounded-full"></div>
              <div class="w-6 h-6 bg-yellow-200 rounded-full"></div>
              <div class="w-6 h-6 bg-green-200 rounded-full"></div>
            </div> -->

            <!-- <div class="text-sm font-semibold mb-2">Base EXP</div>
            <div class="mb-6">239</div> -->

            <!-- <div class="text-sm font-semibold mb-2">Stats</div>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div class="flex justify-between"><span>HP</span><span>84</span></div>
              <div class="flex justify-between"><span>ATK</span><span>86</span></div>
              <div class="flex justify-between"><span>DEF</span><span>88</span></div>
              <div class="flex justify-between"><span>SpA</span><span>111</span></div>
              <div class="flex justify-between"><span>SpD</span><span>101</span></div>
              <div class="flex justify-between"><span>SPD</span><span>60</span></div>
            </div> -->

            <!-- <div class="font-bold mt-4">530</div>

            <div class="text-sm font-semibold mt-6 mb-2">Evolution</div>
            <div class="flex gap-2 items-center">
              <div class="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div class="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div class="h-10 w-10 bg-gray-200 rounded-full"></div>
            </div> -->
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
import type { PokemonDetail } from '@/models/pokemon.model'
const fullPokemonList = ref<PokemonDetail[]>([]) //fullPokemonList เป็น PokemonDetail ที่เป็น array
const searchkey = ref('')

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

  // ลองใช้รูปภาพสำรองตามลำดับความสำคัญ
  const fallbackUrls = [
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

onMounted(async () => {
  await all1025Pokemon() // ค้นหาโปเกมอน ID 1-150
  console.log('mounted')
})
</script>

<style scoped></style>
