<script setup lang="ts">
import { Checkbox } from "@/components/ui/checkbox";
import FilterSection from "./FilterSection.vue";
import Icon from "~/components/Icon.vue";

const categories = [
  "Start Your Business",
  "Run & Operate Smoothly",
  "Manage Your Money",
  "Hire & Build Your Team",
  "Get Customers & Grow",
  "Build Tech & Digital Presence",
  "Ship Products",
  "Expand Internationally",
];
</script>

<template>
  <FilterSection>
    <h3 class="tracking-tight text-sm font-medium flex items-center gap-2">
     <Icon name="Funnel" /> Service Categories
    </h3>
    <div v-for="c in categories" :key="c" class="flex items-center text-sm  space-x-2">
      <Checkbox :id="c" class="h-4 w-4" />
      <label :for="c">{{ c }}</label>
    </div>
  </FilterSection>
</template>
