<template>
  <div 
    class="text-center cursor-pointer group transition-all duration-200 hover:transform hover:scale-105"
    @click="$emit('click', service)"
  >
    <!-- Icon Container -->
    <div class="mx-auto mb-3 w-16 h-16 rounded-xl flex items-center justify-center group-hover:shadow-md transition-all" 
         :class="service.bgColor">
      <span class="text-2xl">{{ service.icon }}</span>
    </div>
    
    <!-- Service Name -->
    <p class="text-gray-700 text-sm font-medium text-center leading-tight group-hover:text-gray-900 transition-colors">
      {{ service.name }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Service {
  id: string
  name: string
  icon: string
  color: string
  bgColor: string
}

defineProps<{
  service: Service
}>()

defineEmits<{
  click: [service: Service]
}>()
</script>