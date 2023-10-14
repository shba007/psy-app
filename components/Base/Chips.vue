<script setup lang="ts">
const props = defineProps<{ title: string }>()
</script>

<template>
  <span class="rounded-full px-3 py-1 w-fit h-fit bg-dark-400 text-[14px] hover:bg-primary-400 transition-colors">
    {{ title }}
  </span>
</template>