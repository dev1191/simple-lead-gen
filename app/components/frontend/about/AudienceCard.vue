<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 group">
    <!-- Icon -->
    <div class="mb-4">
      <div class="w-16 h-16 rounded-lg flex items-center justify-center" :class="audience.iconBg">
        <span class="text-2xl">{{ audience.icon }}</span>
      </div>
    </div>

    <!-- Title -->
    <h3 class="text-xl font-bold text-gray-900 mb-2">
      {{ audience.title }}
    </h3>

    <!-- Subtitle -->
    <p class="text-gray-600 text-sm mb-4 leading-relaxed">
      {{ audience.subtitle }}
    </p>

    <!-- Services List -->
    <ul class="space-y-2">
      <li 
        v-for="service in audience.services" 
        :key="service"
        class="flex items-center gap-2 text-sm text-gray-700"
      >
        <div class="w-1.5 h-1.5 bg-orange-400 rounded-full flex-shrink-0"></div>
        {{ service }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface Audience {
  id: string
  title: string
  subtitle: string
  description: string
  services: string[]
  icon: string
  iconBg: string
}

defineProps<{
  audience: Audience
}>()
</script>