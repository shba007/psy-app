// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    // '@nuxt/image',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@tresjs/nuxt',
    '@vite-pwa/nuxt',
    '@vueuse/nuxt',
    'nuxt-gtag',
    'nuxt-icons',
    'nuxt-schema-org',
  ],
  typescript: {
    shim: false,
  },
  runtimeConfig: {
    public: {
      authUrl: '',
      apiUrl: '',
      anoyToken: ''
    },
    private: {
      corsUrl: '',
      omrUrl: '',
      authAccessSecret: '',
      authWebhook: '',
      paymentUrl: '',
      paymentId: '',
      paymentUserId: '',
      paymentSecret: '',
    },
  },
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
  },
  imports: {
    imports: [
      { name: 'defineStore', from: 'pinia' },
      { name: 'storeToRefs', from: 'pinia' },
    ],
  },
  pwa: {
    /* your pwa options */
  },
  gtag: {
    id: 'G-YPSNKTWEYP'
  }
})
