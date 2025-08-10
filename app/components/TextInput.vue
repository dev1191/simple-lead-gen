<script setup lang="ts">
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface Props {
  name: string;
  modelValue?: string | number;
  label?: string;
  placeholder?: string;
  required?: boolean;
  autocomplete?: string;
  type?: string;
  min?: number;
  max?: number;
  validateOnBlur?: boolean;
  isFieldDirty?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  validateOnBlur: true,
  isFieldDirty: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();

const value = computed({
  get: () => props.modelValue,
  set: (val: string | number) => emit('update:modelValue', val),
});

function handleInput(event: Event, field: any) {
  const input = event.target as HTMLInputElement;
  let val: string | number = input.value;
  
  if (props.type === 'number') {
    const numVal = parseFloat(val);
    if (!isNaN(numVal)) {
      if (props.min !== undefined && numVal < props.min) val = props.min;
      if (props.max !== undefined && numVal > props.max) val = props.max;
    }
  }
  
  // Update both the form field and v-model
  field.onChange(val);
  emit('update:modelValue', val);
}
</script>

<template>
  <FormField 
    v-slot="{ componentField }" 
    :name="name" 
    :validate-on-blur="validateOnBlur && !isFieldDirty"
  >
    <FormItem>
      <FormLabel v-if="label">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </FormLabel>
      <FormControl>
        <Input
          :type="type"
          :placeholder="placeholder || label"
          :required="required"
          :autocomplete="autocomplete"
          :min="type === 'number' ? min : undefined"
          :max="type === 'number' ? max : undefined"
          :model-value="modelValue || componentField.modelValue"
          v-bind="componentField"
          @input="(event) => handleInput(event, componentField)"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
</template>