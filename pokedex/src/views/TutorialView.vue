<template>
  <div class="min-h-screen bg-gray-100">
    <MainWeb></MainWeb>
    <!-- ของเดิมที่ loop pokemon -->
    <div class="bg-gray-100 mt-6 p-6 rounded-lg shadow-lg space-y-10">
      <div class="flex flex-col gap-6">
        <div class="text-center text-2xl font-bold">Pokemon</div>
        <div>
          <div class="text-lg font-semibold mb-2">Pokemon List</div>
          <div class="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div
              v-for="(pokemon, index) in data.results"
              :key="index"
              class="border text-center border-black bg-white rounded-lg shadow-md p-4 hover:shadow-md"
            >
              {{ pokemon.name }}
            </div>
          </div>
        </div>

        <!--ส่วนค้นหาข้อมูลโปเกมอนด้วย ID -->
        <div>
          <div class="text-lg font-semibold mt-6">ค้นหา Pokemon ด้วย ID</div>
          <div class="flex gap-2 items-center my-2">
            <input
              v-model.number="inputId"
              type="number"
              placeholder="ใส่ Pokémon ID"
              class="border px-2 py-1 rounded"
            />
            <button
              @click="getPokemonById"
              class="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              ค้นหา
            </button>
          </div>

          <div
            v-if="selectedPokemon"
            class="mt-4 border p-4 rounded bg-white shadow text-center w-64"
          >
            <img
              :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selectedPokemon.id}.png`"
              alt="pokemon"
              class="mx-auto mb-2"
            />
            <div class="text-lg font-semibold capitalize">{{ selectedPokemon.name }}</div>
            <div>ID: {{ selectedPokemon.id }}</div>
            <div>Base Exp: {{ selectedPokemon.base_experience }}</div>
            <div>Height: {{ selectedPokemon.height }}</div>
            <div>Weight: {{ selectedPokemon.weight }}</div>
          </div>
        </div>

        <!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->

        <div v-if="fullPokemonList.length > 0">
          <div class="text-lg font-semibold mt-10 mb-2">Selected Pokemon</div>
          <PokemonCard :pokemon="fullPokemonList[2]" />
          <div class="text-lg font-semibold mt-10 mb-2">Pokemon ID 1-150</div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <PokemonCard v-for="item in fullPokemonList" :key="item.id" :pokemon="item" />
          </div>
        </div>

        <!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { PokemonResponse, PokemonDetail } from '@/models/pokemon.model'
import { getPokemons, getPokemonDetail } from '@/services/pokemon.service'
import PokemonCard from '@/components/PokemonCard.vue'
import axios from 'axios'
import MainWeb from '@/components/MainWeb.vue'

const data = ref<PokemonResponse>({
  count: 0,
  next: null,
  previous: null,
  results: [],
})

const showPokemon = async () => {
  const res = await getPokemons()
  data.value = res.data
}

const inputId = ref<number>(1) //ตอนเริ่มเป็น 1 เพราะตัว 0 ไม่มี และเป็น number
const selectedPokemon = ref<PokemonDetail | null>(null) // ตอนเริ่มไม่มีค่า และเป็น pokemonDetail

const getPokemonById = async () => {
  try {
    const res = await getPokemonDetail(inputId.value)
    selectedPokemon.value = res.data
  } catch {
    alert('ไม่พบโปเกมอนที่มี ID นี้')
    selectedPokemon.value = null
  }
}
///////////////// ่ส่วนของการ loop pokemon 150 ตัว [fullPokemonList]
const fullPokemonList = ref<PokemonDetail[]>([]) //fullPokemonList เป็น PokemonDetail ที่เป็น array

const first150Pokemon = async () => {
  // ฟังก์ชั่นใหญ่ที่ต้องใส่ await first150Pokemon() เพื่อรอให้เสร็จ
  const limit = 150 //จํานวน pokemon ที่ต้องการสูงสุด 150 ตัว max 1025
  const all150FirstPokemon = []

  for (let id = 1; id <= limit; id++) {
    all150FirstPokemon.push(axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`))
  }
  const finish150PokemonList = await Promise.all(all150FirstPokemon) //รอให้ดึง pokemon ทั้งหมดเสร็จ
  fullPokemonList.value = finish150PokemonList.map((res) => ({
    //เอาค่าที่อยากใช้ไปไว้ใน fullPokemonList
    id: res.data.id,
    name: res.data.name,
    base_experience: res.data.base_experience, //ข้อมูลที่ดึงมาจะอยู่ใน res.data
    height: res.data.height,
    weight: res.data.weight,
  }))
}
///////////////// ่ส่วนของการ loop pokemon 150 ตัว [fullPokemonList]

// เมื่อ component โหลด
onMounted(async () => {
  await showPokemon() // loop pokemon แรก
  await getPokemonById() // ค้นหาโปเกมอนด้วย ID
  await first150Pokemon() // ค้นหาโปเกมอน ID 1-150
  console.log('mounted')
})
</script>
