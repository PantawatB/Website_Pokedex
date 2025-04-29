<template>
  <nav class="flex items-center justify-between px-16 py-6">
    <!-- LOGO -->
    <router-link to="/">
      <img src="../assets/Photos/Pokedex_logo.png" alt="Pokedex Logo" class="w-[145px] h-auto" />
    </router-link>

    <!-- MENU -->
    <ul class="flex space-x-[80px] text-base font-semibold">
      <li class="hover:text-black hover:scale-105 transition-all">
        <router-link :to="{ name: 'home' }">Home</router-link>
      </li>
      <li class="hover:text-black hover:scale-105 transition-all">
        <router-link :to="{ name: 'listpokemon' }">List Pokemon</router-link>
      </li>
      <li class="hover:text-black hover:scale-105 transition-all">
        <router-link :to="{ name: 'minigame' }">Mini Game</router-link>
      </li>
      <li class="hover:text-black hover:scale-105 transition-all">
        <router-link :to="{ name: 'contactme' }">Contact me</router-link>
      </li>
      <li class="hover:text-black hover:scale-105 transition-all">
        <router-link :to="{ name: 'tutorial' }">Tutorial</router-link>
      </li>
    </ul>
  </nav>
</template>
