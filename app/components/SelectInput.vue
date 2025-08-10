<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


interface Option {
  label: string;
  value: string | number;
}

defineProps<{
  modelValue: string | number | null;
  options: Option[];
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  id: string;
  tooltip?: string;
  forId?: string;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  tooltipAlign?: "start" | "center" | "end";
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
}>();

const updateValue = (value: string) => {
  emit("update:modelValue", value);
};
</script>

<template>
  <div class="space-y-4">
    <Label :for="id">
        <slot name="label"
          >{{ label }}<span v-if="required" class="text-red-500">*</span></slot
        >
      </Label>

    <Select :modelValue="modelValue" @update:modelValue="updateValue">
      <SelectTrigger class="w-full">
        <SelectValue :placeholder="placeholder || 'Select an option'" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel v-if="label">{{ label }}</SelectLabel>
          <SelectItem
            v-for="option in options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <InputError v-if="error" :message="error" />
  </div>
</template>
