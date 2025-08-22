<script setup lang="ts">
import ToolCard from "./ToolCard.vue";
import { Skeleton } from "@/components/ui/skeleton"; // shadcn-vue skeleton if you’re using it

defineProps<{
  tools: Array<any>;
  loading: boolean;
}>();
</script>

<template>
  <div>
    <!-- Loading state -->
    <div
      v-if="loading"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div v-for="i in 6" :key="i" class="space-y-4">
        <div class="flex items-center gap-3">
          <Skeleton class="w-12 h-12 rounded-lg" />
          <div class="flex-1 min-w-0">
            <Skeleton class="w-1/4 h-2" />
            <Skeleton class="w-1/4 h-2" />
          </div>
          <Skeleton class="w-1/4 h-2" />
          <Skeleton class="w-1/1 h-2" />
        </div>

        <Skeleton class="w-3/4 h-6" />
        <Skeleton class="w-1/2 h-4" />
      </div>
    </div>

    <!-- Empty state -->
    <Alert v-else-if="!tools?.length" variant="destructive">
      <AlertCircle class="w-4 h-4" />
      <AlertDescription class="flex flex-col text-center">
        No tools found. Try adjusting your filters.
      </AlertDescription>
    </Alert>

    <!-- Tools grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <ToolCard v-for="(tool, i) in tools" :key="i" v-bind="tool" />
    </div>
  </div>
</template>
