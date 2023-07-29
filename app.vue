<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => (titleChunk ? `Psy - ${titleChunk}` : 'Psy'),
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: 'anonymous',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com'
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&family=Source+Sans+3:wght@300;400;500&display=swap',
    },
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  ogType: 'website',
  title: 'Psychological Assessment Toolkit',
  ogTitle: 'Psychological Assessment Toolkit',
  description: 'Discover a powerful collection of psychology tools, including various assessments and a scanner for automatic analysis. Explore our extensive list of free psychological assessment tools for accurate evaluations. Utilize our innovative scanner for automatic analysis, providing insightful results and valuable insights for professionals and individuals alike.',
  ogDescription: 'Discover a powerful collection of psychology tools, including various assessments and a scanner for automatic analysis. Explore our extensive list of free psychological assessment tools for accurate evaluations. Utilize our innovative scanner for automatic analysis, providing insightful results and valuable insights for professionals and individuals alike.',
  ogImage: '/preview/dashboard.jpg',
  ogImageWidth: 1280,
  ogImageHeight: 640,
  ogUrl: 'https://psy.shirsendu-bairagi.dev',
  fbAppId: 966242223397117,
  twitterCard: 'summary_large_image',
})

useSchemaOrg([
  defineOrganization({
    name: 'Psy',
    logo: '/logo.png',
  }),
  defineWebSite({
    name: 'Psy - Psychological Assessment Toolkit',
    description: `Discover a powerful collection of psychology tools, including various assessments and a scanner for automatic analysis. Explore our extensive list of free psychological assessment tools for accurate evaluations. Utilize our innovative scanner for automatic analysis, providing insightful results and valuable insights for professionals and individuals alike.`
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