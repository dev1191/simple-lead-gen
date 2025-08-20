

<script setup lang="ts">
import { ref } from 'vue'
import AudienceCard from './AudienceCard.vue'

interface Audience {
  id: string
  title: string
  subtitle: string
  description: string
  services: string[]
  icon: string
  iconBg: string
}

const audiences = ref<Audience[]>([
  {
    id: 'solopreneurs',
    title: 'Solopreneurs',
    subtitle: 'Individual entrepreneurs looking to turn their business ideas into reality',
    description: '',
    services: [
      'Personal branding tools',
      'Solo-friendly platforms',
      'Marketing solutions',
      'Financial management'
    ],
    icon: '👤',
    iconBg: 'bg-orange-100'
  },
  {
    id: 'startup-founders',
    title: 'Startup Founders',
    subtitle: 'Innovation leaders launching the next big thing with limited resources',
    description: '',
    services: [
      'MVP development',
      'Funding support',
      'Team collaboration',
      'Legal formation'
    ],
    icon: '📍',
    iconBg: 'bg-blue-100'
  },
  {
    id: 'small-teams',
    title: 'Small Teams',
    subtitle: 'Growing businesses with 2-20 employees scaling their operations',
    description: '',
    services: [
      'HR solutions',
      'Team productivity',
      'Customer support',
      'Process optimization'
    ],
    icon: '🌱',
    iconBg: 'bg-green-100'
  },
  {
    id: 'smes',
    title: 'SMEs',
    subtitle: 'Established small and medium enterprises looking to modernize',
    description: '',
    services: [
      'Enterprise tools',
      'Digital transformation',
      'Process automation',
      'Market expansion'
    ],
    icon: '🏢',
    iconBg: 'bg-purple-100'
  }
])
</script>


<template>
  <div class="bg-white py-16">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Who We Serve</h2>
        <p class="text-gray-600 text-lg max-w-3xl mx-auto">
          From solo entrepreneurs to growing teams, we support businesses at every stage of 
          their journey with tailored solutions and expert guidance.
        </p>
      </div>

      <!-- Audience Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <AudienceCard
          v-for="audience in audiences"
          :key="audience.id"
          :audience="audience"
        />
      </div>
    </div>
  </div>
</template>