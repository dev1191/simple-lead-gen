<template>
  <div class="bg-white py-20">
    <div class="max-w-6xl mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">How Yotta Works</h2>
        <p class="text-gray-600 text-lg">Get started in 4 simple steps</p>
      </div>

      <!-- Steps Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <ProcessStep
          v-for="step in steps"
          :key="step.id"
          :step="step"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProcessStep from './ProcessStep.vue'

interface Step {
  id: number
  title: string
  description: string
  icon: string
  iconBg: string
}

const steps = ref<Step[]>([
  {
    id: 1,
    title: 'Search & Discover',
    description: 'Browse through our curated marketplace of business services and tools',
    icon: '🔍',
    iconBg: 'bg-orange-100'
  },
  {
    id: 2,
    title: 'Compare Options',
    description: 'View detailed comparisons, pricing, and reviews from real users',
    icon: '⚖️',
    iconBg: 'bg-yellow-100'
  },
  {
    id: 3,
    title: 'Get Quotes',
    description: 'Request personalized quotes from multiple providers instantly',
    icon: '💬',
    iconBg: 'bg-blue-100'
  },
  {
    id: 4,
    title: 'Choose & Start',
    description: 'Select the best option and start growing your business',
    icon: '🚀',
    iconBg: 'bg-pink-100'
  }
])
</script>