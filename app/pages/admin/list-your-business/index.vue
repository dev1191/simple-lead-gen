

<script setup lang="ts">
import {columns } from "~/components/admin/list-your-businesses/Columns";
import DataTable from "~/components/admin/list-your-businesses/DataTable.vue";


definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useHead({
  title: "List your Business",
});

const businesss = useBusinesses();
</script>

<template>
   <AdminLayoutPage
    title="List your Business"
    description="List your Business "
    sticky
  >

      <div class="overflow-x-auto">
      <DataTable :businesss="businesss" :columns="columns" />
    </div>
  </AdminLayoutPage>
</template>

<style scoped>

</style>