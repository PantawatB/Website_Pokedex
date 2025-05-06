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
      <div class="mt-6">
        <div class="flex items-center mb-2">
          <label class="font-semibold">Filter & Sort:</label>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <!-- Type Filter -->
          <div class="relative">
            <button
              @click="toggleFilterDropdown('type')"
              class="w-full p-2 border border-gray-300 rounded-md flex justify-between items-center bg-white"
            >
              <span>Type</span>
              <span
                v-if="selectedTypes.length > 0"
                class="bg-slate-500 text-white text-xs rounded-full px-2 py-0.5 ml-2"
              >
                {{ selectedTypes.length }}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              v-if="openFilterDropdown === 'type'"
              class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg p-2 max-h-60 overflow-y-auto"
            >
              <div
                v-for="type in allPokemonTypes"
                :key="type"
                class="flex items-center p-1 hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  :id="'type-' + type"
                  :value="type"
                  v-model="selectedTypes"
                  class="mr-2"
                />
                <label :for="'type-' + type" class="flex items-center cursor-pointer w-full">
                  <span
                    class="inline-block w-4 h-4 rounded-full mr-2"
                    :class="getTypeClass(type)"
                  ></span>
                  <span class="capitalize">{{ type }}</span>
                </label>
              </div>
              <div class="border-t border-gray-200 mt-2 pt-2 flex justify-between">
                <button
                  @click="clearFilter('type')"
                  class="text-xs text-gray-600 hover:text-gray-800"
                >
                  Clear
                </button>
                <button
                  @click="openFilterDropdown = null"
                  class="text-xs text-blue-600 hover:text-blue-800"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          <!-- Weaknesses Filter -->
          <div class="relative">
            <button
              @click="toggleFilterDropdown('weakness')"
              class="w-full p-2 border border-gray-300 rounded-md flex justify-between items-center bg-white"
            >
              <span>Weaknesses</span>
              <span
                v-if="selectedWeaknesses.length > 0"
                class="bg-slate-500 text-white text-xs rounded-full px-2 py-0.5 ml-2"
              >
                {{ selectedWeaknesses.length }}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              v-if="openFilterDropdown === 'weakness'"
              class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg p-2 max-h-60 overflow-y-auto"
            >
              <div
                v-for="type in allPokemonTypes"
                :key="type"
                class="flex items-center p-1 hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  :id="'weakness-' + type"
                  :value="type"
                  v-model="selectedWeaknesses"
                  class="mr-2"
                />
                <label :for="'weakness-' + type" class="flex items-center cursor-pointer w-full">
                  <span
                    class="inline-block w-4 h-4 rounded-full mr-2"
                    :class="getTypeClass(type)"
                  ></span>
                  <span class="capitalize">{{ type }}</span>
                </label>
              </div>
              <div class="border-t border-gray-200 mt-2 pt-2 flex justify-between">
                <button
                  @click="clearFilter('weakness')"
                  class="text-xs text-gray-600 hover:text-gray-800"
                >
                  Clear
                </button>
                <button
                  @click="openFilterDropdown = null"
                  class="text-xs text-blue-600 hover:text-blue-800"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          <!-- Resistances Filter -->
          <div class="relative">
            <button
              @click="toggleFilterDropdown('resistance')"
              class="w-full p-2 border border-gray-300 rounded-md flex justify-between items-center bg-white"
            >
              <span>Resistances</span>
              <span
                v-if="selectedResistances.length > 0"
                class="bg-slate-500 text-white text-xs rounded-full px-2 py-0.5 ml-2"
              >
                {{ selectedResistances.length }}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              v-if="openFilterDropdown === 'resistance'"
              class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg p-2 max-h-60 overflow-y-auto"
            >
              <div
                v-for="type in allPokemonTypes"
                :key="type"
                class="flex items-center p-1 hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  :id="'resistance-' + type"
                  :value="type"
                  v-model="selectedResistances"
                  class="mr-2"
                />
                <label :for="'resistance-' + type" class="flex items-center cursor-pointer w-full">
                  <span
                    class="inline-block w-4 h-4 rounded-full mr-2"
                    :class="getTypeClass(type)"
                  ></span>
                  <span class="capitalize">{{ type }}</span>
                </label>
              </div>
              <div class="border-t border-gray-200 mt-2 pt-2 flex justify-between">
                <button
                  @click="clearFilter('resistance')"
                  class="text-xs text-gray-600 hover:text-gray-800"
                >
                  Clear
                </button>
                <button
                  @click="openFilterDropdown = null"
                  class="text-xs text-blue-600 hover:text-blue-800"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          <!-- Height Sort -->
          <div class="relative">
            <button
              @click="toggleFilterDropdown('height')"
              class="w-full p-2 border border-gray-300 rounded-md flex justify-between items-center bg-white"
            >
              <span>Height</span>
              <span v-if="heightSort !== 'none'" class="text-blue-600 text-xs ml-2">
                {{ heightSort === 'asc' ? '↑' : '↓' }}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              v-if="openFilterDropdown === 'height'"
              class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg p-2"
            >
              <div class="flex flex-col">
                <button
                  @click="setHeightSort('none')"
                  class="p-2 text-left hover:bg-gray-100 rounded"
                  :class="{ 'bg-gray-100': heightSort === 'none' }"
                >
                  No sorting
                </button>
                <button
                  @click="setHeightSort('asc')"
                  class="p-2 text-left hover:bg-gray-100 rounded"
                  :class="{ 'bg-gray-100': heightSort === 'asc' }"
                >
                  Shortest first
                </button>
                <button
                  @click="setHeightSort('desc')"
                  class="p-2 text-left hover:bg-gray-100 rounded"
                  :class="{ 'bg-gray-100': heightSort === 'desc' }"
                >
                  Tallest first
                </button>
              </div>
            </div>
          </div>

          <!-- Weight Sort -->
          <div class="relative">
            <button
              @click="toggleFilterDropdown('weight')"
              class="w-full p-2 border border-gray-300 rounded-md flex justify-between items-center bg-white"
            >
              <span>Weight</span>
              <span v-if="weightSort !== 'none'" class="text-blue-600 text-xs ml-2">
                {{ weightSort === 'asc' ? '↑' : '↓' }}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              v-if="openFilterDropdown === 'weight'"
              class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg p-2"
            >
              <div class="flex flex-col">
                <button
                  @click="setWeightSort('none')"
                  class="p-2 text-left hover:bg-gray-100 rounded"
                  :class="{ 'bg-gray-100': weightSort === 'none' }"
                >
                  No sorting
                </button>
                <button
                  @click="setWeightSort('asc')"
                  class="p-2 text-left hover:bg-gray-100 rounded"
                  :class="{ 'bg-gray-100': weightSort === 'asc' }"
                >
                  Lightest first
                </button>
                <button
                  @click="setWeightSort('desc')"
                  class="p-2 text-left hover:bg-gray-100 rounded"
                  :class="{ 'bg-gray-100': weightSort === 'desc' }"
                >
                  Heaviest first
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Active Filters Display -->
        <div v-if="hasActiveFilters" class="mt-3 flex flex-wrap gap-2">
          <div
            v-for="(type, index) in selectedTypes"
            :key="`type-${index}`"
            class="bg-gray-200 px-2 py-1 rounded-full text-xs flex items-center"
          >
            <span class="inline-block w-3 h-3 rounded-full mr-1" :class="getTypeClass(type)"></span>
            <span class="capitalize">{{ type }}</span>
            <button
              @click="removeFilter('type', type)"
              class="ml-1 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <div
            v-for="(type, index) in selectedWeaknesses"
            :key="`weakness-${index}`"
            class="bg-gray-200 px-2 py-1 rounded-full text-xs flex items-center"
          >
            <span>Weak to</span>
            <span class="inline-block w-3 h-3 rounded-full mx-1" :class="getTypeClass(type)"></span>
            <span class="capitalize">{{ type }}</span>
            <button
              @click="removeFilter('weakness', type)"
              class="ml-1 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <div
            v-for="(type, index) in selectedResistances"
            :key="`resistance-${index}`"
            class="bg-gray-200 px-2 py-1 rounded-full text-xs flex items-center"
          >
            <span>Resists</span>
            <span class="inline-block w-3 h-3 rounded-full mx-1" :class="getTypeClass(type)"></span>
            <span class="capitalize">{{ type }}</span>
            <button
              @click="removeFilter('resistance', type)"
              class="ml-1 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <div
            v-if="heightSort !== 'none'"
            class="bg-gray-200 px-2 py-1 rounded-full text-xs flex items-center"
          >
            <span>Height: {{ heightSort === 'asc' ? 'Shortest first' : 'Tallest first' }}</span>
            <button @click="setHeightSort('none')" class="ml-1 text-gray-500 hover:text-gray-700">
              ×
            </button>
          </div>
          <div
            v-if="weightSort !== 'none'"
            class="bg-gray-200 px-2 py-1 rounded-full text-xs flex items-center"
          >
            <span>Weight: {{ weightSort === 'asc' ? 'Lightest first' : 'Heaviest first' }}</span>
            <button @click="setWeightSort('none')" class="ml-1 text-gray-500 hover:text-gray-700">
              ×
            </button>
          </div>
          <button
            @click="clearAllFilters"
            class="bg-red-500 text-white px-2 py-1 rounded-full text-xs"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      <!-- Pokémon Grid -->
      <div class="flex flex-col lg:flex-row gap-4 mt-6">
        <!-- Mobile Pokemon Detail Modal (Shows as popup when a card is clicked) -->
        <div
          v-if="selectedPokemon && isMobileView && showMobileDetail"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          @click.self="closeMobileDetail"
        >
          <div
            class="w-full max-w-md bg-white p-4 rounded-lg shadow-md max-h-[90vh] overflow-y-auto"
          >
            <div class="flex justify-end mb-4">
              <button @click="closeMobileDetail" class="text-gray-500 hover:text-gray-700">
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

            <div class="flex flex-col items-center">
              <!-- Pokemon Image with Shiny Toggle -->
              <div class="flex flex-col items-center mb-4">
                <img
                  :src="getSelectedPokemonImageUrl()"
                  :alt="selectedPokemon.name"
                  class="w-32 h-32 object-contain mb-2"
                  @error="(e) => selectedPokemon && handleImageError(e, selectedPokemon.id)"
                />
                <button
                  @click="toggleShiny"
                  class="bg-slate-800 text-xs px-3 py-1 rounded text-white"
                >
                  {{ isShiny ? 'Toggle to Normal' : 'Toggle to Shiny' }}
                </button>
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
              <p v-if="pokemonSpecies" class="text-gray-600 text-center text-xs mb-4">
                {{ getPokemonDescription() }}
              </p>

              <!-- Pokemon Abilities -->
              <div
                v-if="selectedPokemon.abilities && selectedPokemon.abilities.length > 0"
                class="w-full mb-3"
              >
                <div class="text-xs mb-1 font-semibold">Abilities</div>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="(abilityObj, index) in selectedPokemon.abilities"
                    :key="index"
                    class="px-2 py-1 bg-gray-300 rounded capitalize text-xs"
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
              <div class="flex justify-between w-full text-xs text-gray-500 mb-3">
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
              <div class="w-full mb-3">
                <!-- Weaknesses -->
                <div v-if="typeWeaknesses.length > 0" class="mb-2">
                  <div class="text-xs font-semibold mb-1">Weaknesses</div>

                  <!-- 4x Weaknesses -->
                  <div v-if="typeWeaknesses.some((item) => item.effectiveness === 4)" class="mb-2">
                    <div class="text-xs font-medium mb-1 text-black">
                      Takes 4× more damage with:
                    </div>
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
                    <div class="text-xs font-medium mb-1 text-black">
                      Takes 2× more damage with:
                    </div>
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
                  <div class="text-xs font-semibold mb-1">Resistances</div>

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
                    <div class="text-xs font-medium mb-1 text-black">
                      Takes ¼× less damage with:
                    </div>
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
                    <div class="text-xs font-medium mb-1 text-black">
                      Takes ½× less damage with:
                    </div>
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
              <div v-if="evolutionChain" class="w-full mb-3">
                <div class="text-xs font-semibold mb-1">Evolution Chain</div>
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
                        class="w-12 h-12 object-contain"
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
                  class="px-3 py-1 text-sm bg-slate-800 text-white rounded-md disabled:opacity-50"
                  :disabled="!selectedPokemon || selectedPokemon.id <= 1"
                >
                  Previous
                </button>

                <button
                  @click="goToNextPokemon"
                  class="px-3 py-1 text-sm bg-slate-800 text-white rounded-md disabled:opacity-50"
                  :disabled="!selectedPokemon || selectedPokemon.id >= fullPokemonList.length"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- Left Grid -->
        <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div
            v-if="filteredPokemonList.length === 0 && searchkey.trim()"
            class="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-10"
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
            class="bg-white p-4 rounded-lg shadow-md flex flex-col items-center relative cursor-pointer transform transition-transform duration-300 hover:scale-105 h-[220px] w-full"
            @click="selectPokemon(item)"
          >
            <div class="flex-1 flex items-center justify-center w-full h-[100px]">
              <img
                :src="getPokemonImageUrl(item)"
                :alt="item.name"
                class="w-24 h-24 object-contain"
                @error="(e) => handleImageError(e, item.id)"
              />
            </div>
            <div class="w-full mt-2">
              <div class="capitalize font-bold mb-2 text-center truncate">{{ item.name }}</div>
              <div class="flex gap-2 justify-center flex-wrap">
                <span
                  v-for="(typeObj, index) in item.types"
                  :key="index"
                  class="text-xs px-2 py-1 rounded-full font-semibold capitalize inline-block"
                  :class="getTypeClass(typeObj.type.name)"
                >
                  {{ typeObj.type.name }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Sidebar (Desktop) -->
        <div
          class="hidden lg:block w-auto min-w-[280px] max-w-[350px] bg-white p-4 rounded-lg shadow-md self-start sticky top-12 max-h-[calc(96vh-2rem)] overflow-y-auto"
        >
          <div v-if="!selectedPokemon" class="flex flex-col items-center py-8">
            <div class="h-20 w-20 bg-gray-200 rounded-full mb-4"></div>
            <div class="text-xl text-center font-bold mb-2">Please select any Pokémon</div>
            <div class="text-gray-500 text-sm mb-4">Click on a Pokémon card to view details</div>
          </div>

          <div v-else>
            <div class="flex justify-end items-center mb-4">
              <button
                @click="toggleShiny"
                class="bg-slate-800 text-xs px-2 py-1 rounded text-white"
              >
                {{ isShiny ? 'Toggle to Normal' : 'Toggle to Shiny' }}
              </button>
            </div>

            <div class="flex flex-col items-center">
              <!-- Pokemon Image with Shiny Toggle -->
              <div class="relative mb-4">
                <img
                  :src="getSelectedPokemonImageUrl()"
                  :alt="selectedPokemon.name"
                  class="w-32 h-32 object-contain"
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
              <p v-if="pokemonSpecies" class="text-gray-600 text-center text-xs mb-4">
                {{ getPokemonDescription() }}
              </p>

              <!-- Pokemon Abilities -->
              <div
                v-if="selectedPokemon.abilities && selectedPokemon.abilities.length > 0"
                class="w-full mb-3"
              >
                <div class="text-xs mb-1 font-semibold">Abilities</div>
                <div class="flex flex-wrap gap-1">
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
              <div class="w-full mb-3">
                <!-- Weaknesses -->
                <div v-if="typeWeaknesses.length > 0" class="mb-2">
                  <div class="text-xs font-semibold mb-1">Weaknesses</div>

                  <!-- 4x Weaknesses -->
                  <div v-if="typeWeaknesses.some((item) => item.effectiveness === 4)" class="mb-2">
                    <div class="text-xs font-medium mb-1 text-black">
                      Takes 4× more damage with:
                    </div>
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
                    <div class="text-xs font-medium mb-1 text-black">
                      Takes 2× more damage with:
                    </div>
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
                  <div class="text-xs font-semibold mb-1">Resistances</div>

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
                    <div class="text-xs font-medium mb-1 text-black">
                      Takes ¼× less damage with:
                    </div>
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
                    <div class="text-xs font-medium mb-1 text-black">
                      Takes ½× less damage with:
                    </div>
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
              <div v-if="evolutionChain" class="w-full mb-3">
                <div class="text-xs font-semibold mb-1">Evolution Chain</div>
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
                        class="w-12 h-12 object-contain"
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
              <div class="flex justify-between w-full mt-3">
                <button
                  @click="goToPreviousPokemon"
                  class="px-3 py-1 text-sm bg-slate-800 text-white rounded-md disabled:opacity-50"
                  :disabled="!selectedPokemon || selectedPokemon.id <= 1"
                >
                  Previous
                </button>
                <button
                  @click="goToNextPokemon"
                  class="px-3 py-1 text-sm bg-slate-800 text-white rounded-md disabled:opacity-50"
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

// ตัวแปรสำหรับ Mobile Popup
const isMobileView = ref(false) // ตรวจสอบว่าเป็นหน้าจอขนาดเล็กหรือไม่
const showMobileDetail = ref(false) // ควบคุมการแสดง/ซ่อน popup

// ตัวแปรสำหรับการกรองและเรียงลำดับ
const openFilterDropdown = ref<string | null>(null) // ควบคุมการแสดง/ซ่อน dropdown
const selectedTypes = ref<string[]>([]) // ประเภทที่เลือกสำหรับกรอง
const selectedWeaknesses = ref<string[]>([]) // ความอ่อนแอที่เลือกสำหรับกรอง
const selectedResistances = ref<string[]>([]) // ความต้านทานที่เลือกสำหรับกรอง
const heightSort = ref<'none' | 'asc' | 'desc'>('none') // การเรียงลำดับตามความสูง
const weightSort = ref<'none' | 'asc' | 'desc'>('none') // การเรียงลำดับตามน้ำหนัก

// รายการประเภททั้งหมดของ Pokemon
const allPokemonTypes = [
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
]

// ฟังก์ชันสำหรับปิด popup บนมือถือ
const closeMobileDetail = () => {
  showMobileDetail.value = false
}

// ฟังก์ชันสำหรับตรวจสอบขนาดหน้าจอ
const checkScreenSize = () => {
  isMobileView.value = window.innerWidth < 1024
}

// เพิ่ม event listener สำหรับการเปลี่ยนขนาดหน้าจอ
onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)

  // เพิ่ม event listener สำหรับการคลิกนอก dropdown เพื่อปิด dropdown
  document.addEventListener('click', (event) => {
    if (openFilterDropdown.value && !(event.target as Element).closest('.relative')) {
      openFilterDropdown.value = null
    }
  })
})

