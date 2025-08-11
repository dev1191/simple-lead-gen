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
    <template #actions> </template>

    <div class="overflow-x-auto">
      <DataTable :services="services" :columns="columns" />
    </div>
  </AdminLayoutPage>
</template>

<style scoped></style>
