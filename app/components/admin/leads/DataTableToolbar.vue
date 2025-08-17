<script setup lang="ts">
import type { Table } from "@tanstack/vue-table";
import { Search } from "lucide-vue-next";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "~/components/ui/select";
import Icon from "~/components/Icon.vue";
import type { Service } from "~/shared/types/service";

interface DataTableToolbarProps {
  table: Table<Service>;
  globalFilter: string;
  statusFilter: boolean;
  isFiltered: boolean;
}

const props = defineProps<DataTableToolbarProps>();

// Emit event to update parent filter
const emit = defineEmits<{
  (e: "update:globalFilter", value: string): void;
  (e: "update:statusFilter", value: boolean): void;
  (e: "resetFilters"): void;
}>();

// Local reactive copy of globalFilter
const localFilter = ref(props.globalFilter);
const status = ref(props.statusFilter || false);

// Watch for prop changes to update localFilter
watch(
  () => [props.globalFilter, props.statusFilter],
  ([globalVal, statusVal]) => {
    localFilter.value = globalVal;
    status.value = statusVal;
  }
);

// Emit update when localFilter changes (debounce if needed)
// Emit updates when either localFilter or status changes
watch([localFilter, status], ([newFilter, newStatus]) => {
  emit("update:globalFilter", newFilter);
  emit("update:statusFilter", newStatus);
});

function onResetFilters() {
  emit("resetFilters");
}
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center space-x-2">
      <div class="relative w-full items-center">
        <Input
          id="search"
          type="text"
          placeholder="Search leads..."
          class="pl-10"
          v-model="localFilter"
        />
        <span
          class="absolute left-0 inset-y-0 flex items-center justify-center px-2"
        >
          <Search class="w-4 h-4 text-muted-foreground" />
        </span>
      </div>

      <!-- <Select v-model="status">
        <SelectTrigger>
          <SelectValue placeholder="Select a Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem :value="true">Active</SelectItem>
            <SelectItem :value="false">Paused</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select> -->

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
