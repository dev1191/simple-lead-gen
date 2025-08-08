import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    'shadcn-nuxt',
    "@pinia/nuxt",
    '@nuxtjs/supabase',
  ],
  supabase: {
    redirect: false,
    login: '/auth/login'
  },
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
    build: {
      target: 'esnext'
    },
    optimizeDeps: {
      include: [
        'lucide-vue-next',
        'clsx',
        'class-variance-authority',
        'reka-ui',
        'tailwind-merge',

      ]
    }
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './app/components/ui'
  },
    colorMode: {
    preference: "system",
    fallback: "dark",
    classPrefix: "",
    classSuffix: "",
    storage: "localStorage",
    storageKey: "color-mode",
  },
})