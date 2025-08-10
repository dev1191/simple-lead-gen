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
    'nuxt-tiptap-editor',
  ],
   tiptap: {
    prefix: 'Tiptap', //prefix for Tiptap imports, composables not included
  },
  supabase: {
    redirect: false,
    login: '/auth/login'
  },
  css: ['echo-editor/style.css','~/assets/css/tailwind.css'],
  build: {
    transpile: ['echo-editor']
  },
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
        'echo-editor'
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