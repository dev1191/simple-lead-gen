<script setup lang="ts">
import { BlogCategories } from '~/shared/constants';

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useHead({
  title: "Insights (Blog Management)",
});
</script>

<template>
  <div>
    <div class="flex flex-col space-y-6">
      <div class="flex justify-between gap-2">
        <HeadingSmall
          title="Insights (Blog Management)"
          description="Manage insights (Blog Management)"
        />
        <AdminInsightsHeaderAction label="Article" />
      </div>

      <AdminInsightsCard />

      <AdminInsightsDataTable />
    </div>
  </div>
</template>

<style scoped></style>
