<script setup lang="ts">
import { Checkbox } from "@/components/ui/checkbox";
import FilterSection from "./FilterSection.vue";

const options = [
  "Within 48 hours",
  "3–5 Business Days",
  "1–2 Weeks",
  "1 Month",
  "Custom / Varies",
];
</script>

<template>
  <FilterSection>
    <h3 class="tracking-tight text-sm font-medium flex items-center gap-2">
      Turnaround Time
    </h3>
    <div v-for="o in options" :key="o" class="flex items-center text-sm space-x-2">
      <Checkbox :id="o" class="h-4 w-4" />
      <label :for="o">{{ o }}</label>
    </div>
  </FilterSection>
</template>
