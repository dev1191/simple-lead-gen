<script setup lang="ts">
import type { Table } from "@tanstack/vue-table";
import { Download, Search } from "lucide-vue-next";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "~/components/ui/select";
import Icon from "~/components/Icon.vue";
import type { Vendor } from "~/shared/types/vendor";
import jsonToCsvExport from "json-to-csv-export";
import { format, parseISO } from "date-fns";

interface DataTableToolbarProps {
  table: Table<Vendor>;
  globalFilter: string;
  statusFilter: string;
  isFiltered: boolean;
  data: Vendor[];
}

const props = defineProps<DataTableToolbarProps>();

// Emit event to update parent filter
const emit = defineEmits<{
  (e: "update:globalFilter", value: string): void;
  (e: "update:statusFilter", value: string): void;
  (e: "resetFilters"): void;
}>();

// Local reactive copy of globalFilter
const localFilter = ref(props.globalFilter);
const status = ref(props.statusFilter || "");

// Watch for prop changes to update localFilter
watch(
  () => [props.globalFilter, props.statusFilter],
  ([globalVal, statusVal, categoryVal]) => {
    localFilter.value = globalVal;
    status.value = statusVal;
  }
);

// Emit update when localFilter changes (debounce if needed)
// Emit updates when either localFilter or status changes
watch([localFilter, status], ([newFilter, newStatus, newCategory]) => {
  emit("update:globalFilter", newFilter);
  emit("update:statusFilter", newStatus);
});

function onResetFilters() {
  emit("resetFilters");
}

//"created_at":"2025-08-22T06:46:41.354569+00:00","status":"Active","":0}

const formatData = computed(() =>
  props.data.map((vendor) => ({
    ...vendor,
    created_at: vendor.created_at
      ? format(parseISO(vendor.created_at), "yyyy-MM-dd hh:mm a")
      : "",
  }))
);

const headers = [
  { key: "name", label: "Vendor Name" },
  { key: "email", label: "Vendor Email" },
  { key: "total_leads", label: "Total Leads" },
  { key: "monthly_leads", label: "Monthly Leads" },
  { key: "service_listed", label: "Service Listed" },
  { key: "status", label: "Status" },
  { key: "created_at", label: "Created At" },
];
const downloadCSV = () => {
  jsonToCsvExport({ data: formatData.value, headers, filename: "vendors" });
};
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
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
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
    <Button
      @click="downloadCSV"
      variant="outline"
      class="w-30 h-7 text-sm font-semibold"
      ><Icon name="Download" /> Export CSV</Button
    >
  </div>
</template>
