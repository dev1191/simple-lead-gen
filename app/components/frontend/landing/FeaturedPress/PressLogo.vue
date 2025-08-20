
<script setup lang="ts">
interface Press {
  id: string
  name: string
  logo: string
  color: string
}

defineProps<{
  press: Press
}>()
</script>

<template>
  <div class="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity duration-200">
    <span class="text-xl" :class="press.color">{{ press.logo }}</span>
    <span class="text-gray-600 font-medium text-sm">{{ press.name }}</span>
  </div>
</template>
