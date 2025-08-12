<script setup lang="ts">
import Layout from "~/components/admin/pages/Layout.vue";
import Faq from "~/components/admin/pages/Faq/Index.vue";

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
        <Faq/>
  </Layout>
</template>

<style scoped></style>
