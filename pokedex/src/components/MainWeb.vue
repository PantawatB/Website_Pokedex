<template>
  <nav class="flex items-center p-6">
    <router-link to="/">
      <img
        src="../assets/Photos/Pokedex_logo.png"
        alt="Pokedex Logo"
        style="width: 145px; height: auto"
        class="ml-6 mt-2"
      />
    </router-link>
    <ul class="flex mt-1 ml-[550px] space-x-[100px] text-base font-extrabold">
      <li><a href="#" class="hover:text-black hover:scale-140 transition-all">Home</a></li>
      <li><a href="#" class="hover:text-black hover:scale-140 transition-all">List Pokemon</a></li>
      <li><a href="#" class="hover:text-black hover:scale-140 transition-all">Mini Game</a></li>
      <li><a href="#" class="hover:text-black hover:scale-140 transition-all">Contact me</a></li>
      <li><a href="#" class="hover:text-black hover:scale-140 transition-all">Tutorial</a></li>
    </ul>
  </nav>
</template>

<script setup lang="ts"></script>
