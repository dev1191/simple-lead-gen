<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Image, UploadCloud, X } from 'lucide-vue-next';

const props = defineProps<{
  modelValue?: File | File[] | string | string[] | null;
  accept?: string;
  multiple?: boolean;
  previewUrl?: string | string[];
  placeholder?:string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: File | File[] | null): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const files = ref<File[]>([]);

// Initialize previewUrls from previewUrl prop
const previewUrls = ref<string[]>(
  props.previewUrl
    ? Array.isArray(props.previewUrl)
      ? props.previewUrl
      : [props.previewUrl]
    : []
);

// Watch previewUrl prop changes independently
watch(
  () => props.previewUrl,
  (val) => {
    if (!val) {
      previewUrls.value = [];
    } else if (Array.isArray(val)) {
      previewUrls.value = val;
    } else {
      previewUrls.value = [val];
    }
  },
  { immediate: true }
);

// Watch modelValue prop changes and update files & previewUrls
watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      files.value = [];
      previewUrls.value = [];
    } else if (Array.isArray(val)) {
      files.value = val.filter((v): v is File => v instanceof File);
      previewUrls.value = val.filter((v) => typeof v === 'string') as string[];

      // Generate preview URLs from files, avoid duplicates
      files.value.forEach((file) => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            if (!previewUrls.value.includes(result)) {
              previewUrls.value.push(result);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    } else if (val instanceof File) {
      files.value = [val];
      const reader = new FileReader();
      reader.onload = () => {
        previewUrls.value = [reader.result as string];
      };
      reader.readAsDataURL(val);
    } else if (typeof val === 'string') {
      files.value = [];
      previewUrls.value = [val];
    } else {
      files.value = [];
      previewUrls.value = [];
    }
  },
  { immediate: true }
);

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (!target.files) return;

  const selectedFiles = Array.from(target.files);

  if (props.multiple) {
    files.value = [...files.value, ...selectedFiles];
  } else {
    files.value = [selectedFiles[0]];
  }

  previewUrls.value = [];
  files.value.forEach((file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        previewUrls.value.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  });

  emit('update:modelValue', props.multiple ? files.value : files.value[0] ?? null);
  target.value = '';
}

function removeFile(index: number) {
  files.value.splice(index, 1);
  previewUrls.value.splice(index, 1);
  emit('update:modelValue', props.multiple ? files.value : files.value[0] ?? null);
}

function triggerBrowse() {
  fileInput.value?.click();
}

const hasFiles = computed(() => files.value.length > 0 || previewUrls.value.length > 0);
const isSingle = computed(() => !props.multiple && previewUrls.value.length === 1);
</script>


<template>
  <div class="space-y-4">
    <Card
      class="w-full border-muted hover:border-primary group relative cursor-pointer border-2 border-dashed  p-0 transition-colors"
      @click="triggerBrowse"
      style="min-height: 12rem;"
    >
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        :accept="accept || 'image/*'"
        :multiple="multiple"
        @change="onFileChange"
      />
      <!-- Upload prompt -->
      <template v-if="!hasFiles">
        <div class="flex flex-col items-center justify-center space-y-2 text-center w-full h-48 select-none p-4">
          <Image class="text-muted-foreground group-hover:text-primary h-8 w-8 transition-colors" />
          <p class="text-muted-foreground text-sm">
            <span v-if="placeholder" class="text-foreground font-medium">{{ placeholder }}</span>
            <div v-else>
              <span  class="text-foreground font-medium">Click to upload</span> or drag and drop
            </div>
           
          </p>
        </div>
      </template>
      <!-- Single image preview fills entire card -->
      <template v-else-if="isSingle">
        <div class="relative w-full h-full min-h-[12rem]">
          <img
            :src="previewUrls[0]"
            alt="Preview"
            class="w-full h-full object-cover rounded-md"
            draggable="false"
          />
          <Button
            variant="ghost"
            size="icon"
            class="absolute top-2 right-2 p-0 w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full hover:bg-red-500 shadow-sm"
            @click.stop.prevent="removeFile(0)"
            aria-label="Remove file"
          >
            <X class="w-4 h-4 text-gray-600 hover:text-white" />
          </Button>
        </div>
      </template>
      <!-- Multiple images grid -->
      <template v-else>
        <div class="flex flex-wrap gap-4 p-4">
          <div
            v-for="(url, index) in previewUrls"
            :key="url + index"
            class="relative w-24 h-24 rounded-md border overflow-hidden"
            @click.stop
          >
            <img
              :src="url"
              alt="Preview"
              class="w-full h-full object-contain bg-white"
              draggable="false"
            />
            <Button
              variant="ghost"
              size="icon"
              class="absolute top-1 right-1 p-0 w-6 h-6 bg-white rounded-full hover:bg-red-500"
              @click.prevent="removeFile(index)"
              aria-label="Remove file"
            >
              <X class="w-4 h-4 text-gray-600 hover:text-white" />
            </Button>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>