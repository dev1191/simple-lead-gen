<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});
</script>

<template>
  <AdminLayoutPage title="Services" description="Manage all service listings" sticky>
    <template #actions> </template>

    <div class="overflow-x-auto"></div>
  </AdminLayoutPage>
</template>

<style scoped></style>
