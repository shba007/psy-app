// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    // '@nuxt/image',
    '@nuxtjs/color-mode',
    '@nuxtjs/google-adsense',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@tresjs/nuxt',
    // '@vite-pwa/nuxt',
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
      omrUrl: '',
      anoyToken: '',
      anoyRefreshToken: ''
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
  },
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
  },
  'google-adsense': {
    id: 'ca-pub-5100235454344872'
  },
  pwa: {
    /* your pwa options */
  },
  gtag: {
    id: 'G-YPSNKTWEYP'
  }
})
