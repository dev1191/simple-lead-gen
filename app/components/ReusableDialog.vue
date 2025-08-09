<script setup lang="ts">
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";

const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, required: false },
  width: { type: String, required: false, default: '425px' }, // default width
  persistent: { type: Boolean, required: false, default: false }, // persistent prop
});
</script>


<template>
  <Dialog >
    <DialogTrigger asChild>
      <slot name="trigger" />
    </DialogTrigger>
    <DialogContent
      :style="{ maxWidth: props.width }"
    class="w-full"
      :onInteractOutside="persistent ? (e) => e.preventDefault() : undefined"
    >
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription v-if="description">{{ description }}</DialogDescription>
        <DialogClose class="btn-close" />
      </DialogHeader>
      <slot />
    </DialogContent>
  </Dialog>
</template>
