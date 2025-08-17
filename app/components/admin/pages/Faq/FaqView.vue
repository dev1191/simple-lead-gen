<script setup lang="ts">
import type { Faq } from "~/shared/types";
const props = defineProps<{ faq: Faq; modelValue: boolean }>();
const emit = defineEmits(["update:modelValue", "confirm", "close"]);

const isOpen = ref<boolean>(props.modelValue);
const faq = ref(props.faq);

const handleCancel = () => {
  emit("close");
  isOpen.value = false;
};
</script>

<template>
  <BaseDialog
    :open="isOpen"
    mode="view"
    title="View Faq"
    @update:open="handleCancel"
    size="two"
    isFooter
  >
    <template #default>
      <div class="space-y-4">
        <Card v-if="faq">
          <CardHeader>
            <CardTitle>{{ faq.question }}</CardTitle>
            <CardDescription v-if="faq.category">
              Category: {{ faq.category }}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-gray-700">
              {{ faq.answer }}
            </p>
          </CardContent>
        </Card>
      </div>
    </template>
  </BaseDialog>
</template>

<style scoped></style>
