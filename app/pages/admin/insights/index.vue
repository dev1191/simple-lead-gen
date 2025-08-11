<script setup lang="ts">
import { columns } from "~/components/admin/insights/components/Columns";
import { BlogCategories } from "~/shared/constants";
import DataTable from "~/components/admin/insights/components/DataTable.vue";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useHead({
  title: "Insights (Blog Management)",
});

const blogPosts = useBlogPosts();

console.log("check posts : ",blogPosts.posts.value)
</script>

<template>
  <AdminLayoutPage
    title="Insights (Blog Management)"
    description="Manage insights (Blog Management)"
    sticky
  >
    <template #actions>
      <AdminInsightsHeaderAction label="Article" />
    </template>
    <template #cardHeader>
      <AdminInsightsCard />
    </template>
    <div class="overflow-x-auto">
      <DataTable :blogPosts="blogPosts" :columns="columns" />
    </div>
  </AdminLayoutPage>
</template>

<style scoped></style>
