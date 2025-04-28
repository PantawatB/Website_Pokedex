<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navbar -->
    <MainWeb></MainWeb>

    <!-- Search and Filter -->
    <div class="max-w-7xl mx-auto p-6">
      <div class="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search your Pokémon!"
          class="flex-1 p-3 rounded-md shadow-md border border-gray-300"
        />
        <button class="p-3 bg-red-500 rounded-full text-white">
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
        </button>
      </div>

      <!-- Filters -->
      <div class="flex items-center gap-4 mt-6">
        <div class="flex items-center gap-2">
          <label class="font-semibold">Ascending</label>
          <select class="p-2 border border-gray-300 rounded-md">
            <option>Ascending</option>
            <option>Descending</option>
          </select>
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
            v-for="n in 9"
            :key="n"
            class="bg-white p-6 rounded-lg shadow-md flex flex-col items-center"
          >
            <div class="text-sm text-gray-400 mb-2">N°{{ 386 + n }}</div>
            <div class="h-16 w-16 bg-gray-200 rounded-full mb-4"></div>
            <!-- Placeholder for Pokémon image -->
            <div class="font-bold mb-1">Pokémon {{ n }}</div>
            <div class="text-xs px-2 py-1 rounded-full bg-green-200 text-green-800">GRASS</div>
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

            <p class="text-gray-600 text-center text-sm mb-6">
              It swims as fast as a jet boat. The edges of its wings are sharp and can slice apart
              drifting ice.
            </p>

            <div class="w-full text-sm mb-2 font-semibold">Abilities</div>
            <div class="flex gap-2 mb-6">
              <span class="px-2 py-1 bg-gray-100 rounded">Torrent</span>
              <span class="px-2 py-1 bg-gray-100 rounded">Defiant</span>
            </div>

            <div class="flex justify-between w-full text-xs text-gray-500 mb-4">
              <div>
                <div class="font-bold text-gray-800">Height</div>
                <div>1.7m</div>
              </div>
              <div>
                <div class="font-bold text-gray-800">Weight</div>
                <div>84.5kg</div>
              </div>
            </div>

            <div class="text-sm font-semibold mb-2">Weaknesses</div>
            <div class="flex gap-2 mb-6">
              <div class="w-6 h-6 bg-red-200 rounded-full"></div>
              <div class="w-6 h-6 bg-yellow-200 rounded-full"></div>
              <div class="w-6 h-6 bg-green-200 rounded-full"></div>
            </div>

            <div class="text-sm font-semibold mb-2">Base EXP</div>
            <div class="mb-6">239</div>

            <div class="text-sm font-semibold mb-2">Stats</div>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div class="flex justify-between"><span>HP</span><span>84</span></div>
              <div class="flex justify-between"><span>ATK</span><span>86</span></div>
              <div class="flex justify-between"><span>DEF</span><span>88</span></div>
              <div class="flex justify-between"><span>SpA</span><span>111</span></div>
              <div class="flex justify-between"><span>SpD</span><span>101</span></div>
              <div class="flex justify-between"><span>SPD</span><span>60</span></div>
            </div>

            <div class="font-bold mt-4">530</div>

            <div class="text-sm font-semibold mt-6 mb-2">Evolution</div>
            <div class="flex gap-2 items-center">
              <div class="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div class="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div class="h-10 w-10 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MainWeb from '@/components/MainWeb.vue'

// ยังไม่ต้องมี data เพราะขอเป็นโครงเปล่าไว้ก่อน
</script>

<style scoped>
/* เพิ่มพวก animate หรือ custom ถ้าอยากได้ฟีลเดียวกับต้นฉบับ */
</style>
