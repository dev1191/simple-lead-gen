<script setup lang="ts">
import {
  Calendar,
  Clock,
  BookOpen,
  Tag,
  Share2,
  ImageIcon,
} from "lucide-vue-next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ShareSection from "~/components/frontend/insights/ShareSection.vue";
import type { BlogPost } from "~/shared/types/blogPost";

const route = useRoute();

const { data: pageData } = await useFetch(`/api/insights/${route.params.slug}`);

// Default data based on your screenshot
const post: BlogPost = pageData.value.data;
const relatedPosts: BlogPost = pageData.value.related_posts;

useSeo(
  post ? post.title : "Blog Post",
  post
    ? post.seo_description
    : "Welcome to Yotta, your partner in technology solutions.",
  "/images/home-og.png",
  ["Yotta", "Insights", "Tech company", "Solutions"]
);

const { $config } = useNuxtApp();

const canonicalUrl = `${$config.public.baseUrl}${route.path}`;

// JSON-LD structured data
useJsonld({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.title,
  description: post.content,
  image: post.image_url,
  ...(post.profiles?.display_name && {
    author: {
      "@type": "Person",
      name: post.profiles.display_name,
      description: post.profiles.display_name,
    }
  }),
  publisher: {
    "@type": "Organization",
    name: "Your Company Name",
    logo: {
      "@type": "ImageObject",
      url: "https://your-domain.com/logo.png",
    },
  },
  datePublished: post.published_at,
  dateModified: post.updated_at,
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": canonicalUrl,
  },
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
};

const shareArticle = () => {
  if (navigator.share) {
    navigator.share({
      title: post.title,
      url: window.location.href,
    });
  } else {
    // Fallback: copy URL to clipboard
    navigator.clipboard.writeText(window.location.href);
    // You can add a toast notification here
    console.log("Article URL copied to clipboard");
  }
};

const navigateToPost = (slug: string) => {
  // Navigate to the related post
  navigateTo(`/blog/${slug}`);
};

const onLinkCopied = () => {
  // Handle link copied event - you can show a toast notification here
  console.log("Link copied successfully!");
  // Example: showToast('Link copied to clipboard!')
};

const onShareClicked = (platform: string) => {
  // Handle share analytics or other actions
  console.log(`Shared on ${platform}`);
  // Example: trackEvent('share', { platform })
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Category Badge -->
    <div class="mb-6">
      <Badge
        variant="outline"
        class="bg-orange-50 text-orange-600 border-orange-200"
      >
        <Tag class="w-3 h-3 mr-1" />
        {{ post.category }}
      </Badge>
    </div>

    <!-- Main Content -->
    <article class="space-y-6">
      <!-- Title -->
      <h1 class="text-4xl font-bold text-gray-900 leading-tight">
        {{ post.title }}
      </h1>

      <!-- Meta Information -->
      <div class="flex items-center space-x-6 text-sm text-gray-600">
        <div class="flex items-center space-x-2">
          <Calendar class="w-4 h-4" />
          <span>{{ formatDate(post.published_at) }}</span>
        </div>
        <!-- <div class="flex items-center space-x-2">
          <Clock class="w-4 h-4" />
          <span>{{ post.readTime }}</span>
        </div> -->
        <!-- <div class="flex items-center space-x-2">
          <BookOpen class="w-4 h-4" />
          <span>{{ post.guide }}</span>
        </div> -->
      </div>

      <!-- Author Information -->
      <div class="flex items-center space-x-3">
        <Avatar class="w-12 h-12">
          <AvatarImage
            :src="post.profiles.avatar_url"
            :alt="post.profiles.display_name"
          />
          <AvatarFallback>
            {{ getInitials(post.profiles.display_name) }}
          </AvatarFallback>
        </Avatar>
        <div>
          <p class="font-medium text-gray-900">
            {{ post.profiles.display_name }}
          </p>
        </div>
      </div>

      <!-- Share Button -->
      <div class="pt-4">
        <Button
          variant="outline"
          @click="shareArticle"
          class="flex items-center space-x-2"
        >
          <Share2 class="w-4 h-4" />
          <span>Share Article</span>
        </Button>
      </div>

      <!-- Featured Image Placeholder -->
      <div
        class="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center"
      >
        <div class="text-center text-gray-500">
          <ImageIcon class="w-16 h-16 mx-auto mb-2 opacity-50" />
          <p class="text-sm">Featured Image</p>
        </div>
      </div>

      <!-- Article Content -->
      <div class="prose prose-lg max-w-none">
        <div v-html="post.content"></div>
      </div>

      <!-- Share Section -->
      <ShareSection
        :title="post.title"
        twitter-handle="YourCompanyTwitter"
        @link-copied="onLinkCopied"
        @share-clicked="onShareClicked"
      />

      <!-- Tags Section -->
      <div class="border-t pt-8 mt-12">
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
          <div class="flex flex-wrap gap-2">
            <Badge
              v-for="tag in post.tags"
              :key="tag"
              variant="secondary"
              class="hover:bg-gray-200 cursor-pointer transition-colors"
            >
              {{ tag }}
            </Badge>
          </div>
        </div>
      </div>

      <!-- Related Posts Section -->
      <div class="border-t pt-8 mt-8">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            v-for="relatedPost in relatedPosts"
            :key="relatedPost.id"
            class="hover:shadow-lg transition-shadow cursor-pointer group"
            @click="navigateToPost(relatedPost.slug)"
          >
            <div class="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
              <img
                v-if="relatedPost.image_url"
                :src="relatedPost.image_url"
                :alt="relatedPost.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center"
              >
                <ImageIcon class="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <CardHeader class="pb-2">
              <div class="mb-2">
                <Badge variant="outline" class="text-xs">
                  {{ relatedPost.category }}
                </Badge>
              </div>
              <CardTitle
                class="text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-2"
              >
                {{ relatedPost.title }}
              </CardTitle>
            </CardHeader>
            <CardContent class="pt-0">
              <p class="text-gray-600 text-sm line-clamp-2 mb-3">
                {{ relatedPost.content }}
              </p>
              <div
                class="flex items-center justify-between text-xs text-gray-500"
              >
                <!-- <div class="flex items-center space-x-1">
                  <Clock class="w-3 h-3" />
                  <span>{{ relatedPost.read_time }}</span>
                </div> -->
                <span>{{ formatDate(relatedPost.published_at) }}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
