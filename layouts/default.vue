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
  <div class="flex gap-5 w-screen h-screen bg-dark-400">
    <!-- Navbar -->
    <NavBar :is-transition="isTransition" :route="(route.name?.toString() as 'dashboard' | 'feedbacks')" />
    <div class="flex-grow py-5 pr-2 overflow-y-auto">
      <slot />
    </div>
    <BaseButton icon="question" size="M" title="Need Help" class="fixed bottom-6 right-6" @click="onHelp" />
    <ModelFeedback v-if="openedModel === 'feedback'" :is-open="openedModel === 'feedback'" @close="openedModel = null" />
  </div>
</template>