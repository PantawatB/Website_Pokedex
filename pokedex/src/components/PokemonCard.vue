<template>
  <div class="border text-center bg-white rounded-lg shadow-md p-4 hover:shadow-lg">
    <img
      :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`"
      alt="pokemon"
      class="mx-auto mb-2"
    />
    <div class="capitalize font-semibold">{{ pokemon.name }}</div>
    <div class="text-sm text-gray-600">ID: {{ pokemon.id }}</div>
    <div class="text-sm text-gray-600">Base Exp: {{ pokemon.base_experience }}</div>
    <div class="text-sm text-gray-600">Height: {{ pokemon.height }}</div>
    <div class="text-sm text-gray-600">Weight: {{ pokemon.weight }}</div>
  </div>
</template>

<script setup lang="ts">
import type { PokemonDetail } from '@/models/pokemon.model'

defineProps<{ pokemon: PokemonDetail }>()
</script>
