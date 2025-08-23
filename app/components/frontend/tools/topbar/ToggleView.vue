<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { LayoutGrid, List } from "lucide-vue-next"

const props = defineProps<{
  modelValue: "grid" | "list"
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: "grid" | "list"): void
}>()

const toggle = (v: "grid" | "list") => {
  emit("update:modelValue", v)
}
</script>

<template>
  <div class="flex gap-2">
    <Button
      variant="outline"
      size="icon"
      :class="props.modelValue === 'grid' ? 'bg-orange-600 text-white' : ''"
      @click="toggle('grid')"
    >
      <LayoutGrid class="w-4 h-4" />
    </Button>

    <Button
      variant="outline"
      size="icon"
      :class="props.modelValue === 'list' ? 'bg-orange-600 text-white' : ''"
      @click="toggle('list')"
    >
      <List class="w-4 h-4" />
    </Button>
  </div>
</template>
