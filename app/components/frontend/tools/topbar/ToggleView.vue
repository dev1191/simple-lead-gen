<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { LayoutGrid, List } from "lucide-vue-next"

const view = ref<"grid" | "list">("grid")

const toggle = (v: "grid" | "list") => {
  view.value = v
}
</script>

<template>
  <div class="flex gap-2">
    <Button
      variant="outline"
      size="icon"
      :class="view === 'grid' ? 'bg-orange-600 text-white' : ''"
      @click="toggle('grid')"
    >
      <LayoutGrid class="w-4 h-4 " />
    </Button>

    <Button
      variant="outline"
      size="icon"
      :class="view === 'list' ? 'bg-orange-600 text-white' : ''"
      @click="toggle('list')"
    >
      <List class="w-4 h-4 " />
    </Button>
  </div>
</template>
