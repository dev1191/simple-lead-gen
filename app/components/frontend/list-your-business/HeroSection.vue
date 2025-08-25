<script setup lang="ts">
import type { Page } from "~/shared/types/pages";

const { page } = defineProps<{
  page: Page;
}>();
</script>

<template>
  <section
    class="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16 px-6"
  >
    <div class="max-w-4xl mx-auto text-center space-y-6">
      <!-- Title -->
      <div class="animate-fade-in-up">
        <h1 class="text-3xl md:text-4xl font-bold">
          {{ page.title }}
        </h1>
      </div>

      <!-- Subtitle -->
      <div class="animate-fade-in-up animation-delay-200">
        <p class="text-slate-300 max-w-2xl mx-auto">
          {{ page.content }}
        </p>
      </div>

      <!-- Stats -->
      <div
        class="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 text-center pt-4"
      >
        <div v-for="meta in page.meta_data.stats" :key="meta.label">
          <p class="text-2xl font-bold text-red-500">{{ meta.value }}</p>
          <p class="text-sm text-slate-400">{{ meta.label }}</p>
        </div>
      </div>

      <!-- CTA Button -->
      <div class="pt-6">
        <Button
          @click="() => navigateTo(page.meta_data.cta_link)"
          class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
        >
          {{ page.meta_data.cta_text }}
        </Button>
      </div>
    </div>
  </section>
</template>
