<template>
  <div class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 group">
    <!-- Icon -->
    <div class="mb-4">
      <div class="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">
        {{ benefit.icon }}
      </div>
    </div>

    <!-- Title -->
    <h3 class="text-lg font-semibold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
      {{ benefit.title }}
    </h3>

    <!-- Description -->
    <p class="text-gray-600 text-sm leading-relaxed">
      {{ benefit.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Benefit {
  id: string
  title: string
  description: string
  icon: string
}

defineProps<{
  benefit: Benefit
}>()
</script>