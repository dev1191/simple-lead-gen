

<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'

interface Category {
  id: string
  title: string
  description: string
  icon: string
  iconColor: string
  count: string
  countColor: string
}

defineProps<{
  category: Category
}>()

defineEmits<{
  click: [category: Category]
}>()
</script>


<template>
  <Card 
    class="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-white border border-gray-200"
    @click="$emit('click', category)"
  >
    <CardContent class="p-6">
      <!-- Icon -->
      <div class="mb-4">
        <div class="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
          <span class="text-2xl" :class="category.iconColor">
            {{ category.icon }}
          </span>
        </div>
      </div>

      <!-- Title -->
      <h3 class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
        {{ category.title }}
      </h3>

      <!-- Description -->
      <p class="text-gray-600 text-sm mb-4 leading-relaxed">
        {{ category.description }}
      </p>

      <!-- Count -->
      <div class="flex items-center">
        <span 
          class="text-sm font-medium px-2 py-1 rounded-md bg-gray-50 group-hover:bg-gray-100 transition-colors"
          :class="category.countColor"
        >
          {{ category.count }}
        </span>
      </div>
    </CardContent>
  </Card>
</template>