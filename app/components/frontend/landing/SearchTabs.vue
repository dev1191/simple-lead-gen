<script setup lang="ts">
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, Search } from "lucide-vue-next";

const activeTab = ref("services");
const searchQuery = ref("");
const country = ref("");
const suggestions = ref<string[]>([]);
const showSuggestions = ref(false);
const isSearching = ref(false);
let debounceTimeout: number | undefined;

// Function to fetch suggestions from API
const fetchSuggestions = async (q: string) => {
  try {
    const data = await $fetch(`/api/${activeTab.value}/search`, {
      params: { q },
    });
    // Supabase returns { service_name }
    suggestions.value = (data as any[]).map((s) =>
      activeTab.value === "services" ? s.service_name : s.name
    );
  } catch (err) {
    console.error("Error fetching suggestions:", err);
    suggestions.value = [];
  }
};

// Load initial 10 records when component mounts
fetchSuggestions("");
watch(activeTab, (newTab) => {
  // Reset search query and suggestions when tab changes
  searchQuery.value = "";
  suggestions.value = [];
  showSuggestions.value = false;
  // Fetch initial suggestions for the new tab
  fetchSuggestions("");
});

// Watch searchQuery with debounce
watch(searchQuery, (val) => {
  clearTimeout(debounceTimeout);

  debounceTimeout = window.setTimeout(() => {
    fetchSuggestions(val || ""); // if empty, fetch initial records
  }, 300);
});

const onSearch = () => {
  isSearching.value = true;
  const path = activeTab.value === "services" ? "/services" : "/tools";

  navigateTo({
    path,
    query: {
      search: searchQuery.value,
      country: country.value,
    },
  });

  showSuggestions.value = false;
  isSearching.value = false;
};
const dropdownRef = ref<HTMLElement | null>(null);
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showSuggestions.value = false;
  }
};

onMounted(() => document.addEventListener("click", handleClickOutside));
onBeforeUnmount(() =>
  document.removeEventListener("click", handleClickOutside)
);
</script>

<template>
  <div class="max-w-7xl mx-auto pb-6 bg-white shadow rounded-xl">
    <!-- Tabs -->
    <Tabs v-model="activeTab" class="w-full">
      <TabsList class="grid grid-cols-2 w-full rounded-lg overflow-hidden h-12">
        <TabsTrigger
          value="services"
          class="data-[state=active]:bg-orange-500 data-[state=active]:text-white bg-white font-semibold"
        >
          Services
        </TabsTrigger>
        <TabsTrigger
          value="tools"
          class="data-[state=active]:bg-orange-500 data-[state=active]:text-white bg-white font-semibold"
        >
          SaaS & AI Tools
        </TabsTrigger>
      </TabsList>

      <!-- Tab Content -->
      <TabsContent value="services" class="mt-4 bg-white">
        <div
          class="flex flex-col gap-3 px-4 md:flex-row md:items-center md:gap-2"
        >
          <!-- Search Input -->
          <div
            class="relative flex-1 w-full overflow-visible"
            ref="dropdownRef"
          >
            <Input
              v-model="searchQuery"
              @focus="showSuggestions = true"
              placeholder="Search for services, tools, or solutions..."
              class="pl-10 h-11 w-full"
            />

            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            />

            <div
              v-if="showSuggestions && suggestions.length"
              class="absolute top-full left-0 w-full mt-1 bg-white border rounded-md shadow-lg max-h-100 overflow-y-auto z-50"
            >
              <ul>
                <li
                  v-for="item in suggestions"
                  :key="item"
                  class="px-4 py-2 font-semibold hover:bg-gray-100 cursor-pointer w-full text-left"
                  @mousedown.prevent="
                    searchQuery = item;
                    showSuggestions = true;
                  "
                >
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Country Select -->
          <Select v-model="country">
            <SelectTrigger class="min-w-fullmd:min-w-[150px] min-h-11">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="malaysia">Malaysia</SelectItem>
              <SelectItem value="singapore">Singapore</SelectItem>
            </SelectContent>
          </Select>

          <!-- Search Button -->
          <Button
            @click="onSearch"
            class="bg-orange-500 hover:bg-orange-600 text-white px-6 rounded-lg w-full h-11 md:w-auto"
          >
            <Search class="w-4 h-4" /> Search
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="tools" class="mt-4">
        <div
          class="flex flex-col gap-3 px-4 md:flex-row md:items-center md:gap-2"
        >
          <!-- Search Input -->
          <div class="relative flex-1 w-full" ref="dropdownRef">
            <Input
              v-model="searchQuery"
              @focus="showSuggestions = true"
              placeholder="Search for services, tools, or solutions..."
              class="pl-10 h-11 w-full"
            />

            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            />

            <div
              v-if="showSuggestions && suggestions.length"
              class="absolute top-full left-0 w-full mt-1 bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto z-10"
            >
              <ul>
                <li
                  v-for="item in suggestions"
                  :key="item"
                  class="px-4 py-2 font-semibold hover:bg-gray-100 cursor-pointer w-full text-left"
                  @mousedown.prevent="
                    searchQuery = item;
                    showSuggestions = true;
                  "
                >
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Country Select -->
          <Select v-model="country">
            <SelectTrigger class="min-w-full md:min-w-[150px] min-h-11">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="malaysia">Malaysia</SelectItem>
              <SelectItem value="singapore">Singapore</SelectItem>
            </SelectContent>
          </Select>

          <!-- Search Button -->
          <Button
            type="submit"
            @click="onSearch"
            :disabled="isSearching"
            class="bg-orange-500 hover:bg-orange-600 text-white px-6 rounded-lg w-full h-11 md:w-auto"
          >
            <Loader2 v-if="isSearching" class="w-4 h-4 mr-2 animate-spin" />
            <Search v-else class="w-4 h-4" /> Search
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>
