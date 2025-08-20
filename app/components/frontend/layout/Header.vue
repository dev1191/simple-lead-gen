<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { useRouter } from "vue-router";

const router = useRouter();

// Mobile menu state
const mobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

const handleListService = () => {
  // Navigate to list service page or open modal
  router.push("/list-service");
  closeMobileMenu();
};

// Close mobile menu when route changes
watch(
  () => router.currentRoute.value,
  () => {
    closeMobileMenu();
  }
);

// Optional: Close menu when clicking outside
const handleClickOutside = () => {
  if (mobileMenuOpen.value) {
    closeMobileMenu();
  }
};
</script>

<template>
  <header class="bg-slate-800 text-white shadow-lg">
    <div class="max-w-screen mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <div
              class="bg-orange-500 text-white w-8 h-8 rounded flex items-center justify-center font-bold text-lg"
            >
              Y
            </div>
            <span class="text-xl font-bold">Yotta</span>
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <NuxtLink
            to="/"
            class="text-orange-400 hover:text-orange-300 transition-colors font-medium"
            :class="{ 'text-orange-400': $route.path === '/' }"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="/categories"
            class="text-gray-300 hover:text-white transition-colors"
            :class="{ 'text-orange-400': $route.path === '/categories' }"
          >
            Categories
          </NuxtLink>
          <NuxtLink
            to="/insights"
            class="text-gray-300 hover:text-white transition-colors"
            :class="{ 'text-orange-400': $route.path === '/insights' }"
          >
            Insights
          </NuxtLink>
          <NuxtLink
            to="/about-us"
            class="text-gray-300 hover:text-white transition-colors"
            :class="{ 'text-orange-400': $route.path === '/about-us' }"
          >
            About
          </NuxtLink>
          <NuxtLink
            to="/faq"
            class="text-gray-300 hover:text-white transition-colors"
            :class="{ 'text-orange-400': $route.path === '/faq' }"
          >
            FAQ
          </NuxtLink>
          <NuxtLink
            to="/contact"
            class="text-gray-300 hover:text-white transition-colors"
            :class="{ 'text-orange-400': $route.path === '/contact' }"
          >
            Contact
          </NuxtLink>
        </nav>

        <!-- CTA Button -->
        <div class="hidden md:block">
          <Button
            @click="handleListService"
            class="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 transition-colors"
          >
            List Your Service
          </Button>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            @click="toggleMobileMenu"
            class="text-white hover:bg-slate-700"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                v-if="!mobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div
          v-if="mobileMenuOpen"
          class="md:hidden border-t border-gray-700 pt-4 pb-4"
        >
          <nav class="space-y-2">
            <NuxtLink
              to="/"
              class="block text-orange-400 hover:text-orange-300 transition-colors font-medium py-2"
              :class="{ 'text-orange-400': $route.path === '/' }"
              @click="closeMobileMenu"
            >
              Home
            </NuxtLink>
            <NuxtLink
              to="/categories"
              class="block text-gray-300 hover:text-white transition-colors py-2"
              :class="{ 'text-orange-400': $route.path === '/categories' }"
              @click="closeMobileMenu"
            >
              Categories
            </NuxtLink>
            <NuxtLink
              to="/insights"
              class="block text-gray-300 hover:text-white transition-colors py-2"
              :class="{ 'text-orange-400': $route.path === '/insights' }"
              @click="closeMobileMenu"
            >
              Insights
            </NuxtLink>
            <NuxtLink
              to="/about-us"
              class="block text-gray-300 hover:text-white transition-colors py-2"
              :class="{ 'text-orange-400': $route.path === '/about-us' }"
              @click="closeMobileMenu"
            >
              About
            </NuxtLink>
            <NuxtLink
              to="/faq"
              class="block text-gray-300 hover:text-white transition-colors py-2"
              :class="{ 'text-orange-400': $route.path === '/faq' }"
              @click="closeMobileMenu"
            >
              FAQ
            </NuxtLink>
            <NuxtLink
              to="/contact"
              class="block text-gray-300 hover:text-white transition-colors py-2"
              :class="{ 'text-orange-400': $route.path === '/contact' }"
              @click="closeMobileMenu"
            >
              Contact
            </NuxtLink>
            <div class="pt-4">
              <Button
                @click="handleListService"
                class="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
              >
                List Your Service
              </Button>
            </div>
          </nav>
        </div>
      </Transition>
    </div>
  </header>
</template>

<style scoped>
/* Custom styles for active links */
/* .router-link-active {
  @apply text-orange-400;
} */

/* Ensure smooth transitions */
.transition {
  transition-property: color, background-color, border-color,
    text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter,
    backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
