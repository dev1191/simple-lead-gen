<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});
</script>

<template>
  <AdminLayoutPage
    title="Frontend Pages Management"
    description="Manage Frontend Pages"
    sticky
  >
    <template #actions> </template>

    <div class="overflow-x-auto"></div>
  </AdminLayoutPage>
</template>

<style scoped></style>
