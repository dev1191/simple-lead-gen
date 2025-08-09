
<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const props = defineProps<{
  modelValue: string
  label?: string
  id?: string
  placeholder?: string
  description?: string
  error?: string
  rows?: number
  disabled?: boolean
  required?:boolean
  textareaClass?: string
}>()

const emit = defineEmits(['update:modelValue'])

watch(() => props.modelValue, val => emit('update:modelValue', val))

const value = computed({
    get: () => props.modelValue,
    set: (val: string | number) => emit('update:modelValue', val),
});


</script>


<template>
  <div class="space-y-4">
    <Label :for="id" v-if="label">{{ label }}<span v-if="required" class="text-red-500">*</span></Label>
    <Textarea
      :id="id"
      v-model="value"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled"
      :class="textareaClass"
    />
    <InputError  v-if="error" :message="error" />
  </div>
</template>