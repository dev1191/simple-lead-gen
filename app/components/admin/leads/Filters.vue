<script setup lang="ts">
import type { DateRange } from "reka-ui";

const filters = reactive({
  listingType: "",
  provider: "",
  dateRange: null as DateRange | null,
});

const { leads, fetchLeads, updateFilter, resetFilters } = useLeads();
const { lists, getVendors } = useVendors();

// Fetch vendors for provider filter
onMounted(() => getVendors());

// Compute payload from reactive filters
const getFiltersPayload = () => {
  const payload: Record<string, any> = {};
  if (filters.listingType) payload.listing_type = filters.listingType;
  if (filters.provider) payload.provider_id = filters.provider;
  if (filters.dateRange?.start && filters.dateRange?.end) {
    payload.start_date = filters.dateRange.start.toDate().toISOString();
    payload.end_date = filters.dateRange.end.toDate().toISOString();
  }
  return payload;
};

// Watch combined filters and update leads once
watch(
  () => filters,
  (newFilters) => {
    const payload = getFiltersPayload();
    resetFilters().then(() => {
      Object.entries(payload).forEach(([key, value]) => updateFilter(key, value));
    });
  },
  { deep: true }
);


// Reset all filters
const handleResetFilters = () => {
  filters.listingType = "";
  filters.provider = "";
  filters.dateRange = null;
  resetFilters(); // calls fetchLeads internally
};

</script>

<template>
<BaseCard title="Filters" icon="Funnel" :isFooter="false">
    <div class="grid grid-cols-3 md:grid-cols-3 gap-6 mb-4">
      <!-- Date Range Filter -->
      <div class="grid grid-rows gap-2">
        <Label id="dateRange">Date Range</Label>
        <DateRangeCalendar
          v-model="filters.dateRange"
          placeholder="Select date range"
          :number-of-months="2"
        />
      </div>

      <!-- Provider Filter -->
      <div class="grid grid-rows gap-2">
        <Label id="provider">Provider</Label>
        <Select v-model="filters.provider">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="All Providers" />
          </SelectTrigger>
          <SelectContent>
            <template v-for="provider in lists" :key="provider.id">
              <SelectItem :value="provider.id">{{ provider.name }}</SelectItem>
            </template>
          </SelectContent>
        </Select>
      </div>

      <!-- Listing Type Filter -->
      <div class="grid grid-rows gap-2">
        <Label id="listingType">Listing Type</Label>
        <Select v-model="filters.listingType">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Service">Service</SelectItem>
            <SelectItem value="Tool">Tool</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Reset Filters Button -->
    <div class="flex justify-end">
      <Button variant="outline" size="sm" @click="handleResetFilters">
         <Icon name="X" class="w-5 h-5" />Reset Filters
      </Button>
    </div>
  </BaseCard>
</template>

<style scoped></style>
