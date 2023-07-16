<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean,
}>()
const emit = defineEmits<{
  (event: 'close'): void,
}>()

function onClose() {
  useTrackEvent('model_feedback_close')

  emit('close')
}
</script>

<template>
  <ModelBase :is-open="isOpen" @close="onClose" id="feedback">
    <iframe
      src="https://docs.google.com/forms/d/e/1FAIpQLSf7YAWkJ4fnd_SAE95Ir_r9NYtJcRbceOzJTm8yL2nUUJe03w/viewform?embedded=true"
      width="640" height="618" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
  </ModelBase>
</template>