<script setup lang="ts">
import { BlogCategories } from "~/shared/constants";
</script>

<template>
  <div class="grid grid-cols-4 gap-2">
     <BaseCard  size="sm" height="h-30">
      <template #default>
     <h2 class="text-3xl font-bold">4</h2>
            <div class="text-md text-card-foreground">Total Articles</div>
      </template>
    </BaseCard>
  <BaseCard  size="sm"  height="h-30">
      <template #default>
     <h2 class="text-3xl font-bold">4</h2>
            <div class="text-md text-card-foreground">Published</div>
      </template>
    </BaseCard>
      <BaseCard  size="sm"  height="h-30">
      <template #default>
     <h2 class="text-3xl font-bold">1</h2>
            <div class="text-md text-card-foreground">Drafts</div>
      </template>
    </BaseCard>
    <BaseCard size="sm"  height="h-30">
      <template #default>
            <h2 class="text-3xl font-bold">{{ BlogCategories.length }}</h2>
            <div class="text-md text-card-foreground">Total Categories</div>
      </template>
    </BaseCard>
  </div>
</template>

<style scoped></style>
