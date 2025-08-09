<script setup lang="ts">
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogScrollContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const props = defineProps<{
  open: boolean;
  mode?: "create" | "edit";
  title?: string;
  description?: string;
  size?: string; // fixed sizes
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
}>();

// Map sizes to Tailwind classes
const sizeClasses: Record<string, string> = {
  sm: "md:max-w-sm",
  md: "md:max-w-md",
  lg: "md:max-w-lg",
  xl: "md:max-w-xl",
  two: "md:max-w-2xl",
  three: "md:max-w-3xl",
  four: "md:max-w-4xl",
  five: "md:max-w-5xl",
  six: "md:max-w-6xl",
  seven: "md:max-w-7xl",
  full: "max-w-full",
};
</script>

<template>
  <Dialog :open="props.open" @update:open="(val) => emit('update:open', val)">
    <DialogScrollContent class="sm:max-w-[425px]">
      <DialogContent
        :class="sizeClasses[props.size || 'md']"
        :onInteractOutside="
          (e) => {
            e.preventDefault();
          }
        "
      >
        <DialogHeader class="text-left">
          <DialogTitle>
            {{
              props.title ||
              (props.mode === "edit" ? "Edit Item" : "Create Item")
            }}
          </DialogTitle>
          <DialogDescription>
            {{
              props.description ||
              (props.mode === "edit" ? "Update item details." : "Add new item.")
            }}
          </DialogDescription>
        </DialogHeader>

        <slot />

        <DialogFooter class="mt-4 flex justify-end gap-3">
          <DialogClose as-child>
            <Button type="button" variant="outline"> Close </Button>
          </DialogClose>

          <slot name="footer"></slot>
        </DialogFooter>
      </DialogContent>
    </DialogScrollContent>
  </Dialog>
</template>
