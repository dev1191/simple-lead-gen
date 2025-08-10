<script setup lang="ts">
import {
  Bold,
  BulletList,
  Italic,
  BaseKit,
  Underline,
  Strike,
  LineHeight,
  Image,
  History,
  Heading,
  CodeBlock,
  FontSize,
  Clear,
  Blockquote,
  Link,
  OrderedList,
  Fullscreen,
  locale,
  Columns,
  TextAlign,
  EchoEditor,
} from "echo-editor";
import { shallowRef, computed, useAttrs } from "vue";

interface Props {
  id?: string;
  modelValue?: string;
  value?: string; // for vee-validate slot prop
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Start writing your content...",
});

const attrs = useAttrs() as Record<string, any>;

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "input", value: string): void;
  (e: "change", value: string): void;
  (e: "blur", event: FocusEvent): void;
}>();

locale.setLang("en");

const content = computed({
  get: () => props.modelValue ?? props.value ?? "",
  set: (value: string) => {
    emit("update:modelValue", value);
    emit("input", value);
    emit("change", value);

    if (typeof attrs.onInput === "function") attrs.onInput(value);
    if (typeof attrs.onChange === "function") attrs.onChange(value);
  },
});

const extensions = shallowRef([
  BaseKit.configure({
    placeholder: { placeholder: props.placeholder },
  }),
  History,
  Columns,
  Clear,
  Heading.configure({ spacer: true }),
  FontSize,
  Bold,
  Italic,
  Underline,
  Strike,
  BulletList,
  OrderedList,
  TextAlign.configure({
    types: ["heading", "paragraph", "image"],
    spacer: true,
  }),
  LineHeight,
  Link,
  Image,
  Fullscreen,
]);

function handleBlur(event: FocusEvent) {
  emit("blur", event);
  if (typeof attrs.onBlur === "function") attrs.onBlur(event);
}
</script>

<template>
  <div class="rounded-md border border-input bg-background">
    <ClientOnly>
      <echo-editor
        :id="id"
        :extensions="extensions"
        v-model="content"
        @blur="handleBlur"
        v-bind="$attrs"
      />
    </ClientOnly>
  </div>
</template>

<style scoped>
:deep(.echo-editor .ProseMirror) {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
  min-height: 200px;
  padding: 12px;
}
:deep(.echo-editor .ProseMirror::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}
:deep(.echo-editor .ProseMirror::-webkit-scrollbar-track) {
  background: #f1f5f9;
  border-radius: 4px;
}
:deep(.echo-editor .ProseMirror::-webkit-scrollbar-thumb) {
  background: #cbd5e1;
  border-radius: 4px;
}
:deep(.echo-editor .tiptap) {
  min-height: 200px;
}
:deep(.echo-editor .ProseMirror:focus) {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}
</style>
