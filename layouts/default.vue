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

const openedModel = ref<'feedback' | null>(null)

function onHelp() {
  useTrackEvent('model_feedback_open')

  openedModel.value = 'feedback'
}
</script>

<template>
  <div class="flex flex-col-reverse sm:flex-row sm:gap-5 w-screen h-screen">
    <BaseButton icon="question" size="M" title="Need Help"
      class="fixed top-3 right-0 md:right-2 scale-75 md:scale-95 z-10" @click="onHelp" />
    <!-- Navbar -->
    <NavBar :is-transition="isTransition" :route="(route.name?.toString() as 'dashboard' | 'feedbacks')" />
    <div class="flex-grow py-8 px-4 sm:pl-0 overflow-y-auto">
      <slot />
    </div>
    <ModelFeedback v-if="openedModel === 'feedback'" :is-open="openedModel === 'feedback'" @close="openedModel = null" />
  </div>
</template>