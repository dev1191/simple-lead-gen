<script setup lang="ts">
import FeaturedPress from "~/components/frontend/landing/FeaturedPress/Index.vue";
import ServiceCategories from "~/components/frontend/landing/ServiceCategories/Index.vue";
import HeroSection from "~/components/frontend/landing/HeroSection.vue";
import InsightsSection from "~/components/frontend/landing/InsightsSection.vue";
import ExploreCategories from "~/components/frontend/landing/ExploreCategories/index.vue";
import HowItWorks from "~/components/frontend/landing/HowItWorks/Index.vue";
import TopToolWeek from "~/components/frontend/landing/TopToolWeek/Index.vue";
import MoreServices from "~/components/frontend/landing/MoreServices/Index.vue";

</script>

<template>
  <div>
    <HeroSection />

    <ServiceCategories />
    <FeaturedPress />

    <HowItWorks />
    <TopToolWeek />
    <MoreServices />
    <ExploreCategories />
    <InsightsSection />
  </div>
</template>

<style scoped></style>
