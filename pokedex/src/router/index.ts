import { createRouter, createWebHistory } from 'vue-router'
import StartView from '@/views/StartView.vue'
import HomeView from '@/views/HomeView.vue'
import ListPokemon from '@/views/ListPokemon.vue'
import MiniGameView from '@/views/MinigameView.vue'
import ContactMe from '@/views/ContactMe.vue'
import TutorialView from '@/views/TutorialView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'start',
      component: StartView,
    },
    {
      path: '/home',
      name: 'home',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: HomeView,
    },
    {
      path: '/list-pokemon',
      name: 'listpokemon',
      component: ListPokemon,
    },
    {
      path: '/mini-game',
      name: 'minigame',
      component: MiniGameView,
    },
    {
      path: '/contactme',
      name: 'contactme',
      component: ContactMe,
    },
    {
      path: '/tutorial',
      name: 'tutorial',
      component: TutorialView,
    },
  ],
})

export default router
