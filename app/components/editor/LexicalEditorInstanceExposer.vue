<script setup lang="ts">
import { useLexicalComposer } from 'lexical-vue';
import type { LexicalEditor } from 'lexical';

const model = defineModel<LexicalEditor | null>({ required: true });

const editor = useLexicalComposer();

model.value = editor;
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template />