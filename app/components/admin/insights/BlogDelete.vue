<script setup lang="ts">
import type { BlogPost } from "~/shared/types/blogPost";
import ConfirmDialogue from "~/components/ConfirmDialog.vue";
import { toast } from "@steveyuowo/vue-hot-toast";

const props = defineProps<{
  post: BlogPost;
  modelValue: boolean;
}>();

const emit = defineEmits(["update:modelValue", "confirm", "close"]);

const isOpen = ref<boolean>(props.modelValue);
const loading = ref<boolean>(false);

const { deletePost, fetchPosts } = useBlogPosts();
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
    const { data, error: deleteError } = await deletePost(props.post.id);
    if (deleteError) throw deleteError;
    toast.success("Article delete successfully");
    await fetchPosts();
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
    title="Delete Post?"
    description="Are you sure you want to delete this blog post? This action is irreversible."
  />
</template>

<style scoped></style>
