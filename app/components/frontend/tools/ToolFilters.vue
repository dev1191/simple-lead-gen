<script setup lang="ts">
import CategoryFilter from "./filters/CategoryFilter.vue";
import ToolTypeFilter from "./filters/ToolTypeFilter.vue";
import ConsultationFilter from "./filters/ConsultationFilter.vue";
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

    <div v-if="hasActiveFilters" class="flex items-center gap-2 flex-wrap">
      <div class="text-sm text-muted-foreground">1 filter applied</div>
      <Button
        variant="outline"
        class="w-28 h-6 text-sm"
        @click="$emit('reset')"
      >
        <Icon name="X" /> Clear all
      </Button>
    </div>
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
