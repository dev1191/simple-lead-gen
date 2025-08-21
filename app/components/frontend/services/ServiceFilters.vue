<script setup lang="ts">
import CategoryFilter from "./filters/CategoryFilter.vue";
import ServiceTypeFilter from "./filters/ServiceTypeFilter.vue";
import ConsultationFilter from "./filters/ConsultationFilter.vue";
import TurnaroundFilter from "./filters/TurnaroundFilter.vue";
import RegionFilter from "./filters/RegionFilter.vue";
import SearchBar from "./topbar/SearchBar.vue";
</script>

<template>
  <aside class="w-80 space-y-6">
    <SearchBar />
    <CategoryFilter />
    <ServiceTypeFilter />
    <ConsultationFilter />
    <TurnaroundFilter />
    <RegionFilter />
  </aside>
</template>
