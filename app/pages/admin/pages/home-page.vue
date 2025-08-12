<script setup lang="ts">
import Layout from "~/components/admin/pages/Layout.vue";
import HomePage from "~/components/admin/pages/HomePage.vue"
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
      <HomePage/>
  </Layout>
</template>

<style scoped></style>
