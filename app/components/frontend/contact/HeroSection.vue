<script setup lang="ts">
import type { Page } from "~/shared/types/pages";

const { page } = defineProps<{
  page: Page;
}>();

</script>

<template>
  <div class="bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 flex items-center justify-center py-16">
    <div class="max-w-4xl mx-auto px-4 text-center">
      <!-- Icon and Title -->
      <div class="animate-fade-in-up">
        <div class="mb-8">
          <div class="flex items-center justify-center gap-3 mb-4">
            <h1 class="text-6xl font-extrabold text-black">
              {{ page.title.split(" ")[0] }} <span class="bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text text-transparent">{{ page.title.split(" ")[1]  }}</span>
            </h1>
          </div>
        </div>
      </div>

      <div class="animate-fade-in-up animation-delay-200">
        <!-- Description -->
        <p class="text-gray-600 text-lg leading-relaxed mb-8 max-w-3xl mx-auto">
          {{ page.content }}
        </p>
      </div>
    </div>
  </div>
</template>
