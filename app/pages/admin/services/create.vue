<script setup lang="ts">
import ServiceForm from "~/components/admin/services/ServiceForm.vue"


definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useHead({
  title: "Create Services Management",
});


</script>

<template>
  <AdminLayoutPage title="Create Service" description="Create service" sticky>
    <div>
        <ServiceForm />
    </div>
  </AdminLayoutPage>
</template>

<style scoped></style>
