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
  <AdminLayoutPage title="Create Service" description="Create your service listing to reach more customers" sticky>
    <div>
        <ServiceForm />
    </div>
  </AdminLayoutPage>
</template>

<style scoped></style>
