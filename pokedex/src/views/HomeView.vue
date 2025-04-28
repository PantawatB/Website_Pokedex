<template>
  <div class="min-h-screen bg-gray-100">
    <MainWeb></MainWeb>
    <!-- หน้าเรื่องราว Pokémon -->
    <div class="mt-6 p-6 rounded-lg shadow-lg space-y-10">
      <!-- หัวข้อหลัก -->
      <div class="text-center fade-in">
        <h2 class="text-3xl font-bold mb-2">เรื่องราวของ Pokémon</h2>
        <p class="text-gray-600 text-lg">โลกแห่งการผจญภัยและมิตรภาพกับโปเกมอน</p>
      </div>

      <!-- เนื้อเรื่องเบื้องต้น -->
      <div class="space-y-4 text-gray-700 leading-relaxed text-justify fade-in">
        <p>
          Pokémon (Pocket Monsters) คือสิ่งมีชีวิตลึกลับที่มีพลังพิเศษ
          พวกมันอยู่ร่วมกับมนุษย์ในโลกแห่งการผจญภัย เทรนเนอร์จะจับ ฝึกฝน และออกเดินทางร่วมกับโปเกมอน
          เพื่อสร้างสายสัมพันธ์และแข่งต่อสู้กับคนอื่น
        </p>
        <p>
          จุดเริ่มต้นของ Pokémon เริ่มต้นในปี 1996 ที่ประเทศญี่ปุ่นผ่านเกมบอย (Game Boy)
          และขยายตัวอย่างรวดเร็วไปทั่วโลก ทั้งในรูปแบบเกม, การ์ตูนอนิเมะ, หนัง, ของเล่น และอื่นๆ
          อีกมากมาย
        </p>
      </div>

      <!-- รูป Pikachu -->
      <div class="text-center fade-in">
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
          alt="Pikachu"
          class="mx-auto w-28 h-28"
        />
        <p class="mt-2 text-sm text-gray-500 italic">
          "Pikachu" – โปเกมอนที่เป็นไอคอนของโลก Pokémon
        </p>
      </div>

      <!-- ประวัติ Timeline -->
      <div class="fade-in">
        <h3 class="text-2xl font-bold mb-4">เส้นทางแห่งตำนาน Pokémon</h3>
        <ul class="space-y-2 text-gray-700">
          <li>• 1996 - Pokémon Red และ Green วางจำหน่ายที่ญี่ปุ่น</li>
          <li>• 1997 - การ์ตูน Pokémon ออกอากาศครั้งแรก</li>
          <li>• 1998 - Pokémon เปิดตัวในอเมริกาและกลายเป็นกระแสทั่วโลก</li>
          <li>• 2006 - Pokémon Diamond และ Pearl เปิดตัวใน Nintendo DS</li>
          <li>• 2016 - Pokémon Go สร้างปรากฏการณ์การจับโปเกมอนในโลกจริง</li>
          <li>• 2022 - Pokémon Scarlet และ Violet เปิดตัวโลกแบบ Open World</li>
        </ul>
      </div>

      <!-- Top 5 Pokémon ยอดนิยม -->
      <div class="fade-in">
        <h3 class="text-2xl font-bold mb-4">Top 5 Pokémon ขวัญใจแฟนๆ</h3>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div
            v-for="id in [25, 1, 6, 150, 151]"
            :key="id"
            class="bg-white rounded-lg p-6 shadow-md space-y-2"
          >
            <img
              :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`"
              class="mx-auto w-20 h-20 transition-transform duration-500 ease-in-out hover:scale-110"
              alt="Popular Pokémon"
            />
            <div class="capitalize text-sm text-gray-600">{{ getPokemonName(id) }}</div>
            <button
              class="bg-slate-600 text-white rounded-lg shadow-md py-1 px-4 mt-2 hover:bg-slate-800 transition-all"
              @click="showDetails(id)"
            >
              ดูรายละเอียด
            </button>
          </div>
        </div>
      </div>

      <!-- Carousel โปเกมอน -->
      <div class="fade-in">
        <h3 class="text-2xl font-bold mb-4">Pokémon Highlight</h3>
        <div class="flex overflow-x-auto gap-4 p-2">
          <div
            v-for="id in [4, 7, 1, 25, 39, 150, 151]"
            :key="id"
            class="flex-shrink-0 bg-white p-6 w-32 h-32 rounded-lg shadow-md flex flex-col items-center justify-center transition-all duration-500 ease-in-out transform hover:scale-110"
          >
            <img
              :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`"
              class="w-16 h-16"
              alt="Pokémon Carousel"
            />
            <div class="mt-2 text-xs capitalize">{{ getPokemonName(id) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pokémon Details Modal -->
    <div
      v-if="selectedPokemon"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 class="text-xl font-bold mb-4">{{ getPokemonName(selectedPokemon) }}</h2>
        <img
          :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selectedPokemon}.png`"
          alt="Pokemon"
          class="mx-auto w-32 h-32 mb-4"
        />
        <p class="text-gray-700 mb-4">รายละเอียดเกี่ยวกับ {{ getPokemonName(selectedPokemon) }}</p>
        <div v-if="pokemonDetails[selectedPokemon]">
          <p><strong>ประเภท:</strong> {{ pokemonDetails[selectedPokemon].type.join(', ') }}</p>
          <p><strong>ความสูง:</strong> {{ pokemonDetails[selectedPokemon].height }} m</p>
          <p><strong>น้ำหนัก:</strong> {{ pokemonDetails[selectedPokemon].weight }} kg</p>
        </div>
        <button
          @click="selectedPokemon = null"
          class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400"
        >
          ปิด
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MainWeb from '@/components/MainWeb.vue'

const pokemonNames: Record<number, string> = {
  1: 'bulbasaur',
  4: 'charmander',
  6: 'charizard',
  7: 'squirtle',
  25: 'pikachu',
  39: 'jigglypuff',
  150: 'mewtwo',
  151: 'mew',
}

let selectedPokemon: number | null = null

const pokemonDetails: Record<number, { type: string[]; height: number; weight: number }> = {
  1: { type: ['grass', 'poison'], height: 0.7, weight: 6.9 },
  4: { type: ['fire'], height: 0.6, weight: 8.5 },
  6: { type: ['fire', 'flying'], height: 1.7, weight: 90.5 },
  7: { type: ['water'], height: 0.6, weight: 8.5 },
  25: { type: ['electric'], height: 0.4, weight: 6.0 },
  39: { type: ['fairy'], height: 0.5, weight: 5.5 },
  150: { type: ['psychic'], height: 2.0, weight: 122.0 },
  151: { type: ['psychic'], height: 0.4, weight: 7.0 },
}

const getPokemonName = (id: number) => {
  return pokemonNames[id] || 'unknown'
}

const showDetails = (id: number) => {
  selectedPokemon = id
}
</script>

<style scoped>
/* Animation Effect */
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
</style>
