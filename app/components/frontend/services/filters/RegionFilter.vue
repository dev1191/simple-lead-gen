<script setup lang="ts">
import { Checkbox } from "@/components/ui/checkbox";
import FilterSection from "./FilterSection.vue";

const regions = ["Global", "Malaysia", "Singapore"];
</script>

<template>
  <FilterSection>
    <h3 class="tracking-tight text-sm font-medium flex items-center gap-2">
      Region Served
    </h3>
    <div v-for="r in regions" :key="r" class="flex items-center text-sm  space-x-2">
      <Checkbox :id="r" class="h-4 w-4" />
      <label :for="r">{{ r }}</label>
    </div>
  </FilterSection>
</template>
