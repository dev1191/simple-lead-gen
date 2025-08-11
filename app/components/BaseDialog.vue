<script setup lang="ts">
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const props = defineProps<{
  open: boolean;
  mode?: "create" | "edit" | "view";
  title?: string;
  description?: string;
  size?: string;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "interact-outside", event: Event): void;
}>();

// Map sizes to Tailwind classes
const sizeClasses: Record<string, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md", 
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  two: "sm:max-w-2xl",
  three: "sm:max-w-3xl",
  four: "sm:max-w-4xl",
  five: "sm:max-w-5xl",
  six: "sm:max-w-6xl",
  seven: "sm:max-w-7xl",
  full: "max-w-full",
};
</script>

<template>
  <Dialog :open="open" @update:open="(val) => emit('update:open', val)">
    <DialogContent
      :class="[sizeClasses[size || 'md'], 'max-h-[90vh] flex flex-col p-0']"
      @interact-outside="(e) => emit('interact-outside', e)"
    >
      <!-- Fixed Header -->
      <DialogHeader class="px-6 pt-6 pb-4 border-b flex-shrink-0">
        <DialogTitle class="text-left">
          {{ title || (mode === "edit" ? "Edit Item" : "Create Item") }}
        </DialogTitle>
        <DialogDescription v-if="description" class="text-left">
          {{ description || (mode === "edit" ? "Update item details." : "Add new item.") }}
        </DialogDescription>
      </DialogHeader>

      <!-- Scrollable Content Area -->
      <div class="flex-1 overflow-y-auto px-6 py-4">
        <slot />
      </div>

      <!-- Fixed Footer -->
      <DialogFooter class="px-6 pb-6 pt-4 border-t flex-shrink-0 flex justify-end gap-3">
        <DialogClose as-child>
          <Button type="button" variant="outline">Close</Button>
        </DialogClose>
        <slot name="footer" />
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
