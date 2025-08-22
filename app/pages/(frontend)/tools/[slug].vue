<script setup lang="ts">
import ToolDetail from "~/components/frontend/tools/details/ToolDetail.vue";
definePageMeta({
  layout: "blank",
});
</script>

<template>
  <div>
    <div class="max-w-7xl mx-auto ">
      <ToolDetail :slug="$route.params.slug" />
    </div>
  </div>
</template>

<style scoped></style>
