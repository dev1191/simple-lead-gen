<script setup lang="ts">
import { BlogCategories } from "~/shared/constants";

const { posts, draftCount, publishedCount, fetchCounts, fetchPosts } =
  useBlogPosts();

onMounted(() => {
  fetchCounts();
  fetchPosts();
});
</script>

<template>
  <div class="grid grid-cols-4 gap-2">
    <BaseCard height="h-30" >
      <template #default>
        <h2 class="text-3xl font-bold">{{ posts.length }}</h2>
        <div class="text-md text-card-foreground">Total Articles</div>
      </template>
    </BaseCard>
    <BaseCard  height="h-30" >
      <template #default>
        <h2 class="text-3xl font-bold">{{ publishedCount }}</h2>
        <div class="text-md text-card-foreground">Published</div>
      </template>
    </BaseCard>
    <BaseCard  height="h-30" >
      <template #default>
        <h2 class="text-3xl font-bold">{{ draftCount }}</h2>
        <div class="text-md text-card-foreground">Drafts</div>
      </template>
    </BaseCard>
    <BaseCard  height="h-30" >
      <template #default>
        <h2 class="text-3xl font-bold">{{ BlogCategories.length }}</h2>
        <div class="text-md text-card-foreground">Total Categories</div>
      </template>
    </BaseCard>
  </div>
</template>

<style scoped></style>
