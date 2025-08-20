<script setup lang="ts">
import Layout from "~/components/admin/pages/Layout.vue";
import AboutUs from "~/components/admin/pages/AboutUs.vue"
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useHead({
  title: "About Us Settings",
});
</script>

<template>
  <Layout>
      <AboutUs />
  </Layout>
</template>

<style scoped></style>
