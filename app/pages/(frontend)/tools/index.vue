<script setup lang="ts">
import ToolFilters from "~/components/frontend/tools/ToolFilters.vue";
import ToolList from "~/components/frontend/tools/ToolList.vue";
import SortDropdown from "~/components/frontend/tools/topbar/SortDropdown.vue";
import ToggleView from "~/components/frontend/tools/topbar/ToggleView.vue";

definePageMeta({
  layout: "blank",
});

// Router & Queries
const route = useRoute();

// Reactive filter/query states directly bound to URL
const searchQuery = ref("");
const selectedCategory = ref("");
const selectedSort = ref("newest");
const toolType = ref("");
const region = ref("");
const consultationType = ref("");
const currentPage = ref(1);

// Other states
const viewMode = ref("grid");

// Fetch tools (SSR-friendly)
const {
  data: toolsData,
  pending,
  refresh,
} = await useFetch("/api/tools", {
  query: {
    search: searchQuery,
    category: selectedCategory,
    sortBy: selectedSort,
    toolType: toolType,
    region: region,
    consultationType,
    page: currentPage,
    limit: 24,
  },
  watch: [
    searchQuery,
    selectedCategory,
    selectedSort,
    consultationType,
    currentPage,
  ],
});

// Computed results
const tools = computed(() => toolsData.value?.tools || []);
const filters = computed(() => toolsData.value?.filters || {});
const pagination = computed(() => toolsData.value?.pagination || {});

// Visible pages
const visiblePages = computed(() => {
  const total = pagination.value.totalItems || 1;
  const current = pagination.value.currentPage || 1;
  const pages = [];
  for (
    let i = Math.max(1, current - 2);
    i <= Math.min(total, current + 2);
    i++
  ) {
    pages.push(i);
  }
  return pages;
});

// Reset filters
const resetFilters = () => {
  searchQuery.value = "";
  selectedCategory.value = "";
  selectedSort.value = "newest";
  consultationType.value = "";
  currentPage.value = 1;
};

// Pagination
const setPage = (page: number) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// SEO
useSeo("Tools", "Explore the tools offered by Yotta.", "/images/tools-og.png", [
  "Yotta",
  "Tools",
  "Tech company",
  "Support",
]);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b">
      <div class="container mx-auto px-16 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-foreground">Tool Showcase</h1>
            <p class="text-muted-foreground mt-1">
              Discover {{ pagination?.totalItems || 0 }} amazing tools for your
              business
            </p>
          </div>
          <RouterLink to="/">
            <Button variant="outline">Back to Home</Button>
          </RouterLink>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-16 py-6">
      <div class="flex flex-row gap-4">
        <!-- Sidebar -->
        <ToolFilters
 
          :searchQuery="searchQuery"
          :selectedCategory="selectedCategory"
          :selectedToolType="toolType"
          :selectedConsultation="consultationType"
          :selectedRegion="region"
          @update:searchQuery="searchQuery = $event"
          @update:selectedCategory="selectedCategory = $event"
          @update:selectedToolType="toolType = $event"
          @update:selectedConsultation="consultationType = $event"
          @update:selectedRegion="region = $event"
          @reset="resetFilters"
        />

        <!-- Main Content -->
        <div class="flex-1 space-y-6">
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-500">
              {{ pagination?.totalItems || 0 }} tools found
            </div>
            <div class="flex gap-4 items-center">
              <SortDropdown
                :modelValue="selectedSort"
                @update:modelValue="selectedSort = $event"
              />
              <ToggleView
                :modelValue="viewMode"
                @update:modelValue="viewMode = $event"
              />
            </div>
          </div>

          <ToolList :tools="tools" :loading="pending"          :viewMode="viewMode" />
        </div>
      </div>
    </div>
  </div>
</template>
