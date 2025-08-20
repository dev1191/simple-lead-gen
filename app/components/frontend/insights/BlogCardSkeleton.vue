<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
</script>

<template>
  <Card
    class="overflow-hidden hover:shadow-lg py-0 transition-shadow duration-300 cursor-pointer"
  >
    <!-- Image Skeleton -->
    <div class="relative">
      <Skeleton class="w-full h-48 rounded-md" />
      <Skeleton class="absolute top-3 left-3 h-5 w-16 rounded-md" />
    </div>

    <CardContent class="p-6">
      <!-- Date + Meta -->
      <div class="flex items-center gap-4 text-sm text-gray-500 mb-3">
        <Skeleton class="h-4 w-20 rounded" />
        <Skeleton class="h-4 w-12 rounded" />
      </div>

      <!-- Title -->
      <Skeleton class="h-6 w-3/4 mb-3 rounded" />

      <!-- Content preview -->
      <div class="space-y-2 mb-4">
        <Skeleton class="h-4 w-full rounded" />
        <Skeleton class="h-4 w-5/6 rounded" />
        <Skeleton class="h-4 w-4/6 rounded" />
      </div>

      <!-- Button -->
      <Skeleton class="h-5 w-20 rounded" />
    </CardContent>
  </Card>
</template>
