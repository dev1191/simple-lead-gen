<script setup lang="ts">
import type { BlogPost } from "~/shared/types/blogPost";
import type { Table } from "@tanstack/vue-table";
import { Search } from "lucide-vue-next";
import { ref, watch } from "vue";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "~/components/ui/select";
import Icon from "~/components/Icon.vue";

interface DataTableToolbarProps {
  table: Table<BlogPost>;
  globalFilter: string;
  statusFilter: string;
  categoryFilter: string;
  isFiltered:boolean;
}

const props = defineProps<DataTableToolbarProps>();

// Emit event to update parent filter
const emit = defineEmits<{
  (e: "update:globalFilter", value: string): void;
  (e: "update:statusFilter", value: string): void;
  (e: "update:categoryFilter", value: string): void;
  (e:'resetFilters'):void;
}>();

// Local reactive copy of globalFilter
const localFilter = ref(props.globalFilter);
const status = ref(props.statusFilter || "");
const category = ref(props.categoryFilter || "");

// Watch for prop changes to update localFilter
watch(
  () => [props.globalFilter, props.statusFilter, props.categoryFilter],
  ([globalVal, statusVal, categoryVal]) => {
    localFilter.value = globalVal;
    status.value = statusVal;
    category.value = categoryVal;
  }
);

// Emit update when localFilter changes (debounce if needed)
// Emit updates when either localFilter or status changes
watch(
  [localFilter, status, category],
  ([newFilter, newStatus, newCategory]) => {
    emit("update:globalFilter", newFilter);
    emit("update:statusFilter", newStatus);
    emit("update:categoryFilter", newCategory);
  }
);

function onResetFilters() {
  emit('resetFilters');
}

</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center space-x-2">
      <div class="relative w-full items-center">
        <Input
          id="search"
          type="text"
          placeholder="Search articles..."
          class="pl-10"
          v-model="localFilter"
        />
        <span
          class="absolute left-0 inset-y-0 flex items-center justify-center px-2"
        >
          <Search class="w-4 h-4 text-muted-foreground" />
        </span>
      </div>

      <Select v-model="status">
        <SelectTrigger>
          <SelectValue placeholder="Select a Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="Published">Published</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select v-model="category">
        <SelectTrigger>
          <SelectValue placeholder="Select a Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="Tips">Tips</SelectItem>
            <SelectItem value="Guides">Guides</SelectItem>
            <SelectItem value="Announments">Announments</SelectItem>
            <SelectItem value="Industry News">Industry News</SelectItem>
            <SelectItem value="Case Study">Case Study</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Button
        v-if="isFiltered"
        variant="ghost"
        class="h-8 px-2 lg:px-3"
        @click="onResetFilters"
      >
        Reset
        <Icon name="X" class="ml-2 h-4 w-4" />
      </Button>
    </div>
  </div>
</template>
