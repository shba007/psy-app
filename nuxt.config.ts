// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxtjs/color-mode',
    '@nuxtjs/seo',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
    '@vueuse/nuxt',
    'nuxt-gtag',
    'nuxt-icons',
  ],
  routeRules: {
    '/': { redirect: '/dashboard' }
  },
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
  image: {
    format: ['avif', 'webp'],
    width: 1024,
    quality: 80,
  },
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
  },
  site: {
    name: 'Psy',
    url: 'https://psy.monalisa-bairagi.com',
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Psy',
      short_name: 'Psy',
      description: 'Psychological Assessment Toolkit',
      theme_color: '#37B1A7',
      background_color: '#37B1A7',
      orientation: 'portrait',
      shortcuts: [
        /* {
          'name': 'Scan Document',
          'short_name': 'Scan',
          'description': 'Scan Document',
          'url': 'https://psy.monalisa-bairagi.com/scan',
          'icons': [
            {
              src: '/pwa/scan.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/pwa/scan-maskable.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ]
        }, */
      ],
      icons: [
        {
          src: '/pwa/icon-48.png',
          sizes: '48x48',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/pwa/icon-72.png',
          sizes: '72x72',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/pwa/icon-96.png',
          sizes: '96x96',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/pwa/icon-128.png',
          sizes: '128x128',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/pwa/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/pwa/icon-384.png',
          sizes: '384x384',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/pwa/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/pwa/icon-maskable-48.png',
          sizes: '48x48',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: '/pwa/icon-maskable-72.png',
          sizes: '72x72',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: '/pwa/icon-maskable-96.png',
          sizes: '96x96',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: '/pwa/icon-maskable-128.png',
          sizes: '128x128',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: '/pwa/icon-maskable-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: '/pwa/icon-maskable-384.png',
          sizes: '384x384',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: '/pwa/icon-maskable-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        },
      ],
      screenshots: [
        {
          src: '/pwa/screenshot-desktop-1.webp',
          sizes: '1024x576',
          type: 'image/webp',
          form_factor: 'wide',
          label: 'Screenshot 1'
        },
        /* {
          src: '/pwa/screenshot-desktop-2.webp',
          sizes: '1024x576',
          type: 'image/webp',
          form_factor: 'wide',
          label: 'Screenshot 2'
        },
        {
          src: '/pwa/screenshot-desktop-3.webp',
          sizes: '1024x576',
          type: 'image/webp',
          form_factor: 'wide',
          label: 'Screenshot 3'
        }, */
        {
          src: '/pwa/screenshot-mobile-1.webp',
          sizes: '576x1024',
          type: 'image/webp',
          form_factor: 'narrow',
          label: 'Screenshot 1'
        },
        /* {
          src: '/pwa/screenshot-mobile-2.webp',
          sizes: '576x1024',
          type: 'image/webp',
          form_factor: 'narrow',
          label: 'Screenshot 2'
        },
        {
          src: '/pwa/screenshot-mobile-3.webp',
          sizes: '576x1024',
          type: 'image/webp',
          form_factor: 'narrow',
          label: 'Screenshot 3'
        }, */
      ]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600,
    },
    devOptions: {
      enabled: false,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
  },
  gtag: {
    id: 'G-YPSNKTWEYP'
  }
})
