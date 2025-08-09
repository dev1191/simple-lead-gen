<script setup lang="ts">
import StarterKit from "@tiptap/starter-kit";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import { Label } from "@/components/ui/label";
import { computed } from "vue";

interface Props {
  id: string;
  modelValue: string;
  label?: string;
  error?: string;
  required?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{ (e: "update:modelValue", value: string): void }>();

const editor = useEditor({
  extensions: [StarterKit],
  content: props.modelValue || "",
  onUpdate({ editor }) {
    emit("update:modelValue", editor.getHTML());
  },
});

const value = computed(() => props.modelValue);
</script>

<template>
  <div class="space-y-4">
    <Label v-if="label" :for="id">
      {{ label }}<span v-if="required" class="text-red-500">*</span>
    </Label>
    <EditorContent :editor="editor" class="border p-2 rounded min-h-[200px]" />
    <InputError v-if="error" :message="error" />
  </div>
</template>
