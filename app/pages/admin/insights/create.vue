<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useHead({
  title: "Create Insights (Blog Management)",
});
</script>

<template>
  <div>
    <div class="flex fl ex-col space-y-6">
    
        <HeadingSmall
          title="CreateInsights (Blog Management)"
          description="Create insights (Blog Management)"
        />
    
      <AdminInsightsCreate />
    </div>
  </div>
</template>

<style scoped></style>
