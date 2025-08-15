<script setup lang="ts">
import ConfirmDialogue from "~/components/ConfirmDialog.vue";
import { toast } from "@steveyuowo/vue-hot-toast";
import type { Tool } from "~/shared/types/tools";

const props = defineProps<{
  tool: Tool;
  modelValue: boolean;
}>();

const emit = defineEmits(["update:modelValue", "confirm", "close"]);

const isOpen = ref<boolean>(props.modelValue);
const loading = ref<boolean>(false);

const { deleteTool, fetchTools } = useTools();
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
    const { data, error: deleteError } = await deleteTool(props.tool.id);
    if (deleteError) throw deleteError;
    toast.success("Tool delete successfully");
    await fetchTools();
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
    title="Delete Tool?"
    description="Are you sure you want to delete this tool? This action is irreversible."
  />
</template>

<style scoped></style>