// ฟังก์ชันสำหรับเปิด/ปิด dropdown
const toggleFilterDropdown = (type: string) => {
  if (openFilterDropdown.value === type) {
    openFilterDropdown.value = null
  } else {
    openFilterDropdown.value = type
  }
}

// ฟังก์ชันสำหรับล้างตัวกรองประเภท
const clearFilter = (filterType: string) => {
  if (filterType === 'type') {
    selectedTypes.value = []
  } else if (filterType === 'weakness') {
    selectedWeaknesses.value = []
  } else if (filterType === 'resistance') {
    selectedResistances.value = []
  }
}

// ฟังก์ชันสำหรับลบตัวกรองเดี่ยว
const removeFilter = (filterType: string, value: string) => {
  if (filterType === 'type') {
    selectedTypes.value = selectedTypes.value.filter((type) => type !== value)
  } else if (filterType === 'weakness') {
    selectedWeaknesses.value = selectedWeaknesses.value.filter((type) => type !== value)
  } else if (filterType === 'resistance') {
    selectedResistances.value = selectedResistances.value.filter((type) => type !== value)
  }
}

// ฟังก์ชันสำหรับล้างตัวกรองทั้งหมด
const clearAllFilters = () => {
  selectedTypes.value = []
  selectedWeaknesses.value = []
  selectedResistances.value = []
  heightSort.value = 'none'
  weightSort.value = 'none'
}

