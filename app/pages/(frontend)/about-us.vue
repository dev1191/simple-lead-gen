<script setup lang="ts">
import HeroSection from "~/components/frontend/about/HeroSection.vue";
import WhatWedo from "~/components/frontend/about/WhatWedo.vue";
import WhoWeServe from "~/components/frontend/about/WhoWeServe.vue";
import WhyUseVentureNext from "~/components/frontend/about/WhyUseVentureNext.vue";

const { getPage } = usePages();

// Prefetch page data (SSR + client)
const {
  data: page,
  pending,
  error,
} = await useAsyncData("aboutus-page", () => getPage("aboutus"));

useSeo(
  "About Us",
  "Learn more about Yotta and our mission.",
  "/images/about-og.png",
  ["Yotta", "About Yotta", "Tech company", "Services"]
);

// Update SEO dynamically when page data is available
watch(page, (value) => {
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
    <!-- Loading state -->
    <div v-if="pending" class="text-center py-16 text-gray-500">Loading...</div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-16 text-red-500">
      Failed to load page
    </div>

    <HeroSection  v-if="page" :page="page"/>
    <WhatWedo />
    <WhoWeServe />
    <WhyUseVentureNext />
  </div>
</template>

<style scoped></style>
