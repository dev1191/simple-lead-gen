<script setup lang="ts">
import Layout from "~/components/admin/pages/Layout.vue";
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useHead({
  title: "Home Page Settings",
});
</script>

<template>
  <Layout>
    <h1>Home page</h1>
  </Layout>
</template>

<style scoped></style>
