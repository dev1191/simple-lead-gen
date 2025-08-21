<script setup lang="ts">
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Star } from "lucide-vue-next"

defineProps<{
  title: string
  description: string
  rating: number
  price: string
  tags: string[]
  image: string
  consultation?: boolean
}>()
</script>

<template>
  <Card class="flex flex-col rounded-2xl shadow-md overflow-hidden">
    <!-- Image -->
    <div class="relative">
      <img :src="image" alt="service" class="w-full h-40 object-cover" />
      <Badge v-if="consultation" class="absolute top-2 left-2 bg-white text-black">Free Consultation</Badge>
    </div>

    <CardHeader>
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold truncate">{{ title }}</h3>
        <div class="flex items-center text-yellow-500 text-sm">
          <Star class="w-4 h-4 fill-current" />
          <span>{{ rating }}</span>
        </div>
      </div>
      <p class="text-gray-500 text-sm line-clamp-2">{{ description }}</p>
    </CardHeader>

    <CardContent>
      <div class="flex flex-wrap gap-2">
        <Badge v-for="tag in tags" :key="tag" variant="secondary">{{ tag }}</Badge>
      </div>
    </CardContent>

    <CardFooter class="flex justify-between items-center">
      <span class="font-semibold">From {{ price }}</span>
      <Button>More Details</Button>
    </CardFooter>
  </Card>
</template>
