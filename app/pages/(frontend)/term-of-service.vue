<script setup lang="ts">
import { ref } from "vue";

// Fetch the page data from your API
const { data: pageData, pending, error } = await useFetch("/api/pages/termsofservice");

// Set SEO dynamically
useSeo(
  pageData.value?.title || "Terms of Service",
  pageData.value?.content || "Read our Terms of Service for more information about using Yotta services.",
  "/images/contact-og.png",
  ["Yotta", "Terms of Service", "Tech company", "Support"]
);

watch(pageData, (value) => {
  if (value) {
    useSeo(
      value.title,
      value.content,
      "/images/home-og.png", // optional field
      value.seo_keyword ? value.seo_keyword.split(",") : ["Yotta", "Insights"] // optionally update keywords
    );
  }
});

</script>

<template>
  <section class="max-w-4xl mx-auto px-6 py-12">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900">
        {{ pageData?.title || "Terms of Service" }}
      </h1>
      <p class="mt-3 text-gray-500 text-base md:text-lg">
        Learn more about the rules and guidelines for using Yotta services.
      </p>
    </div>

    <!-- Loading & Error states -->
    <div v-if="pending" class="text-center text-gray-500">Loading...</div>
    <div v-if="error" class="text-center text-red-500">
      Failed to load Terms of Service. Please try again later.
    </div>

    <!-- Content -->
    <article
      v-if="pageData && !pending && !error"
      v-html="pageData.content"
      class="prose prose-gray max-w-none prose-headings:font-semibold prose-a:text-blue-600 hover:prose-a:underline"
    ></article>
  </section>
</template>
