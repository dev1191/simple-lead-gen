<script setup lang="ts">
import {
  useVueTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  FlexRender,
  type ColumnDef,
} from "@tanstack/vue-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DataTableToolbar from "./DataTableToolbar.vue";
import { ref, reactive, watch, watchEffect, onMounted, computed } from "vue";
import type { Business } from "~/shared/types/business";


interface BusinesssComposable {
  businesss: any;
  loading: any;
  totalCount: any;
  currentPage: any;
  pageSize: any;
  sort: any;
  filters: any;
  fetchBusiness: () => Promise<void>;
  resetFilters: () => Promise<void>;
  updateSearch: (term: string) => void;
  updateFilter: (key: string, value: any) => void;
  updateSort: (field: string, order: "asc" | "desc") => void;
  changePage: (page: number) => void;
}

interface DataTableProps {
  columns: ColumnDef<Business, any>[];
  businesss: BusinesssComposable;
}

const props = defineProps<DataTableProps>();
const { businesss, columns } = props;

// Local reactive filter states synced with composable filters
const globalFilter = ref(businesss.filters.value.search || "");
// Sync local filters → composable filters and fetch businesss
watch(globalFilter, (val) => {
  businesss.updateSearch(val);
});



// Sync composable filters → local filters (in case updated externally)
watch(
  () => businesss.filters.value.search,
  (val) => {
    if (val !== globalFilter.value) globalFilter.value = val;
  }
);



// Reactive table state to keep useVueTable stable and synced
const tableState = reactive({
  sorting: [
    {
      id: businesss.sort.value.field,
      desc: businesss.sort.value.order === "desc",
    },
  ],
  pagination: {
    pageIndex: businesss.currentPage.value - 1,
    pageSize: businesss.pageSize.value,
  },
  globalFilter: globalFilter.value,
});
const data = computed(() => businesss.businesses.value || []);

// Create the table instance with computed data
const table = useVueTable({
  get data() {
    return data.value;
  },
  get columns() {
    return columns;
  },
  state: tableState,
  manualSorting: true,
  manualPagination: true,
  manualFiltering: true,
  pageCount: Math.ceil(businesss.totalCount.value / businesss.pageSize.value),
  onSortingChange: (updater) => {
    const newSorting =
      typeof updater === "function" ? updater(tableState.sorting) : updater;
    if (newSorting.length > 0) {
      const { id, desc } = newSorting[0];
      businesss.updateSort(id, desc ? "desc" : "asc");
      tableState.sorting = newSorting;
    }
  },
  onPaginationChange: (updater) => {
    const newPagination =
      typeof updater === "function" ? updater(tableState.pagination) : updater;
    businesss.changePage(newPagination.pageIndex + 1);
    tableState.pagination = newPagination;
  },
  onGlobalFilterChange: (val) => {
    globalFilter.value = val;
    businesss.updateSearch(val);
    tableState.globalFilter = val;
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
});

// Keep table state synced with composable's reactive values:
watchEffect(() => {
  tableState.sorting = [
    {
      id: businesss.sort.value.field,
      desc: businesss.sort.value.order === "desc",
    },
  ];
  tableState.pagination = {
    pageIndex: businesss.currentPage.value - 1,
    pageSize: businesss.pageSize.value,
  };
  tableState.globalFilter = globalFilter.value;
});

// Computed to check if any filter is active
const isFiltered = computed(() => {
  return (
    globalFilter.value.trim() !== ""
  );
});

// Reset all filters and reload data
const onResetFilters = async () => {
  globalFilter.value = "";
  await businesss.resetFilters();
};

onMounted(() => {
  businesss.fetchBusiness();
});
</script>

<template>
  <div class="space-y-4">
    <!-- Toolbar with global search, status and category filters -->
    <DataTableToolbar
      :table="table"
      :globalFilter="globalFilter"
      @update:globalFilter="(val) => (globalFilter = val)"
      :isFiltered="isFiltered"
      @resetFilters="onResetFilters"
      :data="data"
    />


    <!-- Table -->
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <TableRow :data-state="row.getIsSelected() && 'selected'">
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                  <FlexRender
                    :render="cell.column.columnDef.cell"
                    :props="cell.getContext()"
                  />
                </TableCell>
              </TableRow>
              <TableRow v-if="row.getIsExpanded()">
                <TableCell :colspan="row.getAllCells().length">
                  {{ JSON.stringify(row.original) }}
                </TableCell>
              </TableRow>
            </template>
          </template>

          <TableRow v-else>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between px-2">
      <div class="flex-1 text-sm text-muted-foreground">
        {{ table.getFilteredSelectedRowModel().rows.length }} of
        {{ table.getFilteredRowModel().rows.length }} row(s) selected.
      </div>
      <div class="flex items-center space-x-6 lg:space-x-8">
        <div class="flex items-center space-x-2">
          <p class="text-sm font-medium">Rows per page</p>
          <select
            :value="table.getState().pagination.pageSize"
            @change="table.setPageSize(Number($event.target.value))"
            class="h-8 w-[70px] rounded-md border border-input bg-background px-2 py-1 text-sm"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
          </select>
        </div>
        <div
          class="flex w-[100px] items-center justify-center text-sm font-medium"
        >
          Page {{ table.getState().pagination.pageIndex + 1 }} of
          {{ table.getPageCount() }}
        </div>
        <div class="flex items-center space-x-2">
          <button
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
            :disabled="!table.getCanPreviousPage()"
            @click="table.previousPage()"
          >
            Previous
          </button>
          <button
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
            :disabled="!table.getCanNextPage()"
            @click="table.nextPage()"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
