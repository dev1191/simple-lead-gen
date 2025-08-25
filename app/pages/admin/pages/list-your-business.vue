<script setup lang="ts">
import Layout from "~/components/admin/pages/Layout.vue";
import ListYourBusiness from "~/components/admin/pages/ListYourBusiness.vue";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useHead({
  title: "List your Business",
});
</script>

<template>
  <Layout>
        <ListYourBusiness />
  </Layout>
</template>

<style scoped></style>
