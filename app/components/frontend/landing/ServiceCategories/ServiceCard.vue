<template>
  <div 
    class="text-center cursor-pointer group transition-all duration-200 hover:transform hover:scale-105"
    @click="$emit('click', service)"
  >
    <!-- Icon Container -->
    <div class="mx-auto mb-4 w-16 h-16 rounded-lg flex items-center justify-center" :class="service.iconBg">
      <span class="text-2xl">{{ service.icon }}</span>
    </div>
    
    <!-- Title -->
    <h3 class="text-white font-semibold text-lg mb-2 group-hover:text-gray-100 transition-colors">
      {{ service.title }}
    </h3>
    
    <!-- Description -->
    <p class="text-gray-200 text-sm leading-relaxed group-hover:text-gray-100 transition-colors">
      {{ service.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Service {
  id: string
  title: string
  description: string
  icon: string
  iconBg: string
}

defineProps<{
  service: Service
}>()

defineEmits<{
  click: [service: Service]
}>()
</script>