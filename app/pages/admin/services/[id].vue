<script setup lang="ts">
import ServiceForm from "~/components/admin/services/ServiceForm.vue";
import { Service } from "~/shared/types/service";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useHead({
  title: "Edit Services Management",
});
const route = useRoute();

const { getService } = useServices();
const service = ref<Service>({});

onMounted(async () => {
  service.value = await getService(route.params.id);
});
</script>

<template>
  <AdminLayoutPage
    title="Edit Service"
    description="Edit your service listing to reach more customers"
    sticky
  >
    <div>
      <ServiceForm :service="service" :isEditable="true" />
    </div>
  </AdminLayoutPage>
</template>

<style scoped></style>
