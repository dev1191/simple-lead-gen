<script setup lang="ts">
import Layout from "~/components/admin/pages/Layout.vue";
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
    <h1>List your Business page</h1>
  </Layout>
</template>

<style scoped></style>
