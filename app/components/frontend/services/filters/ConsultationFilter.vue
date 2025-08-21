<script setup lang="ts">
import { Checkbox } from "@/components/ui/checkbox";
import FilterSection from "./FilterSection.vue";

const options = ["Yes", "No"];
</script>

<template>
  <FilterSection>
    <h3 class="tracking-tight text-sm font-medium flex items-center gap-2">
      Free Consultation
    </h3>
    <div v-for="o in options" :key="o" class="flex items-center text-sm  space-x-2">
      <Checkbox :id="o" class="h-4 w-4" />
      <label :for="o">{{ o }}</label>
    </div>
  </FilterSection>
</template>
