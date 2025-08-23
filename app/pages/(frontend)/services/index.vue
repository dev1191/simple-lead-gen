<script setup lang="ts">
import ServiceFilters from "~/components/frontend/services/ServiceFilters.vue";
import ServiceList from "~/components/frontend/services/ServiceList.vue";
import SortDropdown from "~/components/frontend/services/topbar/SortDropdown.vue";
import ToggleView from "~/components/frontend/services/topbar/ToggleView.vue";

definePageMeta({
  layout: "blank",
});

// Reactive filter/query states directly bound to URL
const searchQuery = ref("");
const selectedCategory = ref([]);
const selectedSort = ref("newest");
const serviceType = ref([]);
const turnaroundTime = ref([]);
const region = ref([]);
const consultationType = ref([]);
const currentPage = ref(1);

// Other states
const viewMode = ref("grid");

// Fetch services (SSR-friendly)
const {
  data: servicesData,
  pending,
  refresh,
} = await useFetch("/api/services", {
  query: {
    search: searchQuery,
    category: selectedCategory,
    sortBy: selectedSort,
    serviceType: serviceType,
    turnaroundTime: turnaroundTime,
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
const services = computed(() => servicesData.value?.services || []);
const filters = computed(() => servicesData.value?.filters || {});
const pagination = computed(() => servicesData.value?.pagination || {});

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
  selectedCategory.value = [];
  selectedSort.value = "newest";
  consultationType.value = [];
  turnaroundTime.value = [];
  serviceType.value = [];
  region.value = [];
  currentPage.value = 1;
};

const hasActiveFilters = computed(() => {
  return (
    selectedCategory.value.length > 0 ||
    serviceType.value.length > 0 ||
    turnaroundTime.value.length > 0 ||
    region.value.length > 0 ||
    consultationType.value.length > 0
  );
});

// Pagination
const setPage = (page: number) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

useSeo(
  "Services",
  "Explore the services offered by Yotta.",
  "/images/services-og.png",
  ["Yotta", "Services", "Tech company", "Support"]
);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b">
      <div class="container mx-auto px-16 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold">Service Marketplace</h1>
            <p class="text-muted-foreground mt-1">
              Discover {{ pagination?.totalItems || 0 }} professional services
              for your business
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
        <ServiceFilters
          :searchQuery="searchQuery"
          :selectedCategory="selectedCategory"
          :selectedServiceType="serviceType"
          :selectedTurnaroundTime="turnaroundTime"
          :selectedConsultation="consultationType"
          :selectedRegion="region"
          :hasActiveFilters="hasActiveFilters"
          @update:searchQuery="searchQuery = $event"
          @update:selectedCategory="selectedCategory = $event"
          @update:selectedServiceType="serviceType = $event"
          @update:selectedTurnaroundTime="turnaroundTime = $event"
          @update:selectedConsultation="consultationType = $event"
          @update:selectedRegion="region = $event"
          @reset="resetFilters"
        />
        <!-- Main Content -->
        <div class="flex-1 space-y-6">
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-500">6 services found</div>
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
          <ServiceList   :services="services" :loading="pending" :viewMode="viewMode" />

           <!-- Shadcn-vue Pagination -->
          <div
            v-if="pagination?.totalPages > 1"
            class="flex justify-center mt-8"
          >
            <Pagination
              v-slot="{ page }"
              :items-per-page="pagination.perPage"
              :total="pagination.totalItems"
              :default-page="pagination.currentPage"
              @update:page="setPage"
            >
              <PaginationContent v-slot="{ items }">
                <!-- Prev -->
                <PaginationPrevious :disabled="page === 1" />

                <!-- Page Numbers -->
                <template v-for="(item, index) in items" :key="index">
                  <PaginationItem
                    v-if="item.type === 'page'"
                    :value="item.value"
                    :is-active="item.value === page"
                  >
                    {{ item.value }}
                  </PaginationItem>

                  <!-- Ellipsis -->
                  <PaginationEllipsis
                    v-else-if="item.type === 'ellipsis'"
                    :index="index"
                  />
                </template>

                <!-- Next -->
                <PaginationNext :disabled="page === pagination.totalPages" />
              </PaginationContent>
            </Pagination>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>
