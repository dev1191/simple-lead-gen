<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  CalendarIcon,
  ClockIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ImageIcon,
} from "lucide-vue-next";

import { BlogCategories } from "~/shared/constants";
import { useBlogPosts } from "~/composables/useBlogPosts";
import BlogCardSkeleton from "./BlogCardSkeleton.vue";

// composable
const {
  posts,
  loading,
  totalCount,
  currentPage,
  pageSize,
  totalPages,
  fetchPosts,
  changePage,
  updateFilter,
} = useBlogPosts();

// Category state
const activeCategory = ref("all");
const categories = [{ value: "all", label: "All" }, ...BlogCategories];

// Computed
const paginatedPosts = computed(() => posts.value);

// Handle category filter
const setActiveCategory = (categoryId: string) => {
  activeCategory.value = categoryId;
  if (categoryId === "all") {
    updateFilter("category", "");
  } else {
    updateFilter("category", categoryId);
  }
};

// Pagination
const goToPage = (page: number) => {
  changePage(page);
  document.querySelector(".container")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

// Utils
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    "Business Registration": "bg-blue-100 text-blue-800",
    "AI Tools": "bg-purple-100 text-purple-800",
    "Banking & Finance": "bg-green-100 text-green-800",
    "Legal & Compliance": "bg-red-100 text-red-800",
    Marketing: "bg-pink-100 text-pink-800",
    Funding: "bg-yellow-100 text-yellow-800",
  };
  return colors[category] || "bg-gray-100 text-gray-800";
};

const navigateToPost = async (slug: string) => {
  await navigateTo(`/insights/${slug}`);
};

// Lifecycle
onMounted(() => {
  fetchPosts();
});
</script>

<template>
  <div class="bg-gray-50">
    <!-- Category Navigation -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex flex-wrap justify-center items-center gap-20">
          <Button
            v-for="category in categories"
            :key="category.value"
            :variant="activeCategory === category.value ? 'default' : 'outline'"
            :class="[
              'px-4 py-2 rounded-md transition-colors',
              activeCategory === category.value
                ? 'bg-orange-500 hover:bg-orange-600 text-white font-semibold'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold',
            ]"
            @click="setActiveCategory(category.value)"
          >
            {{ category.label }}
          </Button>
        </div>
      </div>
    </div>

    <!-- Blog Posts Grid -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Show Skeletons while loading -->
        <template v-if="loading">
          <BlogCardSkeleton v-for="i in 6" :key="i" />
        </template>
        <template v-else>
          <Card
            v-for="post in paginatedPosts"
            :key="post.id"
            class="overflow-hidden hover:shadow-lg py-0 transition-shadow duration-300 cursor-pointer group"
            @click="navigateToPost(post.slug)"
          >
            <div class="relative">
              <!-- Placeholder Image -->
              <div
                class="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden rounded-md"
              >
                <template v-if="post.image_url">
                  <img
                    :src="post.image_url"
                    alt="Post Image"
                    class="w-full h-full object-cover"
                  />
                </template>
                <template v-else>
                  <ImageIcon class="w-12 h-12 text-gray-400" />
                </template>
              </div>
              <!-- Category Badge -->
              <Badge
                :class="getCategoryColor(post.category)"
                class="absolute top-3 left-3 text-xs px-2 py-1"
              >
                {{ post.category }}
              </Badge>
            </div>

            <CardContent class="p-6">
              <div class="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <div class="flex items-center gap-1">
                  <CalendarIcon class="w-4 h-4" />
                  {{ formatDate(post.created_at) }}
                </div>
                <!-- <div class="flex items-center gap-1">
                <ClockIcon class="w-4 h-4" />
                {{ post.readTime }}
              </div> -->
              </div>

              <h3
                class="text-xl font-semibold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2"
              >
                {{ post.title }}
              </h3>

              <p
                class="text-gray-600 mb-4 line-clamp-3 prose prose-sm max-w-none"
                v-html="post.content"
              ></p>

              <Button
                variant="ghost"
                class="text-orange-600 hover:text-orange-700 hover:bg-orange-50 p-0 h-auto font-medium"
                @click.stop="navigateToPost(post.slug)"
              >
                Read More
                <ArrowRightIcon
                  class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                />
              </Button>
            </CardContent>
          </Card>
        </template>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center items-center gap-2" v-if="totalPages > 1">
        <Button
          variant="outline"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
          class="px-3 py-2"
        >
          <ChevronLeftIcon class="w-4 h-4" />
          Previous
        </Button>

        <div class="flex gap-1">
          <Button
            v-for="page in visiblePages"
            :key="page"
            :variant="currentPage === page ? 'default' : 'outline'"
            :class="[
              'px-3 py-2 min-w-[40px]',
              currentPage === page
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'text-gray-700 hover:bg-gray-100',
            ]"
            @click="goToPage(page)"
          >
            {{ page }}
          </Button>
        </div>

        <Button
          variant="outline"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
          class="px-3 py-2"
        >
          Next
          <ChevronRightIcon class="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
