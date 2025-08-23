<script setup lang="ts">
import CategoryFilter from "./filters/CategoryFilter.vue";
import ServiceTypeFilter from "./filters/ServiceTypeFilter.vue";
import ConsultationFilter from "./filters/ConsultationFilter.vue";
import TurnaroundFilter from "./filters/TurnaroundFilter.vue";
import RegionFilter from "./filters/RegionFilter.vue";
import SearchBar from "./topbar/SearchBar.vue";

defineProps({
  searchQuery: String, // string
  selectedCategory: {
    type: Array as () => string[], // Changed to Array for multi-select
    default: () => [],
  },
  selectedToolType: {
    type: Array as () => string[], // Changed to Array for multi-select
    default: () => [],
  },
  selectedConsultation: {
    type: Array as () => string[], // Changed to Array for multi-select
    default: () => [],
  },
  selectedTurnaroundTime: {
    type: Array as () => string[], // Changed to Array for multi-select
    default: () => [],
  },
  selectedRegion: {
    type: Array as () => string[], // Changed to Array for multi-select
    default: () => [],
  },
  hasActiveFilters: Boolean, // boolean
});

const emit = defineEmits([
  "update:searchQuery",
  "update:selectedCategory",
  "update:selectedToolType",
  "update:selectedConsultation",
  "update:selectedTurnaroundTime",
  "update:selectedRegion",
  "reset",
]);
</script>

<template>
  <aside class="w-80 space-y-6">
    <SearchBar
      :model-value="searchQuery"
      @update:model-value="$emit('update:searchQuery', $event)"
    />
    <CategoryFilter
      :model-value="selectedCategory"
      @update:model-value="$emit('update:selectedCategory', $event)"
    />
    <ServiceTypeFilter
      :model-value="selectedToolType"
      @update:model-value="$emit('update:selectedToolType', $event)"
    />
    <ConsultationFilter
      :model-value="selectedConsultation"
      @update:model-value="$emit('update:selectedConsultation', $event)"
    />
    <TurnaroundFilter
      :model-value="selectedTurnaroundTime"
      @update:model-value="$emit('update:selectedTurnaroundTime', $event)"
    />
    <RegionFilter
      :model-value="selectedRegion"
      @update:model-value="$emit('update:selectedRegion', $event)"
    />
  </aside>
</template>
