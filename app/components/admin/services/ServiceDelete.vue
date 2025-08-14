<script setup lang="ts">
import ConfirmDialogue from "~/components/ConfirmDialog.vue";
import { toast } from "@steveyuowo/vue-hot-toast";
import type { Service } from "~/shared/types/service";

const props = defineProps<{
  service: Service;
  modelValue: boolean;
}>();

const emit = defineEmits(["update:modelValue", "confirm", "close"]);

const isOpen = ref<boolean>(props.modelValue);
const loading = ref<boolean>(false);

const { deleteService, fetchServices } = useServices();
watch(
  () => props.modelValue,
  (val) => {
    isOpen.value = val;
  }
);

const handleCancel = () => {
  emit("close");
  isOpen.value = false;
};

const handleDelete = async () => {
  loading.value = true;
  try {
    const { data, error: deleteError } = await deleteService(props.service.id);
    if (deleteError) throw deleteError;
    toast.success("Service delete successfully");
    await fetchServices();
    // Close dialog
    isOpen.value = false;
  } catch (err) {
    toast.error((err as Error).message || "Failed to delete article");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <ConfirmDialogue
    :open="isOpen"
    @update:open="handleCancel"
    @confirm="handleDelete"
    :loading="loading"
    title="Delete Service?"
    description="Are you sure you want to delete this service? This action is irreversible."
  />
</template>

<style scoped></style>
