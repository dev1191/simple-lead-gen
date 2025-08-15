<script setup lang="ts">
import type { Service } from "~/shared/types/service";
import ServiceForm from "./ServiceForm.vue";

const props = defineProps<{ service: Service; modelValue: boolean }>();

const service = ref(props.service);

</script>

<template>
    <ServiceForm :service="service" />
</template>

<style scoped></style>
