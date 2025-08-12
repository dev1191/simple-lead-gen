<script setup lang="ts">
import { columns } from "~/components/admin/services/Columns";
import DataTable from "~/components/admin/services/DataTable.vue";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useHead({
  title: "Services Management",
});

const services = useServices();
</script>

<template>
  <AdminLayoutPage
    title="Services Management"
    description="Manage all service management"
    sticky
  >
    <template #actions>
      <NuxtLink to="/admin/services/create">
        <Button class="space-x-1">
          <Icon name="Plus" :size="20" />
          <span>Add New Service</span>
        </Button>
      </NuxtLink>
    </template>

    <div class="overflow-x-auto">
      <DataTable :services="services" :columns="columns" />
    </div>
  </AdminLayoutPage>
</template>

<style scoped></style>
