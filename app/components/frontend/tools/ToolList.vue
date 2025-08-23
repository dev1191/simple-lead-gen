<script setup lang="ts">
import type { Tool } from "~/shared/types/tools";
import ToolCard from "./ToolCard.vue";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-vue-next";

defineProps<{
  tools: Array<Tool>;
  loading: boolean;
  viewMode: "grid" | "list"; // type safety
}>();
</script>

<template>
  <div>
    <!-- Loading state -->
    <div
      v-if="loading"
      :class="viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
        : 'flex flex-col gap-4'"
    >
      <div v-for="i in 12" :key="i" class="space-y-4">
        <Card
          class="flex flex-col rounded-lg shadow-md group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/20"
        >
          <CardHeader class="flex flex-row items-start gap-3 pr-4 pl-4">
            <div class="flex items-center gap-3">
              <Skeleton class="w-12 h-12 rounded-lg" />
              <div class="flex-1 min-w-0">
                <Skeleton class="w-1/4 h-2" />
                <Skeleton class="w-1/4 h-2" />
              </div>
            </div>
          </CardHeader>
          <CardContent class="pr-4 pl-4">
            <Skeleton class="w-full h-40" />
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Empty state -->
    <Alert v-else-if="!tools?.length" variant="destructive">
      <AlertCircle class="w-4 h-4" />
      <AlertDescription class="flex flex-col text-center">
        No tools found. Try adjusting your filters.
      </AlertDescription>
    </Alert>

    <!-- Tools grid or list -->
    <div
      v-else
      :class="viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
        : 'flex flex-col gap-4'"
    >
      <ToolCard
        v-for="(tool, i) in tools"
        :key="i"
        v-bind="tool"
        :view-mode="viewMode"
      />
    </div>
  </div>
</template>
