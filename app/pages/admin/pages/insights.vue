<script setup lang="ts">
import Insights from "~/components/admin/pages/Insights.vue";
import Layout from "~/components/admin/pages/Layout.vue";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useHead({
  title: "Insights(Blog) Settings",
});
</script>

<template>
  <Layout>
      <Insights />
  </Layout>
</template>

<style scoped></style>
