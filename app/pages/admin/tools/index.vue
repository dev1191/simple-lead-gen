

<script setup lang="ts">
import { columns } from '~/components/admin/tools/Columns';
import DataTable from "~/components/admin/tools/DataTable.vue"

definePageMeta({
    layout:'admin',
    middleware:['auth']
})

useHead({
  title: "Tools Management",
});

const tools = useTools();
</script>

<template>
    <AdminLayoutPage
    title="Tools Management"
    description="Manage all tool management"
    sticky
  >
    <template #actions>
      <NuxtLink to="/admin/tools/create">
        <Button class="space-x-1">
          <Icon name="Plus" :size="20" />
          <span>Add New Tool</span>
        </Button>
      </NuxtLink>
    </template>

    <div class="overflow-x-auto">
      <DataTable :tools="tools" :columns="columns" />
    </div>
  </AdminLayoutPage>
</template>

<style scoped>

</style>