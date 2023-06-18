<script setup lang="ts">
// @ts-ignore
import banner from '~~/assets/images/banner.svg?raw';

// Newest, Treading, Popular
const props = defineProps<{ title: 'new' | null }>();

function paint(type: 'fill' | 'bg'): string {
  let color: 'primary-400' | 'secondary-400' | 'alert-400';

  if (props.title == null)
    return ""

  switch (props.title) {
    case 'new':
      color = 'secondary-400'
      break;
  }

  return `${type}-${color}`
}
</script>

<template>
  <div v-if="title" v-bind="$attrs">
    <div class="flex justify-center text-white font-body text-xs rotate-180" :class="paint('fill')">
      <div v-html="banner" />
      <span class="mb-[3px] rounded-[4px] px-2 pt-[2px] -translate-x-1 leading-[16px] capitalize -rotate-180"
        :class="paint('bg')">
        {{ title }}
      </span>
    </div>
  </div>
</template>

<style scoped>
:root {
  @apply bg-primary-400 fill-primary-400
}

:root {
  @apply bg-secondary-400 fill-secondary-400
}

:root {
  @apply bg-alert-400 fill-alert-400
}
</style>
