<script setup lang="ts">
import { columns } from "~/components/admin/vendors/Columns";
import DataTable from "~/components/admin/vendors/DataTable.vue";
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const vendors = useVendors();
</script>

<template>
  <AdminLayoutPage title="Vendors" description="Manage all vendors" sticky>
    <template #actions> </template>

    <template #cardHeader>
      <AdminVendorsCard />
    </template>

    <div class="overflow-x-auto">
      <DataTable :vendors="vendors" :columns="columns" />
    </div>
  </AdminLayoutPage>
</template>

<style scoped></style>
