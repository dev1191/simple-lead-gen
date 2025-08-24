<script setup lang="ts">
const { data: pageData } = await useFetch("/api/pages/privacypolicy");

useSeo(
  pageData.value ? pageData.value.title : "Privacy Policy",
  pageData.value
    ? pageData.value.content
    : "Get in touch with Yotta for inquiries and support.",
  "/images/contact-og.png",
  ["Yotta", "Privacy Policy", "Tech company", "Support"]
);
</script>

<template>
  <section class="max-w-4xl mx-auto px-6 py-12">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900">
        {{ pageData?.title || "Privacy Policy" }}
      </h1>
      <p class="mt-3 text-gray-500 text-base md:text-lg">
        Learn more about how we collect, use, and protect your information.
      </p>
    </div>

    <!-- Content -->
    <article
      v-html="pageData?.content"
      class="prose prose-gray max-w-none prose-headings:font-semibold prose-a:text-blue-600 hover:prose-a:underline"
    ></article>
  </section>
</template>
