<script setup lang="ts">
import HeroSection from "~/components/frontend/insights/HeroSection.vue";
import Posts from "~/components/frontend/insights/Posts.vue";

const { getPage } = usePages();

// Prefetch page data (SSR + client)
const { data: page, pending, error } = await useAsyncData('insights-page', () =>
  getPage("insights")
);

// Default SEO while loading
useSeo("Insights", "Welcome to Yotta, your partner in technology solutions.", "/images/home-og.png", ["Yotta", "Insights", "Tech company", "Solutions"]);

// Update SEO dynamically when page data is available
watch(page, (value) => {
  if (value) {
    useSeo(
      value.title,
      value.content,
      value.image || "/images/home-og.png", // optional field
      ["Yotta", "Insights"] // optionally update keywords
    )
  }
})
</script>

<template>
  <div>
    <!-- Loading state -->
    <div v-if="pending" class="text-center py-16 text-gray-500">Loading...</div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-16 text-red-500">Failed to load page</div>

    <!-- Page content -->
    <HeroSection v-else :page="page" />
    <Posts />
  </div>
</template>
