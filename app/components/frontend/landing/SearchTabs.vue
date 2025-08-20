<script setup lang="ts">
import { ref } from "vue";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search } from "lucide-vue-next";

const activeTab = ref("services");
const searchQuery = ref("");
const country = ref("");
const suggestions = ref([
  "Business Registration",
  "Legal Services",
  "Accounting",
  "Tax Filing",
  "Trademark",
]);
const showSuggestions = ref(false);

const onSearch = () => {
  console.log("Searching:", {
    tab: activeTab.value,
    searchQuery: searchQuery.value,
    country: country.value,
  });
  showSuggestions.value = false;
};
</script>

<template>
  <div class="max-w-7xl mx-auto pb-6 bg-white shadow rounded-xl">
    <!-- Tabs -->
    <Tabs v-model="activeTab" class="w-full">
      <TabsList
        class="grid grid-cols-2 w-full rounded-lg overflow-hidden h-12"
      >
        <TabsTrigger
          value="services"
          class="data-[state=active]:bg-orange-500 data-[state=active]:text-white bg-white font-semibold"
        >
          Services
        </TabsTrigger>
        <TabsTrigger
          value="saas"
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
          <div class="relative flex-1 w-full">
            <Input
              v-model="searchQuery"
              @focus="showSuggestions = true"
              @blur="setTimeout(() => (showSuggestions = false), 150)"
              placeholder="Search for services, tools, or solutions..."
              class="pl-10 w-full"
            />
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            />

            <!-- Suggestions Dropdown -->
            <div
              v-if="showSuggestions && searchQuery"
              class="absolute top-full left-0 w-full mt-1 bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto z-10"
            >
              <ul>
                <li
                  v-for="item in suggestions"
                  :key="item"
                  class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  @mousedown.prevent="
                    searchQuery = item;
                    showSuggestions = false;
                  "
                >
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Country Select -->
          <Select v-model="country">
            <SelectTrigger class="min-w-full md:min-w-[150px]">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="my">Malaysia</SelectItem>
              <SelectItem value="sg">Singapore</SelectItem>
            </SelectContent>
          </Select>

          <!-- Search Button -->
          <Button
            @click="onSearch"
            class="bg-orange-500 hover:bg-orange-600 text-white px-6 rounded-lg w-full md:w-auto"
          >
            Search
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="saas" class="mt-4">
        <p class="text-gray-500">Search SaaS & AI Tools here...</p>
      </TabsContent>
    </Tabs>
  </div>
</template>
