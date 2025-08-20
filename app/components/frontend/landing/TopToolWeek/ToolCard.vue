<template>
  <Card class="group cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1 bg-white">
    <CardContent class="p-0">
      <!-- Header Image/Thumbnail -->
      <div class="relative bg-slate-800 p-6 rounded-t-lg">
        <!-- Free Consultation Badge -->
        <div v-if="tool.consultationBadge" class="absolute top-4 right-4">
          <Badge variant="secondary" class="bg-white text-slate-800 text-xs font-medium">
            <Phone class="w-3 h-3 mr-1" />
            Free Consultation
          </Badge>
        </div>

        <!-- Mock Interface -->
        <div class="flex items-center justify-center h-24">
          <span class="text-4xl">{{ tool.thumbnail }}</span>
        </div>
      </div>

      <!-- Content -->
      <div class="p-4">
        <!-- Title & Rating -->
        <div class="flex items-start justify-between mb-3">
          <h3 class="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
            {{ tool.name }}
          </h3>
          <div class="flex items-center gap-1 ml-2">
            <Star class="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span class="text-sm font-medium text-gray-700">{{ tool.rating }}</span>
          </div>
        </div>

        <!-- Description -->
        <p class="text-gray-600 text-sm mb-4 line-clamp-2">
          {{ tool.description }}
        </p>

        <!-- Categories -->
        <div class="space-y-2 mb-4">
          <div class="flex items-center gap-2">
            <Badge variant="outline" class="text-xs font-medium bg-blue-50 text-blue-700 border-blue-200">
              {{ tool.category }}
            </Badge>
          </div>
          <div class="text-xs text-gray-600">
            {{ tool.subcategory }}
          </div>
        </div>

        <!-- Meta Information -->
        <div class="space-y-2 mb-4 text-xs text-gray-500">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-1">
              <Clock class="w-3 h-3" />
              {{ tool.timeframe }}
            </div>
            <div class="flex items-center gap-1">
              <MapPin class="w-3 h-3" />
              {{ tool.location }}
            </div>
          </div>
        </div>

        <!-- Target Audience -->
        <div class="flex flex-wrap gap-1 mb-4">
          <Badge 
            v-for="audience in tool.targetAudience" 
            :key="audience"
            variant="secondary" 
            class="text-xs bg-gray-100 text-gray-700"
          >
            {{ audience }}
          </Badge>
        </div>

        <!-- Pricing & CTA -->
        <div class="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <div class="text-sm font-semibold text-gray-900">
              From {{ tool.pricing.from }}
            </div>
            <div class="text-xs text-gray-500">
              {{ tool.pricing.type }}
            </div>
          </div>
          <Button 
            class="bg-orange-500 hover:bg-orange-600 text-white w-30 h-10 px-2"
            @click.stop="$emit('click', tool)"
          >
            More Details
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Clock, MapPin, Phone } from 'lucide-vue-next'

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

defineProps<{
  tool: Tool
}>()

defineEmits<{
  click: [tool: Tool]
}>()
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>