// ฟังก์ชันสำหรับตั้งค่าการเรียงลำดับตามความสูง
const setHeightSort = (sort: 'none' | 'asc' | 'desc') => {
  heightSort.value = sort
  if (sort !== 'none') {
    weightSort.value = 'none' // ยกเลิกการเรียงลำดับตามน้ำหนักเมื่อเรียงลำดับตามความสูง
  }
  openFilterDropdown.value = null
}

// ฟังก์ชันสำหรับตั้งค่าการเรียงลำดับตามน้ำหนัก
const setWeightSort = (sort: 'none' | 'asc' | 'desc') => {
  weightSort.value = sort
  if (sort !== 'none') {
    heightSort.value = 'none' // ยกเลิกการเรียงลำดับตามความสูงเมื่อเรียงลำดับตามน้ำหนัก
  }
  openFilterDropdown.value = null
}

// ตรวจสอบว่า Pokemon มีความอ่อนแอต่อประเภทที่ระบุหรือไม่
const hasPokemonWeakness = (pokemon: PokemonDetail, weaknessType: string): boolean => {
  // ดึงข้อมูลประเภทของ Pokemon
  const pokemonTypes = pokemon.types?.map((t) => t.type.name) || []

  // ตรวจสอบความอ่อนแอโดยใช้ตารางความสัมพันธ์ของประเภท
  let effectiveness = 1

  // ตารางความสัมพันธ์ของประเภท (ย่อ)
  const typeRelations: Record<
    string,
    { weakTo: string[]; resistantTo: string[]; immuneTo: string[] }
  > = {
    normal: {
      weakTo: ['fighting'],
      resistantTo: [],
      immuneTo: ['ghost'],
    },
    fire: {
      weakTo: ['water', 'ground', 'rock'],
      resistantTo: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'],
      immuneTo: [],
    },
    water: {
      weakTo: ['electric', 'grass'],
      resistantTo: ['fire', 'water', 'ice', 'steel'],
      immuneTo: [],
    },
    electric: {
      weakTo: ['ground'],
      resistantTo: ['electric', 'flying', 'steel'],
      immuneTo: [],
    },
    grass: {
      weakTo: ['fire', 'ice', 'poison', 'flying', 'bug'],
      resistantTo: ['water', 'electric', 'grass', 'ground'],
      immuneTo: [],
    },
    ice: {
      weakTo: ['fire', 'fighting', 'rock', 'steel'],
      resistantTo: ['ice'],
      immuneTo: [],
    },
    fighting: {
      weakTo: ['flying', 'psychic', 'fairy'],
      resistantTo: ['bug', 'rock', 'dark'],
      immuneTo: [],
    },
    poison: {
      weakTo: ['ground', 'psychic'],
      resistantTo: ['grass', 'fighting', 'poison', 'bug', 'fairy'],
      immuneTo: [],
    },
    ground: {
      weakTo: ['water', 'grass', 'ice'],
      resistantTo: ['poison', 'rock'],
      immuneTo: ['electric'],
    },
    flying: {
      weakTo: ['electric', 'ice', 'rock'],
      resistantTo: ['grass', 'fighting', 'bug'],
      immuneTo: ['ground'],
    },
    psychic: {
      weakTo: ['bug', 'ghost', 'dark'],
      resistantTo: ['fighting', 'psychic'],
      immuneTo: [],
    },
    bug: {
      weakTo: ['fire', 'flying', 'rock'],
      resistantTo: ['grass', 'fighting', 'ground'],
      immuneTo: [],
    },
    rock: {
      weakTo: ['water', 'grass', 'fighting', 'ground', 'steel'],
      resistantTo: ['normal', 'fire', 'poison', 'flying'],
      immuneTo: [],
    },
    ghost: {
      weakTo: ['ghost', 'dark'],
      resistantTo: ['poison', 'bug'],
      immuneTo: ['normal', 'fighting'],
    },
    dragon: {
      weakTo: ['ice', 'dragon', 'fairy'],
      resistantTo: ['fire', 'water', 'electric', 'grass'],
      immuneTo: [],
    },
    dark: {
      weakTo: ['fighting', 'bug', 'fairy'],
      resistantTo: ['ghost', 'dark'],
      immuneTo: ['psychic'],
    },
    steel: {
      weakTo: ['fire', 'fighting', 'ground'],
      resistantTo: [
        'normal',
        'grass',
        'ice',
        'flying',
        'psychic',
        'bug',
        'rock',
        'dragon',
        'steel',
        'fairy',
      ],
      immuneTo: ['poison'],
    },
    fairy: {
      weakTo: ['poison', 'steel'],
      resistantTo: ['fighting', 'bug', 'dark'],
      immuneTo: ['dragon'],
    },
  }

  // คำนวณความอ่อนแอ
  for (const type of pokemonTypes) {
    if (typeRelations[type]?.immuneTo.includes(weaknessType)) {
      return false // ถ้ามีภูมิคุ้มกันต่อประเภทนี้ จะไม่มีความอ่อนแอ
    }

    if (typeRelations[type]?.resistantTo.includes(weaknessType)) {
      effectiveness *= 0.5 // ต้านทาน
    }

    if (typeRelations[type]?.weakTo.includes(weaknessType)) {
      effectiveness *= 2 // อ่อนแอ
    }
  }

  return effectiveness > 1 // ถ้า effectiveness > 1 แสดงว่ามีความอ่อนแอต่อประเภทนี้
}

