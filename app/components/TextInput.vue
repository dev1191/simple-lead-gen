<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


interface Props {
    id: string;
    modelValue: string | number;
    label?: string;
        error?: string;
    placeholder?: string;
    required?: boolean;
    autocomplete?: string;
    type?: string;
    min?: number;
    max?: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void;
}>();

const value = computed({
    get: () => props.modelValue,
    set: (val: string | number) => emit('update:modelValue', val),
});

function onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let val: string | number = input.value;

    if (props.type === 'number') {
        const numVal = parseFloat(val);
        if (!isNaN(numVal)) {
            if (props.min !== undefined && numVal < props.min) val = props.min;
            if (props.max !== undefined && numVal > props.max) val = props.max;
        }
    }

    emit('update:modelValue', val);
}
</script>

<template>
    <div class="space-y-4">
        <Label v-if="label" :for="id">{{ label }}<span v-if="required" class="text-red-500">*</span></Label>
        <Input
            :id="id"
            v-model="value"
            :required="required"
            :autocomplete="autocomplete"
            :placeholder="placeholder || label"
            :type="type || 'text'"
            :min="type === 'number' ? min : undefined"
            :max="type === 'number' ? max : undefined"
            :class="{ 'border-red-500': error }"
            @input="onInput"
        />
        <InputError v-if="error" :message="error" />
    </div>
</template>