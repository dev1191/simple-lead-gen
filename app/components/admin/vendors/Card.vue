<script setup lang="ts">
const { vendors, activeCount, fetchCounts, fetchVendors } = useVendors();

const { totalCount } = useServices();
onMounted(() => {
  fetchCounts();
  fetchVendors();
});
</script>

<template>
  <div class="grid grid-cols-3 gap-2">
    <BaseCard size="sm" height="h-30" :isFooter="false">
      <template #default>
        <h2 class="text-3xl font-bold">{{ vendors.length }}</h2>
        <div class="text-md text-card-foreground">Total Vendors</div>
      </template>
    </BaseCard>
    <BaseCard size="sm" height="h-30" :isFooter="false">
      <template #default>
        <h2 class="text-3xl font-bold">{{ activeCount }}</h2>
        <div class="text-md text-card-foreground">Active Vendors</div>
      </template>
    </BaseCard>
    <BaseCard size="sm" height="h-30" :isFooter="false">
      <template #default>
        <h2 class="text-3xl font-bold">{{ totalCount }}</h2>
        <div class="text-md text-card-foreground">Total Services Listed</div>
      </template>
    </BaseCard>
  </div>
</template>

<style scoped></style>
