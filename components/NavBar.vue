<script setup lang="ts">
import { useAuth } from '~/stores/auth';

const props = defineProps<{
  isTransition: boolean,
  route: 'dashboard' | 'feedbacks',
}>()

const authStore = useAuth()

const routes = computed(() => ({
  dashboard: { icon: 'widget' },
  scanner: { icon: 'scanner' }
  // feedbacks: { icon: 'chat', },
  // logout: { icon: 'power' }
}))

function onLogout() {
  authStore.resetToken()
}
</script>

<template>
  <!-- TODO: Make it collapsable -->
  <nav
    class="relative shrink-0 bottom-0 flex flex-col px-[1.25rem] py-[0.75rem] sm:py-8 rounded-t-[1.5rem] sm:rounded-l-none sm:rounded-r-[1.5rem] w-screen sm:w-[100px] lg:w-[252px] md:max-w-[252px] bg-light-500 dark:bg-dark-500 overflow-hidden z-50">
    <div class="hidden sm:flex items-center justify-center mx-auto w-fit !text-primary-400">
      <NuxtIcon name="psy" class="text-[56px]" />
      <h1 class="font-brand text-[28px] uppercase">Psy</h1>
    </div>
    <ul class="grow flex sm:flex-col gap-4 sm:my-12 sm:w-[220px] md:max-h-1/2 overflow-hidden z-10">
      <li v-for="{ icon }, route in routes" :key="route" :ref="route" @click="route === 'logout' ? onLogout() : null"
        :class="{ 'justify-self-end self-center mt-auto': route === 'logout' }">
        <NuxtLink :to="route === 'logout' ? '/' : `/${route}`" :replace="route !== 'dashboard'"
          class="flex items-center p-2 sm:px-0 gap-2 rounded-2xl font-semi-bold bg-light-600 dark:bg-dark-600 overflow-hidden opacity-50 cursor-pointer"
          :class="{ 'justify-self-center self-end': route === 'logout' }"
          active-class="bg-dark-600 text-primary-400 transition-all duration-500 !opacity-100">
          <svg width="21" height="32" viewBox="0 0 21 32" fill="none" xmlns="http://www.w3.org/2000/svg"
            class="hidden sm:inline">
            <path d="M0 2C3.31371 2 6 4.68629 6 8V24C6 27.3137 3.31371 30 0 30V2Z" />
          </svg>
          <!-- <div class="" /> -->
          <NuxtIcon :name="icon" class="text-[32px]" />
          <span class="hidden sm:inline capitalize whitespace-nowrap">{{ route.replaceAll("-", " ") }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
ul>li>a.router-link-exact-active>svg {
  @apply fill-primary-400
}
</style>