<script setup lang="ts">
import ServiceFilters from "~/components/frontend/services/ServiceFilters.vue";
import ServiceList from "~/components/frontend/services/ServiceList.vue";
import SortDropdown from "~/components/frontend/services/topbar/SortDropdown.vue";
import ToggleView from "~/components/frontend/services/topbar/ToggleView.vue";



definePageMeta({
  layout: "blank",
});



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
              Discover 6 professional services for your business
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
        <ServiceFilters />
        <!-- Main Content -->
        <div class="flex-1 space-y-6">
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-500">6 services found</div>
            <div class="flex gap-4 items-center">
              <SortDropdown />
              <ToggleView />
            </div>
          </div>
          <ServiceList />
        </div>
      </div>
    </div>
  </div>
</template>
