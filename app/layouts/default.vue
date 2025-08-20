<script setup lang="ts">
import Header from "~/components/frontend/layout/Header.vue";
import Footer from "~/components/frontend/layout/Footer.vue";
</script>

<template>
  <div class="min-h-screen w-full">
    <Header />
    <main class="w-full">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<style scoped></style>
