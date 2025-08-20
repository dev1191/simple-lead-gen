<script setup lang="ts">
import { ref } from "vue";
import FeatureCard from "./FeatureCard.vue";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconBg: string;
}

const features = ref<Feature[]>([
  {
    id: "curated-selection",
    title: "Curated Selection",
    description:
      "Handpicked entrepreneurs built to help ambitious founders and lean teams cut through the noise.",
    icon: "🎯",
    iconBg: "bg-orange-100",
  },
  {
    id: "no-fluff-overwhelm",
    title: "No Fluff, No Overwhelm",
    description:
      "Just what works. From legal to marketing, CRMs to coworking spaces.",
    icon: "✨",
    iconBg: "bg-yellow-100",
  },
  {
    id: "next-best-thing",
    title: "Next Best Thing",
    description:
      "We bring the industry straight to your fingertips, tailored for early-stage and growing businesses.",
    icon: "🚀",
    iconBg: "bg-orange-100",
  },
]);
</script>

<template>
  <div class="bg-gray-50 py-16">
    <div class="max-w-6xl mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="animate-fade-in-up">
          <h2 class="text-4xl font-bold text-gray-900 mb-6">What We Do</h2>
        </div>

        <div class="animate-fade-in-up animation-delay-200">
          <p class="text-gray-600 text-lg mb-8 max-w-3xl mx-auto">
            Building a business is hard. Finding the right tools and services
            shouldn't be.
          </p>
        </div>
        <div class="animate-fade-in-up animation-delay-400">
          <p class="text-gray-600 leading-relaxed max-w-4xl mx-auto mb-6">
            VentureNext is a handpicked marketplace built to help ambitious
            founders and lean teams cut through the noise. Whether you're
            starting your first side hustle or running your fifth venture, we
            help you discover the best platforms, providers, and solutions
            tailored for early-stage and growing businesses.
          </p>
        </div>
        <div class="animate-fade-in-up animation-delay-600">
          <p class="text-gray-600 leading-relaxed max-w-4xl mx-auto">
            No fluff, no overwhelm—just what works. From legal to marketing,
            CRMs to coworking spaces, we bring the next best thing straight to
            your fingertips.
          </p>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          v-for="feature in features"
          :key="feature.id"
          :feature="feature"
        />
      </div>
    </div>
  </div>
</template>
