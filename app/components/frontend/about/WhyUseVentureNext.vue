<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import BenefitCard from "./BenefitCard.vue";

interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const benefits = ref<Benefit[]>([
  {
    id: "built-for-doers",
    title: "Built for doers",
    description:
      "We don't just list services. We curate what works. Rigorously tested by our insight-driven teams.",
    icon: "💪",
  },
  {
    id: "founder-first",
    title: "Founder-first",
    description:
      "We understand small teams and solo operators because we are one.",
    icon: "👑",
  },
  {
    id: "curated-not-cluttered",
    title: "Curated, not cluttered",
    description: "Get expert-leveling more decision-making, not more choices.",
    icon: "✨",
  },
  {
    id: "real-world-use-cases",
    title: "Real-world use cases",
    description:
      "Tools and providers recommended by real founders, not just marketing copy.",
    icon: "🌍",
  },
  {
    id: "save-time-money",
    title: "Save time and money",
    description: "Skip the trial and error phase. We've already done it.",
    icon: "💰",
  },
  {
    id: "better-than-google",
    title: "Better than Google",
    description:
      "Your business deserves better than random Google searches and 50 open tabs.",
    icon: "🔍",
  },
]);
</script>

<template>
  <div class="bg-orange-50 py-16">
    <div class="max-w-6xl mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="flex items-center justify-center gap-2 mb-4">
          <span class="text-2xl">💖</span>
          <h2 class="text-4xl font-bold text-gray-900">Why Use VentureNext?</h2>
        </div>
        <p class="text-gray-600 text-lg">
          Your business deserves better than random Google searches and 50 open
          tabs.
        </p>
      </div>

      <!-- Benefits Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <BenefitCard
          v-for="benefit in benefits"
          :key="benefit.id"
          :benefit="benefit"
        />
      </div>

      <!-- CTA Button -->
      <div class="text-center">
        <Button
          class="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-base font-medium rounded-lg"
        >
          Start Building Smarter
        </Button>
      </div>
    </div>
  </div>
</template>
