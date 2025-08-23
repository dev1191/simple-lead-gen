<script setup lang="ts">
import ServiceDetail from "~/components/frontend/services/details/ServiceDetail.vue";
definePageMeta({
  layout: "blank",
});

const route = useRoute();

const { data: serviceData } = await useFetch(`/api/services/${route.params.slug}`);

</script>

<template>
  <div>
    <div class="max-w-7xl mx-auto ">
      <ServiceDetail :service="serviceData" />
    </div>
  </div>
</template>

<style scoped></style>
