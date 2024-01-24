<script setup lang="ts">
const props = defineProps<{ title: string }>()
</script>

<template>
  <span
    class="rounded-full px-3 py-1 w-fit h-fit bg-light-400 text-black dark:bg-dark-400 dark:text-white text-[14px] hover:!bg-primary-500 hover:text-white transition-colors">
    {{ title }}
  </span>
</template>