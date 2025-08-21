

<script setup lang="ts">
import { Search, SlidersHorizontal, LayoutGrid, List } from 'lucide-vue-next'

defineProps<{
  filteredCount: number
}>()

const emit = defineEmits<{
  'toggle-filters': []
}>()

const { searchQuery, sortBy } = useServices()
const viewMode = ref('grid')

const toggleView = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}
</script>


<template>
  <div class="border-b bg-white">
    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col lg:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              v-model="searchQuery"
              placeholder="Search services, industries, or solutions..."
              class="pl-10 h-12"
            />
          </div>
        </div>
        <div class="flex gap-3">
          <Select v-model="sortBy">
            <SelectTrigger class="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Most Popular">Most Popular</SelectItem>
              <SelectItem value="Price: Low to High">Price: Low to High</SelectItem>
              <SelectItem value="Price: High to Low">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" @click="toggleView">
            <component :is="viewMode === 'grid' ? List : LayoutGrid" class="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div class="mt-4 flex items-center justify-between">
        <p class="text-sm text-gray-600">{{ filteredCount }} services found</p>
        <Button variant="link" class="text-sm" @click="$emit('toggle-filters')">
          <SlidersHorizontal class="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>
    </div>
  </div>
</template>