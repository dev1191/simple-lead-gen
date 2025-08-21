<script setup lang="ts">
import ServiceCard from "./ServiceCard.vue"

const services = [
  {
    title: "Elite Incorporation",
    description: "Fast company registration...",
    rating: 4.9,
    price: "USD 299",
    tags: ["Startups", "Solopreneurs"],
    image: "/images/service1.png",
    consultation: true,
  },
   {
    title: "Elite Incorporation",
    description: "Fast company registration...",
    rating: 2.9,
    price: "USD 399",
    tags: ["Startups", "Solopreneurs"],
    image: "/images/service1.png",
    consultation: true,
  },
  // ...more mock data
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <ServiceCard v-for="(s, i) in services" :key="i" v-bind="s" />
  </div>
</template>
