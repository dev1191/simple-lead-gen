<script setup lang="ts">
import { Checkbox } from "@/components/ui/checkbox";
import FilterSection from "./FilterSection.vue";

const types = [
  "One-time",
  "Retainer / Monthly",
  "Project-based",
  "Custom / Varies",
];
</script>

<template>
  <FilterSection>
    <h3 class="tracking-tight text-sm font-medium flex items-center gap-2">
      Service Type
    </h3>
    <div v-for="t in types" :key="t" class="flex items-center text-sm  space-x-2">
      <Checkbox :id="t" class="h-4 w-4" />
      <label :for="t">{{ t }}</label>
    </div>
  </FilterSection>
</template>
