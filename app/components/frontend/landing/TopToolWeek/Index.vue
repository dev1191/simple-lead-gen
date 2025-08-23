<script setup lang="ts">
import type { Tool } from "~/shared/types/tools";
import ToolCard from "./ToolCard.vue";

const {
  data: topTools,
  pending,
  error,
} = await useFetch<Tool[]>("/api/tools/weeks");


const handleToolClick = (tool: Tool) => {
  console.log("Tool clicked:", tool.slug);
  // Example: navigate to tool detail page
  navigateTo(`/tools/${tool.slug}`);
};
</script>

<template>
  <div class="bg-gray-50 py-6">
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
      <div v-if="pending" class="text-center text-gray-500">Loading...</div>
      <div v-else-if="error" class="text-center text-red-500">
        Failed to load tools
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ToolCard
          v-for="(tool, i) in topTools"
          :key="i"
          v-bind="tool"
          @click="handleToolClick(tool)"
        />
      </div>
    </div>
  </div>
</template>
