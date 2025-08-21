<script setup lang="ts">
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

const options = ["Most Popular", "Highest Rated", "Newest", "Price: Low to High", "Price: High to Low"]
</script>

<template>
  <Select>
    <SelectTrigger class="w-44">
      <SelectValue placeholder="Sort by" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem v-for="o in options" :key="o" :value="o">{{ o }}</SelectItem>
    </SelectContent>
  </Select>
</template>
