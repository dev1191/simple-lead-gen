<template>
  <div class="text-center group">
    <!-- Icon -->
    <div class="mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center" :class="feature.iconBg">
      <span class="text-3xl">{{ feature.icon }}</span>
    </div>

    <!-- Title -->
    <h3 class="text-xl font-semibold text-gray-900 mb-4">
      {{ feature.title }}
    </h3>

    <!-- Description -->
    <p class="text-gray-600 leading-relaxed">
      {{ feature.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Feature {
  id: string
  title: string
  description: string
  icon: string
  iconBg: string
}

defineProps<{
  feature: Feature
}>()
</script>