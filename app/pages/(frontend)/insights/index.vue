<script setup lang="ts">
import HeroSection from "~/components/frontend/insights/HeroSection.vue";
import Posts from "~/components/frontend/insights/Posts.vue";

const { data: pageData } = await useFetch("/api/pages/insights");

// Default SEO while loading
useSeo(
  "Insights",
  "Welcome to Yotta, your partner in technology solutions.",
  "/images/home-og.png",
  ["Yotta", "Insights", "Tech company", "Solutions"]
);

// Update SEO dynamically when page data is available
watch(pageData, (value) => {
  if (value) {
    useSeo(
      value.title,
      value.content,
      value.image || "/images/home-og.png", // optional field
      ["Yotta", "Insights"] // optionally update keywords
    );
  }
});
</script>

<template>
  <div>
    <!-- Page content -->
    <HeroSection v-if="pageData" :page="pageData" />
    <Posts />
  </div>
</template>
