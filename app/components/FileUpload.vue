<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';


const props = defineProps<{
    modelValue?: File | string | null;
    accept?: string;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: File | null): void;
}>();


const fileInput = ref<HTMLInputElement | null>(null);
const previewUrl = ref<string | null>(null);

watch(
    () => props.modelValue,
    (value) => {
        if (value instanceof File && value.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                previewUrl.value = reader.result as string;
            };
            reader.readAsDataURL(value);
        } else if (value!= '' && typeof value === 'string') {
            previewUrl.value = value; // already uploaded image URL
        } else {
            previewUrl.value = null;
        }
    },
    { immediate: true },
);

function onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0] || null;
    emit('update:modelValue', file);
}

function triggerBrowse() {
    fileInput.value?.click();
}

function clearFile() {
    emit('update:modelValue', null);
    previewUrl.value = null;
    if (fileInput.value) {
        fileInput.value.value = '';
    }
}
</script>

<template>
    <div class="space-y-4">
        <div class="flex justify-between items-start gap-4">
            <!-- File Upload Card -->
            <Card
                class="w-30 h-30 border-muted hover:border-primary group relative cursor-pointer border-1 border-dashed p-1 transition-colors"
                @click="triggerBrowse"
            >
                <div class="flex flex-col items-center justify-center space-y-2 text-center h-full">
                    <Icon name="UploadCloud" class="text-muted-foreground group-hover:text-primary h-8 w-8 transition-colors" />
                    <p class="text-muted-foreground text-sm">
                        <span class="text-foreground font-medium">Click to upload</span> or drag and drop
                    </p>
                    <input ref="fileInput" type="file" class="hidden" :accept="accept || 'image/*'" @change="onFileChange" />
                </div>
                
                <!-- File Name Display (for non-image files) -->
                <div v-if="modelValue && !previewUrl" class="text-muted-foreground mt-2 text-center text-sm">
                    {{ modelValue.name }}
                </div>
            </Card>

            <!-- Preview Card -->
            <div v-if="previewUrl" class="w-30 h-30 relative p-4">
                <div class="absolute top-2 right-2 z-20">
                    <Button variant="ghost" size="icon" class="w-6 h-6 hover:bg-red-500" @click="clearFile">
                        <Icon name="X" class="h-4 w-4 " />
                    </Button>
                </div>
                <div class="flex justify-center items-center h-full">
                    <img 
                        :src="previewUrl" 
                        alt="Preview" 
                        class="max-h-full max-w-full rounded-md border object-contain" 
                    />
                </div>
            </div>
        </div>
    </div>
</template>