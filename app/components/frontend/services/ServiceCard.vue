<script setup lang="ts">
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Star } from "lucide-vue-next"

defineProps<{
  service_name: string;
  service_tagline:string;
  slug: string;
  service_description: string;
  rating: number;
  pricing: number;
  type_of_service?: string;
  category: string;
  sub_categories: string[];
  audience?: string;
  logo_url: string;
  banner_url?: string;
  currency_code?: string;
  best_for?: Array<string>;
  free_trial?: boolean;
  pricing_model?: string;
  free_consultation?: boolean;
}>()
</script>

<template>
  <Card class="flex flex-col rounded-2xl shadow-md overflow-hidden">
    <!-- Image -->
    <div class="relative">
      <img :src="banner_url" alt="service" class="w-full h-40 object-cover" />
      <Badge v-if="free_consultation" class="absolute top-2 left-2 bg-white text-black">Free Consultation</Badge>
    </div>

    <CardHeader>
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold truncate">{{ service_name }}</h3>
        <div class="flex items-center text-yellow-500 text-sm">
          <Star class="w-4 h-4 fill-current" />
          <span>{{ rating }}</span>
        </div>
      </div>
      <p class="text-gray-500 text-sm line-clamp-2">{{ service_tagline }}</p>
    </CardHeader>

    <CardContent>
      <div class="flex flex-wrap gap-2">
        <Badge v-for="tag in category" :key="tag" variant="secondary">{{ tag }}</Badge>
      </div>
    </CardContent>

    <CardFooter class="flex justify-between items-center">
      <span class="font-semibold">From {{ pricing }}</span>
      <Button>More Details</Button>
    </CardFooter>
  </Card>
</template>
