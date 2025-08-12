<script setup lang="ts">
import Layout from "~/components/admin/pages/Layout.vue";
import TermsOfService from "~/components/admin/pages/TermsOfService.vue"
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useHead({
  title: "Terms Of Service Settings",
});
</script>

<template>
  <Layout>
      <TermsOfService />
  </Layout>
</template>

<style scoped></style>