// ตรวจสอบว่า Pokemon มีความต้านทานต่อประเภทที่ระบุหรือไม่
const hasPokemonResistance = (pokemon: PokemonDetail, resistanceType: string): boolean => {
  // ดึงข้อมูลประเภทของ Pokemon
  const pokemonTypes = pokemon.types?.map((t) => t.type.name) || []

  // ตรวจสอบความต้านทานโดยใช้ตารางความสัมพันธ์ของประเภท
  let effectiveness = 1

  // ใช้ตารางความสัมพันธ์เดียวกับ hasPokemonWeakness
  const typeRelations: Record<
    string,
    { weakTo: string[]; resistantTo: string[]; immuneTo: string[] }
  > = {
    normal: {
      weakTo: ['fighting'],
      resistantTo: [],
      immuneTo: ['ghost'],
    },
    fire: {
      weakTo: ['water', 'ground', 'rock'],
      resistantTo: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'],
      immuneTo: [],
    },
    water: {
      weakTo: ['electric', 'grass'],
      resistantTo: ['fire', 'water', 'ice', 'steel'],
      immuneTo: [],
    },
    electric: {
      weakTo: ['ground'],
      resistantTo: ['electric', 'flying', 'steel'],
      immuneTo: [],
    },
    grass: {
      weakTo: ['fire', 'ice', 'poison', 'flying', 'bug'],
      resistantTo: ['water', 'electric', 'grass', 'ground'],
      immuneTo: [],
    },
    ice: {
      weakTo: ['fire', 'fighting', 'rock', 'steel'],
      resistantTo: ['ice'],
      immuneTo: [],
    },
    fighting: {
      weakTo: ['flying', 'psychic', 'fairy'],
      resistantTo: ['bug', 'rock', 'dark'],
      immuneTo: [],
    },
    poison: {
      weakTo: ['ground', 'psychic'],
      resistantTo: ['grass', 'fighting', 'poison', 'bug', 'fairy'],
      immuneTo: [],
    },
    ground: {
      weakTo: ['water', 'grass', 'ice'],
      resistantTo: ['poison', 'rock'],
      immuneTo: ['electric'],
    },
    flying: {
      weakTo: ['electric', 'ice', 'rock'],
      resistantTo: ['grass', 'fighting', 'bug'],
      immuneTo: ['ground'],
    },
    psychic: {
      weakTo: ['bug', 'ghost', 'dark'],
      resistantTo: ['fighting', 'psychic'],
      immuneTo: [],
    },
    bug: {
      weakTo: ['fire', 'flying', 'rock'],
      resistantTo: ['grass', 'fighting', 'ground'],
      immuneTo: [],
    },
    rock: {
      weakTo: ['water', 'grass', 'fighting', 'ground', 'steel'],
      resistantTo: ['normal', 'fire', 'poison', 'flying'],
      immuneTo: [],
    },
    ghost: {
      weakTo: ['ghost', 'dark'],
      resistantTo: ['poison', 'bug'],
      immuneTo: ['normal', 'fighting'],
    },
    dragon: {
      weakTo: ['ice', 'dragon', 'fairy'],
      resistantTo: ['fire', 'water', 'electric', 'grass'],
      immuneTo: [],
    },
    dark: {
      weakTo: ['fighting', 'bug', 'fairy'],
      resistantTo: ['ghost', 'dark'],
      immuneTo: ['psychic'],
    },
    steel: {
      weakTo: ['fire', 'fighting', 'ground'],
      resistantTo: [
        'normal',
        'grass',
        'ice',
        'flying',
        'psychic',
        'bug',
        'rock',
        'dragon',
        'steel',
        'fairy',
      ],
      immuneTo: ['poison'],
    },
    fairy: {
      weakTo: ['poison', 'steel'],
      resistantTo: ['fighting', 'bug', 'dark'],
      immuneTo: ['dragon'],
    },
  }

  // คำนวณความต้านทาน
  for (const type of pokemonTypes) {
    if (typeRelations[type]?.immuneTo.includes(resistanceType)) {
      return true // ถ้ามีภูมิคุ้มกันต่อประเภทนี้ ถือว่ามีความต้านทาน
    }

    if (typeRelations[type]?.resistantTo.includes(resistanceType)) {
      effectiveness *= 0.5 // ต้านทาน
    }

    if (typeRelations[type]?.weakTo.includes(resistanceType)) {
      effectiveness *= 2 // อ่อนแอ
    }
  }

  return effectiveness < 1 // ถ้า effectiveness < 1 แสดงว่ามีความต้านทานต่อประเภทนี้
}

