<template>
  <nav class="flex items-center">
    <router-link to="/">
      <img
        src="../assets/Photos/Pokedex_logo.png"
        alt="Pokedex Logo"
        style="width: 145px; height: auto"
        class="ml-[55px] mt-[30px]"
      />
    </router-link>
    <ul class="flex mt-[30px] ml-[550px] space-x-[100px] text-base font-semibold">
      <router-link to="/home" class="hover:text-black hover:scale-160 transition-all">
        <li>Home</li>
      </router-link>
      <li class="hover:text-black hover:scale-160 transition-all">
        <router-link :to="{ name: 'listpokemon' }">List Pokemon</router-link>
      </li>
      <li class="hover:text-black hover:scale-160 transition-all">
        <router-link to="/mini-game">Mini Game</router-link>
      </li>
      <li class="hover:text-black hover:scale-160 transition-all">
        <router-link to="/contactme">Contact me</router-link>
      </li>
      <li class="hover:text-black hover:scale-160 transition-all">
        <router-link to="/tutorial">Tutorial</router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts"></script>
