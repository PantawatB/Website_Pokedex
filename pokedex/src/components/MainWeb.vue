<template>
  <!-- แถบเมนูด้านบน -->
  <nav class="flex items-center justify-between px-4 sm:px-8 md:px-16 py-6 relative">
    <!-- โลโก้ Pokedex -->
    <router-link to="/">
      <img src="../assets/Photos/Pokedex_logo.png" alt="Pokedex Logo" class="w-[145px] h-auto" />
    </router-link>

    <!-- เมนูหลักที่แสดงบนหน้าจอขนาดใหญ่-->
    <ul class="hidden md:flex space-x-[40px] lg:space-x-[80px] text-base font-semibold">
      <!-- รายการในเมนู -->
      <li class="hover:text-black hover:scale-105 transition-all">
        <router-link :to="{ name: 'home' }">Home</router-link>
      </li>
      <li class="hover:text-black hover:scale-105 transition-all">
        <router-link :to="{ name: 'listpokemon' }">List Pokemon</router-link>
      </li>
      <li class="hover:text-black hover:scale-105 transition-all">
        <router-link :to="{ name: 'minigame' }">Mini Game</router-link>
      </li>
      <!-- <li class="hover:text-black hover:scale-105 transition-all">
        <router-link :to="{ name: 'contactme' }">Contact me</router-link>
      </li> -->
      <li class="hover:text-black hover:scale-105 transition-all">
        <router-link :to="{ name: 'tutorial' }">Tutorial</router-link>
      </li>
    </ul>

    <!-- ปุ่ม Hamburger สำหรับเปิดเมนูบนมือถือ -->
    <button
      @click="toggleMobileMenu"
      class="md:hidden focus:outline-none p-2 bg-gray-100 rounded-md transition-all duration-300 hover:bg-gray-200"
      :class="{ 'rotate-hamburger': mobileMenuOpen }"
    >
      <!-- ไอคอนของปุ่ม Hamburger -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-10 w-10 transition-transform duration-300"
        :class="{ 'rotate-90': mobileMenuOpen }"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2.5"
      >
        <!-- แสดงเป็น hamberger ขีด เมื่อเมนูปิด -->
        <path
          v-if="!mobileMenuOpen"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4 6h16M4 12h16M4 18h16"
        />
        <!-- แสดงเป็น X เมื่อเมนูเปิด -->
        <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- เมนู dropdown ใน hamburger -->
    <div
      class="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg overflow-hidden z-50 md:hidden border-t border-gray-200 transition-all duration-500 ease-in-out"
      :class="{ 'menu-expanded': mobileMenuOpen, 'menu-collapsed': !mobileMenuOpen }"
    >
      <!-- รายการเมนูใน dropdown -->
      <ul class="py-2 text-lg font-semibold max-w-screen-sm mx-auto">
        <li
          class="hover:bg-gray-100 border-b border-gray-100 transform transition-transform duration-300 hover:translate-x-2"
        >
          <!-- แต่ละรายการเมนูจะปิด dropdown เมื่อคลิก -->
          <router-link @click="toggleMobileMenu" :to="{ name: 'home' }" class="block px-6 py-4">
            Home
          </router-link>
        </li>
        <li
          class="hover:bg-gray-100 border-b border-gray-100 transform transition-transform duration-300 hover:translate-x-2"
        >
          <router-link
            @click="toggleMobileMenu"
            :to="{ name: 'listpokemon' }"
            class="block px-6 py-4"
          >
            List Pokemon
          </router-link>
        </li>
        <li
          class="hover:bg-gray-100 border-b border-gray-100 transform transition-transform duration-300 hover:translate-x-2"
        >
          <router-link @click="toggleMobileMenu" :to="{ name: 'minigame' }" class="block px-6 py-4">
            Mini Game
          </router-link>
        </li>
        <li
          class="hover:bg-gray-100 border-b border-gray-100 transform transition-transform duration-300 hover:translate-x-2"
        >
          <router-link
            @click="toggleMobileMenu"
            :to="{ name: 'contactme' }"
            class="block px-6 py-4"
          >
            Contact me
          </router-link>
        </li>
        <li
          class="hover:bg-gray-100 transform transition-transform duration-300 hover:translate-x-2"
        >
          <router-link @click="toggleMobileMenu" :to="{ name: 'tutorial' }" class="block px-6 py-4">
            Tutorial
          </router-link>
        </li>
      </ul>
    </div>
  </nav>

  <!-- พื้นหลังเทาเมื่อเปิดเมนู ใช้สำหรับคลิกปิดเมนู -->
  <div v-if="mobileMenuOpen" @click="toggleMobileMenu" class="fixed inset-0 z-40"></div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

// ตัวแปรเก็บสถานะว่าเมนูมือถือเปิดอยู่หรือไม่
const mobileMenuOpen = ref(false)

// ฟังก์ชัน toggle เปิด/ปิดเมนู
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value

  // ป้องกันไม่ให้ scroll หน้าเว็บเมื่อเมนูเปิด
  if (mobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}
</script>
<style scoped>
/* สไตล์ตอนปุ่ม hamburger ถูกกด */
.rotate-hamburger {
  transform: scale(1.1);
  background-color: #e5e7eb;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* สไตล์เมนูเมื่อเปิด */
.menu-expanded {
  max-height: 500px;
  opacity: 1;
  transform: translateY(0);
}

/* สไตล์เมนูเมื่อปิด */
.menu-collapsed {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

/* เพิ่ม background เมื่อ hover ที่เมนู */
li:hover {
  background-color: #f3f4f6;
}

/* keyframe สำหรับ slide in animation */
@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
