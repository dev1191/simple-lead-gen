<script setup lang="ts">
import CategoryFilter from "./filters/CategoryFilter.vue";
import ToolTypeFilter from "./filters/ToolTypeFilter.vue";
import ConsultationFilter from "./filters/ConsultationFilter.vue";
import RegionFilter from "./filters/RegionFilter.vue";
import SearchBar from "./topbar/SearchBar.vue";

import { defineProps, defineEmits } from "vue";

defineProps({
  searchQuery: String,
  selectedCategory: String,
  selectedToolType: String,
  selectedConsultation: String,
  selectedRegion: String,
});

const emit = defineEmits([
  "update:searchQuery",
  "update:selectedCategory",
  "update:selectedToolType",
  "update:selectedConsultation",
  "update:selectedRegion",
  "reset",
]);
</script>

<template>
  <aside class="w-80 space-y-6">
      <!-- <button class="btn btn-outline w-full" @click="$emit('reset')">
      Reset Filters
    </button> -->
    <SearchBar
      :model-value="searchQuery"
      @update:model-value="$emit('update:searchQuery', $event)"
    />
    <CategoryFilter
      :model-value="selectedCategory"
      @update:model-value="$emit('update:selectedCategory', $event)"
    />
    <ToolTypeFilter
      :model-value="selectedToolType"
      @update:model-value="$emit('update:selectedToolType', $event)"
    />
    <ConsultationFilter
      :model-value="selectedConsultation"
      @update:model-value="$emit('update:selectedConsultation', $event)"
    />
    <RegionFilter
      :model-value="selectedRegion"
      @update:model-value="$emit('update:selectedRegion', $event)"
    />

  
  </aside>
</template>
