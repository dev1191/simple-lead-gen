<template>
  <div class="bg-gray-50 py-16">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          Top Tools This Week
        </h2>
        <p class="text-gray-600 text-lg">
          Most popular business solutions chosen by entrepreneurs
        </p>
      </div>

      <!-- Tools Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ToolCard
          v-for="tool in topTools"
          :key="tool.id"
          :tool="tool"
          @click="handleToolClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ToolCard from './ToolCard.vue'

interface Tool {
  id: string
  name: string
  description: string
  rating: number
  category: string
  subcategory: string
  timeframe: string
  location: string
  targetAudience: string[]
  additionalInfo: string[]
  pricing: {
    from: string
    type: string
  }
  thumbnail: string
  consultationBadge: boolean
}

const topTools = ref<Tool[]>([
  {
    id: 'smartbooks',
    name: 'SmartBooks...',
    description: 'Professional accounting and bookkeeping services for...',
    rating: 4.6,
    category: 'Manage Your Money',
    subcategory: 'Accounting Firms',
    timeframe: 'Within 48 hours',
    location: 'Malaysia',
    targetAudience: ['SMEs', 'Early-stage Startups'],
    additionalInfo: [],
    pricing: {
      from: 'USD $199',
      type: 'Retainer / Monthly'
    },
    thumbnail: '📊',
    consultationBadge: true
  },
  {
    id: 'talentbridge',
    name: 'TalentBridge HR...',
    description: 'End-to-end HR outsourcing and recruitment services for...',
    rating: 4.5,
    category: 'Hire & Build Your Team',
    subcategory: 'Recruitment Agencies',
    timeframe: '1-2 Weeks',
    location: 'Singapore, Malaysia',
    targetAudience: ['Remote Teams', 'SMEs'],
    additionalInfo: [],
    pricing: {
      from: 'USD $599',
      type: 'Custom / Varies'
    },
    thumbnail: '👥',
    consultationBadge: true
  },
  {
    id: 'logisticspro',
    name: 'LogisticsPro...',
    description: 'Complete e-commerce fulfillment and shipping...',
    rating: 4.4,
    category: 'Ship Your Products',
    subcategory: 'Fulfillment & Warehousing Companies',
    timeframe: '3-5 Business Days',
    location: 'Global',
    targetAudience: ['SMEs', 'VC-backed Startups'],
    additionalInfo: [],
    pricing: {
      from: 'USD $299',
      type: 'Retainer / Monthly'
    },
    thumbnail: '📦',
    consultationBadge: true
  }
])

const handleToolClick = (tool: Tool) => {
  console.log('Tool clicked:', tool.name)
  // Handle navigation to tool details
}
</script>