// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    // '@vite-pwa/nuxt',
    '@vueuse/nuxt',
    'nuxt-icons',
  ],
  imports: {
    imports: [
      { name: 'defineStore', from: 'pinia' },
      { name: 'storeToRefs', from: 'pinia' },
    ],
  },

  runtimeConfig: {
    public: {
      authUrl: '',
      apiUrl: '',
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
  }
})
