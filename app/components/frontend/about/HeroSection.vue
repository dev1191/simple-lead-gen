<script setup lang="ts">
import { Button } from "@/components/ui/button";
import type { Page } from "~/shared/types/pages";

const { page } = defineProps<{
  page: Page;
}>();
</script>

<template>
  <div class="bg-orange-50 py-16">
    <div class="max-w-4xl mx-auto px-4 text-center">
      <!-- Icon and Title -->
      <div class="animate-fade-in-up">
        <div class="mb-8">
          <div class="flex items-center justify-center gap-3 mb-4">
            <span class="text-3xl">🚀</span>
            <h1 class="text-4xl font-bold text-gray-900">{{ page.title }}</h1>
          </div>
        </div>
      </div>

      <div class="animate-fade-in-up animation-delay-200">
        <!-- Description -->
        <p
          class="text-gray-600 text-lg leading-relaxed mb-8 max-w-3xl mx-auto"
          v-html="page.content"
        ></p>
      </div>

      <!-- CTA Button -->
      <div class="animate-fade-in-up animation-delay-400">
        <Button
          class="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-base font-medium"
        >
          Explore Our Platform →
        </Button>
      </div>
    </div>
  </div>
</template>
