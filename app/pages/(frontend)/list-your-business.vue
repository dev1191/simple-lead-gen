<script setup lang="ts">
import BusinessForm from "~/components/frontend/list-your-business/BusinessForm.vue";
import HeroSection from "~/components/frontend/list-your-business/HeroSection.vue";
import PartnerSection from "~/components/frontend/list-your-business/PartnerSection.vue";

const { getPage } = usePages();

// Prefetch page data (SSR + client)
const {
  data: page,
  pending,
  error,
} = await useAsyncData("listyourbusiness-page", () =>
  getPage("listyourbusiness")
);

useSeo(
  "List your Business",
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
      "/images/home-og.png", // optional field
      value.seo_keyword ? value.seo_keyword.split(",") : ["Yotta", "Insights"] // optionally update keywords
    );
  }
});
</script>

<template>
  <div>
    <HeroSection :page="page"  />
    <PartnerSection />
    <BusinessForm />
  </div>
</template>

<style scoped></style>
