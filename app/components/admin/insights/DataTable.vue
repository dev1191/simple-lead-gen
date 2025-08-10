<script setup lang="ts">
import {
  useVueTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  FlexRender,
  createColumnHelper,
  type ColumnDef,
} from "@tanstack/vue-table";
import {
  Search,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Plus,
} from "lucide-vue-next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { BlogArticle } from "~/shared/types/blogArticle";

const { posts, total, loading, fetchPosts } = useBlogPosts();

// Filters
const globalFilter = ref("");
const statusFilter = ref("");
const categoryFilter = ref("");
const page = ref(1);
const limit = ref(10);
const search = ref("");
const sort = ref({ column: "created_at", order: "desc" });

watch([page, limit, search, sort], () => {
  fetchPosts();
});

// Mock data - replace with your Supabase data
const blogArticles = ref(posts);

onMounted(() => {
  fetchPosts();
});

// Column helper
const columnHelper = createColumnHelper<BlogArticle>();

// Define columns
const columns: ColumnDef<BlogArticle>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "author",
    header: "Author",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
// Filtered data based on filters
const filteredData = computed(() => {
  let filtered = blogArticles.value;

  if (statusFilter.value) {
    filtered = filtered.filter(
      (Article) => Article.status === statusFilter.value
    );
  }

  if (categoryFilter.value) {
    filtered = filtered.filter(
      (Article) => Article.category === categoryFilter.value
    );
  }

  return filtered;
});

// Table configuration
const table = useVueTable({
  get data() {
    return filteredData.value;
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  state: {
    get globalFilter() {
      return globalFilter.value;
    },
  },
  onGlobalFilterChange: (value) => {
    globalFilter.value = value;
  },
  globalFilterFn: (row, columnId, value) => {
    const search = value.toLowerCase();
    const title = row.original.title.toLowerCase();
    const content = row.original.content.toLowerCase();
    const author = row.original.author.toLowerCase();

    return (
      title.includes(search) ||
      content.includes(search) ||
      author.includes(search)
    );
  },
});

// Watch for global filter changes
watch(globalFilter, (newValue) => {
  table.setGlobalFilter(newValue);
});
</script>

<template>
  <div class="w-full space-y-4">
    <!-- Header with Search and Add Button -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <div class="relative">
          <Search
            class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"
          />
          <input
            v-model="globalFilter"
            placeholder="Search Articles..."
            class="pl-8 h-9 w-[300px] rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <select
          v-model="statusFilter"
          class="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <select
          v-model="categoryFilter"
          class="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">All Categories</option>
          <option value="Tips">Tips</option>
          <option value="Guides">Guides</option>
          <option value="Announments">Announments</option>
          <option value="Industry News">Industry News</option>
          <option value="Case Study">Case Study</option>
        </select>
      </div>
    </div>

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
