<script setup lang="ts">
import type { BlogPost } from "~/shared/types/blogPost";

const props = defineProps<{ post: BlogPost; modelValue: boolean }>();
const emit = defineEmits(["update:modelValue", "confirm", "close"]);

const isOpen = ref<boolean>(props.modelValue);
const post = ref(props.post);

const handleCancel = () => {
  emit("close");
  isOpen.value = false;
};
</script>

<template>
  <BaseDialog
    :open="isOpen"
    mode="edit"
    title="Edit Article"
    @update:open="handleCancel"
    size="four"
  >
    <template #default>
        {{ post }}
    </template>
  </BaseDialog>
</template>

<style scoped></style>
