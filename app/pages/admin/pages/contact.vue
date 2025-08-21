<script setup lang="ts">
import Contact from "~/components/admin/pages/Contact.vue";
import Layout from "~/components/admin/pages/Layout.vue";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useHead({
  title: "Contact Settings",
});
</script>

<template>
  <Layout>
      <Contact />
  </Layout>
</template>

<style scoped></style>
