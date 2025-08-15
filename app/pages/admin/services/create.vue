<script setup lang="ts">
import ServiceForm from "~/components/admin/services/ServiceForm.vue";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useHead({
  title: "Create Services Management",
});

const service = ref({
  service_name: "",
  service_tagline: "",
  service_categories: [],
  type_of_service: "",
  business_types: [],
  highlights: [],
  included: [],
  currency_code: "MYR",
  pricing: "",
  turnaround_time: "within-48-hours",
  free_consulatation: false,
  client_logos: [],
  servers: [],
  url: "",
  banner_url: null,
  logo_url: null,
  provider_name: "",
  provider_email: "",
  description: "",
});
</script>

<template>
  <AdminLayoutPage
    title="Create Service"
    description="Create your service listing to reach more customers"
    sticky
  >
    <div>
      <ServiceForm :service="service" :isEditable=false />
    </div>
  </AdminLayoutPage>
</template>

<style scoped></style>