// ตรวจสอบว่ามีตัวกรองที่ใช้งานอยู่หรือไม่
const hasActiveFilters = computed(() => {
  return (
    selectedTypes.value.length > 0 ||
    selectedWeaknesses.value.length > 0 ||
    selectedResistances.value.length > 0 ||
    heightSort.value !== 'none' ||
    weightSort.value !== 'none'
  )
})

// ข้อมูลความสัมพันธ์ของธาตุ
interface TypeEffectiveness {
  type: string
  effectiveness: number // 0 = immune, 0.25 = very resistant, 0.5 = resistant, 1 = normal, 2 = weak, 4 = very weak
}

const typeWeaknesses = ref<TypeEffectiveness[]>([]) // ประเภทที่ Pokemon นี้แพ้ (effectiveness > 1)
const typeResistances = ref<TypeEffectiveness[]>([]) // ประเภทที่ Pokemon ต้านทาน (effectiveness < 1)

// Computed สำหรับกรองและเรียงลำดับ Pokemon
const filteredPokemonList = computed(() => {
  let result = [...fullPokemonList.value]

  // กรองตามคำค้นหา
  if (searchkey.value.trim()) {
    const keyword = searchkey.value.toLowerCase().trim()
    result = result.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(keyword) || pokemon.id.toString().includes(keyword),
    )
  }

  // กรองตามประเภท
  if (selectedTypes.value.length > 0) {
    result = result.filter((pokemon) => {
      const pokemonTypes = pokemon.types?.map((t) => t.type.name) || []
      return selectedTypes.value.some((type) => pokemonTypes.includes(type))
    })
  }

  // กรองตามความอ่อนแอ
  if (selectedWeaknesses.value.length > 0) {
    result = result.filter((pokemon) => {
      return selectedWeaknesses.value.some((weaknessType) =>
        hasPokemonWeakness(pokemon, weaknessType),
      )
    })
  }

  // กรองตามความต้านทาน
  if (selectedResistances.value.length > 0) {
    result = result.filter((pokemon) => {
      return selectedResistances.value.some((resistanceType) =>
        hasPokemonResistance(pokemon, resistanceType),
      )
    })
  }

  // เรียงลำดับตามความสูง
  if (heightSort.value !== 'none') {
    result.sort((a, b) => {
      if (heightSort.value === 'asc') {
        return a.height - b.height
      } else {
        return b.height - a.height
      }
    })
  }

  // เรียงลำดับตามน้ำหนัก
  if (weightSort.value !== 'none') {
    result.sort((a, b) => {
      if (weightSort.value === 'asc') {
        return a.weight - b.weight
      } else {
        return b.weight - a.weight
      }
    })
  }

  return result
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

  // แสดง popup บนมือถือ
  if (isMobileView.value) {
    showMobileDetail.value = true
  }
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
