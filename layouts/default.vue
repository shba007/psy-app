<script setup lang="ts">
const route = useRoute()

const isMounted = ref(false)
const isTransition = ref(false)

watch(route, () => {
  isTransition.value = !isMounted.value
  isMounted.value = false
})

onMounted(() => {
  isMounted.value = true
})
</script>

<template>
  <div class="flex w-screen h-screen bg-dark-400 text-white">
    <!-- Navbar -->
    <NavBar :is-transition="isTransition" :route="(route.name?.toString() as 'dashboard' | 'feedbacks')" />
    <div class="flex-grow m-6 overflow-hidden">
      <slot />
    </div>
  </div>
</template>