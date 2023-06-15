<script setup lang="ts">
import { useAuth } from '~/stores/auth';

const props = defineProps<{
  isTransition: boolean,
  route: 'dashboard' | 'feedbacks',
}>()

const authStore = useAuth()

const routes = computed(() => ({
  dashboard: { icon: 'home', },
  // feedbacks: { icon: 'chat', },
  logout: { icon: 'power' }
}))

function onLogout() {
  authStore.resetToken()
}
</script>

<template>
  <!-- TODO: Make it collapsable -->
  <nav class="shrink-0 relative px-4 py-8 rounded-r-[24px] w-[252px] h-full bg-dark-500 overflow-hidden">
    <div class="flex items-center justify-center mx-auto w-fit ">
      <NuxtIcon name="psy" :filled="true" class="text-[56px]" />
      <h1 class="font-brand text-[28px] text-primary-400 uppercase">Psy</h1>
    </div>
    <ul class="flex flex-col gap-4 mt-12 w-[220px] h-5/6 overflow-y-scroll z-10">
      <li v-for="{ icon }, route in routes" :key="route" :ref="route" @click="route === 'logout' ? onLogout() : null">
        <NuxtLink :to="route === 'logout' ? '/' : `/${route}`" :replace="route !== 'dashboard'"
          class="flex items-center py-2 gap-2 rounded-2xl font-semi-bold bg-dark-500 opacity-50 cursor-pointer"
          :class="{ 'justify-self-center self-end': route === 'logout' }" active-class="bg-dark-600 !opacity-100">
          <svg width="21" height="32" viewBox="0 0 21 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 2C3.31371 2 6 4.68629 6 8V24C6 27.3137 3.31371 30 0 30V2Z" />
          </svg>
          <NuxtIcon :name="icon" class="text-[32px]" />
          <span class="capitalize whitespace-nowrap">{{ route.replaceAll("-", " ") }}</span>
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