<script setup lang="ts">
import ConfirmDialogue from "~/components/ConfirmDialog.vue";
import { toast } from "@steveyuowo/vue-hot-toast";
import type { Faq } from "~/shared/types";

const props = defineProps<{
  faq: Faq;
  modelValue: boolean;
}>();

const emit = defineEmits(["update:modelValue", "confirm", "close"]);

const isOpen = ref<boolean>(props.modelValue);
const loading = ref<boolean>(false);

const { deleteFaq, fetchFaqs } = useFaqs();
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
    const { data, error: deleteError } = await deleteFaq(props.faq.id);
    if (deleteError) throw deleteError;
    toast.success("Faq delete successfully");
    await fetchFaqs(props.faq.category);
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
    title="Delete Faq?"
    description="Are you sure you want to delete this faqs? This action is irreversible."
  />
</template>

<style scoped></style>
