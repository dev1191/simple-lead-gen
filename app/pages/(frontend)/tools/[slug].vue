<script setup lang="ts">
import ToolDetail from "~/components/frontend/tools/details/ToolDetail.vue";
definePageMeta({
  layout: "blank",
});

const route = useRoute();

const { data: toolData } = await useFetch(`/api/tools/${route.params.slug}`);


console.log("toolData",toolData.value)
</script>

<template>
  <div>
    <div class="max-w-7xl mx-auto ">
      <ToolDetail :tool="toolData" />
    </div>
  </div>
</template>

<style scoped></style>
