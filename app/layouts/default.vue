<script setup lang="ts">
import Header from "~/components/frontend/layout/Header.vue";
import Footer from "~/components/frontend/layout/Footer.vue";
</script>

<template>
  <div>
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </div>
</template>

<style scoped></style>
