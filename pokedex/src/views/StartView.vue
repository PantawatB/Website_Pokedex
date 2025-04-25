<template>
  <MainWeb></MainWeb>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-10 items-center">
    <div>
      <h1 class="text-3xl md:text-4xl font-semibold mb-6">Welcome To Pokedex Website</h1>
      <p class="text-lg mb-8">
        Welcome to the Pokedex Website <br />This website was developed during my internship at
        ITSC. <br />It is a Pokedex-style web application built with Vue 3 and Tailwind CSS.
        <br />The goal is to practice front-end development skills By connecting the api from the
        pokemon database. Additional features, such as a mini-game, are also planned to enhance the
        user experience.
      </p>
      <router-link to="/home">
        <button class="bg-black text-white px-6 py-3 text-lg rounded-xl hover:bg-gray-800">
          Get Started
        </button>
      </router-link>
    </div>

    <div class="flex justify-center">
      <img
        src="@/assets/Photos/charizard.png"
        alt="Charizard"
        style="width: 1200px; height: auto"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import MainWeb from '@/components/MainWeb.vue'
</script>
