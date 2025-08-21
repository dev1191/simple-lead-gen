<script setup lang="ts">
import { Input } from "@/components/ui/input"
import { Search } from "lucide-vue-next"
</script>

<template>
  <div class="relative w-full max-w-md">
    <Search class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
    <Input
      type="text"
      placeholder="Search services, industries, or solutions..."
      class="pl-8"
    />
  </div>
</template>
