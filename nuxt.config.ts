// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    // '@vite-pwa/nuxt',
    '@vueuse/nuxt',
    'nuxt-icons',
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
      authAccessSecret: '',
      authWebhook: '',
      paymentUrl: '',
      paymentId: '',
      paymentUserId: '',
      paymentSecret: '',
    },
    colorMode: {
      classSuffix: '',
      preference: 'dark'
    },
    imports: {
      imports: [
        { name: 'defineStore', from: 'pinia' },
        { name: 'storeToRefs', from: 'pinia' },
      ],
    },
  })
