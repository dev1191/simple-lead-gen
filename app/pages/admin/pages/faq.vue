<script setup lang="ts">
import Layout from "~/components/admin/pages/Layout.vue";
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useHead({
  title: "FAQ",
});
</script>

<template>
  <Layout>
    <h1>FAQ page</h1>
  </Layout>
</template>

<style scoped></style>
