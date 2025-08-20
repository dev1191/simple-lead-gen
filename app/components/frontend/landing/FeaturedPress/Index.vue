<template>
  <div class="bg-white py-12">
    <div class="max-w-7xl mx-auto px-4 text-center">
      <!-- Header -->
      <p class="text-gray-600 text-lg mb-8">Featured in:</p>
      
      <!-- Press Logos -->
      <div class="flex flex-wrap justify-center items-center gap-8 md:gap-12">
        <PressLogo
          v-for="press in pressLogos"
          :key="press.id"
          :press="press"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PressLogo from './PressLogo.vue'

interface Press {
  id: string
  name: string
  logo: string
  color: string
}

const pressLogos = ref<Press[]>([
  {
    id: 'techcrunch',
    name: 'TechCrunch',
    logo: '🚀',
    color: 'text-green-500'
  },
  {
    id: 'forbes',
    name: 'Forbes',
    logo: '📰',
    color: 'text-gray-600'
  },
  {
    id: 'straits-times',
    name: 'The Straits Times',
    logo: '📊',
    color: 'text-blue-600'
  },
  {
    id: 'channel-newsasia',
    name: 'Channel NewsAsia',
    logo: '📺',
    color: 'text-cyan-500'
  },
  {
    id: 'tech-in-asia',
    name: 'Tech in Asia',
    logo: '🌐',
    color: 'text-teal-500'
  },
  {
    id: 'e27',
    name: 'e27',
    logo: '⚡',
    color: 'text-orange-500'
  }
])
</script>