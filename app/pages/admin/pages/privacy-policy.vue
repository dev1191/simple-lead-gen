<script setup lang="ts">
import Layout from "~/components/admin/pages/Layout.vue";
import PrivacyPolicy from "~/components/admin/pages/PrivacyPolicy.vue"
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useHead({
  title: "Privacy Policy",
});
</script>

<template>
  <Layout>
  
    <PrivacyPolicy />
  </Layout>
</template>

<style scoped></style>
