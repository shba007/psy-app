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
  scrollbar-width: none;
  /* Firefox */
  color: white;
}

/* Hide scrollbar for Chrome, Safari and Opera */
*::-webkit-scrollbar {
  display: none;
}

/* TODO: Add to Tailwind */
.scrollbar {
  scrollbar-width: 6px;
}

.scrollbar::-webkit-scrollbar {
  @apply block w-[6px];
}

.scrollbar::-webkit-scrollbar-thumb {
  @apply rounded-md bg-light-500 dark:bg-dark-400;
}

html {
  @apply text-black dark:text-white font-body bg-white dark:bg-black;
}

.nuxt-icon>svg {
  @apply !m-0;
}

.text-shadow {
  text-shadow: #1e1d2a80 0px 2px 6px;
}
</style>