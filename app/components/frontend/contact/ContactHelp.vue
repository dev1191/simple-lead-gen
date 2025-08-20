<script setup lang="ts">
import { NuxtLink } from '#components';

</script>

<template>
  <div class="max-w-2xl mx-auto mt-8 p-6 text-center">
    <h3 class="text-lg font-semibold">Need Immediate Help?</h3>
    <p class="text-gray-600 mt-2">
      Check out our FAQ section for quick answers to common questions
    </p>
    <div class="mt-4">
      <NuxtLink
        to="/faq"
        class="inline-block px-8 py-2 rounded-xl text-white font-medium bg-gradient-to-r from-purple-500 to-orange-500 hover:opacity-90 transition"
      >
        Visit FAQ Page
      </NuxtLink>
    </div>
  </div>
</template>
