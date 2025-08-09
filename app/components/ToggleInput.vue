<script setup lang="ts">
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { FunctionalComponent } from "vue";

interface ToggleOption {
  id: string;
  value: string;
  label?: string;
  icon?: FunctionalComponent;
  error?: string;
  required?: boolean;
}

type Props =
  | {
      type?: "single";
      modelValue: string;
      options: ToggleOption[];
    }
  | {
      type: "multiple";
      modelValue: string[];
      options: ToggleOption[];
    };

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:modelValue", value: string | string[]): void;
}>();

const type = props.type ?? "single";
const options = computed(() => props.options);

const value = computed<string | string[]>({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>

<template>
  <div class="space-y-4">
    <Label v-if="label" :for="id"
      >{{ label }}<span v-if="required" class="text-red-500">*</span></Label
    >

    <ToggleGroup :type="type" variant="outline" v-model="value">
      <ToggleGroupItem
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :aria-label="option.label || option.value"
      >
        <component :is="option.icon" v-if="option.icon" class="h-4 w-4" />
        <span v-else>{{ option.label }}</span>
      </ToggleGroupItem>
    </ToggleGroup>
  </div>
</template>
