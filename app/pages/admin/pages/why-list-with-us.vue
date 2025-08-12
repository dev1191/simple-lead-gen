<script setup lang="ts">
import Layout from "~/components/admin/pages/Layout.vue";
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useHead({
  title: "Why List With Us",
});
</script>

<template>
  <Layout>
    <h1>Why List With Us page</h1>
  </Layout>
</template>

<style scoped></style>
