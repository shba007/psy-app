<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => (titleChunk ? `Psy - ${titleChunk}` : 'Psy')
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
@font-face {
  font-family: 'Arkhip';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('~~/assets/fonts/Arkhip-Regular.ttf') format('truetype');
}

* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: transparent;
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;
  /* IE and Edge */
  /* Firefox */
  scrollbar-width: 6px;
  @apply text-black dark: text-white;
}

body {
  @apply overflow-x-hidden;
}

*::-webkit-scrollbar {
  @apply block w-[6px] bg-light-500 dark: bg-dark-400;
}

*::-webkit-scrollbar-thumb {
  @apply rounded-md bg-light-400 dark: bg-dark-600;
}

html {
  @apply text-black dark: text-white font-body bg-white dark:bg-black;
}

.nuxt-icon>svg {
  @apply !m-0;
}

.text-shadow {
  text-shadow: #1e1d2a80 0px 2px 6px;
}
</style>