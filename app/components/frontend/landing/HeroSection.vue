<script setup lang="ts">
import { useRouter } from "vue-router";
import {
  Brain,
  Building2,
  CreditCard,
  Scale,
  TrendingUp,
} from "lucide-vue-next";
import SearchTabs from "./SearchTabs.vue";

const props = defineProps<{
  title: string;
  subTitle: string;
  popularCategories: Array<{ icon: string; label: string; value: string }>;
}>();

const highlightText = "better deal";

// Split the sentence dynamically
const [beforeText, afterText] = props.title.split(highlightText);

const router = useRouter();

const navigateToCategory = (category: string) => {
  router.push(`/categories/${category}`);
};

// Analytics tracking (optional)
const trackCategoryClick = (category: string) => {
  // Add your analytics tracking here
  console.log(`Category clicked: ${category}`);
};
</script>

<template>
  <section
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-7xl mx-auto text-center">
      <!-- Main Heading -->
      <div class="animate-fade-in-up">
        <h1
          class="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
        >
          {{ beforeText }}
          <span class="text-orange-500 relative">
            {{ highlightText }}
            <svg
              class="absolute -bottom-2 left-0 w-full h-3 text-orange-200"
              viewBox="0 0 100 8"
              fill="currentColor"
            >
              <path
                d="M0 4c20-3 40-3 60 0c20 3 40 3 40 0v2c-20 3-40 3-60 0c-20-3-40-3-40 0v-2z"
              />
            </svg>
          </span>
          {{ afterText }}
        </h1>
      </div>

      <!-- Subheading -->
      <div class="animate-fade-in-up animation-delay-200">
        <p
          class="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          {{ subTitle }}
        </p>
      </div>

      <!-- Search Section -->
      <div
        class="animate-fade-in-up animation-delay-400 max-w-4xl mx-auto mb-16"
      >
        <SearchTabs />
      </div>

      <!-- Service Categories -->
      <div class="">
        <h2 class="text-2xl font-semibold text-gray-900 mb-8">
          Popular Categories
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 w-full mx-auto">
          <!-- Register a Business -->
          <template v-for="category in popularCategories" :key="category.value">
            <div
              class="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300  group transform hover:-translate-y-1"
            >
              <div
                :class="`text-${category.color}-500 mb-4 group-hover:scale-110 transition-transform duration-200`"
              >
                <Icon :name="category.icon" class="w-10 h-10 mx-auto" />
              </div>
              <h3
                class="font-semibold text-gray-900 mb-2 transition-colors"
                :class="`group-hover:text-${category.color}-500`"
              >
                {{ category.label }}
              </h3>
              <p class="text-sm text-gray-600">
                {{ category.value }}
              </p>
            </div>
          </template>
        </div>
      </div>

      <!-- Trust Indicators -->
      <div
        class="animate-fade-in-up animation-delay-800 mt-16 pt-8 border-t border-gray-200"
      >
        <div
          class="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 text-sm text-gray-500"
        >
          <div class="flex items-center space-x-2">
            <svg
              class="h-5 w-5 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <span>10,000+ Happy Customers</span>
          </div>
          <div class="flex items-center space-x-2">
            <svg
              class="h-5 w-5 text-orange-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
            <span>4.8 Star Rating</span>
          </div>
          <div class="flex items-center space-x-2">
            <svg
              class="h-5 w-5 text-blue-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clip-rule="evenodd"
              />
            </svg>
            <span>Secure & Trusted Platform</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Animation classes */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animation-delay-200 {
  animation-delay: 0.2s;
  opacity: 0;
}

.animation-delay-400 {
  animation-delay: 0.4s;
  opacity: 0;
}

.animation-delay-600 {
  animation-delay: 0.6s;
  opacity: 0;
}

.animation-delay-800 {
  animation-delay: 0.8s;
  opacity: 0;
}

/* Custom focus styles */
.focus\:ring-0:focus {
  --tw-ring-shadow: 0 0 #0000;
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow),
    var(--tw-shadow, 0 0 #0000);
}

/* Smooth hover transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
