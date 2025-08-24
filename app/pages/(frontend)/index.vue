<script setup lang="ts">
import FeaturedPress from "~/components/frontend/landing/FeaturedPress/Index.vue";
import ServiceCategories from "~/components/frontend/landing/ServiceCategories/Index.vue";
import HeroSection from "~/components/frontend/landing/HeroSection.vue";
import InsightsSection from "~/components/frontend/landing/InsightsSection.vue";
import ExploreCategories from "~/components/frontend/landing/ExploreCategories/index.vue";
import HowItWorks from "~/components/frontend/landing/HowItWorks/Index.vue";
import TopToolWeek from "~/components/frontend/landing/TopToolWeek/Index.vue";
import MoreServices from "~/components/frontend/landing/MoreServices/Index.vue";

const { data: pageData } = await useFetch("/api/pages/homepage");


useSeo(
  pageData? pageData.title : "Home",
  pageData? pageData.meta_data?.sub_title : "Welcome to Yotta, your partner in technology solutions.",
  pageData? pageData.image_url : "/images/home-og.png",
  pageData? pageData.seo_keyword : ["Yotta", "Home", "Tech company", "Solutions"]
);
</script>

<template>
  <div>

    <HeroSection :title="pageData.title"  :sub-title="pageData.meta_data?.sub_title" />

    <ServiceCategories />
    <FeaturedPress :featured_in="pageData.meta_data?.featured_in" />

    <HowItWorks />
    <TopToolWeek />
    <MoreServices :more_services="pageData.meta_data?.more_services" />
    <ExploreCategories />
    <InsightsSection />
  </div>
</template>

<style scoped></style>
