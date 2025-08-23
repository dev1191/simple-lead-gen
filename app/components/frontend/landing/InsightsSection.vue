<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-vue-next";
import { useFetch } from "#app"; // Nuxt 3 composable
import type { BlogPost } from "~/shared/types/blogPost";


// Fetch latest blog posts from API
const { data: insights, pending, error } = await useFetch<BlogPost[]>(
  "/api/insights/latest"
);

// Format date function
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Handle article click
const handleArticleClick = (article: BlogPost) => {
  navigateTo(`/insights/${article.slug}`);
};
</script>

<template>
  <div class="w-full bg-gray-50 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header Section -->
      <div class="animate-fade-in-up animation-delay-200">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            Latest Business Insights
          </h2>
          <p class="text-gray-600 text-lg">
            Stay ahead with expert tips and industry trends
          </p>
        </div>
      </div>

      <!-- Loader -->
      <div v-if="pending" class="text-center text-gray-500 py-10">
        Loading latest insights...
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center text-red-500 py-10">
        Failed to load insights.
      </div>

      <!-- Insights Grid -->
      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <Card
          v-for="article in insights"
          :key="article.id"
          class="bg-white p-0 hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
          @click="handleArticleClick(article)"
        >
          <CardContent class="p-0">
            <!-- Image -->
            <div
              class="relative h-48 flex items-center justify-center bg-gray-100"
            >
              <img
                v-if="article.image_url"
                :src="article.image_url"
                alt="Article banner"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold"
              >
                {{ article.title }}
              </div>
            </div>

            <!-- Content -->
            <div class="p-6">
              <!-- Category and Date -->
              <div class="flex justify-between items-center mb-4">
                <Badge
                  variant="secondary"
                  class="text-xs font-medium px-3 py-1"
                >
                  {{ article.category || "General" }}
                </Badge>
                <span class="text-sm text-gray-500">
                  {{ formatDate(article.created_at) }}
                </span>
              </div>

              <!-- Title -->
              <h3
                class="text-lg font-semibold text-gray-900 mb-4 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300"
              >
                {{ article.title }}
              </h3>

              <!-- Footer -->
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500">
             
                </span>
                <button
                  class="text-orange-500 hover:text-orange-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all duration-300"
                >
                  Read More
                  <ChevronRight class="w-4 h-4" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
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
</style>
