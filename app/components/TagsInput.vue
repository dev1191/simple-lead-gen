<script setup lang="ts">
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input';
import { Label } from '@/components/ui/label';

interface Props {
  id: string;
  modelValue: string[];
  label?: string;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  max?: number;
  delimiter?: string;
  duplicate?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  delimiter: ',',
  duplicate: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void;
}>();

const value = computed({
  get: () => props.modelValue,
  set: (val: string[]) => emit('update:modelValue', val),
});

function onValueChange(newValue: string[]) {
  let filteredValue = newValue;
  
  // Apply max limit if specified
  if (props.max !== undefined && newValue.length > props.max) {
    filteredValue = newValue.slice(0, props.max);
  }
  
  // Remove duplicates if not allowed
  if (!props.duplicate) {
    filteredValue = [...new Set(filteredValue)];
  }
  
  emit('update:modelValue', filteredValue);
}
</script>

<template>
  <div class="space-y-2">
    <Label v-if="label" :for="id">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </Label>
    
    <TagsInput 
      :id="id"
      v-model="value"
      :disabled="disabled"
      :delimiter="delimiter"
      :duplicate="duplicate"
      :class="{ 'border-red-500': error }"
       @input="onValueChange"
    >
      <TagsInputItem v-for="item in value" :key="item" :value="item">
        <TagsInputItemText />
        <TagsInputItemDelete />
      </TagsInputItem>
      
      <TagsInputInput 
        :placeholder="placeholder || 'Add tags...'"
        :required="required && value.length === 0"
      />
    </TagsInput>
    
    <div v-if="error" class="text-sm text-red-500">
      {{ error }}
    </div>
    
    <div v-if="max" class="text-xs text-gray-500">
      {{ value.length }}/{{ max }} tags
    </div>
  </div>
</template>