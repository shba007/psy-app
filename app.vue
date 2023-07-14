<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => (titleChunk ? `Psy - ${titleChunk}` : 'Psy')
})

useSchemaOrg([
  defineOrganization({
    name: 'Psy',
    logo: '/logo.png',
  }),
  defineWebSite({
    name: 'Psy',
    description: `Psy is a app that modernize psychological calculations. It can 
    easily calculate scores for popular psychological scales like DSMD, SCL-90R, TCI, MPQ, MMPI-RF, MCMI, MACI, JTCI, EPQ-R, EPQ, 
    and many more coming, all in one convenient tool.`
  }),
  defineWebPage({
    datePublished: new Date(2, 7, 2020).toISOString(),
    dateModified: new Date(5, 7, 2020).toISOString(),
    author: 'Shirsendu Bairagi',
  }),
])
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
  @apply text-black dark:text-white;
}

*::-webkit-scrollbar {
  @apply block w-[6px] bg-light-500 dark:bg-dark-400;
}

*::-webkit-scrollbar-thumb {
  @apply rounded-md bg-light-400 dark:bg-dark-600;
}

html {
  @apply text-black dark:text-white font-body bg-white dark:bg-black;
}

.nuxt-icon>svg {
  @apply !m-0;
}

.scrollbar-hidden {
  -ms-overflow-style: none;
  /* Internet Explorer 10+ */
  scrollbar-width: none;
  /* Firefox */
}

.scrollbar-hidden::-webkit-scrollbar {
  display: none;
  /* Safari and Chrome */
}
</style>