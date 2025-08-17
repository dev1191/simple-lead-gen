

<script setup lang="ts">
import DataTable from "~/components/admin/leads/DataTable.vue"
import { columns } from "~/components/admin/leads/Columns"
definePageMeta({
     layout:'admin',
    middleware:['auth']
})

useHead({
  title: "Leads Management",
});


const leads = useLeads();

</script>

<template>
       <AdminLayoutPage
    title="Leads Management"
    description="Manage all leads management"
    sticky
  >

   <template #cardHeader>
      <AdminLeadsFilters/>
    </template>

    <div class="overflow-x-auto">
      <DataTable :leads="leads" :columns="columns" />
    </div>
  </AdminLayoutPage>
</template>

<style scoped>

</style>