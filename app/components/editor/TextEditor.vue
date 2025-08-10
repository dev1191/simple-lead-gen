<script setup lang="ts">

interface Props {
  id: string;
  modelValue: string;
  label?: string;
  error?: string;
  required?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{ (e: "update:modelValue", value: string): void }>();


const value = computed(() => props.modelValue);
</script>

<template>
  <div class="space-y-4">
    <Label v-if="label" :for="id">
      {{ label }}<span v-if="required" class="text-red-500">*</span>
    </Label>

    <InputError v-if="error" :message="error" />
  </div>
</template>


