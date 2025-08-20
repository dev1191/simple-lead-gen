<script setup lang="ts">
import { Toaster } from "@steveyuowo/vue-hot-toast";


useHead({
  title: 'Yotta',
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { key: "theme-color", name: "theme-color", content: 'light' },
  ],
  htmlAttrs: {
    lang: 'en',
  },
})
</script>

<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
	  <Toaster/>
    </NuxtLayout>
  </div>
</template>
