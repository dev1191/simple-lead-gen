<template>
  <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 py-4">
    <div class="w-full mx-auto px-4">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <ServiceCard
          v-for="service in services"
          :key="service.id"
          :service="service"
          @click="handleServiceClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ServiceCard from './ServiceCard.vue'

interface Service {
  id: string
  title: string
  description: string
  icon: string
  iconBg: string
}

const services = ref<Service[]>([
  {
    id: 'saas-tools',
    title: 'SaaS Tools',
    description: 'Software solutions for business growth',
    icon: '💻',
    iconBg: 'bg-cyan-400'
  },
  {
    id: 'ai-tools',
    title: 'AI Tools',
    description: 'Artificial intelligence powered services',
    icon: '🤖',
    iconBg: 'bg-red-400'
  },
  {
    id: 'register-business',
    title: 'Register A Business',
    description: 'Legal incorporation and setup services',
    icon: '🏢',
    iconBg: 'bg-blue-400'
  },
  {
    id: 'marketing-services',
    title: 'Marketing Services',
    description: 'Digital marketing and growth solutions',
    icon: '📊',
    iconBg: 'bg-gray-300'
  },
  {
    id: 'design-creative',
    title: 'Design & Creative',
    description: 'Branding, logos, and creative services',
    icon: '🎨',
    iconBg: 'bg-red-400'
  }
])

const handleServiceClick = (service: Service) => {
  console.log('Service clicked:', service.title)
  // Handle navigation
}
</script>