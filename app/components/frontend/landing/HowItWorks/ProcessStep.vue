<template>
  <div class="text-center group">
    <!-- Step Number & Icon -->
    <div class="relative mb-6">
      <!-- Icon Container -->
      <div class="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4" :class="step.iconBg">
        <span class="text-3xl">{{ step.icon }}</span>
      </div>
      
      <!-- Step Number Badge -->
      <div class="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
        <span class="text-white font-bold text-sm">{{ step.id }}</span>
      </div>
    </div>

    <!-- Title -->
    <h3 class="text-xl font-semibold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
      {{ step.title }}
    </h3>

    <!-- Description -->
    <p class="text-gray-600 text-sm leading-relaxed">
      {{ step.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Step {
  id: number
  title: string
  description: string
  icon: string
  iconBg: string
}

defineProps<{
  step: Step
}>()
</script>